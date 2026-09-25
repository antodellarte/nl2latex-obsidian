import { Editor, MarkdownView, Notice, Plugin } from "obsidian";
import { DEFAULT_SETTINGS, NL2LatexSettings, convert } from "./parser";
import { NL2LatexSettingTab } from "./settings";

export default class NL2LatexPlugin extends Plugin {
	declare settings: NL2LatexSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new NL2LatexSettingTab(this.app, this));

		this.addCommand({
			id: "convert-selection-to-latex",
			name: "Convert selection to LaTeX",
			editorCallback: (editor: Editor) => {
				this.convertSelection(editor);
			},
		});

		this.addCommand({
			id: "convert-marker-block-to-latex",
			name: "Convert marker block before cursor to LaTeX",
			editorCallback: (editor: Editor) => {
				this.convertMarkerBlock(editor);
			},
		});

		this.registerEditorExtensionListener();
	}

	registerEditorExtensionListener() {
		this.registerDomEvent(document, "keyup", (evt: KeyboardEvent) => {
			if (!this.settings.autoConvertOnMarker) return;
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!view) return;
			
			const editor = view.editor;
			if (!editor.hasFocus()) return;
			
			const cursor = editor.getCursor();
			const line = editor.getLine(cursor.line);
			const closeMarker = this.settings.closeMarker;
			const textBeforeCursor = line.slice(0, cursor.ch);
			if (closeMarker.length > 0 && textBeforeCursor.endsWith(closeMarker)) {
				this.convertMarkerBlock(editor);
			}
		});
	}

	convertSelection(editor: Editor) {
		const selection = editor.getSelection();
		if (!selection || selection.trim().length === 0) {
			new Notice("Nl2LaTeX: No text selected for conversion.");
			return;
		}
		const latex = convert(selection, this.settings);
		editor.replaceSelection(latex);
	}

	convertMarkerBlock(editor: Editor) {
		const cursor = editor.getCursor();
		const line = editor.getLine(cursor.line);
		const open = this.settings.openMarker;
		const close = this.settings.closeMarker;
		const textBeforeCursor = line.slice(0, cursor.ch);

		const closeIdx = textBeforeCursor.endsWith(close)
			? textBeforeCursor.length - close.length
			: textBeforeCursor.lastIndexOf(close);
		const searchArea = textBeforeCursor.slice(0, closeIdx);
		const openIdx = searchArea.lastIndexOf(open);

		if (openIdx === -1 || closeIdx === -1 || closeIdx <= openIdx) {
			new Notice(`NL2LaTeX: No block between "${open}" and "${close}" found before the cursor.`);
			return;
		}

		const naturalText = line.slice(openIdx + open.length, closeIdx);
		const latex = convert(naturalText, this.settings);

		const from = { line: cursor.line, ch: openIdx };
		const to = { line: cursor.line, ch: closeIdx + close.length };
		editor.replaceRange(latex, from, to);

		const newCursorCh = openIdx + latex.length;
		editor.setCursor({ line: cursor.line, ch: newCursorCh });
	}

	onunload() {}

	async loadSettings() {
		const loadedData = (await this.loadData()) as Partial<NL2LatexSettings> | null;
		this.settings = Object.assign({}, DEFAULT_SETTINGS, loadedData);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
