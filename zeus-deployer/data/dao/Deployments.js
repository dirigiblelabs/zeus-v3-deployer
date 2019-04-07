var query = require("db/v4/query");

var GET_TEMPLATE = "select * from zeus_templates where template_id = ?";

var GET_CONTAINERS = "select * from zeus_template_containers "
	+ "join zeus_containers on template_container_container = container_id "
	+ "join zeus_container_protocols on container_protocol = container_protocol_id "
	+ "where template_container_template = ?";

var GET_SERVICES = "select * from zeus_template_services "
	+ "join zeus_template_service_types on template_service_type = service_type_id "
	+ "where template_service_template = ?";

var GET_VARIABLES = "select * from zeus_template_variables "
	+ "where template_variable_template = ?";

var GET_CONFIGMAPS = "select * from zeus_template_configmaps "
	+ "where template = ?";

exports.getTemplate = function(templateId) {
	var template = query.execute(GET_TEMPLATE, [{
		type: "INTEGER",
		value: templateId
	}]);

	return {
		id: templateId,
		name: template[0].template_name,
		replicas: template[0].template_replicas,
		isStateful: template[0].template_is_stateful,
		mountPath: template[0].template_mount_path
	};
};

exports.getContainers = function(templateId) {
	var containers = query.execute(GET_CONTAINERS, [{
		type: "INTEGER",
		value: templateId
	}]);

	containers = containers.map(function(next) {
		return {
			name: next.container_name,
			image: next.container_image,
			port: next.container_port,
			protocol: next.container_name
		};
	});
	return containers;
};

exports.getServices = function(templateId) {
	var services = query.execute(GET_SERVICES, [{
		type: "INTEGER",
		value: templateId
	}]);

	services = services.map(function(next) {
		return {
			name: next.template_service_name,
			type: next.service_type_name,
			port: next.template_service_port,
			host: next.template_service_host,
			path: next.template_service_path
		};
	});
	return services;
};

exports.getVariables = function(templateId) {
	var variables = query.execute(GET_VARIABLES, [{
		type: "INTEGER",
		value: templateId
	}]);

	variables = variables.map(function(next) {
		return {
			name: next.template_variable_name,
			value: next.template_variable_value
		};
	});
	return variables;
};

exports.getConfigMaps = function(templateId) {
	var configMaps = query.execute(GET_CONFIGMAPS, [{
		type: "INTEGER",
		value: templateId
	}]);

	configMaps = configMaps.map(function(next) {
		return {
			id: next.id,
			name: next.name,
			key: next.key,
			mountPath: next.mountpath,
			data: data
		};
	});
	return configMaps;
};