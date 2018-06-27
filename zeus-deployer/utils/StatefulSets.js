var StatefulSetsApi = require('kubernetes/apis/apps/v1/StatefulSets');
var DeploymentDao = require('zeus-deployer/data/dao/Deployments');

exports.create = function(server, token, namespace, template, applicationName) {
	var api = new StatefulSetsApi(server, token, namespace);

	var builder = api.getEntityBuilder();
	builder.getMetadata().setNamespace(namespace);

	builder.getMetadata().setName(applicationName);
	builder.getMetadata().setLabels({
		'zeus-application': applicationName
	});

	builder.setStorage('1Gi');
	builder.getSpec().setServiceName(applicationName + '-' + DeploymentDao.getServices(template.id)[0].name);
	builder.getSpec().setReplicas(template.replicas);
	addContainers(builder, template);
	
	var entity = builder.build();

	return api.create(entity);
};

exports.delete = function(server, token, namespace, applicationName) {
	var api = new StatefulSetsApi(server, token, namespace);
	return api.delete(applicationName);
};

function addContainers(builder, template) {
	var containers = DeploymentDao.getContainers(template.id);
	var env = DeploymentDao.getVariables(template.id);
	for (var i = 0 ; i < containers.length; i ++) {
		var container = {
			'name': containers[i].name,
			'image': containers[i].image,
			'ports': [{
				'containerPort': containers[i].port
			}],
            'volumeMounts': [{
                'name': 'root',
                'mountPath': template.mountPath
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
