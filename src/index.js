const matrixFont = require('matrix-led-font')
import './style.css'

const ArrowUp = "ArrowUp"; const ArrowDown = "ArrowDown"; const ArrowRight ="ArrowRight"; const ArrowLeft="ArrowLeft";
const navNode = document.querySelector('#nav')
const contentDiv = document.querySelector('#content')
const lcdNode = document.querySelector('#lcd')
const messageButton = document.querySelector('#messageButton');
const message = document.querySelector('#message');
var currentPageKeyListener
var currentNav = 1;
var ALL_ZEROS = [
					'00000000',
					'00000000',
					'00000000',
					'00000000',
					'00000000',
					'00000000',
					'00000000',
					'00000000'
					]


const wrapDigitsInSpans = (word)=> {
	return word.split('').map(char=>`<span class="digitOf${char}">${char}</span>`).join('')
}
const navigateTo =(page)=> {
		navNode.querySelectorAll("li").forEach((li)=>{
			if (parseInt(li.dataset.page) == page){
				li.className='selected'
			} else {
				li.className=''
			}
		})
		message.className = "hide"
		messageButton.className = "hide"
		
		switch(page){
			case 1 :
				displayPageOne()
				break;
			case 2 :
				displayGlyphs()	
				break;
		}
		
			// case 2 :
			// 	displayNodeModule()
			// 	break;
}
const displayNodeModule = ()=> {
	displayPageText(allTheGlypsAsJson);
	document.createElement('div').innerHTML = `The lovely matrix-led-font node module! <br/>
	<a href="https://github.com/lyle/matrix-led-font">https://github.com/lyle/matrix-led-font</a>`
	contentDiv.appendChild()

}
const displayPageOne = ()=> {
	let state = 0;
	currentPageKeyListener = (key)=>{
		let forLCD = []
		let forText = ALL_ZEROS
		let styleForLCD
		if(key == ArrowDown){
			state ++;
		} else if (key == ArrowUp) {
			state --;
		}
		console.log(state,forText)
		switch(state){
			case 0:
				forText = ALL_ZEROS;
				forLCD = [];
				break;
			case 1:
				forText = ALL_ZEROS;
				forLCD = ALL_ZEROS;
				break;
			case 2:
				forText = matrixFont.getChar(1)
				break;

			case 3:
				forText = forLCD = matrixFont.getChar(1)
				break;

			case 4:
				forText = forLCD = matrixFont.getChar(1)
				styleForLCD = "rotate"
				break;
			case 5:
				forText = forLCD = matrixFont.getChar(1)
				styleForLCD = "rotateAndSize"
				break;
			case 6:
				forText = forLCD = matrixFont.getChar(1)
				styleForLCD = "animatedFullLed"
				break;
			default:

		}
		displayPageText(arrayToText(forText))
		paintLCD(forLCD,styleForLCD)
	}
	currentPageKeyListener();
}
function arrayToText(arrayOfText) {
	return "'" + arrayOfText.join("',\n'") + "'"
}
function displayPageText(text) {
	const nodeToDispaly = document.createElement('pre')
	nodeToDispaly.innerText=text
	displayPage(nodeToDispaly);
	// body...
}
document.body.addEventListener('keydown', function(event) {
    const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
    switch(key) {
    	case "ArrowRight":
    		currentNav ++;
    		navigateTo(currentNav)
    		break;
    	case "ArrowLeft":
    		currentNav --;
    		navigateTo(currentNav)
    		break;
    	case "ArrowDown":
    	case "ArrowUp":
    		if (currentPageKeyListener) {
    			currentPageKeyListener(key)
    		}
    }
});

const displayPage = (pageNode)=> {
	contentDiv.innerHTML = '';
	lcdNode.innerHTML = '';
	if (pageNode){
		contentDiv.appendChild(pageNode);
	}
}

function setupNavigation() {
	const handleClick = (e)=>{
		let page = parseInt(e.target.dataset.page)
		navigateTo(page)
	}
	navNode.querySelectorAll("li").forEach((li)=>{
		li.addEventListener('click',handleClick)
	})
}


function displayGlyphs() {
	displayPage(glyphList())
	setupGlyphClickHandlers()

		message.className = ""
		messageButton.className = ""
	messageButton.addEventListener('click',function(e){
		if (message.value != ''){
			console.log(message.value)
			var xhr = new XMLHttpRequest();
			xhr.open("POST", 'http://localhost:1337/', true);

			//Send the proper header information along with the request
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

			xhr.onreadystatechange = function() {//Call a function when the state changes.
			    if(this.readyState == XMLHttpRequest.DONE && this.status == 200) {
			        // Request finished. Do processing here.
			        responseFromPost("md")
			    }
			}
			xhr.send(matrixFont.getBufferFromLine(message.value)); 

		}
	})

	function responseFromPost(fromPost) {
		const smile = matrixFont.getChar(' ').concat(matrixFont.getChar(':').concat(matrixFont.getChar(")")))
		paintLCD(smile,'fullLed')
		// body...
	}
// <div id="sendMessage">
// 	<input type="text" name="message"><button id="messageButton">

	function glyphList() {
	  let element = document.createElement('ul');
	  element.id = "glyphs"
	  let glyphs = matrixFont.getAllGlyphs();
	  for (var i = glyphs.length - 1; i >= 0; i--) {
	  	let gDom = document.createElement('li')
	  	let glyph = glyphs[i];
	  	gDom.dataset.glyph = glyph
	  	gDom.innerText = glyph;
	  	element.appendChild(gDom)
	  }
	  return element;
	}
	
	function setupGlyphClickHandlers() {

		let lis = document.querySelectorAll('#content li')

		let handleLiClick = (e)=>{
			lis.forEach((li)=>li.className='')
			e.target.className = 'selected'
			let key = e.target.dataset.glyph
			let value = matrixFont.getChar(key)
			paintLCD(value,'fullLed')
			const message = document.querySelector('#message');
			message.value = message.value + key
		}

		for (var i = lis.length - 1; i >= 0; i--) {
			let li = lis[i]
			li.addEventListener('click',handleLiClick)
		}
	}
}

function paintLCD(value,className) {
	console.log("value is:"+value+"<<")
	lcdNode.className = className || ''
	lcdNode.innerHTML = value.map(wrapDigitsInSpans).join("</br>")
}


setupNavigation()
navigateTo(1)




var allTheGlypsAsJson =`{
    ' ': [
          0b00000000,
          0b00000000,
          0b00000000,
          0b00000000],
    '!': [
          0b01011111,
          0b00000000],
    '"': [
          0b00000011,
          0b00000000,
          0b00000011,
          0b00000000],
    '#': [
          0b00010100,
          0b00111110,
          0b00010100,
          0b00111110,
          0b00010100,
          0b00000000],
    '$': [
          0b00100100,
          0b01101010,
          0b00101011,
          0b00010010,
          0b00000000],
    '%': [
          0b01100011,
          0b00010011,
          0b00001000,
          0b01100100,
          0b01100011,
          0b00000000],
    '&': [
          0b00110110,
          0b01001001,
          0b01010110,
          0b00100000,
          0b01010000,
          0b00000000],
    '\'': [
          0b00000011,
          0b00000000],
    '(': [
          0b00011100,
          0b00100010,
          0b01000001,
          0b00000000],
    ')': [
          0b01000001,
          0b00100010,
          0b00011100,
          0b00000000],
    '*': [
          0b00101000,
          0b00011000,
          0b00001110,
          0b00011000,
          0b00101000,
          0b00000000],
    '+': [
          0b00001000,
          0b00001000,
          0b00111110,
          0b00001000,
          0b00001000,
          0b00000000],
    ',': [
          0b10110000,
          0b01110000,
          0b00000000],
    '-': [
          0b00001000,
          0b00001000,
          0b00001000,
          0b00001000,
          0b00000000],
    '.': [
          0b01100000,
          0b01100000,
          0b00000000],
    '/': [
          0b01100000,
          0b00011000,
          0b00000110,
          0b00000001,
          0b00000000],
    '0': [
          0b00111110,
          0b01000001,
          0b01000001,
          0b00111110,
          0b00000000],
    '1': [
          0b01000010,
          0b01111111,
          0b01000000,
          0b00000000],
    '2': [
          0b01100010,
          0b01010001,
          0b01001001,
          0b01000110,
          0b00000000],
    '3': [
          0b00100010,
          0b01000001,
          0b01001001,
          0b00110110,
          0b00000000],
    '4': [
          0b00011000,
          0b00010100,
          0b00010010,
          0b01111111,
          0b00000000],
    '5': [
          0b00100111,
          0b01000101,
          0b01000101,
          0b00111001,
          0b00000000],
    '6': [
          0b00111110,
          0b01001001,
          0b01001001,
          0b00110000,
          0b00000000],
    '7': [
          0b01100001,
          0b00010001,
          0b00001001,
          0b00000111,
          0b00000000],
    '8': [
          0b00110110,
          0b01001001,
          0b01001001,
          0b00110110,
          0b00000000],
    '9': [
          0b00000110,
          0b01001001,
          0b01001001,
          0b00111110,
          0b00000000],
    ':': [
          0b00010100,
          0b00000000],
    ';': [
          0b00100000,
          0b00010100,
          0b00000000],
    '<': [
          0b00001000,
          0b00010100,
          0b00100010,
          0b00000000],
    '=': [
          0b00010100,
          0b00010100,
          0b00010100,
          0b00000000],
    '>': [
          0b00100010,
          0b00010100,
          0b00001000,
          0b00000000],
    '?': [
          0b00000010,
          0b01011001,
          0b00001001,
          0b00000110,
          0b00000000],
    '@': [
          0b00111110,
          0b01001001,
          0b01010101,
          0b01011101,
          0b00001110,
          0b00000000],
    'A': [
          0b01111110,
          0b00010001,
          0b00010001,
          0b01111110,
          0b00000000],
    'B': [
          0b01111111,
          0b01001001,
          0b01001001,
          0b00110110,
          0b00000000],
    'C': [
          0b00111110,
          0b01000001,
          0b01000001,
          0b00100010,
          0b00000000],
    'D': [
          0b01111111,
          0b01000001,
          0b01000001,
          0b00111110,
          0b00000000],
    'E': [
          0b01111111,
          0b01001001,
          0b01001001,
          0b01000001,
          0b00000000],
    'F': [
          0b01111111,
          0b00001001,
          0b00001001,
          0b00000001,
          0b00000000],
    'G': [
          0b00111110,
          0b01000001,
          0b01001001,
          0b01111010,
          0b00000000],
    'H': [
          0b01111111,
          0b00001000,
          0b00001000,
          0b01111111,
          0b00000000],
    'I': [
          0b01000001,
          0b01111111,
          0b01000001,
          0b00000000],
    'J': [
          0b00110000,
          0b01000000,
          0b01000001,
          0b00111111,
          0b00000000],
    'K': [
          0b01111111,
          0b00001000,
          0b00010100,
          0b01100011,
          0b00000000],
    'L': [
          0b01111111,
          0b01000000,
          0b01000000,
          0b01000000,
          0b00000000],
    'M': [
          0b01111111,
          0b00000010,
          0b00001100,
          0b00000010,
          0b01111111,
          0b00000000],
    'N': [
          0b01111111,
          0b00000100,
          0b00001000,
          0b00010000,
          0b01111111,
          0b00000000],
    'O': [
          0b00111110,
          0b01000001,
          0b01000001,
          0b00111110,
          0b00000000],
    'P': [
          0b01111111,
          0b00001001,
          0b00001001,
          0b00000110,
          0b00000000],
    'Q': [
          0b00111110,
          0b01000001,
          0b01000001,
          0b10111110,
          0b00000000],
    'R': [
          0b01111111,
          0b00001001,
          0b00001001,
          0b01110110,
          0b00000000],
    'S': [
          0b01000110,
          0b01001001,
          0b01001001,
          0b00110010,
          0b00000000],
    'T': [
          0b00000001,
          0b00000001,
          0b01111111,
          0b00000001,
          0b00000001,
          0b00000000],
    'U': [
          0b00111111,
          0b01000000,
          0b01000000,
          0b00111111,
          0b00000000],
    'V': [
          0b00001111,
          0b00110000,
          0b01000000,
          0b00110000,
          0b00001111,
          0b00000000],
    'W': [
          0b00111111,
          0b01000000,
          0b00111000,
          0b01000000,
          0b00111111,
          0b00000000],
    'X': [
          0b01100011,
          0b00010100,
          0b00001000,
          0b00010100,
          0b01100011,
          0b00000000],
    'Y': [
          0b00000111,
          0b00001000,
          0b01110000,
          0b00001000,
          0b00000111,
          0b00000000],
    'Z': [
          0b01100001,
          0b01010001,
          0b01001001,
          0b01000111,
          0b00000000],
    '[': [
          0b01111111,
          0b01000001,
          0b00000000],
   '\\': [
          0b00000001,
          0b00000110,
          0b00011000,
          0b01100000,
          0b00000000],
    ']': [
          0b01000001,
          0b01111111,
          0b00000000],
    '_': [
          0b01000000,
          0b01000000,
          0b01000000,
          0b01000000,
          0b00000000],
    'a': [
          0b00100000,
          0b01010100,
          0b01010100,
          0b01111000,
          0b00000000],
    'b': [
          0b01111111,
          0b01000100,
          0b01000100,
          0b00111000,
          0b00000000],
    'c': [
          0b00111000,
          0b01000100,
          0b01000100,
          0b00101000,
          0b00000000],
    'd': [
          0b00111000,
          0b01000100,
          0b01000100,
          0b01111111,
          0b00000000],
    'e': [
          0b00111000,
          0b01010100,
          0b01010100,
          0b00011000,
          0b00000000],
    'f': [
          0b00000100,
          0b01111110,
          0b00000101,
          0b00000000],
    'g': [
          0b10011000,
          0b10100100,
          0b10100100,
          0b01111000,
          0b00000000],
    'h': [
          0b01111111,
          0b00000100,
          0b00000100,
          0b01111000,
          0b00000000],
    'i': [
          0b01000100,
          0b01111101,
          0b01000000,
          0b00000000],
    'j': [
          0b01000000,
          0b10000000,
          0b10000100,
          0b01111101,
          0b00000000],
    'k': [
          0b01111111,
          0b00010000,
          0b00101000,
          0b01000100,
          0b00000000],
    'l': [
          0b01000001,
          0b01111111,
          0b01000000,
          0b00000000],
    'm': [
          0b01111100,
          0b00000100,
          0b01111100,
          0b00000100,
          0b01111000,
          0b00000000],
    'n': [
          0b01111100,
          0b00000100,
          0b00000100,
          0b01111000,
          0b00000000],
    'o': [
          0b00111000,
          0b01000100,
          0b01000100,
          0b00111000,
          0b00000000],
    'p': [
          0b11111100,
          0b00100100,
          0b00100100,
          0b00011000,
          0b00000000],
    'q': [
          0b00011000,
          0b00100100,
          0b00100100,
          0b11111100,
          0b00000000],
    'r': [
          0b01111100,
          0b00001000,
          0b00000100,
          0b00000100,
          0b00000000],
    's': [
          0b01001000,
          0b01010100,
          0b01010100,
          0b00100100,
          0b00000000],
    't': [
          0b00000100,
          0b00111111,
          0b01000100,
          0b00000000],
    'u': [
          0b00111100,
          0b01000000,
          0b01000000,
          0b01111100,
          0b00000000],
    'v': [
          0b00011100,
          0b00100000,
          0b01000000,
          0b00100000,
          0b00011100,
          0b00000000],
    'w': [
          0b00111100,
          0b01000000,
          0b00111100,
          0b01000000,
          0b00111100,
          0b00000000],
    'x': [
          0b01000100,
          0b00101000,
          0b00010000,
          0b00101000,
          0b01000100,
          0b00000000],
    'y': [
          0b10011100,
          0b10100000,
          0b10100000,
          0b01111100,
          0b00000000],
    'z': [
          0b01100100,
          0b01010100,
          0b01001100,
          0b00000000],
    '{': [
          0b00001000,
          0b00110110,
          0b01000001,
          0b00000000],
    '|': [
          0b01111111,
          0b00000000],
    '}': [
          0b01000001,
          0b00110110,
          0b00001000,
          0b00000000],
    '~': [
          0b00001000,
          0b00000100,
          0b00001000,
          0b00000100,
          0b00000000],
    '♡': [
          0b00011110,
          0b00100001,
          0b01000001,
          0b10000110,
          0b10000110,
          0b01000001,
          0b00100001,
          0b00011110],
    '❤': [
          0b00011110,
          0b00111111,
          0b01111111,
          0b11111110,
          0b11111110,
          0b01111111,
          0b00111111,
          0b00011110],
    '^': [
          0b00000010,
          0b00000001,
          0b00000010,
          0b00000000]
}`;