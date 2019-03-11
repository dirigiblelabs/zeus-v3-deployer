var Clusters = require('zeus-accounts/data/dao/Deliver/Clusters');

exports.getCredentials = function(clusterId) {
	var cluster = Clusters.get(clusterId);
	return {
		'server': cluster.API,
		'ingress': cluster.Ingress,
		'token': cluster.Token,
		'namespace': 'zeus'
	};
};