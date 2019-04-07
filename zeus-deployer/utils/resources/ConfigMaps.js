var ConfigMapsApi = require("kubernetes/api/v1/ConfigMaps");
var ConfigMapBuilder = require("kubernetes/builders/api/v1/ConfigMap");

exports.create = function(server, token, namespace, deployment) {
	var api = new ConfigMapsApi(server, token, namespace);
	return api.create(deployment);
};

exports.delete = function(server, token, namespace, name) {
	var api = new ConfigMapsApi(server, token, namespace);
	return api.delete(name);
};

exports.build = function(entity) {
	var builder = new ConfigMapBuilder();
	builder.getMetadata().setName(entity.name);
	builder.getMetadata().setNamespace(entity.namespace);
	builder.getMetadata().setLabels({
		"zeus-application": entity.application
	});
    var data = {};
    data[entity.key] = entity.data
	builder.setData(data);
	return builder.build();
};