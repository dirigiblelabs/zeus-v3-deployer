var Deployments = require('kubernetes/apis/apps/v1beta1/Deployments');

exports.deploy = function(templateId) {
	var server = 'https://192.168.99.101:8443';
	var token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IiJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJ6ZXVzIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6InpldXMtdG9rZW4teHZjenYiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiemV1cyIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjQ1ZWFjYWEwLTYyNzYtMTFlOC1iNzAwLTA4MDAyNzVmODhlMSIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDp6ZXVzOnpldXMifQ.ndlt6o8l5-DJc9-jNuY7D4wmJo4AAW2uaNt5eVgu0JMoEo8-4HO0rnDXsE02aw3ueyhLKG2rG-Tn5fLtqqx7Qx40w57mKxhliZLMoGj-0oECNwbN0YVaozs46NSzjBd4cIp1au77mjVjXHE8Sf3lJNVZ7je7Wlqdfd8f3k85lNmI8ON_5pTJX0Vu-G0Ql07qvBSFohn8GqBGNfVipokv9dSAZszofAeO4CwQ2UWAq_hlVoCuERU9oyA0FvZCnIxoe0O9z41X1M7MEViOSYWFFM7zmBdYRt1uCIsjxO0cguv4fgp6I3yAIk7SmYvaV0DHykHdvklmbbtwstcGpuyUag';
	var deploymentsApi = new Deployments(server, token, 'zeus');

	var builder = deploymentsApi.getEntityBuilder();
	builder.getMetadata().setName('test-application');
	builder.getMetadata().setNamespace('zeus');
	builder.getMetadata().setLabels({
		'application': 'zeus-application-test'
	});
	builder.getSpec().getTemplate().getSpec().addContainer({
		'name': 'dirigible',
		'image': 'dirigiblelabs/dirigible-tomcat:latest',
		'ports': [{
			'containerPort': 8080
		}]
	});
	builder.getSpec().setReplicas(1);
	
	var deployment = builder.build();
	return deploymentsApi.create(deployment);
};

exports.undeploy = function(templateId) {
	
};