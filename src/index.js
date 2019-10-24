import './style.css'
import GameScene from './gamescene'
import { preload } from './assets'
import Preloader from './preloader'

let root = document.getElementById('root')
let scene = new Preloader(root, startGame)

function startGame() {
	scene.destroy()
	scene = new GameScene(root)
}

function flap(e) {
	e.preventDefault()
	if (scene.userInputAllowed) {
		scene.emit('flap')
	}
}

let touchControls = false

// touch controls
document.ontouchstart = e => {
	touchControls = true
	flap(e)
}

// mouse controls
document.onmousedown = e => {
	if (touchControls) {
		e.preventDefault()
	} else {
		flap(e)
	}
}

// keyboard controls
document.onkeydown = (e) => {
	if (e.keyCode == 32) {
		flap(e)
	}
}

// fixed timestep game loop, where update is called 60 times a second
let timestep = 1/60
let t1 = performance.now()
let dt = 0
function repaint(t2) {
	dt += (t2-t1) / 1000
	while (dt > timestep) {
		dt -= timestep
		scene.update()
	}
	scene.draw() 
	t1 = t2
	requestAnimationFrame(repaint)
}

requestAnimationFrame(repaint)

