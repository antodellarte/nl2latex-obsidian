export interface RegexSnippet {
	id: string;
	label: string;
	pattern: string; 
	flags: string; 
	replacement: string; 
	enabled: boolean;
}

export interface NL2LatexSettings {
	openMarker: string;
	closeMarker: string;
	autoConvertOnMarker: boolean;
	convertOnSpace: boolean;
	preferredLanguageHint: "auto" | "it" | "en";
	regexSnippets: RegexSnippet[];
	wrapInDollars: boolean;
	dollarStyle: "$...$" | "$$...$$" | "none";
}

export const DEFAULT_SETTINGS: NL2LatexSettings = {
	openMarker: ";;",
	closeMarker: ";;",
	autoConvertOnMarker: true,
	convertOnSpace: false,
	preferredLanguageHint: "auto",
	wrapInDollars: true,
	dollarStyle: "$...$",
	regexSnippets: [
		{
			id: "builtin-sqrt-of",
			label: "radice quadrata di X / square root of X",
			pattern: "(?:square root|radice quadrata) of\\s+(.+)",
			flags: "i",
			replacement: "\\sqrt{$1}",
			enabled: true,
		},
		{
			id: "builtin-infinity",
			label: "infinito / infinity",
			pattern: "\\b(infinity|infinito)\\b",
			flags: "gi",
			replacement: "\\infty",
			enabled: true,
		},
	],
};


type Canon =
	| "INTEGRAL" | "DERIVATIVE" | "PARTIAL_DERIVATIVE" | "LIMIT"
	| "SUM" | "PRODUCT" | "SQRT" | "NROOT" | "FRACTION"
	| "OF" | "FROM" | "TO" | "AS" | "APPROACHES" | "WITH_RESPECT_TO"
	| "SQUARED" | "CUBED" | "TO_THE_POWER"
	| "PLUS" | "MINUS" | "TIMES" | "DIVIDED_BY"
	| "OPEN_PAREN" | "CLOSE_PAREN"
	| "SIN" | "COS" | "TAN" | "LN" | "LOG" | "PI" | "E_CONST"
	| "ALPHA" | "BETA" | "GAMMA" | "DELTA" | "EPSILON" | "THETA" | "LAMBDA" | "MU" | "SIGMA" | "OMEGA" | "PHI"
	| "AND" | "OR" | "NOT" | "IMPLIES" | "IFF" | "FORALL" | "EXISTS" | "NEQ" | "LEQ" | "GEQ" | "APPROX";

const SYNONYMS: Array<{ canon: Canon; variants: string[] }> = [
	{ canon: "PARTIAL_DERIVATIVE", variants: [ "partial derivative of", "derivata parziale di" ]},
	{ canon: "DERIVATIVE", variants: [ "derivative of", "derivata di", "derivata prima di", "derivative" ]},
	{ canon: "INTEGRAL", variants: [ "integral of", "integrale di", "integrale", "integral" ]},
	{ canon: "LIMIT", variants: [ "limit of", "limite di", "limite", "limit" ]},
	{ canon: "SUM", variants: [ "sum of", "sommatoria di", "somma di", "summation of", "sommatoria", "summation" ]},
	{ canon: "PRODUCT", variants: [ "product of", "produttoria di", "produttoria" ]},
	{ canon: "SQRT", variants: [ "square root of", "radice quadrata di", "radice di" ]},
	{ canon: "NROOT", variants: [ "root of order", "radice di ordine", "n-th root of", "radice ennesima di" ]},
	{ canon: "WITH_RESPECT_TO", variants: [ "with respect to", "rispetto a", "wrt" ]},
	{ canon: "APPROACHES", variants: [ "approaches", "tends to", "tende a", "che tende a" ]},
	{ canon: "FROM", variants: [ "from", "da" ]},
	{ canon: "TO", variants: [ "to", "a" ]},
	{ canon: "AS", variants: [ "as", "per" ]},
	{ canon: "SQUARED", variants: [ "squared", "al quadrato", "quadro" ]},
	{ canon: "CUBED", variants: [ "cubed", "al cubo", "cubo" ]},
	{ canon: "TO_THE_POWER", variants: [ "to the power of", "to the power", "alla potenza di", "elevato alla", "elevato a" ]},
	{ canon: "PLUS", variants: [ "plus", "più", "piu" ]},
	{ canon: "MINUS", variants: [ "minus", "meno" ]},
	{ canon: "TIMES", variants: [ "times", "multiplied by", "per", "moltiplicato per", "volte" ]},
	{ canon: "DIVIDED_BY", variants: [ "divided by", "over", "diviso", "diviso per", "fratto" ]},
	{ canon: "SIN", variants: [ "sine of", "seno di", "sin", "sen" ]},
	{ canon: "COS", variants: [ "cosine of", "coseno di", "cos" ]},
	{ canon: "TAN", variants: [ "tangent of", "tangente di", "tan", "tg" ]},
	{ canon: "LN", variants: [ "natural log of", "logaritmo naturale di", "ln" ]},
	{ canon: "LOG", variants: [ "log base", "logarithm of", "logaritmo di", "log" ]},
	{ canon: "PI", variants: [ "pi" ]},
	{ canon: "E_CONST", variants: [ "euler", "eulero" ]},
    
	{ canon: "ALPHA", variants: [ "alpha", "alfa" ]},
	{ canon: "BETA", variants: [ "beta" ]},
	{ canon: "GAMMA", variants: [ "gamma" ]},
	{ canon: "DELTA", variants: [ "delta" ]},
	{ canon: "EPSILON", variants: [ "epsilon" ]},
	{ canon: "THETA", variants: [ "theta", "teta" ]},
	{ canon: "LAMBDA", variants: [ "lambda", "lamda" ]},
	{ canon: "MU", variants: [ "mu", "mi" ]},
	{ canon: "SIGMA", variants: [ "sigma" ]},
	{ canon: "OMEGA", variants: [ "omega" ]},
	{ canon: "PHI", variants: [ "phi", "fi" ]},

	{ canon: "AND", variants: [ "and", "e logico", "congiunzione" ]},
	{ canon: "OR", variants: [ "or", "o logico", "disgiunzione" ]},
	{ canon: "NOT", variants: [ "not", "non logico", "negazione di" ]},
	{ canon: "IMPLIES", variants: [ "implies", "implica" ]},
	{ canon: "IFF", variants: [ "if and only if", "se e solo se", "doppia implicazione" ]},
	{ canon: "FORALL", variants: [ "for all", "per ogni", "quantificatore universale" ]},
	{ canon: "EXISTS", variants: [ "there exists", "esiste", "quantificatore esistenziale" ]},
	{ canon: "NEQ", variants: [ "not equal to", "diverso da", "diverso" ]},
	{ canon: "LEQ", variants: [ "less than or equal to", "minore o uguale a" ]},
	{ canon: "GEQ", variants: [ "greater than or equal to", "maggiore o uguale a" ]},
	{ canon: "APPROX", variants: [ "approximately", "circa uguale a", "circa" ]},
];




function escapeRegex(s: string): string {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface FlatSynonym { canon: Canon; variant: string; }
const FLAT: FlatSynonym[] = [];
for (const entry of SYNONYMS) {
	for (const v of entry.variants) {
		FLAT.push({ canon: entry.canon, variant: v });
	}
}
FLAT.sort((a, b) => b.variant.length - a.variant.length);

// CORREZIONE: Usiamo due gruppi di cattura. Il primo (p1) cattura lo spazio 
// o il bordo, il secondo (p2) cattura la variante pulita.
const SYNONYM_REGEX = new RegExp(
	"(^|\\s|\\b)(" + FLAT.map(f => escapeRegex(f.variant)).join("|") + ")(?=$|\\s|\\b)",
	"gi"
);

const VARIANT_TO_CANON = new Map<string, Canon>();
for (const f of FLAT) {
	VARIANT_TO_CANON.set(f.variant.toLowerCase(), f.canon);
}

export function normalizeToTokens(input: string): string {
	let s = " " + input.trim() + " ";
		s = s.replace(SYNONYM_REGEX, (match: string, p1: string, p2: string) => {		
		const canon = VARIANT_TO_CANON.get(p2.toLowerCase());
		return canon ? `${p1}@@${canon}@@ ` : match;
	});
	
	s = s.replace(/\^2\b/g, " @@SQUARED@@ ");
	s = s.replace(/\^3\b/g, " @@CUBED@@ ");
	return s.replace(/\s+/g, " ").trim();
}

interface Cursor { text: string; pos: number; }
function peekToken(c: Cursor): string | null {
	const rest = c.text.slice(c.pos).replace(/^\s+/, "");
	const m = rest.match(/^@@([A-Z_]+)@@/);
	return m ? m[1] : null;
}

function consumeToken(c: Cursor): string {
	const rest = c.text.slice(c.pos);
	const leadingWs = rest.match(/^\s*/)![0].length;
	c.pos += leadingWs;
	const m = c.text.slice(c.pos).match(/^@@([A-Z_]+)@@/);
	if (!m) throw new Error("Token atteso non trovato");
	c.pos += m[0].length;
	return m[1];
}

function readFreeTextUntil(c: Cursor, stopTokens: string[]): string {
	let depth = 0;
	let out = "";
	while (c.pos < c.text.length) {
		const rest = c.text.slice(c.pos);
		const tokenMatch = rest.match(/^\s*@@([A-Z_]+)@@/);
		if (tokenMatch && depth === 0 && stopTokens.includes(tokenMatch[1])) {
			break;
		}
		if (tokenMatch) {
			out += tokenMatch[0];
			c.pos += tokenMatch[0].length;
			continue;
		}
		const ch = c.text[c.pos];
		if (ch === "(") depth++;
		if (ch === ")") depth--;
		out += ch;
		c.pos++;
	}
	return out.trim();
}


function renderExpression(raw: string): string {
	let s = raw;

	s = s.replace(/([^\s@]+(?:\s*@@[A-Z_]+@@\s*[^\s@]*)*)\s*@@SQUARED@@/g, (_m: string, base: string) => `${wrapIfNeeded(base)}^2`);
	s = s.replace(/([^\s@]+(?:\s*@@[A-Z_]+@@\s*[^\s@]*)*)\s*@@CUBED@@/g, (_m: string, base: string) => `${wrapIfNeeded(base)}^3`);
	s = s.replace(/([^\s@]+)\s*@@TO_THE_POWER@@\s*([^\s@]+)/g, (_m: string, base: string, exp: string) => `${wrapIfNeeded(base)}^{${exp}}`);
	s = s.replace(/@@SIN@@\s*([^\s@]+)/g, "\\sin($1)");
	s = s.replace(/@@COS@@\s*([^\s@]+)/g, "\\cos($1)");
	s = s.replace(/@@TAN@@\s*([^\s@]+)/g, "\\tan($1)");
	s = s.replace(/@@LN@@\s*([^\s@]+)/g, "\\ln($1)");
	s = s.replace(/@@LOG@@\s*([^\s@]+)/g, "\\log($1)");

	s = s.replace(/@@SQRT@@\s*([^\s@]+(?:\s*[^\s@]+)*)/g, (_m: string, inner: string) => `\\sqrt{${inner.trim()}}`);
	
	s = s.replace(/@@E_CONST@@/g, "e");
	s = s.replace(/@@ALPHA@@/g, "\\alpha");
	s = s.replace(/@@BETA@@/g, "\\beta");
	s = s.replace(/@@GAMMA@@/g, "\\gamma");
	s = s.replace(/@@DELTA@@/g, "\\delta");
	s = s.replace(/@@EPSILON@@/g, "\\epsilon");
	s = s.replace(/@@THETA@@/g, "\\theta");
	s = s.replace(/@@LAMBDA@@/g, "\\lambda");
	s = s.replace(/@@MU@@/g, "\\mu");
	s = s.replace(/@@SIGMA@@/g, "\\sigma");
	s = s.replace(/@@OMEGA@@/g, "\\omega");
	s = s.replace(/@@PHI@@/g, "\\phi");

	s = s.replace(/@@AND@@/g, " \\land ");
	s = s.replace(/@@OR@@/g, " \\lor ");
	s = s.replace(/@@NOT@@/g, "\\lnot ");
	s = s.replace(/@@IMPLIES@@/g, " \\implies ");
	s = s.replace(/@@IFF@@/g, " \\iff ");
	s = s.replace(/@@FORALL@@/g, "\\forall ");
	s = s.replace(/@@EXISTS@@/g, "\\exists ");
	s = s.replace(/@@NEQ@@/g, " \\neq ");
	s = s.replace(/@@LEQ@@/g, " \\leq ");
	s = s.replace(/@@GEQ@@/g, " \\geq ");
	s = s.replace(/@@APPROX@@/g, " \\approx ");

	s = s.replace(/\s+/g, " ").trim();
	return s;
}

function wrapIfNeeded(base: string): string {
	const b = base.trim();
	if (/^[a-zA-Z0-9]$/.test(b)) return b;
	if (/^\\[a-zA-Z]+\{.*\}$/.test(b)) return b;
	return `(${b})`;
}

function parseIntegral(c: Cursor): string {
	consumeToken(c); 
	let integrand = readFreeTextUntil(c, ["FROM", "WITH_RESPECT_TO"]);
	let lower = "", upper = "";
	if (peekToken(c) === "FROM") {
		consumeToken(c);
		lower = readFreeTextUntil(c, ["TO"]);
		if (peekToken(c) === "TO") {
			consumeToken(c);
			upper = readFreeTextUntil(c, []);
		}
	}
	let variable = "x";
	const wrtMatch = integrand.match(/@@WITH_RESPECT_TO@@\s*([^\s@]+)/);
	if (wrtMatch) {
		variable = wrtMatch[1];
		integrand = integrand.replace(/@@WITH_RESPECT_TO@@\s*([^\s@]+)/, "").trim();
	}
	const integrandLatex = renderExpression(stripOuterParensToken(integrand));
	const boundsLatex = lower && upper ? `_{${renderExpression(lower)}}^{${renderExpression(upper)}}` : "";
	return `\\int${boundsLatex} ${wrapForIntegrand(integrandLatex)} \\, d${variable}`;
}

function wrapForIntegrand(latex: string): string {
	const needsParens = /[+-]/.test(latex.replace(/\\[a-zA-Z]+/g, "")) && !latex.startsWith("(");
	return needsParens ? `(${latex})` : latex;
}

function stripOuterParensToken(s: string): string {
	const t = s.trim();
	if (t.startsWith("(") && t.endsWith(")")) {
		let depth = 0;
		for (let i = 0; i < t.length; i++) {
			if (t[i] === "(") depth++;
			if (t[i] === ")") depth--;
			if (depth === 0 && i < t.length - 1) return t;
		}
		return t.slice(1, -1).trim();
	}
	return t;
}

function parseDerivative(c: Cursor, partial: boolean): string {
	consumeToken(c);  
	let body = readFreeTextUntil(c, ["WITH_RESPECT_TO"]);
	let variable = "x";
	if (peekToken(c) === "WITH_RESPECT_TO") {
		consumeToken(c);
		variable = readFreeTextUntil(c, []).trim() || "x";
	}
	const inner = renderExpression(stripOuterParensToken(body));
	const d = partial ? "\\partial" : "d";
	return `\\frac{${d}}{${d}${variable}}(${inner})`;
}

function parseLimit(c: Cursor): string {
	consumeToken(c); 
	let body = readFreeTextUntil(c, ["AS"]);
	let variable = "x", target = "0";
	if (peekToken(c) === "AS") {
		consumeToken(c);
		const asClause = readFreeTextUntil(c, []);
		const m = asClause.match(/^([^\s@]+)\s*@@APPROACHES@@\s*(.+)$/);
		if (m) {
			variable = m[1];
			target = renderExpression(m[2]);
		}
	}
	const inner = renderExpression(stripOuterParensToken(body));
	return `\\lim_{${variable} \\to ${target}} ${inner}`;
}

function parseSum(c: Cursor, isProduct: boolean): string {
	consumeToken(c);
	let body = readFreeTextUntil(c, ["FROM"]);
	let lower = "", upper = "";
	let variable = "n";
	if (peekToken(c) === "FROM") {
		consumeToken(c);
		const lowerClause = readFreeTextUntil(c, ["TO"]);
		const m = lowerClause.match(/^([^\s@=]+)\s*=\s*(.+)$/);
		if (m) { variable = m[1]; lower = m[2]; } else { lower = lowerClause; }
		if (peekToken(c) === "TO") {
			consumeToken(c);
			upper = readFreeTextUntil(c, []);
		}
	}
	const inner = renderExpression(stripOuterParensToken(body));
	const symbol = isProduct ? "\\prod" : "\\sum";
	return `${symbol}_{${variable}=${renderExpression(lower)}}^{${renderExpression(upper)}} ${inner}`;
}

function parseSqrtLike(c: Cursor, isNroot: boolean): string {
	consumeToken(c);
	if (isNroot) {
		const orderText = readFreeTextUntil(c, []);
		const parts = orderText.split(/\bof\b|\bdi\b/i);
		if (parts.length >= 2) {
			const order = parts[0].trim();
			const inner = renderExpression(stripOuterParensToken(parts.slice(1).join(" ")));
			return `\\sqrt[${order}]{${inner}}`;
		}
		return `\\sqrt[n]{${renderExpression(orderText)}}`;
	}
	const inner = readFreeTextUntil(c, []);
	return `\\sqrt{${renderExpression(stripOuterParensToken(inner))}}`;
}


export function convertNaturalLanguageToLatex(input: string): string {
	const normalized = normalizeToTokens(input);
	const c: Cursor = { text: normalized, pos: 0 };
	const first = peekToken(c);

	try {
		switch (first) {
			case "INTEGRAL":
				return parseIntegral(c);
			case "DERIVATIVE":
				return parseDerivative(c, false);
			case "PARTIAL_DERIVATIVE":
				return parseDerivative(c, true);
			case "LIMIT":
				return parseLimit(c);
			case "SUM":
				return parseSum(c, false);
			case "PRODUCT":
				return parseSum(c, true);
			case "SQRT":
				return parseSqrtLike(c, false);
			case "NROOT":
				return parseSqrtLike(c, true);
			default:
				return renderExpression(normalized);
		}
	} catch (_e) {
		return renderExpression(normalized);
	}
}


export function applyRegexSnippets(input: string, snippets: RegexSnippet[]): string | null {
	for (const snip of snippets) {
		if (!snip.enabled) continue;
		try {
			const re = new RegExp(snip.pattern, snip.flags.includes("g") ? snip.flags : snip.flags + "g");
			if (re.test(input)) {
				return input.replace(re, snip.replacement);
			}
		} catch {
			continue;
		}
	}
	return null;
}



export function convert(input: string, settings: NL2LatexSettings): string {
	const trimmed = input.trim();
	if (trimmed.length === 0) return "";

	const regexResult = applyRegexSnippets(trimmed, settings.regexSnippets);
	const bodyLatex = regexResult !== null ? regexResult : convertNaturalLanguageToLatex(trimmed);

	if (settings.dollarStyle === "$$...$$") return `$$${bodyLatex}$$`;
	if (settings.dollarStyle === "$...$") return `$${bodyLatex}$`;
	return bodyLatex;
}
