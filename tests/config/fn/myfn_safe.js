const { nunjucks } = require('../../../cjs/index.js');
module.exports = {
	functions: {
		myfn_safe: x => new nunjucks.runtime.SafeString(x),
		myfn: x => x,
	},
	filters: {
		myfn_safe: x => new nunjucks.runtime.SafeString(x),
		myfn: x => x,
	}
};
