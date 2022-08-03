import showdown from 'showdown';
import nunjucks from 'nunjucks';
import { fileWriter, FileWriterOptions } from '@static-pages/file-writer';

export { nunjucks };

export type NunjucksWriterOptions = {
	view?: string | { (data: Record<string, unknown>): string };
	viewsDir?: string | string[];

	// advanced
	globals?: Record<string, unknown>;
	functions?: Record<string, { (...args: unknown[]): unknown }>;
	filters?: Record<string, { (...args: unknown[]): unknown }>;
	advanced?: { (env: nunjucks.Environment): void };
	showdownEnabled?: boolean;
	showdownOptions?: showdown.ConverterOptions;
} & Omit<FileWriterOptions, 'renderer'>;

export const nunjucksWriter = ({
	view = 'main.html',
	viewsDir = 'views',
	globals = {},
	functions = {},
	filters = {},
	advanced = () => undefined,
	showdownEnabled = true,
	showdownOptions = {},
	...rest
}: NunjucksWriterOptions = {}) => {
	if (typeof view !== 'string' && typeof view !== 'function')
		throw new Error('nunjucks-writer \'view\' option expects a string or a function.');

	if (typeof viewsDir !== 'string' && !(Array.isArray(viewsDir) && viewsDir.every(x => typeof x === 'string')))
		throw new Error('nunjucks-writer \'viewsDir\' option expects a string or string[].');

	if (typeof globals !== 'object' || !globals)
		throw new Error('nunjucks-writer \'globals\' option expects an object.');

	if (typeof functions !== 'object' || !functions)
		throw new Error('nunjucks-writer \'functions\' option expects an object.');

	if (typeof filters !== 'object' || !filters)
		throw new Error('nunjucks-writer \'filters\' option expects an object.');

	if (typeof advanced !== 'function')
		throw new Error('nunjucks-writer \'advanced\' option expects a function.');

	if (typeof showdownOptions !== 'object' || !showdownOptions)
		throw new Error('nunjucks-writer \'showdownOptions\' option expects an object.');

	// Create Nunjucks env
	const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(viewsDir));

	// Provide a built-in markdown filter
	if (showdownEnabled) {
		const converter = new showdown.Converter({
			simpleLineBreaks: true,
			ghCompatibleHeaderId: true,
			customizedHeaderId: true,
			tables: true,
			...showdownOptions,
		});
		env.addFilter('markdown', md => new nunjucks.runtime.SafeString(converter.makeHtml(md)));
	}

	// Globals
	for (const [k, v] of Object.entries(globals)) {
		env.addGlobal(k, v);
	}

	// Functions
	for (const [k, v] of Object.entries(functions)) {
		env.addGlobal(k, v);
	}

	// Filters
	for (const [k, v] of Object.entries(filters)) {
		env.addFilter(k, v);
	}

	// Advanced configuration if nothing helps.
	advanced(env);

	const writer = fileWriter({
		...rest,
		renderer: data => env.render(typeof view === 'function' ? view(data) : view, data),
	});

	return (data: Record<string, unknown>): Promise<void> => writer(data);
};

export default nunjucksWriter;
