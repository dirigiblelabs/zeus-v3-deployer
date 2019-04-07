var dao = require("zeus-deployer/data/dao/Deployments");
var api = require("zeus-deployer/utils/resources/ConfigMaps");

exports.create = function(server, token, namespace, template, name) {
	var configMaps = [];
	var configs = dao.getConfigMaps(template.id);
	for (var i = 0 ; i < configs.length; i ++) {
        var entity = api.build({
            name: name + "-" + configs[i].name,
            namespace: namespace,
            application: name,
            key: configs[i].key,
            mountPath: configs[i].mountPath,
            data: configs[i].data,
        });
        var config = api.create(server, token, namespace, entity);
        configMaps.push(config);
	}
	return configMaps;
};

exports.delete = function(server, token, namespace, templateId, applicationName) {
	var result = [];
	var configs = dao.getConfigMaps(template.id);

	for (var i = 0 ; i < configs.length; i ++) {
        var config = api.delete(server, token, namespace, applicationName + "-" + configs[i].name);
        result.push(config);
	}
	return result;
};