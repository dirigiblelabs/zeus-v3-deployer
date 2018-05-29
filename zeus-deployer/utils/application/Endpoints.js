var dao = require('zeus-applications/data/dao/Endpoints')

exports.create = function(server, applicationId, services) {
	for (var i = 0; i < services.length; i ++) {
		var port = services[i].spec.ports[0].nodePort;
		dao.create({
			'URL': server.substr(0, server.lastIndexOf(':')).replace("https", "http") + ':' + port,
			'Application': applicationId
		});
	}
};

exports.delete = function(applicationId) {
	var entity = dao.list({
		'Application': applicationId
	})[0];

	dao.delete(entity.Id);
};