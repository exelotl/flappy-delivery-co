import { Actor } from "./engine"
import { playBlipSfx, blipSfx } from "./assets"

// display text to the screen, to make characters talk
// you can use this to queue actions
export default class Dialogue extends Actor {
	constructor() {
		this.div(298, 36)
		this.el.classList.add('dialogue')
		this.el.style.padding = '2px'
		this.el.style.backgroundColor = '#000'
		this.el.style.overflow = 'hidden'
		this.el.style.zIndex = '3'
		this.el.style.transition = 'opacity 0.1s'
		
		// changing img.src appears to not be instantaneous,
		// so I'll use a div with background image instead.
		this.iconEl = document.createElement('div')
		this.iconEl.style.width = '32px'
		this.iconEl.style.height = '32px'
		this.iconEl.style.cssFloat = 'left'
		this.iconEl.style.margin = '1px 4px 0 0'
		this.el.appendChild(this.iconEl)
		
		this.nameEl = document.createElement('div')
		this.nameEl.style.color = '#6d758d'
		this.el.appendChild(this.nameEl)
		this.textEl = document.createElement('span')
		this.textEl.style.color = '#fff'
		this.el.appendChild(this.textEl)
		this.hiddenTextEl = document.createElement('span')
		this.hiddenTextEl.style.color = '#000'
		this.el.appendChild(this.hiddenTextEl)
		
		this.str = ''
		this.revealCount = 0
		this.revealDelay = 1
		this.revealSpeed = 1
		
		this.visible = false
		this.skippable = true
	}
	
	show(name, icon) {
		this.iconEl.style.backgroundImage = `url("assets/${icon}")`
		this.nameEl.innerText = name
		this.visible = true
	}
	hide() {
		this.visible = false
	}
	
	// begin to reveal text from a certain character with a certain name
	say(text) {
		this.str = text
		this.revealCount = -1
		this.revealDelay = 0
		blipSfx.loop = true
		blipSfx.play()
	}
	
	textRevealed() {
		return this.revealCount == this.str.length
	}
	quickReveal() {
		if (this.skippable) {
			this.revealCount = this.str.length-1
			this.revealDelay = 0
		}
	}
	
	update() {
		this.x = this.scene.camX + 10
		this.y = this.scene.camY + this.scene.h - 46
		if (this.revealDelay-- > 0) {
			return
		}
		this.revealDelay = this.revealSpeed
		if (!this.textRevealed()) {
			this.revealCount++
			this.textEl.innerText = this.str.substr(0, this.revealCount)
			this.hiddenTextEl.innerText = this.str.substring(this.revealCount)
			if (this.textRevealed()) {
				blipSfx.loop = false
			}
		}
	}
	
	draw() {
		super.draw()
		this.el.style.opacity = this.visible ? '1' : '0'
	}
}
