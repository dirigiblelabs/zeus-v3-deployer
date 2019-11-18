var VirtualServicesApi = require('kubernetes/apis/networking.istio.io/v1alpha3/VirtualServices');
var VirtualServiceBuilder = require('kubernetes/builders/apis/networking.istio.io/v1alpha3/VirtualService');

exports.create = function(server, token, namespace, service) {
	var api = new VirtualServicesApi(server, token, namespace);
	return api.create(service);
};

exports.delete = function(server, token, namespace, name) {
	var api = new VirtualServicesApi(server, token, namespace);
	return api.delete(name);
};

exports.build = function(entity) {
	var builder = new VirtualServiceBuilder();
	builder.getMetadata().setName(entity.name);
	builder.getMetadata().setNamespace(entity.namespace);
	builder.getMetadata().setLabels({
		'zeus-application': entity.application
	});
	builder.getSpec().addGateway("knative-serving/knative-ingress-gateway");
	builder.getSpec().addHost(entity.name + "." + entity.host);
	var httpBuilder = builder.getSpec().getHttpBuilder();
	httpBuilder.addMatch({
        uri: {
            prefix: "/"
        }
    });
    httpBuilder.addRoute({
        destination: {
            host: entity.serviceName + "." + entity.namespace + ".svc.cluster.local",
            port: {
                number: entity.servicePort
            }
        }
    });
	builder.getSpec().addHttp(httpBuilder.build());

	return builder.build();
};