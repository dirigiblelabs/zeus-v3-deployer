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

	builder.getSpec().setReplicas(1);
	addContainers(builder, templateId);
	
	var entity = builder.build();
	return api.create(entity);
};

function addContainers(builder, templateId) {
	var containers = DeploymentDao.getContainers(templateId);
	for (var i = 0 ; i < containers.length; i ++) {
		builder.getSpec().getTemplate().getSpec().addContainer({
			'name': containers[i].name,
			'image': containers[i].image,
			'ports': [{
				'containerPort': containers[i].port
			}]
		});
	}	
}