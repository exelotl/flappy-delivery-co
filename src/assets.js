
// Images
// ------

// fill this with images so the browser is forced to keep them available in memory
const imgCache = []

// surely it's possible to use FuseBox to generate this list??
// but I guess this will do
const imgList = [
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


// Audio
// -----

import {Howl, Howler} from 'howler'

const sounds = []

function Sound(settings) {
	settings.preload = false
	let howl = new Howl(settings)
	sounds.push(howl)
	return howl
}

// audio can be played directly through these objects, just import them and call play()
export const boomboxMusic = Sound({
	src: 'assets/detune-filtered.ogg',
	html5: true
})
export const flapSfx = Sound({
	src: 'assets/flap.wav',
	volume: 0.5,
})
export const blipSfx = Sound({
	src: 'assets/blip.wav',
	loop: true,
})
export const deathSfx = Sound({
	src: 'assets/death.wav',
})


// Preloading
// ----------

import * as FontFaceObserver from 'fontfaceobserver'

let totalAssets = 0
let loadedAssets = 0

export function preload(onLoad) {
	
	// font
	totalAssets++
	let font = new FontFaceObserver('Skullboy')
	font.load().then(() => {
		loadedAssets++
		onLoad('font', font, loadedAssets, totalAssets)
	}, (err) => {
	})
	
	// sounds
	for (let howl of sounds) {
		totalAssets++
		howl.on('load', () => {
			loadedAssets++
			onLoad('sound', howl, loadedAssets, totalAssets)
		})
		howl.load()
	}
	
	// images
	for (let name of imgList) {
		let image = document.createElement('img')
		image.src = `assets/${name}`
		totalAssets++
		image.onload = () => {
			loadedAssets++
			imgCache.push(image)
			onLoad('image', image, loadedAssets, totalAssets)
		}
	}
	
	
}