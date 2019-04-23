var dao = require("zeus-deployer/data/dao/Deployments");
var api = require("zeus-deployer/utils/resources/ConfigMaps");
var extensions = require("core/v4/extensions");

exports.create = function(server, token, namespace, template, name, context) {
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
		entity = beforeCreate(entity, context);
        var config = api.create(server, token, namespace, entity);
        configMaps.push(config);
	}
	return configMaps;
};

exports.delete = function(server, token, namespace, templateId, applicationName) {
	var result = [];
	var configs = dao.getConfigMaps(templateId);

	for (var i = 0 ; i < configs.length; i ++) {
		var config = api.delete(server, token, namespace, applicationName + "-" + configs[i].name);
		result.push(config);
	}
	return result;
};

function beforeCreate(entity, context) {
	var module = null;
	var extensionModules = extensions.getExtensions("zeus-deployer-resources-ConfigMap");
	if (extensionModules !== null && extensionModules.length > 0) {
		module = require(extensionModules[0]);
		if (typeof module.beforeCreate === "function") {
			return module.beforeCreate(entity, context);
		}
	}
	return entity;
}