var dao = require("zeus-deployer/data/dao/Deployments");
var api = require("zeus-deployer/utils/resources/Deployments");

exports.create = function(server, token, namespace, template, name) {
	var entity = {
		name: name,
        namespace: namespace,
        application: name,
        replicas: template.replicas,
		containers: [],
		configMaps: configMaps
	}
	addContainers(entity, template);

	var deployment = api.build(entity)
	return api.create(server, token, namespace, deployment);
};

exports.delete = function(server, token, namespace, name) {
    return api.delete(server, token, namespace, name);
};

function addContainers(entity, template) {
	var containers = dao.getContainers(template.id);
	var env = dao.getVariables(template.id);
	var configMaps = dao.getConfigMaps(template.id);
	for (var i = 0 ; i < containers.length; i ++) {
		entity.containers.push({
			name: containers[i].name,
			image: containers[i].image,
			port: containers[i].port,
			env: env,
			configMaps: configMaps
		});
	}
}