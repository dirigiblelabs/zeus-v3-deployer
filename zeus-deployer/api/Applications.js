var rs = require('http/v3/rs');

var Applications = require('zeus-deployer/utils/Applications');

rs.service()
	.resource('')
		.get(function(ctx, request, response) {
			var templateId = 1;
			var deployment = Applications.create(templateId);
			response.println(JSON.stringify(deployment));
		})
.execute();