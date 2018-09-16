const matrixFont = require('matrix-led-font')
import './style.css'

function component() {
  let element = document.createElement('ul');
  let glyphs = matrixFont.getAllGlyphs();
  for (var i = glyphs.length - 1; i >= 0; i--) {
  	let gDom = document.createElement('li')
  	let glyph = glyphs[i];
  	gDom.dataset.glyph = glyph
  	gDom.innerText = glyph;
  	element.appendChild(gDom)
  }
  element.classList.add('hello');
  return element;
}
function wrapDigitsInSpans(word) {
	return word.split('').map(char=>`<span class="digitOf${char}">${char}</span>`).join('')
}
function handleLiClick(e){
	let key = e.target.dataset.glyph
	let value = matrixFont.getChar(key)
	console.log("value is:"+value+"<<")
	document.querySelector('#lcd').innerHTML = value.map(wrapDigitsInSpans).join("</br>")
}
function setupClickHandlers() {
	let lis = document.querySelectorAll('li')
	for (var i = lis.length - 1; i >= 0; i--) {
		let li = lis[i]
		li.addEventListener('click',handleLiClick)
	}
}

document.querySelector('#list').appendChild(component());
setupClickHandlers()