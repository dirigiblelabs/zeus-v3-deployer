var ServicesApi = require('kubernetes/api/v1/Services');
var DeploymentDao = require('zeus-deployer/data/dao/Deployments');

exports.create = function(server, token, namespace, templateId) {
	var api = new ServicesApi(server, token, namespace);

	var builder = api.getEntityBuilder();

	builder.getMetadata().setNamespace(namespace);

	builder.getMetadata().setName('test-application');
	builder.getMetadata().setLabels({
		'application': 'zeus-application-test'
	});

	builder.getSpec().setType('NodePort');
	builder.getSpec().addPort({
		'port': 8080,
		'targetPort': 8080
	});
	
	var entity = builder.build();
	return api.create(entity);
};
