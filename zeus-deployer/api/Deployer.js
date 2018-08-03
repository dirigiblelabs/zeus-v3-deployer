var response = require('http/v3/response');
var Deployments = require('zeus-deployer/utils/resources/Deployments');
var StatefulSets = require('zeus-deployer/utils/resources/StatefulSets');
var Services = require('zeus-deployer/utils/resources/Services');
var Ingresses = require('zeus-deployer/utils/resources/Ingresses');

var entity = {
    'deployment': {
        'name': 'demo',
        'namespace': 'zeus',
        'application': 'zeus',
        'replicas': 1,
        'containers': [{
            'name': 'dirigible',
            'image': 'dirigiblelabs/dirigible:latest',
            'port': 8080,
            'env': [{
                'name': 'KEYCLOAK_CONFIDENTIAL_PORT',
                'value': 443
            }, {
                'name': 'KEYCLOAK_SSL_REQUIRED',
                'value': 'none'
            }, {
                'name': 'KEYCLOAK_CLIENT_ID',
                'value': 'ide'
            }, {
                'name': 'KEYCLOAK_REALM',
                'value': 'applications'
            }, {
                'name': 'KEYCLOAK_AUTH_SERVER_URL',
                'value': 'https://auth.ingress.dev.promart.shoot.canary.k8s-hana.ondemand.com/auth'
            }]
        }]
    },
    'statefulSet': {
        'name': 'demo',
        'namespace': 'zeus',
        'application': 'demo',
        'replicas': 1,
        'storage': '1Gi',
        'serviceName': 'zeus-http',
        'containers': [{
            'name': 'dirigible',
            'image': 'dirigiblelabs/dirigible:latest',
            'port': 8080,
            'mountPath': '/usr/local/tomcat/dirigible',
            'env': [{
                'name': 'KEYCLOAK_CONFIDENTIAL_PORT',
                'value': 443
            }, {
                'name': 'KEYCLOAK_SSL_REQUIRED',
                'value': 'none'
            }, {
                'name': 'KEYCLOAK_CLIENT_ID',
                'value': 'ide'
            }, {
                'name': 'KEYCLOAK_REALM',
                'value': 'applications'
            }, {
                'name': 'KEYCLOAK_AUTH_SERVER_URL',
                'value': 'https://auth.ingress.dev.promart.shoot.canary.k8s-hana.ondemand.com/auth'
            }]
        }]
    },
    'service': {
        'name': 'demo-http',
        'namespace': 'zeus',
        'application': 'demo',
        'type': 'NodePort',
        'port': 8080
    },
    'ingress': {
        'name': 'demo',
        'namespace': 'zeus',
        'application': 'demo',
        'host': 'demo.ingress.dev.promart.shoot.canary.k8s-hana.ondemand.com',
        'serviceName': 'demo-http',
        'servicePort': 8080
    }
};

var deployment = Deployments.build(entity.deployment);
var statefulSet = StatefulSets.build(entity.statefulSet);
var service = Services.build(entity.service);
var ingress = Ingresses.build(entity.ingress);

response.println(JSON.stringify({
    'deployment': deployment,
    'statefulSet': statefulSet,
    'service': service,
    'ingress': ingress
}));