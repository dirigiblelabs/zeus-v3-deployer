var IngressesApi = require('kubernetes/apis/extensions/v1beta1/Ingresses');
var IngressBuilder = require('kubernetes/builders/apis/extensions/v1beta1/Ingress');
var DeploymentDao = require('zeus-deployer/data/dao/Deployments');

exports.create = function(server, token, namespace, template, applicationName) {
	var result = [];
	var services = DeploymentDao.getServices(template.id);

	var api = new IngressesApi(server, token, namespace);
	for (var i = 0 ; i < services.length; i ++) {
		if (isIngress(services[i])) {
			var ingress = exports.build({
				'name': applicationName + '-' + services[i].name,
				'namespace': namespace,
				'application': applicationName,
				'host': services[i].host,
				'path': services[i].path,
				'serviceName': applicationName + '-' + services[i].name,
				'servicePort': services[i].port
			});
			result.push(api.create(ingress));
		}
	}
	return result;
};

exports.delete = function(server, token, namespace, templateId, applicationName) {
	var result = [];
	var services = DeploymentDao.getServices(templateId);

	for (var i = 0 ; i < services.length; i ++) {
		if (isIngress(services[i])) {
			var api = new IngressesApi(server, token, namespace);
			var ingress = api.delete(applicationName + '-' + services[i].name);
			result.push(ingress);
		}
	}
	return result;
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

function isIngress(service) {
	return service.host != null && service.path != null;
}