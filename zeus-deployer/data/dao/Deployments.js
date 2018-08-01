var query = require('db/v3/query');

var GET_TEMPLATE = 'select * from ZEUS_TEMPLATES where TEMPLATE_ID = ?';

var GET_CONTAINERS = 'select * from ZEUS_TEMPLATE_CONTAINERS '
	+ 'join ZEUS_CONTAINERS on TEMPLATE_CONTAINER_CONTAINER = CONTAINER_ID '
	+ 'join ZEUS_CONTAINER_PROTOCOLS on CONTAINER_PROTOCOL = CONTAINER_PROTOCOL_ID '
	+ 'where TEMPLATE_CONTAINER_TEMPLATE = ?';

var GET_SERVICES = 'select * from ZEUS_TEMPLATE_SERVICES '
	+ 'join ZEUS_TEMPLATE_SERVICE_TYPES on TEMPLATE_SERVICE_TYPE = SERVICE_TYPE_ID '
	+ 'where TEMPLATE_SERVICE_TEMPLATE = ?';

var GET_VARIABLES = 'select * from ZEUS_TEMPLATE_VARIABLES '
	+ 'where TEMPLATE_VARIABLE_TEMPLATE = ?';

exports.getTemplate = function(templateId) {
	var template = query.execute(GET_TEMPLATE, [{
		'type': 'INTEGER',
		'value': templateId
	}]);

	return {
		'id': templateId,
		'name': template[0].TEMPLATE_NAME,
		'replicas': template[0].TEMPLATE_REPLICAS,
		'isStateful': template[0].TEMPLATE_IS_STATEFUL,
		'mountPath': template[0].TEMPLATE_MOUNT_PATH
	};
};

exports.getContainers = function(templateId) {
	var containers = query.execute(GET_CONTAINERS, [{
		'type': 'INTEGER',
		'value': templateId
	}]);

	containers = containers.map(function(next) {
		return {
			'name': next.CONTAINER_NAME,
			'image': next.CONTAINER_IMAGE,
			'port': next.CONTAINER_PORT,
			'protocol': next.CONTAINER_NAME
		};
	});
	return containers;
};

exports.getServices = function(templateId) {
	var services = query.execute(GET_SERVICES, [{
		'type': 'INTEGER',
		'value': templateId
	}]);

	services = services.map(function(next) {
		return {
			'name': next.TEMPLATE_SERVICE_NAME,
			'type': next.SERVICE_TYPE_NAME,
			'port': next.TEMPLATE_SERVICE_PORT,
			'host': next.TEMPLATE_SERVICE_HOST,
			'path': next.TEMPLATE_SERVICE_PATH
		};
	});
	return services;
};

exports.getVariables = function(templateId) {
	var variables = query.execute(GET_VARIABLES, [{
		'type': 'INTEGER',
		'value': templateId
	}]);

	variables = variables.map(function(next) {
		return {
			'name': next.TEMPLATE_VARIABLE_NAME,
			'value': next.TEMPLATE_VARIABLE_VALUE
		};
	});
	return variables;
};