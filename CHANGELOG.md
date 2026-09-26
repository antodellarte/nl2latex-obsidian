# Changelog

## [1.0.4] - 2026-09-26

### Added

- Esteso il parser natural-language LaTeX con ulteriori costrutti matematici in italiano e inglese.
- Aggiunti supporto per matrici con elementi composti, vettori riga/colonna, prodotti scalari e vettoriali.
- Aggiunti simboli e costrutti per insiemi, limiti laterali, derivate di ordine superiore, integrali multipli e operatori vettoriali.
- Aggiunto il simbolo di non esistenza `\\nexists`.

### Fixed

- Corretti parsing di frazioni, radici, potenze, funzioni e parentesi annidate.
- Corretta la gestione dei separatori di frazione e dei numeri decimali con virgola.
- Migliorata la distinzione tra sintassi italiana ambigua, inclusi `per`, `a` e `fratto`.
- Corretta la gestione delle variabili di integrazione, dei bound e delle matrici con espressioni aritmetiche.

### Validation

- Aggiunta ed eseguita la suite di regressione del parser.
- `npm test`: 13 test superati.
- `npm run build`: superato.
