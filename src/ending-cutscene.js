import { Actor } from './engine'

// a little graphicless entity to orchestrate the ending cutscene
// I just put it here to make things less cluttered

export default class EndingCutscene extends Actor {
	
	constructor() {
		super(0,0)
		this.queue = []
	}
	
	schedule(t, f) {
		this.queue.push({ t, f })
	}
	
	added() {
		let bird = this.scene.bird
		bird.facing = 'right'
		
		// make sure the bird doesn't deliver the money
		bird.canDeliver = false
		
		// player can't make the bird flap anymore
		this.scene.userInputAllowed = false
		
		// fly right
		this.schedule(10, ()=>{
			bird.mode = 'flying'
			bird.vx = 1
			this.emit('flap')
		})
		for (let i=0; i<1; i++) {
			this.schedule(38, ()=>{ this.emit('flap') })
		}
		
		// fly up
		this.schedule(0, ()=>{
			bird.vx = 0
		})
		for (let i=0; i<2; i++) {
			this.schedule(36, ()=>{ this.emit('flap') })
			this.schedule(36, ()=>{ this.emit('flap') })
		}
		// fly left
		this.schedule(0, ()=>{
			this.scene.dialogue.say('Okay-                hey, wait!')
			bird.facing = 'left'
			bird.vx = -1
		})
		
		for (let i=0; i<3; i++) {
			this.schedule(38, ()=>{ this.emit('flap') })
		}
		
		this.schedule(0, () => { this.scene.dialogue.say('Where are you going?') })
		
		for (let i=0; i<4; i++) {
			this.schedule(38, ()=>{ this.emit('flap') })
		}
		
		this.schedule(0, () => { this.scene.dialogue.say('Come back!') })
		
		for (let i=0; i<4; i++) {
			this.schedule(38, ()=>{ this.emit('flap') })
		}
		
		this.schedule(0, () => {
			bird.mode = 'resting'
		})
		
		this.schedule(30, () => {
			this.scene.dialogue.say('Noooooooooooooooooo!')
		})
		
		this.schedule(220, () => {
			this.scene.dialogue.hide()
		})
		
		this.schedule(100, () => {
			this.scene.dialogue.show('Bird', 'bird-portrait.png')
			this.scene.dialogue.say('Another day, another crime syndicate dismantled ... >>')
			this.scene.userInputAllowed = true
			this.scene.queue(() => {
				this.scene.dialogue.say('... and as it so happens, just another successful chapter in the life of Detective Bird.')
			})
			this.scene.queue(() => {
				this.scene.dialogue.say('Thank you for playing!')
				this.scene.userInputAllowed = false
			})
		})
	}
	
	update() {
		let item = this.queue[0]
		if (item && item.t-- <= 0) {
			this.queue.shift()
			item.f()
		}
	}
}
