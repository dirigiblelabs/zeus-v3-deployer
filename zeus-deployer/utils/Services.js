var dao = require('zeus-deployer/data/dao/Deployments');
var api = require('zeus-deployer/utils/resources/Services');

exports.create = function(server, token, namespace, template, name) {
	var services = [];
	var templateServices = dao.getServices(template.id);
	for (var i = 0 ; i < templateServices.length ; i ++ ) {
		var entity = api.build({
			'name': name + '-' + templateServices[i].name,
			'namespace': namespace,
			'application': name,
			'type': templateServices[i].type,
			'port': templateServices[i].port
		});
		var service = api.create(server, token, namespace, entity);
		services.push(service);
	}
	return services;
};

exports.delete = function(server, token, namespace, template, name) {
    return api.delete(server, token, namespace, template, name);
};