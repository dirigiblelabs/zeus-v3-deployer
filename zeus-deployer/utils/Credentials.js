var Clusters = require('zeus-accounts/data/dao/Deliver/Clusters');

exports.getCredentials = function(clusterId) {
	var credentials = Clusters.get(clusterId);
	return {
		'server': credentials.URL,
		'token': credentials.Token,
		'namespace': 'zeus'
	};
};