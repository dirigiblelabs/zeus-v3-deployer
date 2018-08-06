var response = require('http/v3/response');
var Credentials = require('zeus-deployer/utils/Credentials');
var Manager = require('zeus-deployer/utils/Manager');
var Applications = require('zeus-deployer/utils/application/Applications');

var rs = require('http/v3/rs');

rs.service()
	.resource('')
		.post(function(ctx, request, response) {
            var result = {};
			var application = request.getJSON();
            var credentials = Credentials.getCredentials(application.settings.clusterId);

            result.deployment = Manager.createDeployment(credentials, application.deployment);
            result.statefulSet = Manager.createStatefulSet(credentials, application.statefulSet);
            result.service = Manager.createService(credentials, application.service);
            result.ingress = Manager.createIngress(credentials, application.ingress);

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

            result.deployment = Manager.deleteDeployment(credentials, deploymentName);
            result.statefulSet = Manager.deleteStatefulSet(credentials, statefulSetName);
            result.service = Manager.deleteService(credentials, serviceName);
            result.ingress = Manager.deleteIngress(credentials, ingressName);

            response.println(JSON.stringify(result));
		})
.execute();