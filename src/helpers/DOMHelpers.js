/**
 * window.document
 *
 * @global
**/
var doc = window.document,

/**
 * window.document.body
 *
 * @global
**/
body = doc.body;

/**
 * Cancels the event if it is cancelable, without stopping further propagation of the event
 *
 * @function preventDefault
 * @param {Event} e
 * @returns {Boolean} false
**/
function preventDefault(e) {
	e.preventDefault ? e.preventDefault() : e.returnValue = false;
	
	return false;
}

/**
 * Prevents further propagation of the current event
 *
 * @function stopPropagation
 * @param {Event} e
 * @returns {Boolean} false
**/
function stopPropagation(e) {
	e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
	
	return false;
}

/**
 * Checks if the browser support audios
 *
 * @function ifBrowserSupportAudio
 * @returns {Boolean}
**/
function ifBrowserSupportAudio() {
	return window.Audio !== undefined;
}

/**
 * Gets the preferred audio type
 *
 * @function getPreferredAudioType
 * @returns {?String}
**/
function getPreferredAudioType() {
	var audioTypes, i, il, audio;
	
	if (ifBrowserSupportAudio()) {
		audioTypes = ['ogg', 'mp3', 'mpeg', 'wav'];
		i = 0;
		il = audioTypes.length;
		audio = new Audio();
		
		for (; i < il; i++) {
			if (audio.canPlayType('audio/' + audioTypes[i])) {
				return audioTypes[i];
			}
		}
	}
	
	return null;
}

/**
 * Plays an audio
 *
 * @function playAudio
 * @param {Audio} audio
 * @param {int} [volume]
 * @param {Boolean} [reset]
 * @param {Function} [callback]
 * @returns {Audio}
**/
function playAudio(audio, volume, reset, callback) {
	var callbackWrapper;
	
	if (audio.readyState > 0) {
		if (reset === true) {
			audio.pause();
			audio.currentTime = 0;
		}
		
		if (typeof callback === 'function') {
			callbackWrapper = function(e) {
				callback.call(this, e);
				audio.removeEventListener('ended', callbackWrapper);
			};
			
			audio.addEventListener('ended', callbackWrapper);
		}
		
		if (volume !== undefined) {
			audio.volume = Math.min(Math.max(0, volume / 100), 1);
		}
		
		audio.play();
	}
	
	return audio;
}

/**
 * Creates an HTML element
 *
 * @function createElement
 * @param {String} tagName
 * @param {HTMLElement} [parentElement]
 * @param {String} [textContent]
 * @returns {HTMLElement}
**/
function createElement(tagName, parentElement, textContent) {
	var elem = window.document.createElement(tagName);
	
	if (parentElement !== undefined) {
		parentElement.appendChild(elem);
	}
	
	if (textContent !== undefined) {
		elem.textContent = textContent;
	}
	
	return elem;
}
