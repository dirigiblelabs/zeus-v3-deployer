var ServicesApi = require('kubernetes/api/v1/Services');
var ServiceBuilder = require('kubernetes/builders/api/v1/Service');
var DeploymentDao = require('zeus-deployer/data/dao/Deployments');

exports.create = function(server, token, namespace, service) {
	var api = new ServicesApi(server, token, namespace);
	return api.create(service);
};

exports.delete = function(server, token, namespace, templateId, applicationName) {
	var result = [];
	var services = DeploymentDao.getServices(templateId);

	for (var i = 0 ; i < services.length; i ++) {
		var api = new ServicesApi(server, token, namespace);
		var service = api.delete(applicationName + '-' + services[i].name);
		result.push(service);
	}
	return result;
};

exports.build = function(entity) {
	var builder = new ServiceBuilder();
	builder.getMetadata().setName(entity.name);
	builder.getMetadata().setNamespace(entity.namespace);
	builder.getMetadata().setLabels({
		'zeus-application': entity.application
	});
	builder.getSpec().setType(entity.type);
	builder.getSpec().addPort({
		'port': entity.port,
		'targetPort': 8080
	});

	return builder.build();
};