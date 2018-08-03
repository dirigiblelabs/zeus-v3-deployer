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

            result.deployment = create(credentials, Deployments, application.deployment);
            result.statefulSet = create(credentials, StatefulSets, application.statefulSet);
            result.service = create(credentials, Services, application.service);
            result.ingress = create(credentials, Ingresses, application.ingress);

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
	.resource('{id}')
		.delete(function(ctx, request, response) {
            // TODO
		})
.execute();


function create(credentials, api, entity) {
    console.warn('Credentials: ' + JSON.stringify(credentials));
    console.warn('API: ' + JSON.stringify(api));
    console.warn('Entity: ' + JSON.stringify(entity));
    if (entity) {
        var resource = api.build(entity);
        return api.create(credentials.server, credentials.token, credentials.namespace, resource);
    }
    return null;
}
// var entity = {
//     'deployment': {
//         'name': 'demo',
//         'namespace': 'zeus',
//         'application': 'zeus',
//         'replicas': 1,
//         'containers': [{
//             'name': 'dirigible',
//             'image': 'dirigiblelabs/dirigible:latest',
//             'port': 8080,
//             'env': [{
//                 'name': 'KEYCLOAK_CONFIDENTIAL_PORT',
//                 'value': 443
//             }, {
//                 'name': 'KEYCLOAK_SSL_REQUIRED',
//                 'value': 'none'
//             }, {
//                 'name': 'KEYCLOAK_CLIENT_ID',
//                 'value': 'ide'
//             }, {
//                 'name': 'KEYCLOAK_REALM',
//                 'value': 'applications'
//             }, {
//                 'name': 'KEYCLOAK_AUTH_SERVER_URL',
//                 'value': 'https://auth.ingress.dev.promart.shoot.canary.k8s-hana.ondemand.com/auth'
//             }]
//         }]
//     },
//     'statefulSet': {
//         'name': 'demo',
//         'namespace': 'zeus',
//         'application': 'demo',
//         'replicas': 1,
//         'storage': '1Gi',
//         'serviceName': 'zeus-http',
//         'containers': [{
//             'name': 'dirigible',
//             'image': 'dirigiblelabs/dirigible:latest',
//             'port': 8080,
//             'mountPath': '/usr/local/tomcat/dirigible',
//             'env': [{
//                 'name': 'KEYCLOAK_CONFIDENTIAL_PORT',
//                 'value': 443
//             }, {
//                 'name': 'KEYCLOAK_SSL_REQUIRED',
//                 'value': 'none'
//             }, {
//                 'name': 'KEYCLOAK_CLIENT_ID',
//                 'value': 'ide'
//             }, {
//                 'name': 'KEYCLOAK_REALM',
//                 'value': 'applications'
//             }, {
//                 'name': 'KEYCLOAK_AUTH_SERVER_URL',
//                 'value': 'https://auth.ingress.dev.promart.shoot.canary.k8s-hana.ondemand.com/auth'
//             }]
//         }]
//     },
//     'service': {
//         'name': 'demo-http',
//         'namespace': 'zeus',
//         'application': 'demo',
//         'type': 'NodePort',
//         'port': 8080
//     },
//     'ingress': {
//         'name': 'demo',
//         'namespace': 'zeus',
//         'application': 'demo',
//         'host': 'demo.ingress.dev.promart.shoot.canary.k8s-hana.ondemand.com',
//         'serviceName': 'demo-http',
//         'servicePort': 8080
//     }
// };

// var deployment = Deployments.build(entity.deployment);
// var statefulSet = StatefulSets.build(entity.statefulSet);
// var service = Services.build(entity.service);
// var ingress = Ingresses.build(entity.ingress);

// response.println(JSON.stringify({
//     'deployment': deployment,
//     'statefulSet': statefulSet,
//     'service': service,
//     'ingress': ingress
// }));