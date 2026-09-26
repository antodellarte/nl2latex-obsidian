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
	fractionSeparator: string;
}

export const DEFAULT_SETTINGS: NL2LatexSettings = {
	openMarker: ",,",
	closeMarker: ",,",
	autoConvertOnMarker: true,
	convertOnSpace: false,
	preferredLanguageHint: "auto",
	wrapInDollars: true,
	dollarStyle: "$...$",
	fractionSeparator: ",",
	regexSnippets: [],
};

type Canon =
	| "INTEGRAL" | "DERIVATIVE" | "PARTIAL_DERIVATIVE" | "LIMIT"
	| "SUM" | "PRODUCT" | "SQRT" | "NROOT" | "FRACTION"
	| "OF" | "FROM" | "TO" | "AS" | "APPROACHES" | "WITH_RESPECT_TO"
	| "SQUARED" | "CUBED" | "TO_THE_POWER"
	| "PLUS" | "MINUS" | "TIMES" | "DIVIDED_BY"
	| "EQUAL" | "LESS_THAN" | "GREATER_THAN" | "PLUS_MINUS" | "MINUS_PLUS"
	| "EQUIVALENT" | "CONGRUENT" | "SIMILAR" | "PROPORTIONAL"
	| "FACTORIAL" | "ABSOLUTE_VALUE" | "REAL_PART" | "IMAGINARY_PART"
	| "IN_SET" | "NOT_IN_SET" | "SUBSET" | "UNION" | "INTERSECTION" | "SETMINUS" | "EMPTY_SET" | "EXISTS_UNIQUE" | "NOT_EXISTS"
	| "SECOND_DERIVATIVE" | "THIRD_DERIVATIVE" | "SECOND_PARTIAL_DERIVATIVE" | "THIRD_PARTIAL_DERIVATIVE"
	| "DOUBLE_INTEGRAL" | "TRIPLE_INTEGRAL" | "LINE_INTEGRAL" | "CLOSED_LINE_INTEGRAL"
	| "GRADIENT" | "DIVERGENCE" | "CURL" | "LAPLACIAN"
	| "LEFT_SIDE" | "RIGHT_SIDE"
	| "ARCSIN" | "ARCCOS" | "ARCTAN" | "SINH" | "COSH" | "TANH" | "SEC" | "CSC" | "COT" | "EXP"
	| "DOT_PRODUCT" | "CROSS_PRODUCT" | "TRANSPOSE" | "INVERSE" | "DETERMINANT"
	| "MATRIX" | "COLUMN_VECTOR" | "ROW_VECTOR"
	| "OPEN_PAREN" | "CLOSE_PAREN"
	| "SIN" | "COS" | "TAN" | "LN" | "LOG" | "VECTOR" | "INFINITY" | "IMAGINARY_UNIT"
	| "NATURAL_SET" | "INTEGER_SET" | "RATIONAL_SET" | "REAL_SET" | "COMPLEX_SET" | "PI" | "E_CONST"
	| "ALPHA" | "BETA" | "GAMMA" | "DELTA" | "EPSILON" | "THETA" | "LAMBDA" | "MU" | "SIGMA" | "OMEGA" | "PHI"
	| "ZETA" | "ETA" | "IOTA" | "KAPPA" | "NU" | "XI" | "OMICRON" | "RHO" | "TAU" | "UPSILON" | "CHI"
	| "AND" | "OR" | "NOT" | "IMPLIES" | "IFF" | "FORALL" | "EXISTS" | "NEQ" | "LEQ" | "GEQ" | "APPROX";

const SYNONYMS: Array<{ canon: Canon; variants: string[] }> = [
	{ canon: "PARTIAL_DERIVATIVE", variants: [ "partial derivative of", "derivata parziale di" ]},
	{ canon: "DERIVATIVE", variants: [ "derivative of", "derivata di", "derivata prima di", "derivative" ]},
	{ canon: "INTEGRAL", variants: [ "integral of", "integrale di", "integrale", "integral" ]},
	{ canon: "LIMIT", variants: [ "limit of", "limite di", "limite", "limit" ]},
	{ canon: "SUM", variants: [ "sum of", "sommatoria di", "somma di", "summation of", "sommatoria", "summation" ]},
	{ canon: "PRODUCT", variants: [ "product of", "produttoria di", "produttoria" ]},
	{ canon: "SQRT", variants: [ "square root of", "sqrt of", "sqrt", "radice quadrata di", "radice quadrata", "radice di" ]},
	{ canon: "NROOT", variants: [ "root of order", "radice di ordine", "n-th root of", "radice ennesima di" ]},
	{ canon: "WITH_RESPECT_TO", variants: [ "with respect to", "rispetto a", "wrt" ]},
	{ canon: "APPROACHES", variants: [ "approaches", "tends to", "tende a", "che tende a" ]},
	{ canon: "FROM", variants: [ "from", "da" ]},
	{ canon: "TO", variants: [ "to", "a" ]},
	{ canon: "AS", variants: [ "as", "come" ]},
	{ canon: "SQUARED", variants: [ "squared", "al quadrato", "quadro" ]},
	{ canon: "CUBED", variants: [ "cubed", "al cubo", "cubo" ]},
	{ canon: "TO_THE_POWER", variants: [ "to the power of", "to the power", "alla potenza di", "elevato alla", "elevato a" ]},
	{ canon: "PLUS", variants: [ "plus", "più", "piu" ]},
	{ canon: "MINUS", variants: [ "minus", "meno" ]},
	{ canon: "TIMES", variants: [ "times", "multiplied by", "per", "moltiplicato per", "volte" ]},
	{ canon: "DIVIDED_BY", variants: [ "divided by", "over", "diviso", "diviso per" ]},
	{ canon: "EQUAL", variants: [ "equals", "equal to", "uguale a", "uguale" ]},
	{ canon: "LESS_THAN", variants: [ "is less than", "è minore di", "less than", "minore di", "minore" ]},
	{ canon: "GREATER_THAN", variants: [ "is greater than", "è maggiore di", "greater than", "maggiore di", "maggiore" ]},
	{ canon: "PLUS_MINUS", variants: [ "plus or minus", "più o meno", "piu o meno" ]},
	{ canon: "MINUS_PLUS", variants: [ "minus or plus", "meno o più", "meno o piu" ]},
	{ canon: "EQUIVALENT", variants: [ "equivalent to", "equivalente a" ]},
	{ canon: "CONGRUENT", variants: [ "congruent", "congruente" ]},
	{ canon: "SIMILAR", variants: [ "similar to", "simile a" ]},
	{ canon: "PROPORTIONAL", variants: [ "proportional to", "proporzionale a" ]},
	{ canon: "FACTORIAL", variants: [ "factorial", "fattoriale" ]},
	{ canon: "ABSOLUTE_VALUE", variants: [ "absolute value of", "valore assoluto di", "absolute value", "valore assoluto" ]},
	{ canon: "REAL_PART", variants: [ "real part of", "parte reale di" ]},
	{ canon: "IMAGINARY_PART", variants: [ "imaginary part of", "parte immaginaria di" ]},
	{ canon: "IN_SET", variants: [ "belongs to", "is in", "appartiene a" ]},
	{ canon: "NOT_IN_SET", variants: [ "does not belong to", "doesn't belong to", "not in", "non appartiene a" ]},
	{ canon: "SUBSET", variants: [ "subset of", "sottoinsieme di" ]},
	{ canon: "UNION", variants: [ "union", "unione" ]},
	{ canon: "INTERSECTION", variants: [ "intersection", "intersezione" ]},
	{ canon: "SETMINUS", variants: [ "set difference", "difference of sets", "setminus", "differenza tra insiemi" ]},
	{ canon: "EMPTY_SET", variants: [ "empty set", "insieme vuoto" ]},
	{ canon: "EXISTS_UNIQUE", variants: [ "there exists a unique", "there exists exactly one", "esiste un unico", "esiste una unica" ]},
	{ canon: "NOT_EXISTS", variants: [ "does not exist", "doesn't exist", "non esiste" ]},
	{ canon: "SECOND_DERIVATIVE", variants: [ "second derivative of", "derivata seconda di" ]},
	{ canon: "THIRD_DERIVATIVE", variants: [ "third derivative of", "derivata terza di" ]},
	{ canon: "SECOND_PARTIAL_DERIVATIVE", variants: [ "second partial derivative of", "derivata parziale seconda di" ]},
	{ canon: "THIRD_PARTIAL_DERIVATIVE", variants: [ "third partial derivative of", "derivata parziale terza di" ]},
	{ canon: "DOUBLE_INTEGRAL", variants: [ "double integral of", "integrale doppio di" ]},
	{ canon: "TRIPLE_INTEGRAL", variants: [ "triple integral of", "integrale triplo di" ]},
	{ canon: "LINE_INTEGRAL", variants: [ "line integral of", "integral around", "integrale di linea" ]},
	{ canon: "CLOSED_LINE_INTEGRAL", variants: [ "closed line integral", "contour integral", "integrale di linea chiusa" ]},
	{ canon: "GRADIENT", variants: [ "gradient of", "gradiente di" ]},
	{ canon: "DIVERGENCE", variants: [ "divergence of", "divergenza di" ]},
	{ canon: "CURL", variants: [ "curl of", "rotor of", "rotore di" ]},
	{ canon: "LAPLACIAN", variants: [ "laplacian of", "laplaciano di" ]},
	{ canon: "LEFT_SIDE", variants: [ "from the left", "from left", "da sinistra" ]},
	{ canon: "RIGHT_SIDE", variants: [ "from the right", "from right", "da destra" ]},
	{ canon: "FRACTION", variants: [ "fratto", "fraction", "frazione" ]},
	{ canon: "OF", variants: [ "of", "di" ]},
	{ canon: "VECTOR", variants: [ "vector of", "vettore di", "vector", "vettore" ]},
	{ canon: "SIN", variants: [ "sine of", "sin of", "seno di", "sin", "sen" ]},
	{ canon: "COS", variants: [ "cosine of", "cos of", "coseno di", "cos" ]},
	{ canon: "TAN", variants: [ "tangent of", "tan of", "tangente di", "tan", "tg" ]},
	{ canon: "LN", variants: [ "natural log of", "ln of", "logaritmo naturale di", "ln" ]},
	{ canon: "LOG", variants: [ "log base", "logarithm of", "log of", "logaritmo di", "log" ]},
	{ canon: "ARCSIN", variants: [ "arcsine of", "arcsin of", "arcoseno di", "arcsin" ]},
	{ canon: "ARCCOS", variants: [ "arccosine of", "arccos of", "arcocoseno di", "arccos" ]},
	{ canon: "ARCTAN", variants: [ "arctangent of", "arctan of", "arcotangente di", "arctan" ]},
	{ canon: "SINH", variants: [ "hyperbolic sine of", "seno iperbolico di", "sinh" ]},
	{ canon: "COSH", variants: [ "hyperbolic cosine of", "coseno iperbolico di", "cosh" ]},
	{ canon: "TANH", variants: [ "hyperbolic tangent of", "tangente iperbolica di", "tanh" ]},
	{ canon: "SEC", variants: [ "secant of", "secante di", "sec" ]},
	{ canon: "CSC", variants: [ "cosecant of", "cosecante di", "csc" ]},
	{ canon: "COT", variants: [ "cotangent of", "cotangente di", "cot" ]},
	{ canon: "EXP", variants: [ "exponential of", "esponenziale di", "exp" ]},
	{ canon: "DOT_PRODUCT", variants: [ "dot product", "scalar product", "prodotto scalare" ]},
	{ canon: "CROSS_PRODUCT", variants: [ "cross product", "vector product", "prodotto vettoriale" ]},
	{ canon: "TRANSPOSE", variants: [ "transpose", "trasposta" ]},
	{ canon: "INVERSE", variants: [ "inverse", "inversa" ]},
	{ canon: "DETERMINANT", variants: [ "determinant", "determinante" ]},
	{ canon: "MATRIX", variants: [ "matrix", "matrice", "mat" ]},
	{ canon: "COLUMN_VECTOR", variants: [ "column vector", "vettore colonna" ]},
	{ canon: "ROW_VECTOR", variants: [ "row vector", "vettore riga" ]},
	{ canon: "INFINITY", variants: [ "infinity", "infinito", "infinite", "inf" ]},
	{ canon: "IMAGINARY_UNIT", variants: [ "imaginary unit", "unita immaginaria", "imaginary number", "numero immaginario" ]},
	{ canon: "NATURAL_SET", variants: [ "natural numbers", "numeri naturali", "natural number", "numero naturale" ]},
	{ canon: "INTEGER_SET", variants: [ "integers", "numeri interi", "integer", "interi" ]},
	{ canon: "RATIONAL_SET", variants: [ "rational numbers", "numeri razionali", "rational number", "numero razionale" ]},
	{ canon: "REAL_SET", variants: [ "real numbers", "numeri reali", "real number", "numero reale" ]},
	{ canon: "COMPLEX_SET", variants: [ "complex numbers", "numeri complessi", "complex number", "numero complesso" ]},
	{ canon: "PI", variants: [ "pi greco", "pi" ]},
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
	{ canon: "ZETA", variants: [ "zeta" ]},
	{ canon: "ETA", variants: [ "eta" ]},
	{ canon: "IOTA", variants: [ "iota" ]},
	{ canon: "KAPPA", variants: [ "kappa" ]},
	{ canon: "NU", variants: [ "nu" ]},
	{ canon: "XI", variants: [ "xi" ]},
	{ canon: "OMICRON", variants: [ "omicron" ]},
	{ canon: "RHO", variants: [ "rho" ]},
	{ canon: "TAU", variants: [ "tau" ]},
	{ canon: "UPSILON", variants: [ "upsilon" ]},
	{ canon: "CHI", variants: [ "chi" ]},

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


const SYNONYM_REGEX = new RegExp(
	"(^|\\s|\\b)(" + FLAT.map(f => escapeRegex(f.variant)).join("|") + ")(?=$|\\s|\\b)",
	"gi"
);

const VARIANT_TO_CANON = new Map<string, Canon>();
for (const f of FLAT) {
	VARIANT_TO_CANON.set(f.variant.toLowerCase(), f.canon);
}

export function normalizeToTokens(input: string, fractionSeparator = ","): string {
	let s = " " + input.trim() + " ";
	s = s.replace(/\b(limit|limite)\b([\s\S]*?)\bper(?=\s+[^\s]+\s+(?:che\s+)?(?:tende a|approaches)\b)/i, "$1$2 as");
	s = s.replace(/\b(integral|integrale)\b([\s\S]*?)\bin\s+d?\s*([a-zA-Z])\b/i, "$1$2 with respect to $3");
		s = s.replace(SYNONYM_REGEX, (match: string, p1: string, p2: string) => {		
		if (p2.length === 1 && p2 !== p2.toLowerCase()) return match;
		const canon = VARIANT_TO_CANON.get(p2.toLowerCase());
		return canon ? `${p1}@@${canon}@@ ` : match;
	});
	const standaloneSetLetters: Record<string, string> = {
		N: "NATURAL_SET",
		Z: "INTEGER_SET",
		Q: "RATIONAL_SET",
		R: "REAL_SET",
		C: "COMPLEX_SET",
	};
	const setLetter = s.trim().toUpperCase();
	if (standaloneSetLetters[setLetter]) {
		s = `@@${standaloneSetLetters[setLetter]}@@`;
	}
	s = s.replace(/@@(IN_SET|NOT_IN_SET|SUBSET)@@\s+([NZQRC])\b/g, (_match, relation: string, letter: string) =>
		`@@${relation}@@ @@${standaloneSetLetters[letter]}@@`
	);
	s = s.replace(/\\exists!/g, " @@EXISTS_UNIQUE@@ ");
	s = s.replace(/\\nexists/g, " @@NOT_EXISTS@@ ");
	s = s.replace(/\\pm/g, " @@PLUS_MINUS@@ ");
	s = s.replace(/\\mp/g, " @@MINUS_PLUS@@ ");
	s = s.replace(/\\equiv/g, " @@EQUIVALENT@@ ");
	s = s.replace(/\\cong/g, " @@CONGRUENT@@ ");
	s = s.replace(/\\sim/g, " @@SIMILAR@@ ");
	s = s.replace(/\\propto/g, " @@PROPORTIONAL@@ ");
	s = s.replace(/\\notin/g, " @@NOT_IN_SET@@ ");
	s = s.replace(/\\in(?![a-zA-Z])/g, " @@IN_SET@@ ");
	s = s.replace(/\\subset/g, " @@SUBSET@@ ");
	s = s.replace(/\\cup/g, " @@UNION@@ ");
	s = s.replace(/\\cap/g, " @@INTERSECTION@@ ");
	s = s.replace(/\\setminus/g, " @@SETMINUS@@ ");
	s = s.replace(/\\varnothing/g, " @@EMPTY_SET@@ ");
	s = s.replace(/=/g, " @@EQUAL@@ ");
	s = s.replace(/</g, " @@LESS_THAN@@ ");
	s = s.replace(/>/g, " @@GREATER_THAN@@ ");
	s = s.replace(/@@(IN_SET|NOT_IN_SET|SUBSET)@@\s+([NZQRC])\b/g, (_match, relation: string, letter: string) =>
		`@@${relation}@@ @@${standaloneSetLetters[letter]}@@`
	);
	const separator = fractionSeparator.trim() || ",";
	s = s.replace(
		new RegExp(`${escapeRegex(separator)}(?=\\s*@@FRACTION@@)`, "g"),
		" @@FRACTION_SEPARATOR@@ "
	);
	
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

function readSingleOperand(c: Cursor): string {
	while (/\s/.test(c.text[c.pos] ?? "")) c.pos++;
	if (peekToken(c) === "OF") consumeToken(c);
	while (/\s/.test(c.text[c.pos] ?? "")) c.pos++;
	const start = c.pos;
	if (c.text[c.pos] === "(") {
		let depth = 0;
		do {
			if (c.text[c.pos] === "(") depth++;
			if (c.text[c.pos] === ")") depth--;
			c.pos++;
		} while (c.pos < c.text.length && depth > 0);
		return c.text.slice(start, c.pos).trim();
	}
	const token = c.text.slice(c.pos).match(/^@@[A-Z_]+@@/);
	if (token) {
		c.pos += token[0].length;
		return token[0];
	}
	while (c.pos < c.text.length && !/[\s()]/.test(c.text[c.pos])) c.pos++;
	return c.text.slice(start, c.pos).trim();
}


function renderExpression(raw: string): string {
	let s = raw;

	s = s.replace(/([^\s@]+(?:\s*@@[A-Z_]+@@\s*[^\s@]*)*)\s*@@SQUARED@@/g, (_m: string, base: string) => `${wrapIfNeeded(base)}^2`);
	s = s.replace(/([^\s@]+(?:\s*@@[A-Z_]+@@\s*[^\s@]*)*)\s*@@CUBED@@/g, (_m: string, base: string) => `${wrapIfNeeded(base)}^3`);
	s = replacePower(s);
	s = replaceGroupedFunction(s, "SIN", "\\sin");
	s = replaceGroupedFunction(s, "COS", "\\cos");
	s = replaceGroupedFunction(s, "TAN", "\\tan");
	s = replaceGroupedFunction(s, "LN", "\\ln");
	s = replaceGroupedFunction(s, "ARCSIN", "\\arcsin");
	s = replaceGroupedFunction(s, "ARCCOS", "\\arccos");
	s = replaceGroupedFunction(s, "ARCTAN", "\\arctan");
	s = replaceGroupedFunction(s, "SINH", "\\sinh");
	s = replaceGroupedFunction(s, "COSH", "\\cosh");
	s = replaceGroupedFunction(s, "TANH", "\\tanh");
	s = replaceGroupedFunction(s, "SEC", "\\sec");
	s = replaceGroupedFunction(s, "CSC", "\\csc");
	s = replaceGroupedFunction(s, "COT", "\\cot");
	s = replaceGroupedFunction(s, "EXP", "\\exp");
	s = replaceGroupedFunction(s, "REAL_PART", "\\operatorname{Re}");
	s = replaceGroupedFunction(s, "IMAGINARY_PART", "\\operatorname{Im}");
	s = replaceGroupedVector(s);
	s = replaceGroupedLog(s);
	s = s.replace(/@@SIN@@\s*(?:@@OF@@\s*)?([^\s@]+)/g, "\\sin($1)");
	s = s.replace(/@@COS@@\s*(?:@@OF@@\s*)?([^\s@]+)/g, "\\cos($1)");
	s = s.replace(/@@TAN@@\s*(?:@@OF@@\s*)?([^\s@]+)/g, "\\tan($1)");
	s = s.replace(/@@LN@@\s*(?:@@OF@@\s*)?([^\s@]+)/g, "\\ln($1)");
	s = s.replace(/@@ARCSIN@@\s*(?:@@OF@@\s*)?([^\s@]+)/g, "\\arcsin($1)");
	s = s.replace(/@@ARCCOS@@\s*(?:@@OF@@\s*)?([^\s@]+)/g, "\\arccos($1)");
	s = s.replace(/@@ARCTAN@@\s*(?:@@OF@@\s*)?([^\s@]+)/g, "\\arctan($1)");
	s = s.replace(/@@SINH@@\s*(?:@@OF@@\s*)?([^\s@]+)/g, "\\sinh($1)");
	s = s.replace(/@@COSH@@\s*(?:@@OF@@\s*)?([^\s@]+)/g, "\\cosh($1)");
	s = s.replace(/@@TANH@@\s*(?:@@OF@@\s*)?([^\s@]+)/g, "\\tanh($1)");
	s = s.replace(/@@SEC@@\s*(?:@@OF@@\s*)?([^\s@]+)/g, "\\sec($1)");
	s = s.replace(/@@CSC@@\s*(?:@@OF@@\s*)?([^\s@]+)/g, "\\csc($1)");
	s = s.replace(/@@COT@@\s*(?:@@OF@@\s*)?([^\s@]+)/g, "\\cot($1)");
	s = s.replace(/@@EXP@@\s*(?:@@OF@@\s*)?([^\s@]+)/g, "\\exp($1)");
	s = s.replace(/@@REAL_PART@@\s*(?:@@OF@@\s*)?([^\s@]+)/g, "\\operatorname{Re}($1)");
	s = s.replace(/@@IMAGINARY_PART@@\s*(?:@@OF@@\s*)?([^\s@]+)/g, "\\operatorname{Im}($1)");
	s = s.replace(/@@ABSOLUTE_VALUE@@\s*(?:@@OF@@\s*)?(\([^)]*\)|[^\s@]+)/g, "\\left|$1\\right|");
	s = s.replace(/((?:@@TO@@|[^\s@]+))\s*@@DOT_PRODUCT@@\s*([^\s@]+)/g, (_match, left: string, right: string) => `${left === "@@TO@@" ? "a" : left} \\cdot ${right}`);
	s = s.replace(/((?:@@TO@@|[^\s@]+))\s*@@CROSS_PRODUCT@@\s*([^\s@]+)/g, (_match, left: string, right: string) => `${left === "@@TO@@" ? "a" : left} \\times ${right}`);
	s = s.replace(/@@DOT_PRODUCT@@\s*@@OF@@\s*((?:@@TO@@|[^\s@]+))\s*(?:@@AND@@|e)\s*([^\s@]+)/g, (_match, left: string, right: string) => `${left === "@@TO@@" ? "a" : left} \\cdot ${right}`);
	s = s.replace(/@@CROSS_PRODUCT@@\s*@@OF@@\s*((?:@@TO@@|[^\s@]+))\s*(?:@@AND@@|e)\s*([^\s@]+)/g, (_match, left: string, right: string) => `${left === "@@TO@@" ? "a" : left} \\times ${right}`);
	s = s.replace(/@@INVERSE@@\s*(?:@@OF@@\s*)?(\([^)]*\)|[^\s@]+)/g, "$1^{-1}");
	s = s.replace(/@@DETERMINANT@@\s*(?:@@OF@@\s*)?(\([^)]*\)|[^\s@]+)/g, "\\det($1)");
	s = s.replace(/@@TRANSPOSE@@\s*(?:@@OF@@\s*)?([^\s@]+)/g, "$1^T");
	s = s.replace(/@@VECTOR@@\s*(?:@@OF@@\s*)?([^\s@]+)/g, "\\vec{$1}");
	s = s.replace(/@@LOG@@\s*([^\s@]+)\s*@@OF@@\s*([^\s@]+)/g, "\\log_{$1}($2)");
	s = s.replace(/@@LOG@@\s*(?:@@OF@@\s*)?([^\s@]+)/g, "\\log($1)");

	s = replaceGroupedFraction(s);
	s = s.replace(/@@TO@@(?=\s*@@(?:PLUS|MINUS|TIMES|DIVIDED_BY)@@)/g, "a");
	s = s.replace(/@@PLUS@@/g, " + ");
	s = s.replace(/@@MINUS@@/g, " - ");
	s = s.replace(/@@TIMES@@/g, " \\times ");
	s = s.replace(/@@DIVIDED_BY@@/g, " \\div ");
	s = s.replace(/@@PI@@/g, "\\pi");
	s = s.replace(/@@INFINITY@@/g, "\\infty");
	s = s.replace(/@@IMAGINARY_UNIT@@/g, "\\mathrm{i}");
	s = s.replace(/@@NATURAL_SET@@/g, "\\mathbb{N}");
	s = s.replace(/@@INTEGER_SET@@/g, "\\mathbb{Z}");
	s = s.replace(/@@RATIONAL_SET@@/g, "\\mathbb{Q}");
	s = s.replace(/@@REAL_SET@@/g, "\\mathbb{R}");
	s = s.replace(/@@COMPLEX_SET@@/g, "\\mathbb{C}");
	
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
	s = s.replace(/@@ZETA@@/g, "\\zeta");
	s = s.replace(/@@ETA@@/g, "\\eta");
	s = s.replace(/@@IOTA@@/g, "\\iota");
	s = s.replace(/@@KAPPA@@/g, "\\kappa");
	s = s.replace(/@@NU@@/g, "\\nu");
	s = s.replace(/@@XI@@/g, "\\xi");
	s = s.replace(/@@OMICRON@@/g, "\\omicron");
	s = s.replace(/@@RHO@@/g, "\\rho");
	s = s.replace(/@@TAU@@/g, "\\tau");
	s = s.replace(/@@UPSILON@@/g, "\\upsilon");
	s = s.replace(/@@CHI@@/g, "\\chi");

	s = s.replace(/@@AND@@/g, " \\land ");
	s = s.replace(/@@OR@@/g, " \\lor ");
	s = s.replace(/@@NOT@@/g, "\\lnot ");
	s = s.replace(/@@IMPLIES@@/g, " \\implies ");
	s = s.replace(/@@IFF@@/g, " \\iff ");
	s = s.replace(/@@FORALL@@/g, "\\forall ");
	s = s.replace(/@@EXISTS@@/g, "\\exists ");
	s = s.replace(/@@NOT_EXISTS@@/g, "\\nexists ");
	s = s.replace(/@@NEQ@@/g, " \\neq ");
	s = s.replace(/@@LEQ@@/g, " \\leq ");
	s = s.replace(/@@GEQ@@/g, " \\geq ");
	s = s.replace(/@@APPROX@@/g, " \\approx ");
	s = s.replace(/@@UNION@@/g, " \\cup ");
	s = s.replace(/@@INTERSECTION@@/g, " \\cap ");
	s = s.replace(/@@SETMINUS@@/g, " \\setminus ");
	s = s.replace(/@@SUBSET@@/g, " \\subset ");
	s = s.replace(/@@IN_SET@@/g, " \\in ");
	s = s.replace(/@@NOT_IN_SET@@/g, " \\notin ");
	s = s.replace(/@@GRADIENT@@/g, "\\nabla ");
	s = s.replace(/@@DIVERGENCE@@/g, "\\nabla \\cdot ");
	s = s.replace(/@@CURL@@/g, "\\nabla \\times ");
	s = s.replace(/@@LAPLACIAN@@/g, "\\nabla^2 ");
	s = s.replace(/@@DOT_PRODUCT@@/g, " \\cdot ");
	s = s.replace(/@@CROSS_PRODUCT@@/g, " \\times ");
	s = s.replace(/@@TRANSPOSE@@/g, "^T");
	s = s.replace(/@@INVERSE@@/g, "^{-1}");
	s = s.replace(/@@DETERMINANT@@/g, "\\det");
	s = s.replace(/@@EQUAL@@/g, " = ");
	s = s.replace(/@@LESS_THAN@@/g, " < ");
	s = s.replace(/@@GREATER_THAN@@/g, " > ");
	s = s.replace(/@@PLUS_MINUS@@/g, " \\pm ");
	s = s.replace(/@@MINUS_PLUS@@/g, " \\mp ");
	s = s.replace(/@@EQUIVALENT@@/g, " \\equiv ");
	s = s.replace(/@@CONGRUENT@@/g, " \\cong ");
	s = s.replace(/@@SIMILAR@@/g, " \\sim ");
	s = s.replace(/@@PROPORTIONAL@@/g, " \\propto ");
	s = s.replace(/@@IN_SET@@/g, " \\in ");
	s = s.replace(/@@NOT_IN_SET@@/g, " \\notin ");
	s = s.replace(/@@SUBSET@@/g, " \\subset ");
	s = s.replace(/@@UNION@@/g, " \\cup ");
	s = s.replace(/@@INTERSECTION@@/g, " \\cap ");
	s = s.replace(/@@SETMINUS@@/g, " \\setminus ");
	s = s.replace(/@@EMPTY_SET@@/g, "\\varnothing");
	s = s.replace(/@@EXISTS_UNIQUE@@/g, "\\exists!");
	s = s.replace(/@@FACTORIAL@@/g, "!");
	s = s.replace(/([^\s@()]+)\s+!/g, "$1!");
	s = s.replace(/(\([^()]*\))\s+!/g, "$1!");

	const fallbackTokens: Record<string, string> = {
		FRACTION: "\\frac",
		OF: " ",
		FROM: " ",
		TO: " ",
		AS: " ",
		APPROACHES: " \\to ",
		WITH_RESPECT_TO: " ",
		OPEN_PAREN: "(",
		CLOSE_PAREN: ")",
		SQUARED: "^2",
		CUBED: "^3",
		TO_THE_POWER: "^",
		INTEGRAL: "\\int ",
		DERIVATIVE: "\\frac{d}{d}",
		PARTIAL_DERIVATIVE: "\\frac{\\partial}{\\partial}",
		LIMIT: "\\lim ",
		SUM: "\\sum ",
		PRODUCT: "\\prod ",
		SQRT: "\\sqrt ",
		NROOT: "\\sqrt ",
		FRACTION_SEPARATOR: " ",
		VECTOR: "\\vec ",
		INFINITY: "\\infty",
		IMAGINARY_UNIT: "\\mathrm{i}",
		NATURAL_SET: "\\mathbb{N}",
		INTEGER_SET: "\\mathbb{Z}",
		RATIONAL_SET: "\\mathbb{Q}",
		REAL_SET: "\\mathbb{R}",
		COMPLEX_SET: "\\mathbb{C}",
		NOT_EXISTS: "\\nexists",
	};
	s = s.replace(
		/@@([A-Z_]+)@@/g,
		(_match: string, token: string) => fallbackTokens[token] ?? `\\operatorname{${token.toLowerCase()}}`
	);

	s = s.replace(/\s+/g, " ").trim();
	return s;
}

function findMatchingOpenParen(s: string, closeIndex: number): number {
	let depth = 0;
	for (let i = closeIndex; i >= 0; i--) {
		if (s[i] === ")") depth++;
		if (s[i] === "(" && --depth === 0) return i;
	}
	return -1;
}

function findMatchingCloseParen(s: string, openIndex: number): number {
	let depth = 0;
	for (let i = openIndex; i < s.length; i++) {
		if (s[i] === "(") depth++;
		if (s[i] === ")" && --depth === 0) return i;
	}
	return -1;
}

function replacePower(s: string): string {
	const marker = "@@TO_THE_POWER@@";
	let markerIndex = s.indexOf(marker);
	while (markerIndex >= 0) {
		let exponentStart = markerIndex + marker.length;
		while (/\s/.test(s[exponentStart] ?? "")) exponentStart++;
		let exponentEnd = exponentStart;
		if (s[exponentStart] === "(") {
			exponentEnd = findMatchingCloseParen(s, exponentStart) + 1;
		} else if (s.startsWith("@@", exponentStart)) {
			const exponentMarkerEnd = s.indexOf("@@", exponentStart + 2);
			exponentEnd = exponentMarkerEnd < 0 ? exponentStart : exponentMarkerEnd + 2;
		} else {
			while (exponentEnd < s.length && !/[\s@()]/.test(s[exponentEnd])) exponentEnd++;
		}
		let baseEnd = markerIndex - 1;
		while (/\s/.test(s[baseEnd] ?? "")) baseEnd--;
		let baseStart = baseEnd;
		if (s[baseEnd] === ")") {
			baseStart = findMatchingOpenParen(s, baseEnd);
		} else {
			while (baseStart > 0 && !/[\s@()]/.test(s[baseStart - 1] ?? "")) baseStart--;
		}
		if (exponentEnd <= exponentStart || baseStart < 0 || baseEnd < baseStart) {
			markerIndex = s.indexOf(marker, markerIndex + marker.length);
			continue;
		}
		const base = s.slice(baseStart, baseEnd + 1).trim();
		const exponent = s.slice(exponentStart, exponentEnd).trim();
		s = `${s.slice(0, baseStart)}${wrapIfNeeded(base)}^{${exponent}}${s.slice(exponentEnd)}`;
		markerIndex = s.indexOf(marker, baseStart + base.length);
	}
	return s;
}

function replaceGroupedFunction(s: string, canon: string, latexName: string): string {
	const marker = `@@${canon}@@`;
	let markerIndex = s.indexOf(marker);
	while (markerIndex >= 0) {
		let argumentStart = markerIndex + marker.length;
		while (/\s/.test(s[argumentStart] ?? "")) argumentStart++;
		if (s.startsWith("@@OF@@", argumentStart)) {
			argumentStart += "@@OF@@".length;
			while (/\s/.test(s[argumentStart] ?? "")) argumentStart++;
		}
		if (s[argumentStart] !== "(") {
			markerIndex = s.indexOf(marker, markerIndex + marker.length);
			continue;
		}
		const argumentEnd = findMatchingCloseParen(s, argumentStart);
		if (argumentEnd < 0) break;
		s = `${s.slice(0, markerIndex)}${latexName}${s.slice(argumentStart, argumentEnd + 1)}${s.slice(argumentEnd + 1)}`;
		markerIndex = s.indexOf(marker, markerIndex + latexName.length);
	}
	return s;
}

function replaceGroupedVector(s: string): string {
	const marker = "@@VECTOR@@";
	let markerIndex = s.indexOf(marker);
	while (markerIndex >= 0) {
		let argumentStart = markerIndex + marker.length;
		while (/\s/.test(s[argumentStart] ?? "")) argumentStart++;
		if (s.startsWith("@@OF@@", argumentStart)) {
			argumentStart += "@@OF@@".length;
			while (/\s/.test(s[argumentStart] ?? "")) argumentStart++;
		}
		if (s[argumentStart] !== "(") {
			markerIndex = s.indexOf(marker, markerIndex + marker.length);
			continue;
		}
		const argumentEnd = findMatchingCloseParen(s, argumentStart);
		if (argumentEnd < 0) break;
		const grouped = s.slice(argumentStart + 1, argumentEnd).trim();
		const components = grouped.split(/\s+/).filter(Boolean);
		const replacement = components.length > 1 && !/@@[A-Z_]+@@/.test(grouped)
			? `\\begin{pmatrix}${components.map(renderExpression).join(" \\\\ ")}\\end{pmatrix}`
			: `\\vec{${s.slice(argumentStart, argumentEnd + 1)}}`;
		s = `${s.slice(0, markerIndex)}${replacement}${s.slice(argumentEnd + 1)}`;
		markerIndex = s.indexOf(marker, markerIndex + "\\vec".length);
	}
	return s;
}

function replaceGroupedLog(s: string): string {
	const marker = "@@LOG@@";
	let markerIndex = s.indexOf(marker);
	while (markerIndex >= 0) {
		const baseMatch = s.slice(markerIndex + marker.length).match(/^\s*([^\s@()]+)\s*@@OF@@\s*/);
		if (!baseMatch) {
			markerIndex = s.indexOf(marker, markerIndex + marker.length);
			continue;
		}
		const argumentStart = markerIndex + marker.length + baseMatch[0].length;
		if (s[argumentStart] !== "(") {
			markerIndex = s.indexOf(marker, markerIndex + marker.length);
			continue;
		}
		const argumentEnd = findMatchingCloseParen(s, argumentStart);
		if (argumentEnd < 0) break;
		s = `${s.slice(0, markerIndex)}\\log_{${baseMatch[1]}}${s.slice(argumentStart, argumentEnd + 1)}${s.slice(argumentEnd + 1)}`;
		markerIndex = s.indexOf(marker, markerIndex + 1);
	}
	return s;
}

function replaceGroupedFraction(s: string): string {
	const marker = "@@FRACTION@@";
	const separatorMarker = "@@FRACTION_SEPARATOR@@";
	let markerIndex = s.indexOf(marker);
	while (markerIndex >= 0) {
		let separatorEnd = markerIndex;
		while (/\s/.test(s[separatorEnd - 1] ?? "")) separatorEnd--;
		const separatorStart = separatorEnd - separatorMarker.length;
		if (separatorStart >= 0 && s.slice(separatorStart, separatorEnd) === separatorMarker) {
			let numeratorEnd = separatorStart;
			while (/\s/.test(s[numeratorEnd - 1] ?? "")) numeratorEnd--;
			let numeratorStart = numeratorEnd;
			if (s[numeratorEnd - 1] === ")") {
				numeratorStart = findMatchingOpenParen(s, numeratorEnd - 1);
			} else {
				while (numeratorStart > 0 && !/[\s@()]/.test(s[numeratorStart - 1] ?? "")) numeratorStart--;
			}
			let rightStart = markerIndex + marker.length;
			while (/\s/.test(s[rightStart] ?? "")) rightStart++;
			let rightEnd = rightStart;
			if (s[rightStart] === "(") {
				rightEnd = findMatchingCloseParen(s, rightStart) + 1;
			} else {
				while (rightEnd < s.length && !/[\s@()]/.test(s[rightEnd])) rightEnd++;
			}
			if (numeratorStart < 0 || rightEnd <= rightStart) break;
			const numerator = stripOuterParensToken(s.slice(numeratorStart, numeratorEnd).trim());
			const denominator = stripOuterParensToken(s.slice(rightStart, rightEnd).trim());
			s = `${s.slice(0, numeratorStart)}\\frac{${numerator}}{${denominator}}${s.slice(rightEnd)}`;
			markerIndex = s.indexOf(marker);
			continue;
		}
		let leftEnd = markerIndex - 1;
		while (/\s/.test(s[leftEnd] ?? "")) leftEnd--;
		let leftStart = leftEnd;
		if (s[leftEnd] === ")") {
			leftStart = findMatchingOpenParen(s, leftEnd);
		} else {
			while (leftStart > 0 && !/[\s@()]/.test(s[leftStart - 1] ?? "")) leftStart--;
		}
		let rightStart = markerIndex + marker.length;
		while (/\s/.test(s[rightStart] ?? "")) rightStart++;
		let rightEnd = rightStart;
		if (s[rightStart] === "(") {
			rightEnd = findMatchingCloseParen(s, rightStart) + 1;
		} else {
			while (rightEnd < s.length && !/[\s@()]/.test(s[rightEnd])) rightEnd++;
		}
		if (leftStart < 0 || rightEnd <= rightStart || (s[rightStart] === "(" && rightEnd === 0)) break;
		const numerator = stripOuterParensToken(s.slice(leftStart, markerIndex).trim());
		const denominator = stripOuterParensToken(s.slice(rightStart, rightEnd).trim());
		s = `${s.slice(0, leftStart)}\\frac{${numerator}}{${denominator}}${s.slice(rightEnd)}`;
		markerIndex = s.indexOf(marker, leftStart + numerator.length);
	}
	return s;
}

function wrapIfNeeded(base: string): string {
	const b = base.trim();
	if (/^[a-zA-Z0-9]$/.test(b)) return b;
	if (b.startsWith("(") && findMatchingCloseParen(b, 0) === b.length - 1) return b;
	if (/^\\[a-zA-Z]+\{.*\}$/.test(b)) return b;
	return `(${b})`;
}

function parseIntegral(c: Cursor, symbol = "\\int"): string {
	consumeToken(c); 
	let integrand = "";
	let lower = "", upper = "";
	let variable = "x";
	if (peekToken(c) !== "FROM") {
		integrand = readFreeTextUntil(c, ["FROM", "WITH_RESPECT_TO"]);
	}
	if (peekToken(c) === "FROM") {
		consumeToken(c);
		lower = readSingleOperand(c);
		if (peekToken(c) === "TO") {
			consumeToken(c);
			upper = readSingleOperand(c);
			const postRange = readFreeTextUntil(c, ["WITH_RESPECT_TO"]);
			integrand = integrand ? `${integrand} ${postRange}`.trim() : postRange;
		}
	}
	if (peekToken(c) === "WITH_RESPECT_TO") {
		consumeToken(c);
		variable = readSingleOperand(c) || "x";
	}
	const wrtMatch = integrand.match(/@@WITH_RESPECT_TO@@\s*([^\s@]+)/);
	if (wrtMatch) {
		variable = wrtMatch[1];
		integrand = integrand.replace(/@@WITH_RESPECT_TO@@\s*([^\s@]+)/, "").trim();
	}
	const integrandLatex = renderExpression(stripOuterParensToken(integrand));
	const boundsLatex = lower && upper ? `_{${renderIntegralBound(lower)}}^{${renderIntegralBound(upper)}}` : "";
	return `\\int${boundsLatex} ${wrapForIntegrand(integrandLatex)} \\, d${variable}`;
}

function renderIntegralBound(bound: string): string {
	return bound.trim() === "@@TO@@" ? "a" : renderExpression(bound);
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

function parseDerivative(c: Cursor, partial: boolean, order = 1): string {
	consumeToken(c);  
	let body = readFreeTextUntil(c, ["WITH_RESPECT_TO"]);
	let variable = "x";
	if (peekToken(c) === "WITH_RESPECT_TO") {
		consumeToken(c);
		variable = readFreeTextUntil(c, []).trim() || "x";
	}
	const inner = renderExpression(stripOuterParensToken(body));
	const d = partial ? "\\partial" : "d";
	const power = order > 1 ? `^${order}` : "";
	const denominatorVariable = partial ? ` ${variable}` : variable;
	return `\\frac{${d}${power}}{${d}${denominatorVariable}${power}}(${inner})`;
}

function parseLimit(c: Cursor): string {
	consumeToken(c); 
	let body = readFreeTextUntil(c, ["AS"]);
	let variable = "x", target = "0";
	if (peekToken(c) === "AS") {
		consumeToken(c);
		let asClause = readFreeTextUntil(c, []);
		let direction = "";
		if (asClause.endsWith("@@LEFT_SIDE@@")) {
			direction = "^-";
			asClause = asClause.slice(0, -"@@LEFT_SIDE@@".length).trim();
		} else if (asClause.endsWith("@@RIGHT_SIDE@@")) {
			direction = "^+";
			asClause = asClause.slice(0, -"@@RIGHT_SIDE@@".length).trim();
		}
		const m = asClause.match(/^([^\s@]+)\s*@@APPROACHES@@\s*(.+)$/);
		if (m) {
			variable = m[1];
			target = normalizeLimitTarget(renderExpression(m[2]), direction);
		}
	}
	const inner = renderExpression(stripOuterParensToken(body));
	return `\\lim_{${variable} \\to ${target}} ${inner}`;
}

function normalizeLimitTarget(target: string, direction: string): string {
	const trimmed = target.trim();
	const signed = trimmed.match(/^(.+?)([+-])$/);
	if (signed) return `${signed[1]}^${signed[2]}`;
	return `${trimmed}${direction}`;
}

function parseSum(c: Cursor, isProduct: boolean): string {
	consumeToken(c);
	let body = readFreeTextUntil(c, ["FROM"]);
	let lower = "", upper = "";
	let variable = "n";
	if (peekToken(c) === "FROM") {
		consumeToken(c);
		const lowerClause = readFreeTextUntil(c, ["TO"]);
		const m = lowerClause.match(/^([^\s@=]+)\s*(?:=|@@EQUAL@@)\s*(.+)$/);
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
		const order = readSingleOperand(c);
		const inner = readSingleOperand(c);
		const remainder = renderExpression(readFreeTextUntil(c, []));
		return `\\sqrt[${renderExpression(order)}]{${renderExpression(stripOuterParensToken(inner))}}${remainder ? ` ${remainder}` : ""}`;
	}
	const inner = readSingleOperand(c);
	const remainder = renderExpression(readFreeTextUntil(c, []));
	return `\\sqrt{${renderExpression(stripOuterParensToken(inner))}}${remainder ? ` ${remainder}` : ""}`;
}

function parseMatrix(c: Cursor): string {
	consumeToken(c);
	const rest = readFreeTextUntil(c, []).replace(/^\s*@@OF@@\s*/, "");
	const match = rest.match(/^(\d+)\s*[x×]\s*(\d+)\s+(.+)$/i);
	if (!match) return "\\begin{pmatrix}\\end{pmatrix}";
	const rows = Number(match[1]);
	const columns = Number(match[2]);
	const tokens = match[3].trim().split(/\s+/).filter(Boolean);
	const values: string[] = [];
	const matrixOperators = new Set(["@@PLUS@@", "@@MINUS@@", "@@TIMES@@", "@@DIVIDED_BY@@", "@@FRACTION@@"]);
	for (let index = 0; index < tokens.length;) {
		let value = tokens[index++];
		if (matrixOperators.has(tokens[index])) {
			value += ` ${tokens[index++]}`;
			if (index < tokens.length) value += ` ${tokens[index++]}`;
		}
		values.push(value);
	}
	const expected = rows * columns;
	if (rows < 1 || columns < 1 || values.length !== expected) {
		return `\\text{Invalid matrix: expected ${expected} elements, got ${values.length}}`;
	}
	const rendered = values.map((value) => renderExpression(value));
	const matrixRows: string[] = [];
	for (let row = 0; row < rows; row++) {
		matrixRows.push(rendered.slice(row * columns, (row + 1) * columns).join(" & "));
	}
	return `\\begin{pmatrix}${matrixRows.join(" \\\\ ")}\\end{pmatrix}`;
}

function parseListVector(c: Cursor, column: boolean): string {
	consumeToken(c);
	if (peekToken(c) === "OF") consumeToken(c);
	while (/\s/.test(c.text[c.pos] ?? "")) c.pos++;
	let values: string[];
	if (c.text[c.pos] === "(") {
		const grouped = readSingleOperand(c).slice(1, -1).trim();
		values = /@@[A-Z_]+@@/.test(grouped)
			? [`(${grouped})`]
			: grouped.split(/\s+/).filter(Boolean);
	} else {
		const rest = readFreeTextUntil(c, ["PLUS", "MINUS", "TIMES", "DIVIDED_BY", "AND", "OR"]);
		values = rest.split(/\s+/).filter((value) => value && value !== "@@OF@@");
	}
	const vector = `\\begin{pmatrix}${values.map(renderExpression).join(column ? " \\\\ " : " & ")}\\end{pmatrix}`;
	const remainder = renderExpression(readFreeTextUntil(c, []));
	return remainder ? `${vector} ${remainder}` : vector;
}


export function convertNaturalLanguageToLatex(input: string, fractionSeparator = ","): string {
	const normalized = normalizeToTokens(input, fractionSeparator);
	const c: Cursor = { text: normalized, pos: 0 };
	const first = peekToken(c);

	try {
		switch (first) {
			case "INTEGRAL": return parseIntegral(c);
			case "DOUBLE_INTEGRAL": return parseIntegral(c).replace(/^\\int/, "\\iint");
			case "TRIPLE_INTEGRAL": return parseIntegral(c).replace(/^\\int/, "\\iiint");
			case "LINE_INTEGRAL": return parseIntegral(c);
			case "CLOSED_LINE_INTEGRAL": return parseIntegral(c).replace(/^\\int/, "\\oint");
			case "DERIVATIVE": return parseDerivative(c, false);
			case "SECOND_DERIVATIVE": return parseDerivative(c, false, 2);
			case "THIRD_DERIVATIVE": return parseDerivative(c, false, 3);
			case "PARTIAL_DERIVATIVE": return parseDerivative(c, true);
			case "SECOND_PARTIAL_DERIVATIVE": return parseDerivative(c, true, 2);
			case "THIRD_PARTIAL_DERIVATIVE": return parseDerivative(c, true, 3);
			case "LIMIT": return parseLimit(c);
			case "SUM": return parseSum(c, false);
			case "PRODUCT": return parseSum(c, true);
			case "SQRT": return parseSqrtLike(c, false);
			case "NROOT": return parseSqrtLike(c, true);
			case "MATRIX": return parseMatrix(c);
			case "COLUMN_VECTOR": return parseListVector(c, true);
			case "ROW_VECTOR": return parseListVector(c, false);
			default:
				return renderExpression(normalized);
		}
	} catch {
		return renderExpression(normalized);
	}
}

export function applyRegexSnippets(input: string, snippets: RegexSnippet[]): string | null {
	for (const snip of snippets) {
		if (!snip.enabled) continue;
		try {
			const re = new RegExp(snip.pattern, snip.flags.includes("g") ? snip.flags : snip.flags + "g");
			const replaced = input.replace(re, snip.replacement);
			if (replaced !== input) {
				return replaced;
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
	const bodyLatex = regexResult !== null
		? regexResult
		: convertNaturalLanguageToLatex(trimmed, settings.fractionSeparator);

	if (settings.dollarStyle === "$$...$$") return `$$${bodyLatex}$$`;
	if (settings.dollarStyle === "$...$") return `$${bodyLatex}$`;
	return bodyLatex;
}