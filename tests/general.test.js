const fs = require('fs');
const { nunjucks } = require('../cjs/index.js');
jest.spyOn(fs, 'writeFileSync').mockImplementation();
jest.spyOn(fs, 'mkdirSync').mockImplementation();

const path = require('path');
const nunjucksWriter = require('../cjs/index').default;

process.chdir(__dirname); // cwd should be in tests folder where we provide a proper folder structure.
// TODO: mock fs to provide a more stable environment for the tests?

afterEach(() => {
	jest.clearAllMocks();
});

test('can initialize a writer with default parameters', async () => {
	const writer = nunjucksWriter();
	expect(writer).toBeDefined();
});

test('can render a simple template', async () => {
	const writer = nunjucksWriter();

	await writer({
		body: 'foo',
	});

	const expectedPath = path.resolve('build/unnamed-1.html');
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
});

test('can set multiple views dir with initial view', async () => {
	const writer = nunjucksWriter({
		view: 'userview.html',
		viewsDir: [
			'config/userViews1',
			'config/userViews2'
		]
	});

	await writer({
		body: 'foo',
	});

	const expectedPath = path.resolve('build/unnamed-1.html');
	const expectedContent = '__*<p>foo</p>*__';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
});

test('can use globals', async () => {
	const writer = nunjucksWriter({
		view: 'globals.test.html',
		globals: {
			globalValue: 'foo bar'
		}
	});

	await writer({
		body: 'foo',
	});

	const expectedPath = path.resolve('build/unnamed-1.html');
	const expectedContent = 'foo bar';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
});

test('can set output dir', async () => {
	const writer = nunjucksWriter({
		outDir: 'dist'
	});

	await writer({
		body: 'foo',
	});

	const expectedPath = path.resolve('dist/unnamed-1.html');
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
});

test('can set outfile name via output.path', async () => {
	const writer = nunjucksWriter();

	await writer({
		output: {
			path: 'my/output.file'
		},
		body: 'foo',
	});

	const expectedPath = path.resolve('build/my/output.file');
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
});

test('can set outfile name via output.url', async () => {
	const writer = nunjucksWriter();

	await writer({
		output: {
			url: 'my/output.file'
		},
		body: 'foo',
	});

	const expectedPath = path.resolve('build/my/output.file.html');
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
});

test('can set outfile name via header.path', async () => {
	const writer = nunjucksWriter();

	await writer({
		header: {
			path: 'my/output.file'
		},
		body: 'foo',
	});

	const expectedPath = path.resolve('build/my/output.html');
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
});

test('can set outfile name via outFile option', async () => {
	const writer = nunjucksWriter({
		outFile: () => 'my/output.file'
	});

	await writer({
		body: 'foo',
	});

	const expectedPath = path.resolve('build/my/output.file');
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
});

test('can set additional nunjucks functions', async () => {
	const writer = nunjucksWriter({
		view: 'functions.test.html',
		functions: {
			myfn(x) { return x; },
		}
	});

	await writer({
		body: 'foo bar',
	});

	const expectedPath = path.resolve('build/unnamed-1.html');
	const expectedContent = 'foo bar';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
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
		body: '<foo>',
	});

	const expectedPath = path.resolve('build/unnamed-1.html');
	const expectedContent = '&lt;foo&gt;<foo>';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
});

test('can set additional nunjucks filters', async () => {
	const writer = nunjucksWriter({
		view: 'filters.test.html',
		filters: {
			myfn(x) { return x; },
		}
	});

	await writer({
		body: 'foo bar',
	});

	const expectedPath = path.resolve('build/unnamed-1.html');
	const expectedContent = 'foo bar';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
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
		body: '<foo>',
	});

	const expectedPath = path.resolve('build/unnamed-1.html');
	const expectedContent = '&lt;foo&gt;<foo>';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
});

test('can configure with advanced configuration', async () => {
	const writer = nunjucksWriter({
		advanced: env => env.addGlobal('globalValue', 'foo bar')
	});

	await writer({
		body: 'foo',
	});

	const expectedPath = path.resolve('build/unnamed-1.html');
	const expectedContent = 'hello world!<p>foo</p>';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
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
		body: '# foo',
	});

	const expectedPath = path.resolve('build/unnamed-1.html');
	const expectedContent = '<h2 id="foo">foo</h2>';

	expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
	expect(fs.writeFileSync).toHaveBeenCalledWith(expectedPath, expectedContent);
});
