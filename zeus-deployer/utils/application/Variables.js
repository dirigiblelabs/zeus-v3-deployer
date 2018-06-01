var dao = require('zeus-applications/data/dao/Variables')

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
	var entity = dao.list({
		'Application': applicationId
	})[0];

	if (entity) {
		dao.delete(entity.Id);
	}
};
