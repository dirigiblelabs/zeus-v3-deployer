var dao = require('zeus-deployer/data/dao/Deployments');
var api = require('zeus-deployer/utils/resources/Ingresses');

exports.create = function(server, token, namespace, template, name, ingressHost) {
	var ingresses = [];
	var services = dao.getServices(template.id);
	for (var i = 0 ; i < services.length; i ++) {
		if (isIngress(services[i])) {
			var entity = api.build({
				'name': name + '-' + services[i].name,
				'namespace': namespace,
				'application': name,
				'host': name + '.' + ingressHost,
				'path': services[i].path,
				'serviceName': name + '-' + services[i].name,
				'servicePort': services[i].port
			});
			var ingress = api.create(server, token, namespace, entity);
			ingresses.push(ingress);
		}
	}
	return ingresses;
};

exports.delete = function(server, token, namespace, templateId, applicationName) {
	var result = [];
	var services = dao.getServices(templateId);

	for (var i = 0 ; i < services.length; i ++) {
		if (isIngress(services[i])) {
			var ingress = api.delete(server, token, namespace, applicationName + '-' + services[i].name);
			result.push(ingress);
		}
	}
	return result;
};

function isIngress(service) {
	return service.type === "Ingress";
}