var crypto  = require('crypto'),
    fs      = require('fs'),
    request = require('request');

const API_URL = 'https://api.tutucloud.com/v1/face/';

function face(keys) {
	this.api_key    = keys.api_key;
	this.api_secret = keys.api_secret;

	this.request = function(method, params, callback) {
		if (this.api_key == undefined || this.api_secret == undefined) {
			throw 'api_key and api_secret are required';
		}

		var _params = {};

		if (params.url !== undefined ) {
			_params.img = params.url	
		} else if (params.file !== undefined) {					
			_params.img = fs.createReadStream(params.file);
		} else {
			throw 'parameter missing : img';
		}

		delete params.url;
		delete params.file;

		for (var k in params) {
			_params[k] = params[k];
		}	

		_params.api_key = this.api_key;
		_params.t       = Math.floor(Date.now() / 1000);
		_params.sign    = signature(_params, this.api_secret);

		request.post({url: API_URL + method, formData: _params}, function optionalCallback(err, httpResponse, body) {
			if (err) {
				throw err;
			}
			if (typeof(callback) == 'function') {
				callback(JSON.parse(body));
			}
		});	
	}
}

function signature(params, api_secret) {
	keys = [];
	for (var k in params) {
		if (typeof params[k] !== 'object') {
			keys.push(k);
		}
	}
	keys.sort();
	var signstr = '';
	for (var i in keys) {
		signstr += keys[i].toLowerCase() + params[keys[i]];
	}
	signstr += api_secret;
	return crypto.createHash('md5').update(signstr).digest('hex');
}

module.exports = face;
