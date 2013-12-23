var vcard;
var fs = require('fs');
var path = require('path');

fs.readFile(path.join(__dirname, '/db.json'), function(err, data) {
	vcard = JSON.parse(data);
});

exports.create = function(req, res){
	var person = {
		nickname: "",
		name: "",
		tel: ""
	};

	person.nickname = req.params.nickname;

	person.tel =  req.query.tel;
	person.name = req.query.name;

	vcard.push(person);

	res.end();
};

exports.read = function(req, res){
	res.send(vcard);

	res.end();
};

exports.update = function(req, res){
	var nickname = req.params.nickname;

	vcard.forEach(function (entry) {
		if (entry.nickname === nickname) {
			console.log('found!');

			entry.name =  req.query.name;
			entry.tel =  req.query.tel;
		}
	});

	res.end();
};

exports.delete = function(req, res){
	res.end();
};

exports.upload = function(req, res) {

    var type = req.params.type;   // 'photo' or 'voice'
    var ext;

    switch (type) {
        case 'photo':
            ext = '.jpg';
            break;
        case 'voice':
            ext = '.mp3';
            break;
    }

    var filename = req.params.nickname + ext;
    var newPath = path.join(__dirname, '../frontend/uploads', filename);

    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        var wstream = fs.createWriteStream(newPath);
        file.pipe(wstream);
    });

    req.busboy.on('end', function() {
        res.json({status: 'ok'});
        res.end();
    });
};
