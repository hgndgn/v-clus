module.exports = {
	theme: {
		container: {
			center: true,
			padding: '1rem'
		},
	},
	variants: {
		tableLayout: [ 'responsive', 'hover', 'focus', 'active' ],
		appearance: [ 'responsive' ],
		borderColor: [ 'responsive', 'hover', 'focus' ],
		outline: [ 'responsive', 'focus' ],
		zIndex: [ 'responsive' ]

		// 	opacity: [ 'responsive', 'hover' ],
		// 	appearance: [ 'responsive' ]
	},
	plugins: [ require('@tailwindcss/custom-forms') ]
};
