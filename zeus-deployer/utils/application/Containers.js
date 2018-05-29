var dao = require('zeus-applications/data/dao/Containers')

exports.create = function(applicationId, deployment) {
	var containers = deployment.spec.template.spec.containers;
	for (var i = 0; i < containers.length; i ++) {
		dao.create({
			'Name': containers[i].name,
			'Image': containers[i].image,
			'Protocol': containers[i].ports[0].protocol,
			'Port': containers[i].ports[0].containerPort,
			'Application': applicationId
		});
	}
};

exports.delete = function(applicationId) {
	var entity = dao.list({
		'Application': applicationId
	})[0];

	dao.delete(entity.Id);
};