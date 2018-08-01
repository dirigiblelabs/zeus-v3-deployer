var IngressesApi = require('kubernetes/apis/extensions/v1beta1/Ingresses');
var DeploymentDao = require('zeus-deployer/data/dao/Deployments');

exports.create = function(server, token, namespace, template, applicationName) {
	var result = [];
	var services = DeploymentDao.getServices(template.id);

	for (var i = 0 ; i < services.length; i ++) {
		if (isIngress(services[i])) {
			var api = new IngressesApi(server, token, namespace);
		
			var builder = api.getEntityBuilder();
		
			builder.getMetadata().setNamespace(namespace);
		
			builder.getMetadata().setName(applicationName + '-' + services[i].name);
			builder.getMetadata().setLabels({
				'zeus-application': applicationName
			});
		
			builder.getSpec().setHost(services[i].host);
			builder.getSpec().setPath(services[i].path);
			builder.getSpec().setServiceName(applicationName + '-' + services[i].name);
			builder.getSpec().setServicePort(services[i].port);
			
			var entity = builder.build();
			result.push(api.create(entity));
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

function isIngress(service) {
	return service.host !== null && service.path !== null;
}