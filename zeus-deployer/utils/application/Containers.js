var dao = require('zeus-applications/data/dao/Containers')

exports.create = function(applicationId, deployment) {
	var containers = deployment.spec.template.spec.containers;
	for (var i = 0; i < containers.length; i ++) {
		var entity = {
			'Name': containers[i].name,
			'Image': containers[i].image,
			'Protocol': containers[i].ports[0].protocol,
			'Port': containers[i].ports[0].containerPort,
			'Application': applicationId
		};
		console.error(JSON.stringify(entity));

		dao.create({
			'Name': containers[i].name,
			'Image': containers[i].image,
			'Protocol': containers[i].ports[0].protocol,
			'Port': containers[i].ports[0].containerPort,
			'Application': applicationId
		});
	}
};