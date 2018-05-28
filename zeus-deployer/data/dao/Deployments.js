var query = require('db/v3/query');

var GET_CONTAINERS = 'select * from ZEUS_TEMPLATE_CONTAINERS '
	+ 'join ZEUS_CONTAINERS on ZTC_CONTAINER = ZC_ID '
	+ 'join ZEUS_CONTAINER_PROTOCOLS on ZC_PROTOCOL = ZCP_ID '
	+ 'where ZTC_TEMPLATE = ?';

var GET_SERVICES = 'select * from ZEUS_TEMPLATE_SERVICES '
	+ 'join ZEUS_TEMPLATE_SERVICE_TYPES on ZTS_TYPE = ZTST_ID '
	+ 'where ZTS_TEMPLATE = ?';

var GET_VARIABLES = 'select * from ZEUS_TEMPLATE_VARIABLES '
	+ 'where ZTV_TEMPLATE = ?';

exports.getContainers = function(templateId) {
	var containers = query.execute(GET_CONTAINERS, [{
		'type': 'INTEGER',
		'value': templateId
	}]);

	containers = containers.map(function(next) {
		return {
			'name': next.ZC_NAME,
			'image': next.ZC_IMAGE,
			'port': next.ZC_PORT,
			'protocol': next.ZCP_NAME
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
			'name': next.ZTS_NAME,
			'type': next.ZTST_NAME,
			'port': next.ZTS_PORT
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
			'name': next.ZTV_NAME,
			'value': next.ZTV_VALUE
		};
	});
	return variables;
};