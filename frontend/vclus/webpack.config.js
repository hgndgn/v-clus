const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

const cssConfigName = './tailwindcss-config.js';
const tailwindConfig = tailwindcss(cssConfigName);

const purgecss = require('@fullhuman/postcss-purgecss')
({
	content: [ './src/**/*.html', './src/**/*.component.ts' ],
	defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || []
});

module.exports = (config) => {
	const isProductionMode = config.mode === 'production';

	console.log(`Using '${config.mode}' mode`);

	config.module.rules.push({
		test: /\.css$/,
		use: [
			{
				loader: 'postcss-loader',
				options: {
					ident: 'postcss',
					syntax: 'postcss-scss',
					plugins: [ tailwindConfig, autoprefixer, ...(isProductionMode ? [ purgecss ] : []) ]
				}
			}
		]
	});
	
	return config;
};
