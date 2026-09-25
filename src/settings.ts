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

		new Setting(containerEl).setName("NL2LaTeX Snippets").setHeading();
		containerEl.createEl("p", {
			text:
				"Scrivi espressioni matematiche in linguaggio naturale (italiano o inglese, anche mescolati) " +
				"e convertile in LaTeX. Esempio: 'integral of x squared plus 3x from 0 to pi'.",
		});

		new Setting(containerEl).setName("Marcatori rapidi").setHeading();

		new Setting(containerEl)
			.setName("Marcatore di apertura")
			.setDesc("Testo che segnala l'inizio dell'espressione da convertire (es. ';;').")
			.addText((text) =>
				text.setValue(this.plugin.settings.openMarker).onChange(async (value) => {
					this.plugin.settings.openMarker = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Marcatore di chiusura")
			.setDesc("Testo che segnala la fine dell'espressione da convertire (es. ';;').")
			.addText((text) =>
				text.setValue(this.plugin.settings.closeMarker).onChange(async (value) => {
					this.plugin.settings.closeMarker = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Conversione automatica al marcatore di chiusura")
			.setDesc(
				"Se attivo, digitando il marcatore di chiusura la conversione avviene immediatamente. " +
					"Se disattivo, usa il comando/hotkey impostato."
			)
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.autoConvertOnMarker).onChange(async (value) => {
					this.plugin.settings.autoConvertOnMarker = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl).setName("Formattazione output").setHeading();

		new Setting(containerEl)
			.setName("Delimitatori matematici")
			.setDesc("Come racchiudere il LaTeX generato.")
			.addDropdown((drop) =>
				drop
					.addOptions({
						"$...$": "Inline: $...$",
						"$$...$$": "Blocco: $$...$$",
						"none": "Nessuno (solo codice LaTeX)",
					})
					.setValue(this.plugin.settings.dollarStyle)
					.onChange(async (value) => {
						this.plugin.settings.dollarStyle = value as NL2LatexSettings["dollarStyle"];
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl).setName("Snippet regex personalizzati").setHeading();
		containerEl.createEl("p", {
			text:
				"Regole eseguite PRIMA del motore di linguaggio naturale, in ordine. " +
				"Pattern in sintassi regex JavaScript; usa $1, $2... nel campo 'Sostituzione' per riferirti ai gruppi tra parentesi del pattern.",
		});

		this.plugin.settings.regexSnippets.forEach((snippet, index) => {
			this.renderSnippetRow(containerEl, snippet, index);
		});

		new Setting(containerEl).addButton((btn) =>
			btn
				.setButtonText("+ Aggiungi snippet")
				.setCta()
				.onClick(async () => {
					const newSnippet: RegexSnippet = {
						id: `custom-${Date.now()}`,
						label: "Vettore (Esempio)",
						pattern: "vettore (?:di )?([a-zA-Z0-9]+)",
						flags: "i",
						replacement: "\\vec{$1}",
						enabled: true,
					};
					this.plugin.settings.regexSnippets.push(newSnippet);
					await this.plugin.saveSettings();
					this.displayImpl();
				})
		);

		new Setting(containerEl).setName("Guida rapida costrutti riconosciuti").setHeading();
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
		// Crea un box visivo (Card) per raggruppare i campi dello snippet
		const card = containerEl.createDiv({
			attr: {
				style: "border: 1px solid var(--background-modifier-border); border-radius: 6px; padding: 15px; margin-bottom: 15px; background-color: var(--background-secondary-alt);"
			}
		});

		// 1. Intestazione: Nome, interruttore e cestino
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
					.setTooltip("Elimina snippet")
					.onClick(async () => {
						this.plugin.settings.regexSnippets = this.plugin.settings.regexSnippets.filter(
							(s) => s.id !== snippet.id
						);
						await this.plugin.saveSettings();
						this.displayImpl();
					})
			);

		// 2. Campo Etichetta su una riga separata
		new Setting(card)
			.setName("Etichetta")
			.setDesc("Nome descrittivo per questo snippet")
			.addText((text) =>
				text
					.setPlaceholder("Es: Radice quadrata")
					.setValue(snippet.label)
					.onChange(async (value) => {
						snippet.label = value;
						await this.plugin.saveSettings();
					})
			);

		// 3. Campo Pattern su una riga separata
		new Setting(card)
			.setName("Pattern (RegEx)")
			.addText((text) =>
				text
					.setPlaceholder("Es: radice di (.+)")
					.setValue(snippet.pattern)
					.onChange(async (value) => {
						snippet.pattern = value;
						await this.plugin.saveSettings();
					})
			);

		// 4. Campo Sostituzione su una riga separata
		new Setting(card)
			.setName("Sostituzione")
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
