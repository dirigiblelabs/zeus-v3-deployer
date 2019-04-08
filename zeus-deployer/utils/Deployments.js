var dao = require("zeus-deployer/data/dao/Deployments");
var DeploymentsApi = require("kubernetes/apis/apps/v1/Deployments");
var DeploymentBuilder = require("kubernetes/builders/apis/apps/v1/Deployment");

exports.getApi = function(credentials) {
	return new DeploymentsApi(credentials.server, credentials.token, credentials.namespace);
};

exports.create = function(server, token, namespace, template, name) {
	var entity = {
		name: name,
        namespace: namespace,
        application: name,
        replicas: template.replicas,
		containers: dao.getContainers(template.id),
		configMaps: dao.getConfigMaps(template.id),
		env: dao.getVariables(template.id)
	};

	var deployment = this.build(entity);

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
    builder.getSpec().getTemplate().getSpec().setContainers(buildContainers(entity));
    builder.getSpec().getTemplate().getSpec().setVolumes(buildVolumes(entity));

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
		for (var j = 0; j < entity.env && entity.env.length; j ++) {
			var env = entity.env[j];
			container.env.push({
				name: env.name,
				value: env.value
			});
		}
		container.volumeMounts = [];
		for (var k = 0; k < entity.configMaps && entity.configMaps.length; k ++) {
			var configMap = entity.configMaps[k];
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

function buildVolumes(entity) {
	var volumes = [];
	for (var i = 0; i < entity.configMaps && entity.configMaps.length; i ++) {
		volumes.push({
			name: "config-volume-" + entity.configMaps[i].name,
			configMap: {
				name: entity.name + "-" + entity.configMaps[i].name,
				items: [{
					key: entity.configMaps[i].key,
					path: entity.configMaps[i].key
				}]
			}
		});
	}
	return volumes;
}