var dao = require('zeus-applications/data/dao/Explore/Applications');
var Containers = require('zeus-deployer/utils/application/Containers');
var Variables = require('zeus-deployer/utils/application/Variables');
var Services = require('zeus-deployer/utils/application/Services');
var Endpoints = require('zeus-deployer/utils/application/Endpoints');

exports.get = function(id) {
	return dao.get(id);
};

exports.create = function(application) {
	var applicationId = dao.create({
		'Template': application.templateId,
		'Cluster': application.clusterId,
		'Name': application.name
	});
    Containers.create(applicationId, application.deployment);
	Variables.create(applicationId, application.deployment);
	Services.create(applicationId, application.services);
	Endpoints.create(application.server, applicationId, application.services, application.ingresses);
};

exports.delete = function(id) {
    Containers.delete(id);
	Variables.delete(id);
	Services.delete(id);
	Endpoints.delete(id);
	dao.delete(id);
};