module.exports = {
	entry: './app.js',
	output: {
		path: __dirname + '/dist/',
		filename: 'k-slider.min.js',
	},
	module: {
		loaders: [
			{ test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
		]
	},
}
