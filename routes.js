module.exports = function(app, express, http) {
	// Public directory
	console.log(__dirname);
	app.use(express.static(__dirname + '/public'));

	var utils = require('./utils.js')(app, express, http);

	app.get('/', (req, res) => {

		//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
		var options = {
		  host: 'ent-prod.oniris-nantes.fr',
		  path: '/EDT/EDTE16_17_2sem/g8220.xml'
		};

		callback = function(response) {
		  var str = '';

		  //another chunk of data has been recieved, so append it to `str`
		  response.on('data', function (chunk) {
		  	str += chunk;
		  });

		  //the whole response has been recieved, so we just print it out here
		  response.on('end', function () {
		    // console.log(str);s
		    utils.parse(res, str);
		  });
		}

		http.request(options, callback).end();

		// var client = http.request(80, "google.com");
		// request = client.request();
		// request.on('response', function( res2 ) {
		//     res2.on('data', function( data ) {
		//         res.send(data);
		//         // utils.parse(res);
		//     } );
		// } );
		// request.end();
	});


}