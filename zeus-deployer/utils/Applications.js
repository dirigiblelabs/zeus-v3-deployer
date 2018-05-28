var Deployments = require('zeus-deployer/utils/Deployments');
var Services = require('zeus-deployer/utils/Services');
var Credentials = require('zeus-deployer/utils/Credentials');

exports.create = function(templateId, clusterId, applicationName) {
	var credentials = Credentials.getCredentials(clusterId);

	var deployment = Deployments.create(credentials.server, credentials.token, credentials.namespace, templateId, applicationName);
	var service = Services.create(credentials.server, credentials.token, credentials.namespace, templateId, applicationName);

	return {
		'deployment': deployment,
		'service': service
	};
};

exports.undeploy = function(templateId) {
	
};