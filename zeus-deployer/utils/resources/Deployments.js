var DeploymentsApi = require('kubernetes/apis/apps/v1/Deployments');
var DeploymentBuilder = require('kubernetes/builders/apis/apps/v1/Deployment');
var DeploymentDao = require('zeus-deployer/data/dao/Deployments');

exports.create = function(server, token, namespace, deployment) {
	var api = new DeploymentsApi(server, token, namespace);
	return api.create(deployment);
};

exports.delete = function(server, token, namespace, name) {
	var api = new DeploymentsApi(server, token, namespace);
	return api.delete(name);
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