var ServicesApi = require('kubernetes/api/v1/Services');
var DeploymentDao = require('zeus-deployer/data/dao/Deployments');

exports.create = function(server, token, namespace, templateId, applicationName) {
	var result = [];
	var services = DeploymentDao.getServices(templateId);

	for (var i = 0 ; i < services.length; i ++) {
		var api = new ServicesApi(server, token, namespace);
	
		var builder = api.getEntityBuilder();
	
		builder.getMetadata().setNamespace(namespace);
	
		builder.getMetadata().setName(applicationName + '-' + services[i].name);
		builder.getMetadata().setLabels({
			'zeus-application': applicationName
		});
	
		builder.getSpec().setType(services[i].type);
		builder.getSpec().addPort({
			'port': services[i].port
		});
		
		var entity = builder.build();
		result.push(api.create(entity));
	}
	return result;
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