var StatefulSetsApi = require('kubernetes/apis/apps/v1/StatefulSets');
var StatefulSetBuilder = require('kubernetes/builders/apis/apps/v1/StatefulSet');
var DeploymentDao = require('zeus-deployer/data/dao/Deployments');

exports.create = function(server, token, namespace, statefulSet) {
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
		'zeus-application': entity.application
	});

	builder.setStorage(entity.storage);
	builder.getSpec().setServiceName(entity.serviceName);
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
			'name': entity.containers[i].name,
			'image': entity.containers[i].image,
			'ports': [{
				'containerPort': entity.containers[i].port
			}],
            'volumeMounts': [{
                'name': 'root',
                'mountPath': entity.containers[i].mountPath
            }],
			'env': []
		};
		for (var j = 0; j < entity.containers[i].env.length; j ++) {
			container.env.push({
				'name': entity.containers[i].env[j].name,
				'value': entity.containers[i].env[j].value
			});
		}
        containers.push(container);
	}
    return containers;
}