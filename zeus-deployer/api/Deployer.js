var response = require('http/v3/response');
var Credentials = require('zeus-deployer/utils/Credentials');
var Deployments = require('zeus-deployer/utils/resources/Deployments');
var StatefulSets = require('zeus-deployer/utils/resources/StatefulSets');
var Services = require('zeus-deployer/utils/resources/Services');
var Ingresses = require('zeus-deployer/utils/resources/Ingresses');
var Applications = require('zeus-deployer/utils/application/Applications');

var rs = require('http/v3/rs');

rs.service()
	.resource('')
		.post(function(ctx, request, response) {
            var result = {};
			var application = request.getJSON();
            var credentials = Credentials.getCredentials(application.settings.clusterId);

            result.deployment = createResource(credentials, Deployments, application.deployment);
            result.statefulSet = createResource(credentials, StatefulSets, application.statefulSet);
            result.service = createResource(credentials, Services, application.service);
            result.ingress = createResource(credentials, Ingresses, application.ingress);

            // TODO: Create Application Entry!
            // var name = application.settings.applicationName;
            // var templateId = -1;
            // var clusterId = application.settings.clusterId;
            // var deployment = result.deployment;
            // var services = [];
            // services.push(result.service);
            // var ingresses = [];
            // ingresses.push(result.ingress);

            // Applications.create({
            //     'name': name,
            //     'templateId': templateId,
            //     'clusterId': clusterId,
            //     'deployment': deployment,
            //     'services': services,
            //     'ingresses': ingresses,
            //     'server': credentials.server
            // });

            response.println(JSON.stringify(result));
		})
	.resource('')
		.delete(function(ctx, request, response) {
            var result = {};
            var clusterId = request.getParameter('clusterId');
            var deploymentName = request.getParameter('deploymentName');
            var statefulSetName = request.getParameter('statefulSetName');
            var serviceName = request.getParameter('serviceName');
            var ingressName = request.getParameter('ingressName');
            var credentials = Credentials.getCredentials(clusterId);

            result.deployment = deleteResource(credentials, Deployments, deploymentName);
            result.statefulSet = deleteResource(credentials, StatefulSets, statefulSetName);
            result.service = deleteResource(credentials, Services, serviceName);
            result.ingress = deleteResource(credentials, Ingresses, ingressName);

            response.println(JSON.stringify(result));
		})
.execute();


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