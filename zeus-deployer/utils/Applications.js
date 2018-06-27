var dao = require('zeus-applications/data/dao/Applications');
var DeploymentDao = require('zeus-deployer/data/dao/Deployments');

var StatefulSets = require('zeus-deployer/utils/StatefulSets');
var Deployments = require('zeus-deployer/utils/Deployments');
var Services = require('zeus-deployer/utils/Services');
var Credentials = require('zeus-deployer/utils/Credentials');
var ApplicationContainers = require('zeus-deployer/utils/application/Containers');
var ApplicationVariables = require('zeus-deployer/utils/application/Variables');
var ApplicationServices = require('zeus-deployer/utils/application/Services');
var ApplicationEndpoints = require('zeus-deployer/utils/application/Endpoints');

exports.create = function(templateId, clusterId, name) {
	var credentials = Credentials.getCredentials(clusterId);

	var template = DeploymentDao.getTemplate(templateId);
	var deployment = null;
	if (template.isStateful) {
		deployment = StatefulSets.create(credentials.server, credentials.token, credentials.namespace, template, name);
	} else {
		deployment = Deployments.create(credentials.server, credentials.token, credentials.namespace, template, name);
	}
	var services = Services.create(credentials.server, credentials.token, credentials.namespace, template, name);

	var applicationId = dao.create({
		'Template': templateId,
		'Cluster': clusterId,
		'Name': name
	});

	ApplicationContainers.create(applicationId, deployment);
	ApplicationVariables.create(applicationId, deployment);
	ApplicationServices.create(applicationId, services);
	ApplicationEndpoints.create(credentials.server, applicationId, services);

	return {
		'deployment': deployment,
		'services': services
	};
};

exports.delete = function(applicationId) {
	var application = dao.get(applicationId);
	var template = DeploymentDao.getTemplate(application.Template);
	var credentials = Credentials.getCredentials(application.Cluster);

	var deployment = null;
	if (template.isStateful) {
		deployment = StatefulSets.delete(credentials.server, credentials.token, credentials.namespace, application.Name);
	} else {
		deployment = Deployments.delete(credentials.server, credentials.token, credentials.namespace, application.Name);
	}
	var services = Services.delete(credentials.server, credentials.token, credentials.namespace, application.Template, application.Name)

	ApplicationContainers.delete(applicationId);
	ApplicationVariables.delete(applicationId);
	ApplicationServices.delete(applicationId);
	ApplicationEndpoints.delete(applicationId);
	dao.delete(applicationId);

	return {
		'deployment': deployment,
		'services': services
	};
};
