import Canvas from './canvas.js'

const canvas = document.getElementById('canvas')
const c = new Canvas(canvas)

export let mouse = { 
  x: 0, 
  y: 0,
  left: false,
  right: false,
}
export let scroll = 0

canvas.addEventListener('click', e => {
  mouse.left = true
})
canvas.addEventListener('contextmenu', e => {
  e.preventDefault()
  mouse.left = true
})
canvas.addEventListener('mousemove', e => {
  mouse.x = e.clientX * window.devicePixelRatio
  mouse.y = e.clientY * window.devicePixelRatio
})
canvas.addEventListener('wheel', e => {
  e.preventDefault()
  scroll -= Math.sign(e.deltaY)
})
