import { App, ExtraButtonComponent, PluginSettingTab, Setting} from "obsidian";
import NL2LatexPlugin from "./main";
import { NL2LatexSettings, RegexSnippet } from "./parser";

export class NL2LatexSettingTab extends PluginSettingTab {
	plugin: NL2LatexPlugin;

	constructor(app: App, plugin: NL2LatexPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		this.displayImpl();
	}

	getSettingDefinitions() {
		return [];
	}

	private displayImpl(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl("p", {
			text:
				"Write mathematical expressions in natural language (Italian or English, even mixed) " + 
				"and convert them to LaTeX. Example: 'integral of x squared plus 3x from 0 to pi'.",
		});


		new Setting(containerEl)
			.setName("Opening marker")
			.setDesc("Text that signals the start of the expression to be converted (e.g., ';;').")
			.addText((text) =>
				text.setValue(this.plugin.settings.openMarker).onChange(async (value) => {
					this.plugin.settings.openMarker = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Closing marker")
			.setDesc("Text that signals the end of the expression to be converted (e.g., ';;').")
			.addText((text) =>
				text.setValue(this.plugin.settings.closeMarker).onChange(async (value) => {
					this.plugin.settings.closeMarker = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Auto-convert on marker")
			.setDesc(
				"If enabled, the conversion will be triggered automatically when the closing marker is typed. " +
					"If disabled, use the command/hotkey set."
			)
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.autoConvertOnMarker).onChange(async (value) => {
					this.plugin.settings.autoConvertOnMarker = value;
					await this.plugin.saveSettings();
				})
			);


		new Setting(containerEl)
			.setName("Math delimiter style")
			.setDesc("How to wrap the LaTeX output: inline, block, or none (just the LaTeX code).")
			.addDropdown((drop) =>
				drop
					.addOptions({
						"$...$": "Inline: $...$",
						"$$...$$": "Block: $$...$$",
						"none": "None (just the LaTeX code)",
					})
					.setValue(this.plugin.settings.dollarStyle)
					.onChange(async (value) => {
						this.plugin.settings.dollarStyle = value as NL2LatexSettings["dollarStyle"];
						await this.plugin.saveSettings();
					})
			);

		containerEl.createEl("p", {
			text:
				"Rules executed BEFORE the natural language engine, in order. " +
				"Patterns are regular expressions. Use $1, $2, ... for captured groups in the replacement.",
		});

		this.plugin.settings.regexSnippets.forEach((snippet, index) => {
			this.renderSnippetRow(containerEl, snippet, index);
		});

		new Setting(containerEl).addButton((btn) =>
			btn
				.setButtonText("+ Add snippet")
				.setCta()
				.onClick(async () => {
					const newSnippet: RegexSnippet = {
						id: `custom-${Date.now()}`,
						label: "Vector (Example)",
						pattern: "vector (?:of )?([a-zA-Z0-9]+)",
						flags: "i",
						replacement: "\\vec{$1}",
						enabled: true,
					};
					this.plugin.settings.regexSnippets.push(newSnippet);
					await this.plugin.saveSettings();
					this.displayImpl();
				})
		);

		const list = containerEl.createEl("ul");
		const examples = [
			"integral of X from A to B  /  integrale di X da A a B",
			"limit of X as Y approaches Z  /  limite di X per Y che tende a Z",
			"sum of X from n = A to B  /  sommatoria di X da n = A a B",
			"alpha, beta, gamma...  /  and, or, implies...  /  maggiore o uguale a",
		];
		examples.forEach((ex) => list.createEl("li", { text: ex }));
	}

	private renderSnippetRow(containerEl: HTMLElement, snippet: RegexSnippet, index: number) {
		const card = containerEl.createDiv({
			attr: {
				style: "border: 1px solid var(--background-modifier-border); border-radius: 6px; padding: 15px; margin-bottom: 15px; background-color: var(--background-secondary-alt);"
			}
		});

		new Setting(card)
			.setName(snippet.label || `Snippet ${index + 1}`)
			.addToggle((toggle) =>
				toggle.setValue(snippet.enabled).onChange(async (value) => {
					snippet.enabled = value;
					await this.plugin.saveSettings();
				})
			)
			.addExtraButton((btn: ExtraButtonComponent) =>
				btn
					.setIcon("trash")
					.setTooltip("Delete snippet")
					.onClick(async () => {
						this.plugin.settings.regexSnippets = this.plugin.settings.regexSnippets.filter(
							(s) => s.id !== snippet.id
						);
						await this.plugin.saveSettings();
						this.displayImpl();
					})
			);

		new Setting(card)
			.setName("Label")
			.setDesc("Name of the snippet, for display purposes.")
			.addText((text) =>
				text
					.setPlaceholder("Es: Radice quadrata")
					.setValue(snippet.label)
					.onChange(async (value) => {
						snippet.label = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(card)
			.setName("Pattern (RegEx)")
			.setDesc("Regular expression pattern to match.")
			.addText((text) =>
				text
					.setPlaceholder("Es: root of (.+)")
					.setValue(snippet.pattern)
					.onChange(async (value) => {
						snippet.pattern = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(card)
			.setName("Replacement")
			.setDesc("Text to replace the matched pattern with.")
			.addText((text) =>
				text
					.setPlaceholder("Es: \\sqrt{$1}")
					.setValue(snippet.replacement)
					.onChange(async (value) => {
						snippet.replacement = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
