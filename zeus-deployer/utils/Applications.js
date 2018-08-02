var dao = require('zeus-applications/data/dao/Explore/Applications');
var DeploymentDao = require('zeus-deployer/data/dao/Deployments');

var StatefulSets = require('zeus-deployer/utils/StatefulSets');
var Deployments = require('zeus-deployer/utils/Deployments');
var Services = require('zeus-deployer/utils/Services');
var Ingresses = require('zeus-deployer/utils/Ingresses');
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
	var services = createServices(credentials.server, credentials.token, credentials.namespace, template, name);
	var ingresses = Ingresses.create(credentials.server, credentials.token, credentials.namespace, template, name);

	var applicationId = dao.create({
		'Template': templateId,
		'Cluster': clusterId,
		'Name': name
	});

	ApplicationContainers.create(applicationId, deployment);
	ApplicationVariables.create(applicationId, deployment);
	ApplicationServices.create(applicationId, services);
	ApplicationEndpoints.create(credentials.server, applicationId, services, ingresses);

	return {
		'deployment': deployment,
		'services': services
	};
};

function createServices(server, token, namespace, template, name) {
	var services = [];
	var templateServices = DeploymentDao.getServices(template.id);
	for (var i = 0 ; i < templateServices.length ; i ++ ) {
		var entity = Services.build({
			'name': name + '-' + templateServices[i].name,
			'namespace': namespace,
			'application': name,
			'type': templateServices[i].type,
			'port': templateServices[i].port
		});
		var service = Services.create(server, token, namespace, entity);
		services.push(service);
	}
	return services;
}

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
	var services = Services.delete(credentials.server, credentials.token, credentials.namespace, application.Template, application.Name);
	var ingresses = Ingresses.delete(credentials.server, credentials.token, credentials.namespace, application.Template, application.Name);

	ApplicationContainers.delete(applicationId);
	ApplicationVariables.delete(applicationId);
	ApplicationServices.delete(applicationId);
	ApplicationEndpoints.delete(applicationId);
	dao.delete(applicationId);

	return {
		'deployment': deployment,
		'services': services,
		'ingresses': ingresses
	};
};
