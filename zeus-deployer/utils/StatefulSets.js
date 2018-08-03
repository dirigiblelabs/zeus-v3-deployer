var dao = require('zeus-deployer/data/dao/Deployments');
var api = require('zeus-deployer/utils/resources/StatefulSets');

exports.create = function(server, token, namespace, template, name) {
	var entity = {
		'name': name,
		'namespace': namespace,
		'application': name,
		'replicas': template.replicas,
		'serviceName': name + '-' + dao.getServices(template.id)[0].name,
		'storage': '1Gi',
		'containers': []
	};
	addContainers(entity, template);

	var statefulSet = api.build(entity);
	return api.create(server, token, namespace, statefulSet);
};

exports.delete = function(server, token, namespace, name) {
	return api.delete(server, token, namespace, name);
};

function addContainers(entity, template) {
	var containers = dao.getContainers(template.id);
	var env = dao.getVariables(template.id);
	for (var i = 0 ; i < containers.length; i ++) {
		var container = {
			'name': containers[i].name,
			'image': containers[i].image,
			'port': containers[i].port,
			'mountPath': template.mountPath,
			'env': env
		};
		entity.containers.push(container);
	}
}
