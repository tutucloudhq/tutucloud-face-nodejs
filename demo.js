face = require('./tutucloud/face');

face = new face({
	// 公有 key
	api_key: '',
	// 私有 key
	api_secret: '',
});

try {
	face.request('analyze/detection', {
		url: 'https://files.tusdk.com/img/faces/f-dd1.jpg'
		// file: 'test.webp'
	}, function(resp){
		console.log(resp);
	});

} catch (err) {
	console.error('ERROR: ' + err)
}
