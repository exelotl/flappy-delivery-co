import {Scene,Actor} from './engine'
import Bird from './bird'
import { MainBackground, WaterForeground } from './background'
import Dialogue from './dialogue'
import { PipePair } from './pipe'
import Island from './island'
import * as items from './items'
import Shark from './shark'
import EndingCutscene from './ending-cutscene'

export default class GameScene extends Scene {
	constructor(root) {
		super(root)
		
		this.userInputAllowed = true
		
		this.add(new MainBackground(), new WaterForeground())
		
		this.item = null
		this.islandLeft = new Island('island-left.png')
		this.islandRight = new Island('island-right.png')
		this.add(this.islandLeft, this.islandRight)
		
		let {landX,landY} = this.islandLeft
		this.bird = new Bird(landX, landY)
		this.add(this.bird)
		
		this.add(new Shark(520, 170))
		
		this.pipes1 = new PipePair(380, 26, 30)
		this.pipes2 = new PipePair(650, 26, 30)
		this.add(this.pipes1, this.pipes2)
		
		this.dialogue = new Dialogue()
		this.add(this.dialogue)
		
		// list of functions to schedule dialogue lines and other game events
		this.actions = []
		
		// every time we press space, it will cause the queue to advance (as long as the dialogue is fully revealed)
		this.on('flap', () => {
			if (this.actions.length > 0) {
				if (this.dialogue.textRevealed()) {
					this.advance()
				} else {
					this.dialogue.quickReveal()
				}
			}
		})
		
		this.on('reset', () => {
			this.pipes1.randomize()
			this.pipes2.randomize()
			// allow the flight to begin again after the bird has respawned
			this.queue(() => { this.emit('begin-flight') })
		})
		
		this.nextLevel = this.lv1
		
		this.on('bird-land', () => {
			this.nextLevel()
		})
		
		this.nextLevel() // begin the game
	}
	
	queue(f) {
		this.actions.push(f)
	}
	
	// execute the next action in the queue
	// generally only called when space is pressed after dialogue has finished
	advance() {
		let f = this.actions.shift()
		if (f) f()
	}
	
	update() {
		this.camX = Math.max(this.islandLeft.x, Math.floor(this.bird.centerX() - this.w/2))
		super.update()
	}
	
	configurePipes(sep) {
		this.pipes1.separation = sep
		this.pipes2.separation = sep
		this.pipes1.randomize()
		this.pipes2.randomize()
	}
	
	lv1() {
		this.islandLeft.setNpc('boss-man')
		this.dialogue.show('Boss Man', 'boss-man.png')
		this.dialogue.say('Good morning Flappy Bird. I hope you are ready for another gruelling and efficient day of deliveries.')
		this.queue(() => {
			this.dialogue.say('But before you get started with the real stuff, I want you to deliver this LETTER to my beloved Sally.')
			this.item = new items.Letter()
			this.add(this.item)
		})
		this.queue(() => {
			this.dialogue.hide()
			this.bird.facing = 'right'
		})
		this.queue(() => { this.emit('begin-flight') })
		
		this.configurePipes(24)
		this.nextLevel = this.lv2
		this.islandRight.setNpc('sally')
	}
	
	lv2() {
		this.dialogue.show('Sally', 'sally.png')
		this.dialogue.say('Howdy Mr. Flappy Bird! I hope the Boss Man isn\'t being too hard on you!')
		this.queue(() => {
			this.dialogue.say('We started shipping kittens at the pet store. Do you think you could get this little guy across safely?')
			this.remove(this.item)
			this.item = new items.Kitten()
			this.add(this.item)
		})
		this.queue(() => {
			this.dialogue.hide()
			this.bird.facing = 'left'
		})
		this.queue(() => { this.emit('begin-flight') })
		
		this.configurePipes(28)
		this.nextLevel = this.lv3
		this.islandLeft.setNpc('greg')
	}
	
	lv3() {
		this.dialogue.show('Greg', 'greg.png')
		this.dialogue.say('Yo yo wassup homie. I need you to deliver this JET ENGINE to my folks on the other side.')
		this.queue(() => {
			this.dialogue.say('Also sorry bro, I don\'t know how to turn it off...')
			this.remove(this.item)
			this.item = new items.JetEngine()
			this.add(this.item)
		})
		this.queue(() => {
			this.dialogue.hide()
			this.bird.facing = 'right'
		})
		this.queue(() => { this.emit('begin-flight') })
		
		this.configurePipes(28)
		this.nextLevel = this.lv4
		this.islandRight.setNpc('goddess')
	}
	
	lv4() {
		this.dialogue.show('???', 'goddess.png')
		this.dialogue.say('Hello. I\'ve been waiting for this moment.')
		this.queue(() => {
			this.dialogue.say('My request may be unusual, but I need you to fly this BOOMBOX across the sea.')
		})
		this.queue(() => {
			this.dialogue.say('No questions. The world simply needs to hear my sick mixtape.')
			this.remove(this.item)
			this.item = new items.Boombox()
			this.add(this.item)
		})
		this.queue(() => {
			this.dialogue.hide()
			this.bird.facing = 'left'
		})
		this.queue(() => { this.emit('begin-flight') })
		
		this.configurePipes(30)
		this.pipes1.oscillate(0.08, 15)
		this.pipes2.oscillate(0.16, 10)
		this.nextLevel = this.lv5
		this.islandLeft.setNpc('greg')
	}
	
	lv5() {
		this.dialogue.show('Greg', 'greg.png')
		this.dialogue.say('Hey bro! Long time no see.')
		this.queue(() => {
			this.dialogue.say('Aeronautical engineering didn\'t really work out for me, so now I sell fish.')
		})
		this.queue(() => {
			this.dialogue.say('Please deliver this BOX OF MACKEREL to my folks on the other side.')
			this.remove(this.item)
			this.item = new items.BoxOfFish()
			this.add(this.item)
		})
		this.queue(() => {
			this.dialogue.hide()
			this.bird.facing = 'right'
		})
		this.queue(() => { this.emit('begin-flight') })
		
		this.configurePipes(30)
		this.pipes1.oscillate(0,0)
		this.pipes2.oscillate(0,0)
		this.nextLevel = this.lv6
		this.islandRight.setNpc('sally')
	}
	
	lv6() {
		this.dialogue.show('Sally', 'sally.png')
		this.dialogue.say('Howdy again! You wouldn\'t believe the order we just got at the pet store!')
		this.queue(() => {
			this.dialogue.say('Do you think you could escort this BABY ELEPHANT for me? Thanks and good luck!')
			this.remove(this.item)
			this.item = new items.Elephant()
			this.add(this.item)
		})
		this.queue(() => {
			this.dialogue.hide()
			this.bird.facing = 'left'
		})
		this.queue(() => { this.emit('begin-flight') })
		
		this.configurePipes(30)
		this.nextLevel = this.lv7
		this.islandLeft.setNpc('boss-man')
	}
	
	lv7() {
		this.dialogue.show('Boss Man', 'boss-man.png')
		this.dialogue.say('Good evening Flappy Bird. I see you have been working hard. I have a final request, confidential in nature.')
		this.queue(() => {
			this.dialogue.say('Please deliver this extraordinarily large BAG OF MONEY to the mafia.')
			this.remove(this.item)
			this.item = new items.BagOfMoney()
			this.add(this.item)
		})
		this.queue(() => {
			this.dialogue.say('They\'re gonna use it to build a casino on every island. The profits will make me into a billionaire!')
		})
		this.queue(() => {
			this.add(new EndingCutscene())
		})
	}
	
}
