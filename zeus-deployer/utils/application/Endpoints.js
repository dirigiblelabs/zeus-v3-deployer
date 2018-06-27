var dao = require('zeus-applications/data/dao/Endpoints')

exports.create = function(server, applicationId, services) {
	for (var i = 0; i < services.length; i ++) {
		dao.create({
			'URL': getUrl(server, services[i].spec),
			'Application': applicationId
		});
	}
};

function getUrl(server, serviceSpec) {
	if (serviceSpec.type === 'ClusterIP') {
		return '<internal> | ' + serviceSpec.clusterIP + ':' + serviceSpec.ports[0].port;
	}
	return getHostName(server) + ':' + serviceSpec.ports[0].nodePort;
}

function getHostName(server) {
	return server.indexOf(':', 'https:'.length) > 0 ? server.substr(0, server.lastIndexOf(':')) : server;
}

exports.delete = function(applicationId) {
	var endpoints = dao.list({
		'Application': applicationId
	});

	for (var i = 0 ; i < endpoints.length; i ++) {
		dao.delete(endpoints[i].Id);
	}
};