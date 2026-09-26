import assert from "node:assert/strict";
import { test } from "node:test";
import { DEFAULT_SETTINGS, convert } from "../src/parser.ts";

const settings = {
	...DEFAULT_SETTINGS,
	regexSnippets: [],
	dollarStyle: "none" as const,
};

function latex(input: string, extra: Partial<typeof settings> = {}): string {
	return convert(input, { ...settings, ...extra });
}

test("sum and product bounds accept normalized equality tokens", () => {
	assert.equal(latex("sum of x from n = 1 to 3"), "\\sum_{n=1}^{3} x");
	assert.equal(latex("product of x from n = 1 to 3"), "\\prod_{n=1}^{3} x");
});

test("fraction separators are contextual and do not consume decimal commas", () => {
	assert.equal(latex("(4x-2) fratto 4x"), "\\frac{4x-2}{4x}");
	assert.equal(latex("(4x minus 2), fratto 4x"), "\\frac{4x - 2}{4x}");
	assert.equal(latex("x plus (4x minus 2), fratto 4x"), "x + \\frac{4x - 2}{4x}");
	assert.equal(latex("a plus (4x minus 2) fratto 4x"), "a + \\frac{4x - 2}{4x}");
	assert.equal(latex("x plus (4x-2) fratto 4x"), "x + \\frac{4x-2}{4x}");
	assert.equal(latex("1,5 plus 2"), "1,5 + 2");
	assert.equal(latex("4x-1; fratto 4", { fractionSeparator: ";" }), "\\frac{4x-1}{4}");
});

test("Italian `per` distinguishes multiplication from limit syntax", () => {
	assert.equal(latex("x per y"), "x \\times y");
	assert.equal(latex("limite di f per x che tende a 0"), "\\lim_{x \\to 0} f");
});

test("integrals consume explicit English and Italian differential variables", () => {
	assert.equal(latex("integral of x with respect to y"), "\\int x \\, dy");
	assert.equal(latex("integrale di x in dy"), "\\int x \\, dy");
});

test("built-in substitutions are parser behavior, not editable default snippets", () => {
	assert.equal(DEFAULT_SETTINGS.regexSnippets.length, 0);
	assert.equal(latex("square root of x"), "\\sqrt{x}");
	assert.equal(latex("infinito"), "\\infty");
});

test("roots and vectors stop at the next expression", () => {
	assert.equal(latex("sqrt of (x plus 1)"), "\\sqrt{x + 1}");
	assert.equal(latex("sqrt of x plus 1"), "\\sqrt{x} + 1");
	assert.equal(latex("radice quadrata di (x più 1)"), "\\sqrt{x + 1}");
	assert.equal(latex("radice quadrata di x più 1"), "\\sqrt{x} + 1");
	assert.equal(latex("square root of x plus y"), "\\sqrt{x} + y");
	assert.equal(latex("vector of v plus 1"), "\\vec{v} + 1");
	assert.equal(latex("vettore di v più 1"), "\\vec{v} + 1");
	assert.equal(latex("vector of (1 2 3)"), "\\begin{pmatrix}1 \\\\ 2 \\\\ 3\\end{pmatrix}");
	assert.equal(latex("vettore di (1 2 3)"), "\\begin{pmatrix}1 \\\\ 2 \\\\ 3\\end{pmatrix}");
	assert.equal(latex("vector of (x plus 1) plus y"), "\\vec{(x + 1)} + y");
	assert.equal(latex("vettore di (x più 1) più y"), "\\vec{(x + 1)} + y");
	assert.equal(latex("column vector of 1 2 3 plus x"), "\\begin{pmatrix}1 \\\\ 2 \\\\ 3\\end{pmatrix} + x");
});

test("line integrals distinguish open and closed contours", () => {
	assert.equal(latex("line integral of f"), "\\int f \\, dx");
	assert.equal(latex("closed line integral of f"), "\\oint f \\, dx");
});

test("left and right limits support English, Italian, and signed targets", () => {
	assert.equal(latex("limit of f as x approaches 0+"), "\\lim_{x \\to 0^+} f");
	assert.equal(latex("limite di f come x tende a 0 da sinistra"), "\\lim_{x \\to 0^-} f");
	assert.equal(latex("limite di f come x tende a 0 da destra"), "\\lim_{x \\to 0^+} f");
});

test("matrix dimensions reject missing and extra entries", () => {
	assert.match(latex("matrix 2x2 1 2 3"), /Invalid matrix: expected 4 elements, got 3/);
	assert.match(latex("matrix 2x2 1 2 3 4 5"), /Invalid matrix: expected 4 elements, got 5/);
});

test("nested fractions, powers, functions, and parentheses remain valid", () => {
	assert.equal(latex("(x plus 1) fratto (x minus 1)"), "\\frac{x + 1}{x - 1}");
	assert.equal(latex("(x plus 1) elevato a 2"), "(x + 1)^{2}");
	assert.equal(latex("sin (x plus 1)"), "\\sin(x + 1)");
	assert.equal(latex("ln (x fratto 2)"), "\\ln(\\frac{x}{2})");
	assert.equal(latex("log base 2 of (x plus 1)"), "\\log_{2}(x + 1)");
	const output = latex("(x plus 1) fratto (e elevato a (2x minus 3))");
	assert.equal(output, "\\frac{x + 1}{e^{(2x - 3)}}");
	assert.doesNotMatch(output, /@@[A-Z_]+@@/);
});

test("requested construct regressions remain correct", () => {
	assert.equal(latex("(x plus 1) fratto (y minus 2)"), "\\frac{x + 1}{y - 2}");
	assert.equal(latex("valore assoluto di x"), "\\left|x\\right|");
	assert.equal(latex("integral from 0 to 1 x squared with respect to x"), "\\int_{0}^{1} x^2 \\, dx");
	assert.equal(latex("integral of x squared from 0 to 1 with respect to x"), "\\int_{0}^{1} x^2 \\, dx");
	assert.equal(latex("integrale da a a b f(x) rispetto a x"), "\\int_{a}^{b} f(x) \\, dx");
	assert.equal(latex("vettore colonna di (1 2 3)"), "\\begin{pmatrix}1 \\\\ 2 \\\\ 3\\end{pmatrix}");
	assert.equal(latex("row vector of (1 2 3)"), "\\begin{pmatrix}1 & 2 & 3\\end{pmatrix}");
	assert.equal(latex("a dot product b"), "a \\cdot b");
	assert.equal(latex("a cross product b"), "a \\times b");
	assert.equal(latex("log base 2 of x"), "\\log_{2}(x)");
	assert.equal(latex("matrix 2x2 x plus 1 y minus 1 z times 2 w divided by 3"), "\\begin{pmatrix}x + 1 & y - 1 \\\\ z \\times 2 & w \\div 3\\end{pmatrix}");
	assert.equal(latex("matrice 2x2 x più 1 y meno 1 z per 2 w fratto 3"), "\\begin{pmatrix}x + 1 & y - 1 \\\\ z \\times 2 & \\frac{w}{3}\\end{pmatrix}");
	assert.equal(latex("matrix 2x2 1 2 3 4"), "\\begin{pmatrix}1 & 2 \\\\ 3 & 4\\end{pmatrix}");
});

test("all tested constructs never leak internal tokens", () => {
	const inputs = [
		"x equals y", "x not in Q", "absolute value of x", "real part of z",
		"imaginary part of z", "scalar product of a and b", "zeta eta xi",
		"gradient of f", "divergence of F", "laplacian of f", "infinite",
	];
	for (const input of inputs) assert.doesNotMatch(latex(input), /@@[A-Z_]+@@/);
});

test("non-existence renders in English, Italian, and raw LaTeX", () => {
	assert.equal(latex("does not exist x"), "\\nexists x");
	assert.equal(latex("non esiste x"), "\\nexists x");
	assert.equal(latex("\\nexists x"), "\\nexists x");
});
