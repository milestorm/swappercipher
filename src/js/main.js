function createArray(length) {
	var arr = new Array(length || 0),
		i = length;

	if (arguments.length > 1) {
		var args = Array.prototype.slice.call(arguments, 1);
		while(i--) arr[length-1 - i] = createArray.apply(this, args);
	}

	return arr;
}

const defaultKey = [ [1,0], [0,-1], [-1,0], [0,1] ];  // X,Y =   -> , ^ , <- , v
let secretKey = defaultKey;
let useCustomKey = false;
let customKey;


function keyPosInc(keyPosition) {
	keyPosition++;
	if (keyPosition > secretKey.length - 1) {
		keyPosition = 0;
	}
  return keyPosition;
}

function keyPosDec(keyPosition) {
	keyPosition--;
	if (keyPosition < 0) {
		keyPosition = secretKey.length - 1;
	}
  return keyPosition;
}

function shuffleEncode(array) {
	let keyPosition = 0;
	let buffer, change, keyX, keyY;

	for (let y = 0; y < array.length; y++) {
		for (let x = 0; x < array[0].length; x++) {
			keyX = secretKey[keyPosition][0];
			keyY = secretKey[keyPosition][1];

			if (	(x + keyX < 0) || (y + keyY < 0) || (x + keyX > array[0].length - 1) || (y + keyY > array.length - 1)  ) {
				keyX = 0;
				keyY = 0;
			}

			buffer = array[y][x];
			change = array[y + keyY][x + keyX];

			array[y][x] = change;
			array[y + keyY][x + keyX] = buffer;

			//console.log("Position:", x, y, " | KEY:",keyPosition, "-", keyX, keyY, " | ", buffer, " -> ", change);

			keyPosition = keyPosInc(keyPosition);
		}
	}

	return array;
}

function shuffleDecode(array) {
	//const decodedKeyPosition = keyPosition;
	//keyPosition = decodedKeyPosition - 1;
	let keyPosition = secretKey.length - 1; // when MOD is 0
	let buffer, change, keyX, keyY;

	for (let y = array.length - 1; y >= 0; y--) {
		for (let x = array[0].length - 1; x >= 0; x--) {

			keyX = secretKey[keyPosition][0];
			keyY = secretKey[keyPosition][1];

			if ((x + keyX < 0) || (y + keyY < 0) || (x + keyX > array[0].length - 1) || (y + keyY > array.length - 1)) {
				keyX = 0;
				keyY = 0;
			}

			buffer = array[y][x];
			change = array[y + keyY][x + keyX];

			array[y][x] = change;
			array[y + keyY][x + keyX] = buffer;

			//console.log("Position:", x, y, " | KEY:",keyPosition, "-", keyX, keyY, " | ", buffer, " -> ", change);

			keyPosition = keyPosDec(keyPosition);

			if(x == 0) {
				keyX = secretKey[keyPosition][0];
				keyY = secretKey[keyPosition][1];

				if ((x + keyX < 0) || (y + keyY < 0) || (x + keyX > array[0].length - 1) || (y + keyY > array.length - 1) ) {
					keyX = secretKey[keyPosition][0];
					keyY = secretKey[keyPosition][1];
				}
			}

		}
	}

	return array;
}

function prettyPrintArray(array) {
	let pretty = "";

	array.forEach(row => {
		row.forEach(letter => {
			pretty += `${letter} `
		});
		pretty = pretty.slice(0, -1);
		pretty += "\n";
	});

	return pretty;
}

function encodedTextToArray(encodedText){
	let retText = encodedText.replace(/ +?/g, '');
	const numLines = (retText.match(/\n/g) || '').length + 1;
	const numChars = retText.split("\n")[0].length;

	retText = retText.replace(/\n/g,""); //get rid of newlines

	const retArray = createArray(numLines, numChars);
	let arrayPosition = 0;

	for (let row = 0; row < retArray.length; row++) {
		for (let letter = 0; letter < retArray[0].length; letter++) {
			retArray[row][letter] = retText.substr(arrayPosition, 1);
			arrayPosition++;
		}
	}

	return retArray;
}

function inputTextToArray(inputText) {
	let retText = inputText.replace(/[.,\/#?!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s/g,"").toUpperCase();

	if (retText.length % secretKey.length !== 0) {
		let addChars = secretKey.length - (retText.length % secretKey.length);
		for (let i = 0; i < addChars; i++) {
			retText += "."
		}
	}

	let numLines, numChars;
	//for (let i = 10; i >= secretKey.length; i--) {
	for (let i = secretKey.length + 1; i < 16; i++) {
		if (retText.length % i == 0) {
			numLines = i;
			numChars = retText.length / i;
			break;
		}
	}

	const retArray = createArray(numLines, numChars);
	let arrayPosition = 0;

	for (let row = 0; row < retArray.length; row++) {
		for (let letter = 0; letter < retArray[0].length; letter++) {
			retArray[row][letter] = retText.substr(arrayPosition, 1);
			arrayPosition++;
		}
	}

	return retArray;
}


function errorCheck(inputElm, customKeyElm, errElm) {
	const val = inputElm.value;
	const keyVal = customKeyElm.value;
	let inputBool = true;
	let keyBool = true;

	errElm.innerText = "";

	if (val.length < 5) {
		errElm.innerText += "Input must contain at least 5 characters.\n";
		errElm.classList.remove("hidden");
		inputBool = false;
	}

	if (useCustomKey == true) {
		if (keyVal.length < 4) {
			errElm.innerText += "Custom key must contain at least 4 characters.\n";
			errElm.classList.remove("hidden");
			keyBool = false;
		}
	}

	if ((inputBool && keyBool) == true) {
		errElm.classList.add("hidden");
	}

	return inputBool && keyBool;
}

function makeCustomKey(inputElm) {
	let value = inputElm.value.toUpperCase().replaceAll(/[^UDLR]/g,"");
	inputElm.value = value;
	value = value.split("");
	let retArray = value.map(character => {
		switch (character) {
			case "R":
				return [1, 0];
				break;
			case "U":
				return [0, -1];
				break;
			case "L":
				return [-1, 0];
				break;
			case "D":
				return [0, 1];
				break;
			default:
				break;
		}
	});

	return retArray;
}


const inputElm = document.querySelector(".inputCode");
const errElm = document.querySelector(".errormessage");
const outputEnablerElm = document.querySelector(".outputText");
const outputHeading = document.querySelector(".outputHeading");
const outputElm = document.querySelector(".outputCode");

const customKeyElm = document.querySelector("input.key");



document.querySelector(".button.encode").addEventListener("click", () => {
	if (!errorCheck(inputElm, customKeyElm, errElm)) {
		return;
	}

	if (useCustomKey) {
		secretKey = makeCustomKey(customKeyElm);
	} else {
		secretKey = defaultKey;
	}

	const textToEncode = inputTextToArray(inputElm.value);
	const encodedText = shuffleEncode(textToEncode);
	outputElm.innerText = prettyPrintArray(encodedText);
	outputHeading.innerText = "Encoded output";
	outputEnablerElm.classList.remove("hidden");
});

document.querySelector(".button.decode").addEventListener("click", () => {
	if (!errorCheck(inputElm, customKeyElm, errElm)) {
		return;
	}

	if (useCustomKey) {
		secretKey = makeCustomKey(customKeyElm);
	} else {
		secretKey = defaultKey;
	}

	const textToDecode = encodedTextToArray(inputElm.value);
	const decodedText = shuffleDecode(textToDecode);
	outputElm.innerText = prettyPrintArray(decodedText);
	outputHeading.innerText = "Decoded output";
	outputEnablerElm.classList.remove("hidden");
});

$(".customKey").click(function(){
	$(".customKeyWrap .inputWrap").slideToggle();
	!useCustomKey ? useCustomKey = true : useCustomKey = false;
});

$(document).ready(function(){
	$(".customKeyWrap .inputWrap").hide();
});