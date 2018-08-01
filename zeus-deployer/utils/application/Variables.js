var dao = require('zeus-applications/data/dao/Explore/Variables')

exports.create = function(applicationId, deployment) {
	var containers = deployment.spec.template.spec.containers;
	for (var i = 0; i < containers.length; i ++) {
		var env = containers[i].env;
		for (var j = 0; env !== undefined && j < env.length; j ++) {
			dao.create({
				'Name': env[j].name,
				'Value': env[j].value,
				'Application': applicationId
			});
		}
	}
};

exports.delete = function(applicationId) {
	var variables = dao.list({
		'Application': applicationId
	});

	for (var i = 0; i < variables.length; i ++) {
		dao.delete(variables[i].Id);
	}
};
