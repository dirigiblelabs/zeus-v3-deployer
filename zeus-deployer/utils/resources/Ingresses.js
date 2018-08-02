var IngressesApi = require('kubernetes/apis/extensions/v1beta1/Ingresses');
var IngressBuilder = require('kubernetes/builders/apis/extensions/v1beta1/Ingress');
var DeploymentDao = require('zeus-deployer/data/dao/Deployments');

exports.create = function(server, token, namespace, ingress) {
	var api = new IngressesApi(server, token, namespace);
	return api.create(ingress);
};

exports.delete = function(server, token, namespace, name) {
	var api = new IngressesApi(server, token, namespace);
	return api.delete(name);
};

exports.build = function(entity) {
	var builder = new IngressBuilder();
	builder.getMetadata().setName(entity.name);
	builder.getMetadata().setNamespace(entity.namespace);
	builder.getMetadata().setLabels({
		'zeus-application': entity.application
	});
	builder.getSpec().setHost(entity.host);
	builder.getSpec().setPath(entity.path);
	builder.getSpec().setServiceName(entity.serviceName);
	builder.getSpec().setServicePort(entity.servicePort);
	return builder.build();
};