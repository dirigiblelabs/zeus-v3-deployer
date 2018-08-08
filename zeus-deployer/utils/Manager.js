var Deployments = require('zeus-deployer/utils/resources/Deployments');
var StatefulSets = require('zeus-deployer/utils/resources/StatefulSets');
var Services = require('zeus-deployer/utils/resources/Services');
var Ingresses = require('zeus-deployer/utils/resources/Ingresses');

exports.createDeployment = function(credentials, deployment) {
    return createResource(credentials, Deployments, deployment);
};

exports.createStatefulSet = function(credentials, statefulSet) {
    return createResource(credentials, StatefulSets, statefulSet);
};

exports.createService = function(credentials, service) {
    return createResource(credentials, Services, service);
};

exports.createIngress = function(credentials, ingress) {
    return createResource(credentials, Ingresses, ingress);
};

exports.deleteDeployment = function(credentials, name) {
    return deleteResource(credentials, Deployments, name);
};

exports.deleteStatefulSet = function(credentials, name) {
    return deleteResource(credentials, StatefulSets, name);
};

exports.deleteService = function(credentials, name) {
    return deleteResource(credentials, Services, name);
};

exports.deleteIngress = function(credentials, name) {
    return deleteResource(credentials, Ingresses, name);
};

function createResource(credentials, api, entity) {
    if (entity) {
        entity.namespace = credentials.namespace;
        var resource = api.build(entity);
        return api.create(credentials.server, credentials.token, credentials.namespace, resource);
    }
}

function deleteResource(credentials, api, name) {
    if (name) {
        return api.delete(credentials.server, credentials.token, credentials.namespace, name);
    }
}