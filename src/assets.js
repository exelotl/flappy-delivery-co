
// surely it's possible to use FuseBox to generate this list??
// but I guess this will do
const imgList =[
	'background.png',
	'bag-of-money.png',
	'bird.png',
	'bird-portrait.png',
	'boombox.png',
	'boss-man-overworld.png',
	'boss-man.png',
	'box-of-fish.png',
	'elephant.png',
	'goddess-overworld.png',
	'goddess.png',
	'greg-overworld.png',
	'greg.png',
	'island-left.png',
	'island-right.png',
	'jet.png',
	'kitten.png',
	'letter.png',
	'pipe.png',
	'sally-overworld.png',
	'sally.png',
	'shark.png',
	'water.png',
]

// we fill this with images so the browser is forced to keep them available in memory
const cache = []

export function preload() {
	for (let name in imgList) {
		let image = document.createElement('img')
		image.src = `assets/${name}`
		cache.push(image)
	}
}

// audio can be played directly through these elements, just import them and call play()

export const boomboxMusic = document.createElement('audio')
boomboxMusic.src = 'assets/detune-filtered.ogg'
boomboxMusic.load()

export const flapSfx = document.createElement('audio')
flapSfx.src = 'assets/flap.wav'
flapSfx.volume = 0.5
flapSfx.load()

export const blipSfx = document.createElement('audio')
blipSfx.src = 'assets/blip.wav'
blipSfx.loop = true
blipSfx.load()

export const deathSfx = document.createElement('audio')
deathSfx.src = 'assets/death.wav'
deathSfx.load()