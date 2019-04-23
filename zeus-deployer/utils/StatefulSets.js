var dao = require("zeus-deployer/data/dao/Deployments");
var StatefulSetsApi = require("kubernetes/apis/apps/v1/StatefulSets");
var StatefulSetBuilder = require("kubernetes/builders/apis/apps/v1/StatefulSet");

exports.create = function(server, token, namespace, template, name, context) {
	var entity = {
		name: name,
		namespace: namespace,
		application: name,
		replicas: template.replicas,
		serviceName: name + "-" + dao.getServices(template.id)[0].name,
		storage: "1Gi",
		mountPath: template.mountPath,
		containers: dao.getContainers(template.id),
		env: dao.getVariables(template.id)
	};

	var statefulSet = this.build(entity);
	var api = new StatefulSetsApi(server, token, namespace);
	return api.create(statefulSet);
};

exports.delete = function(server, token, namespace, name) {
	var api = new StatefulSetsApi(server, token, namespace);
	return api.delete(name);
};

exports.build = function(entity) {
	var builder = new StatefulSetBuilder();
	builder.getMetadata().setName(entity.name);
	builder.getMetadata().setNamespace(entity.namespace);
	builder.getMetadata().setLabels({
		"zeus-application": entity.application
	});
	builder.setStorage(entity.storage);
	builder.getSpec().setServiceName(entity.serviceName);
	builder.getSpec().setReplicas(entity.replicas);
    builder.getSpec().getTemplate().getSpec().setContainers(buildContainers(entity));

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
            volumeMounts: [{
                name: "root",
                mountPath: entity.mountPath
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
        containers.push(container);
	}
    return containers;
}
