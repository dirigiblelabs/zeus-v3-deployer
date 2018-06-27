var DeploymentsApi = require('kubernetes/apis/apps/v1/Deployments');
var DeploymentDao = require('zeus-deployer/data/dao/Deployments');

exports.create = function(server, token, namespace, templateId, applicationName) {
	var api = new DeploymentsApi(server, token, namespace);

	var builder = api.getEntityBuilder();
	builder.getMetadata().setNamespace(namespace);

	builder.getMetadata().setName(applicationName);
	builder.getMetadata().setLabels({
		'zeus-application': applicationName
	});

	builder.getSpec().setReplicas(DeploymentDao.getTemplate(templateId).replicas);
	addContainers(builder, templateId);
	
	var entity = builder.build();
	return api.create(entity);
};

exports.delete = function(server, token, namespace, applicationName) {
	var api = new DeploymentsApi(server, token, namespace);
	return api.delete(applicationName);
};

function addContainers(builder, templateId) {
	var containers = DeploymentDao.getContainers(templateId);
	var env = DeploymentDao.getVariables(templateId);
	for (var i = 0 ; i < containers.length; i ++) {
		var container = {
			'name': containers[i].name,
			'image': containers[i].image,
			'ports': [{
				'containerPort': containers[i].port
			}],
			'env': []
		};
		for (var j = 0; j < env.length; j ++) {
			container.env.push({
				'name': env[j].name,
				'value': env[j].value
			});
		}
		builder.getSpec().getTemplate().getSpec().addContainer(container);
	}
}
