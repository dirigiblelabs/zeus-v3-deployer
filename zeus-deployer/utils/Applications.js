var dao = require('zeus-applications/data/dao/Applications');
var Deployments = require('zeus-deployer/utils/Deployments');
var Services = require('zeus-deployer/utils/Services');
var Credentials = require('zeus-deployer/utils/Credentials');
var ApplicationContainers = require('zeus-deployer/utils/application/Containers');
var ApplicationServices = require('zeus-deployer/utils/application/Services');

exports.create = function(templateId, clusterId, name) {
	var credentials = Credentials.getCredentials(clusterId);

	var deployment = Deployments.create(credentials.server, credentials.token, credentials.namespace, templateId, name);
	var services = Services.create(credentials.server, credentials.token, credentials.namespace, templateId, name);

	var applicationId = dao.create({
		'Template': templateId,
		'Cluster': clusterId,
		'Name': name
	});


	ApplicationContainers.create(applicationId, deployment);
	ApplicationServices.create(applicationId, services);

	return {
		'deployment': deployment,
		'services': services
	};
};

exports.undeploy = function(templateId) {
	
};