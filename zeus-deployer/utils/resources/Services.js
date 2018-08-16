var ServicesApi = require('kubernetes/api/v1/Services');
var ServiceBuilder = require('kubernetes/builders/api/v1/Service');
var DeploymentDao = require('zeus-deployer/data/dao/Deployments');

exports.create = function(server, token, namespace, service) {
	var api = new ServicesApi(server, token, namespace);
	return api.create(service);
};

exports.delete = function(server, token, namespace, name) {
	var api = new ServicesApi(server, token, namespace);
	return api.delete(name);
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
		'targetPort': entity.port
	});

	return builder.build();
};