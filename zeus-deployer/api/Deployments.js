var rs = require('http/v3/rs');

var Deployer = require('zeus-deployer/utils/Deployer');

rs.service()
	.resource('')
		.get(function(ctx, request, response) {
			var deployment = Deployer.deploy(1);
			response.println(JSON.stringify(deployment));
		})
.execute();