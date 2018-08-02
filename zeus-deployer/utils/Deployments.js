var DeploymentsApi = require('kubernetes/apis/apps/v1/Deployments');
var DeploymentBuilder = require('kubernetes/builders/apis/apps/v1/Deployment');
var DeploymentDao = require('zeus-deployer/data/dao/Deployments');

exports.create = function(server, token, namespace, template, applicationName) {
	var api = new DeploymentsApi(server, token, namespace);
	var containers = DeploymentDao.getContainers(template.id);
	var env = DeploymentDao.getVariables(template.id);

	var entity = {
		'name': applicationName,
        'namespace': namespace,
        'application': applicationName,
        'replicas': template.replicas,
		'containers': []
	}
	for (var i = 0 ; i < containers.length; i ++) {
		containers[i].env = env;
		entity.containers.push(buildContainer(containers[i]));
	}
	var deployment = exports.build(entity);
	return api.create(deployment);
};

exports.delete = function(server, token, namespace, applicationName) {
	var api = new DeploymentsApi(server, token, namespace);
	return api.delete(applicationName);
};

exports.build = function(entity) {
	var builder = new DeploymentBuilder();
	builder.getMetadata().setName(entity.name);
	builder.getMetadata().setNamespace(entity.namespace);
	builder.getMetadata().setLabels({
		'zeus-application': entity.application
	});
	builder.getSpec().setReplicas(entity.replicas);

	for (var i = 0 ; i < entity.containers.length; i ++) {
		builder.getSpec().getTemplate().getSpec().addContainer(entity.containers[i]);
	}
	return builder.build();
};

function buildContainer(entity) {
	var container = {
		'name': entity.name,
		'image': entity.image,
		'ports': [{
			'containerPort': entity.port
		}],
		'env': []
	};
	for (var i = 0; i < entity.env.length; i ++) {
		container.env.push({
			'name': entity.env[i].name,
			'value': entity.env[i].value
		});
	}
	return container;
}