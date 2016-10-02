/**
 * HTTP namespace
 *
 * @namespace HTTP
 * @description todoc
**/
var HTTP = Object.create(null);

HTTP.get = (function() {
	function onLoad(callback, e) {
		var xmlHttp = e.target;
		
		if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
			callback(xmlHttp.responseText);
		}
	}

	/**
	 * HTTP get
	 *
	 * @method
	 * @name HTTP.get
	 * @param {String} url
	 * @param {Function} callback
	 * @returns {XMLHttpRequest}
	 * @todo Error handling
	 **/
	return function get(url, callback) {
		var httpRequest = new XMLHttpRequest();
		
		httpRequest.open('GET', url, true);
		httpRequest.onreadystatechange = onLoad.bind(httpRequest, callback);
		httpRequest.send(null);
		
		return httpRequest;
	};
}());

/**
 * HTTP getJSON
 *
 * @memberof HTTP
 * @param {String} url
 * @param {Function} callback
 * @returns {XMLHttpRequest}
 * @todo Invalid JSON handling
**/
HTTP.getJSON = function(url, callback) {
	return HTTP.get(url, function(data) {
		callback(JSON.parse(data));
	});
};

/**
 * HTTP post
 *
 * @memberof HTTP
 * @param {String} url
 * @param {String} data
 * @param {Function} callback
 * @returns {XMLHttpRequest}
 * @todo Error handling
**/
HTTP.post = function(url, data, callback) {
	var httpRequest = new XMLHttpRequest();
	
	httpRequest.open('POST', url, true);
	httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	httpRequest.onreadystatechange = callback;
	httpRequest.send(null);
	
	return httpRequest;
};
