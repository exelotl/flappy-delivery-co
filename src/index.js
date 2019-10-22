import './style.css'
import GameScene from './gamescene'
import { preload } from './assets'

preload()

let root = document.getElementById('root')
let scene = new GameScene(root)

function flap(e) {
	e.preventDefault()
	if (scene.userInputAllowed) {
		scene.emit('flap')
	}
}

// spacebar to jump / advance etc.
document.onkeydown = (e) => {
	if (e.keyCode == 32) {
		flap(e)
	}
}

// touch controls:
document.ontouchstart = flap

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

