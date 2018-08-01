var dao = require('zeus-applications/data/dao/Explore/Endpoints')

exports.create = function(server, applicationId, services, ingresses) {
	if (ingresses !== null && ingresses.length > 0) {
		for (var i = 0; i < ingresses.length; i ++) {
			dao.create({
				'URL': getUrlFromIngress(ingresses[i].spec),
				'Application': applicationId
			});
		}
	} else {
		for (var i = 0; i < services.length; i ++) {
			dao.create({
				'URL': getUrlFromService(server, services[i].spec),
				'Application': applicationId
			});
		}
	}
};

function getUrlFromIngress(ingress) {
	return ingress.rules[0].host;
}

function getUrlFromService(server, serviceSpec) {
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