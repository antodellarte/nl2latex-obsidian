import esbuild from "esbuild";
import process from "process";
import { builtinModules } from "module";
import fs from "fs"; 

const banner = `/*
NL2LaTeX Snippets for Obsidian
auto-generated bundle, DO NOT EDIT.
*/`;

const prod = process.argv[2] === "production";

if (!fs.existsSync("build")) {
	fs.mkdirSync("build");
}

const context = await esbuild.context({
	banner: { js: banner },
	entryPoints: ["src/main.ts"],
	bundle: true,
	external: [
		"obsidian",
		"electron",
		"@codemirror/autocomplete",
		"@codemirror/collab",
		"@codemirror/commands",
		"@codemirror/language",
		"@codemirror/lint",
		"@codemirror/search",
		"@codemirror/state",
		"@codemirror/view",
		"@lezer/common",
		"@lezer/highlight",
		"@lezer/lr",
		...builtinModules,
	],
	format: "cjs",
	target: "es2018",
	logLevel: "info",
	sourcemap: prod ? false : "inline",
	treeShaking: true,
	outfile: "build/main.js", 
	minify: prod,
});

if (prod) {
	await context.rebuild();
	fs.copyFileSync("manifest.json", "build/manifest.json");
	process.exit(0);
} else {
	await context.watch();
	fs.copyFileSync("manifest.json", "build/manifest.json");
}