const { FuseBox, WebIndexPlugin, Sparky, QuantumPlugin } = require('fuse-box')

let production = true

const fuse = FuseBox.init({
	homeDir: 'src',
	output: 'build/$name.js',
	sourceMaps: !production,
	plugins: [
		WebIndexPlugin({
			title: 'Flappy Delivery Co.',
			template: 'src/template.html',
			path: '.'
		}),
		production && QuantumPlugin({
			ensureES5: false,
			uglify: { es6: true }
		})
	]
})

// start development server
fuse.dev({})

// bundle js files
fuse.bundle('app')
	.watch()
	.instructions('>index.js')

Sparky.task('watch-assets', () => {
	return Sparky.watch('assets/*.(png|otf|ogg|mp3|wav)').dest('build/assets/$name')
})

// I thought the CSS plugin would do this job but oh well...
Sparky.task('watch-css', () => {
	return Sparky.watch('src/*.css').dest('build/$name')
})

// bundle js and watch assets in parallel
Sparky.task('default', ['&watch-assets', '&watch-css'], () => {
	fuse.run()
})