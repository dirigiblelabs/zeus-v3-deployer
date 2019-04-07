var DeploymentsApi = require("kubernetes/apis/apps/v1/Deployments");
var DeploymentBuilder = require("kubernetes/builders/apis/apps/v1/Deployment");
var DeploymentDao = require("zeus-deployer/data/dao/Deployments");

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
		"zeus-application": entity.application
	});
	builder.getSpec().setReplicas(entity.replicas);

	var containers = buildContainers(entity);
    for (var i = 0; i < containers.length; i ++) {
        builder.getSpec().getTemplate().getSpec().addContainer(containers[i]);
    }

	return builder.build();
};

function buildContainers(entity) {
    var containers = [];
	for (var i = 0 ; i < entity.containers.length; i ++) {
		var container = {
			name: entity.containers[i].name,
			image: entity.containers[i].image,
			ports: [{
				containerPort: entity.containers[i].port
			}],
			env: []
		};
		for (var j = 0; j < entity.containers[i].env.length; j ++) {
			container.env.push({
				name: entity.containers[i].env[j].name,
				value: entity.containers[i].env[j].value
			});
		}
		container.volumeMounts = [];
		for (var k = 0; k < entity.containers[i].configMaps.length; k ++) {
			var configMap = entity.containers[i].configMaps[k];
			container.volumeMounts.push({
				name: "config-volume-" + configMap.name,
				mountPath: configMap.mountPath,
				subPath: configMap.key
			});
		}
        containers.push(container);
	}
    return containers;
}