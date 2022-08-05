import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import rimraf from 'rimraf';
import { nunjucksWriter, nunjucks } from '../cjs/index.js';

// cwd should be in tests folder where we provide a proper folder structure.
process.chdir(path.dirname(fileURLToPath(import.meta.url)));

// TODO: mock fs to provide a more stable environment for the tests?

afterEach(() => {
	rimraf.sync('dist');
});

test('can initialize a writer with default parameters', async () => {
	const writer = nunjucksWriter();
	expect(writer).toBeDefined();
});

test('can render a simple template', async () => {
	const writer = nunjucksWriter();

	await writer({
		url: 'unnamed',
		body: 'foo',
	});

	const expectedPath = 'dist/unnamed.html';
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.existsSync(expectedPath)).toBe(true);
	expect(fs.readFileSync(expectedPath, 'utf-8')).toBe(expectedContent);
});

test('can set multiple views dir with initial view', async () => {
	const writer = nunjucksWriter({
		view: 'userview.html',
		viewsDir: [
			'views2/userViews1',
			'views2/userViews2'
		]
	});

	await writer({
		url: 'unnamed',
		body: 'foo',
	});

	const expectedPath = 'dist/unnamed.html';
	const expectedContent = '__*<p>foo</p>*__';

	expect(fs.existsSync(expectedPath)).toBe(true);
	expect(fs.readFileSync(expectedPath, 'utf-8')).toBe(expectedContent);
});

test('can use globals', async () => {
	const writer = nunjucksWriter({
		view: 'globals.test.html',
		globals: {
			globalValue: 'foo bar'
		}
	});

	await writer({
		url: 'unnamed',
		body: 'foo',
	});

	const expectedPath = 'dist/unnamed.html';
	const expectedContent = 'foo bar';

	expect(fs.existsSync(expectedPath)).toBe(true);
	expect(fs.readFileSync(expectedPath, 'utf-8')).toBe(expectedContent);
});

test('can set output dir', async () => {
	const writer = nunjucksWriter({
		outDir: 'dist'
	});

	await writer({
		url: 'unnamed',
		body: 'foo',
	});

	const expectedPath = 'dist/unnamed.html';
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.existsSync(expectedPath)).toBe(true);
	expect(fs.readFileSync(expectedPath, 'utf-8')).toBe(expectedContent);
});

test('can set outfile name via url', async () => {
	const writer = nunjucksWriter();

	await writer({
		url: 'my/output.file',
		body: 'foo',
	});

	const expectedPath = 'dist/my/output.file.html';
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.existsSync(expectedPath)).toBe(true);
	expect(fs.readFileSync(expectedPath, 'utf-8')).toBe(expectedContent);
});

test('can set outfile name via header.path', async () => {
	const writer = nunjucksWriter();

	await writer({
		header: {
			path: 'my/output.file'
		},
		body: 'foo',
	});

	const expectedPath = 'dist/my/output.html';
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.existsSync(expectedPath)).toBe(true);
	expect(fs.readFileSync(expectedPath, 'utf-8')).toBe(expectedContent);
});

test('can set outfile name via outFile option', async () => {
	const writer = nunjucksWriter({
		outFile: () => 'my/output.file'
	});

	await writer({
		body: 'foo',
	});

	const expectedPath = 'dist/my/output.file';
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.existsSync(expectedPath)).toBe(true);
	expect(fs.readFileSync(expectedPath, 'utf-8')).toBe(expectedContent);
});

test('can set additional nunjucks functions', async () => {
	const writer = nunjucksWriter({
		view: 'functions.test.html',
		functions: {
			myfn(x) { return x; },
		}
	});

	await writer({
		url: 'unnamed',
		body: 'foo bar',
	});

	const expectedPath = 'dist/unnamed.html';
	const expectedContent = 'foo bar';

	expect(fs.existsSync(expectedPath)).toBe(true);
	expect(fs.readFileSync(expectedPath, 'utf-8')).toBe(expectedContent);
});

test('can set additional nunjucks functions with options', async () => {
	const writer = nunjucksWriter({
		view: 'functions-opts.test.html',
		functions: {
			myfn_safe: x => new nunjucks.runtime.SafeString(x),
			myfn: x => x,
		}
	});

	await writer({
		url: 'unnamed',
		body: '<foo>',
	});

	const expectedPath = 'dist/unnamed.html';
	const expectedContent = '&lt;foo&gt;<foo>';

	expect(fs.existsSync(expectedPath)).toBe(true);
	expect(fs.readFileSync(expectedPath, 'utf-8')).toBe(expectedContent);
});

test('can set additional nunjucks filters', async () => {
	const writer = nunjucksWriter({
		view: 'filters.test.html',
		filters: {
			myfn(x) { return x; },
		}
	});

	await writer({
		url: 'unnamed',
		body: 'foo bar',
	});

	const expectedPath = 'dist/unnamed.html';
	const expectedContent = 'foo bar';

	expect(fs.existsSync(expectedPath)).toBe(true);
	expect(fs.readFileSync(expectedPath, 'utf-8')).toBe(expectedContent);
});

test('can set additional nunjucks filters with options', async () => {
	const writer = nunjucksWriter({
		view: 'filters-opts.test.html',
		filters: {
			myfn_safe: x => new nunjucks.runtime.SafeString(x),
			myfn: x => x,
		}
	});

	await writer({
		url: 'unnamed',
		body: '<foo>',
	});

	const expectedPath = 'dist/unnamed.html';
	const expectedContent = '&lt;foo&gt;<foo>';

	expect(fs.existsSync(expectedPath)).toBe(true);
	expect(fs.readFileSync(expectedPath, 'utf-8')).toBe(expectedContent);
});

test('can configure with advanced configuration', async () => {
	const writer = nunjucksWriter({
		advanced: env => env.addGlobal('globalValue', 'foo bar')
	});

	await writer({
		url: 'unnamed',
		body: 'foo',
	});

	const expectedPath = 'dist/unnamed.html';
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.existsSync(expectedPath)).toBe(true);
	expect(fs.readFileSync(expectedPath, 'utf-8')).toBe(expectedContent);
});

test('can turn off custom markdown filter', async () => {
	const writer = nunjucksWriter({
		showdownEnabled: false
	});

	await expect(async () => {
		await writer({
			body: 'foo',
		});
	})
		.rejects
		.toThrow('Error: filter not found: markdown');
});

test('can configure showdown filter', async () => {
	const writer = nunjucksWriter({
		view: 'showdown.html',
		showdownOptions: {
			headerLevelStart: 2
		}
	});

	await writer({
		url: 'unnamed',
		body: '# foo',
	});

	const expectedPath = 'dist/unnamed.html';
	const expectedContent = '<h2 id="foo">foo</h2>';

	expect(fs.existsSync(expectedPath)).toBe(true);
	expect(fs.readFileSync(expectedPath, 'utf-8')).toBe(expectedContent);
});
