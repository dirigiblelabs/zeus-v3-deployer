var rs = require('http/v3/rs');

var Applications = require('zeus-deployer/utils/Applications');

rs.service()
	.resource('')
		.post(function(ctx, request, response) {
			var application = request.getJSON();
			var deployment = Applications.create(application.templateId, application.clusterId, application.name);
			response.println(JSON.stringify(deployment));
		})
.execute();