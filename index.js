import Canvas from './canvas.js'
import * as util from './util.js'
import { mouse, scroll } from './event.js'

const canvas = document.getElementById('canvas')
const c = new Canvas(canvas)
const Colors = util.colors

const renderMenu = class {
  constructor(width, height) {
    this.width = width
    this.height = height
    
    this.userPetals = new Map()
    this.petalNames = 'Air,Antenna,Basic,Basil,Bubble,Cactus,Claw,Clover,Corn,Cutter,Dahlia,Dandelion,Egg,Fangs,Faster,Grapes,Heavy,Honey,Iris,Jelly,Leaf,Light,Lightning,Magnet,Missile,Orange,Pearl,Peas,Pincer,Pollen,Powder,Rice,Rock,Rose,Salt,Sand,Shell,Soil,Sponge,Starfish,Stick,Stringer,Uranium,Web,Wing,Yggdrasil,Yin Yang,Yucca'.split(',')
    this.selectedPetal = { type: null, rarity: null }
  }
  render(width, height, time) {
    this.width = width
    this.height = height
    this.time = time
    
    this.mainMenu()
    this.craftingTable()
    this.petalMenu()
  }
  mainMenu() {
    let bgSize = { width: this.width - (this.width * 0.05), height: this.height - (this.width * 0.05) }

    // Crafting Menu
    let boxZone = { 
      x: this.width * 0.025 + (bgSize.width * 0.5), 
      y: this.width * 0.025 + (bgSize.height * 0.5),
      w: bgSize.width * 0.4,
      h: bgSize.height,
    }
    c.box(
      boxZone.x, boxZone.y, 
      boxZone.w, boxZone.h, 
      0, 
      Colors.brown, util.mixColors(Colors.brown, Colors.black, 0.35), 15
    )
    
    // Header
    let header = ({w, h, offset}) => ({ x: boxZone.x + offset.x, y: boxZone.y + offset.y, w: w, h: h, })

    let title = header({w: 35, h: 35, offset: { x: 0, y: -(boxZone.h * 0.49 - 35)}})
    c.text(title.x, title.y, title.w, 'Craft', 3.5)
    
    // Exit box
    let xBox = header({w: 30, h: 30, offset: { x: (boxZone.w * 0.49 - 25), y: -(boxZone.h * 0.49 - 25)}})
    c.box(
      xBox.x, xBox.y, 
      xBox.w, xBox.h, 

      0, 
      Colors.red, util.mixColors(Colors.red, Colors.black, 0.35), 15
    )
    c.x(
      xBox.x, xBox.y - 4,
      7.5,
      Colors.lgrey
    )

    // Switch Box
    let switchBox = {
      x: xBox.x - 10 - 80,
      y: xBox.y,
      w: 100,
      h: 30,
    }
    c.box(
      switchBox.x, switchBox.y, 
      switchBox.w, switchBox.h, 
      0, 
      Colors.purple, util.mixColors(Colors.purple, Colors.black, 0.35), 15
    )
    c.text(switchBox.x, switchBox.y + 6.75, 25, 'Switch', 3.5)
  }
  craftingTable(time) {
    let bgSize = { width: this.width - (this.width * 0.05), height: this.height - (this.width * 0.05) }
    let tableZone = { 
      x: this.width * 0.025 + (bgSize.width * 0.5), 
      y: this.width * 0.025 + (bgSize.height * 0.2) + 60,
      w: bgSize.width * 0.4,
      h: bgSize.height * 0.4,
    }
    
    // Crafting Boxes
    let tableCenter = { left: tableZone.x - (tableZone.w * 0.2), right: tableZone.x + (tableZone.w * 0.2) }
    for (let i = 0; i < 5; i++) {
      let angle = Math.PI * 2 * i / 5
      c.box(
        tableCenter.left + Math.cos(angle - 1.5708) * 100, tableZone.y + Math.sin(angle - 1.5708) * 100,
        50, 50, 
        0, 
        this.selectedPetal.type == null ?
          util.mixColors(Colors.brown, Colors.black, 0.3) :
          this.selectedPetal.rarity, 
        this.selectedPetal.type == null ? 
          util.mixColors(Colors.brown, Colors.black, 0.3) :
          util.mixColors(this.selectedPetal.rarity, Colors.black, 0.3),
        15
      )
      if (this.selectedPetal.type != null)
        c.text(
          tableCenter.left + Math.cos(angle - 1.5708) * 100, tableZone.y + Math.sin(angle - 1.5708) * 100,// + 70,
          10,
          this.selectedPetal.type,
          1.5
        )
    }
    
    // Craft Button
    c.box(
      tableCenter.right, tableZone.y, 
      90, 30, 
      0, 
      Colors.grey, util.mixColors(Colors.grey, Colors.black, 0.35), 15
    )
    c.text(tableCenter.right, tableZone.y + 5, 20, 'Craft', 2.5)
    c.text(tableCenter.right, tableZone.y + 40, 15, '?% success chance', 2)
    c.text(tableZone.x, tableZone.y + (tableZone.h * 0.45), 20, 'Combine 5 of the same petal to craft an upgrade', 2.5)
  }
  petalMenu() {
    let bgSize = { width: this.width - (this.width * 0.05), height: this.height - (this.width * 0.05) }
    let galleryZone = { 
      x: this.width * 0.025 + (bgSize.width * 0.5), 
      y: this.width * 0.025 + (bgSize.height * 0.65) + 60,
      w: bgSize.width * 0.35,
      h: bgSize.height * 0.5,
    }
    
    // Petal Gallery Clipping
    c.clipStart(
      galleryZone.x - (galleryZone.w * 0.5), galleryZone.y - (galleryZone.h * 0.5), 
      galleryZone.w, galleryZone.h,
      Colors.green
    )
        
    let galleryMin = this.width * 0.025 + (bgSize.height * 0.65) + 60 + (bgSize.height * 0.001)
    let galleryMax = this.width * 0.025 + (bgSize.height * 0.65) + 60 - (bgSize.height * 3.56)
    
    let galleryTo = galleryZone.y + scroll * 50
    galleryZone.y = util.clamp(galleryTo, galleryMax, galleryMin)
    
    this.petalGallery(galleryZone)

    c.clipEnd()
  }
  petalGallery(galleryZone) {
    // Petal Boxes
    c.box(
      galleryZone.x, galleryZone.y + (50 * 48 * 0.75), 
      galleryZone.x, 85 * 48, 
      0, 
      Colors.brown, Colors.brown, 15
    )
    
    let colors = ['cgreen', 'uyellow', 'rblue', 'epurple', 'lred', 'mcyan', 'upink', 'sgreen']

    for (let i = 0; i < 47 * 8; i++) {
      let x = i % 8
      let y = Math.floor(i / 8)
      c.box(
        galleryZone.x - (galleryZone.w * 0.5 - 75 * x) + 50, galleryZone.y - (galleryZone.h * 0.5 - 75 * y) + 50, 
        50, 50, 
        0, 
        Colors[colors[x]], util.mixColors(Colors[colors[x]], Colors.black, 0.3), 15
      )
      if (util.inOrOut(
        galleryZone.x - (galleryZone.w * 0.5 - 75 * x) + 25, galleryZone.y - (galleryZone.h * 0.5 - 75 * y) + 25, 
        50, 50, mouse
      ) && mouse.left) {
        this.selectedPetal = { type: this.petalNames[y], rarity: Colors[colors[x]] }
      }
      c.text(
        galleryZone.x - (galleryZone.w * 0.5 - 75 * x) + 50, galleryZone.y - (galleryZone.h * 0.5 - 75 * y) + 55,// + 70,
        10,
        this.petalNames[y],
        1.5
      )
    }
  }
}

let width = window.innerWidth * window.devicePixelRatio
let height = window.innerHeight * window.devicePixelRatio

const menu = new renderMenu(width, height)

let time = 0
let appLoop = newTime => {
  let timeElapsed = newTime - time
  time = newTime
  
  let ratio = c.setSize(window.innerWidth, window.innerHeight, window.devicePixelRatio)
  width = window.innerWidth * window.devicePixelRatio
  height = window.innerHeight * window.devicePixelRatio
  
  c.box(0, 0, 6000, 6000, 0, Colors.green)
  
  menu.render(width, height, time)
  
  
  let lMousePos = {
    x: mouse.x / (window.innerWidth * window.devicePixelRatio) * width * 2,
    y: mouse.y / (window.innerHeight * window.devicePixelRatio) * height * 2,
  }
  
  mouse.left = false
  mouse.right = false

  requestAnimationFrame(appLoop)
}
  
requestAnimationFrame(appLoop)
