var dao = require('zeus-deployer/data/dao/Deployments');
var api = require('zeus-deployer/utils/resources/Deployments');

exports.create = function(server, token, namespace, template, name) {
	var containers = dao.getContainers(template.id);
	var env = dao.getVariables(template.id);

	var entity = {
		'name': name,
        'namespace': namespace,
        'application': name,
        'replicas': template.replicas,
		'containers': []
	}
	for (var i = 0 ; i < containers.length; i ++) {
		containers[i].env = env;
		entity.containers.push(buildContainer(containers[i]));
	}
	var deployment = api.build(entity)
	return api.create(server, token, namespace, deployment);
};

exports.delete = function(server, token, namespace, name) {
    return api.delete(server, token, namespace, name);
};

function buildContainer(entity) {
	var container = {
		'name': entity.name,
		'image': entity.image,
		'ports': [{
			'containerPort': entity.port
		}],
		'env': entity.env
	};
	return container;
}