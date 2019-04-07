var Clusters = require("zeus-accounts/data/dao/Deliver/Clusters");

exports.getCredentials = function(clusterId) {
	var cluster = Clusters.get(clusterId);
	return getClusterCredentials(cluster);
};

exports.getDefaultCredentials = function() {
	var cluster = Clusters.list().filter(e => e.IsDefault)[0];
	return getClusterCredentials(cluster);
};

function getClusterCredentials(cluster) {
	return {
		id: cluster.Id,
		server: cluster.API,
		ingress: cluster.Ingress,
		token: cluster.Token,
		namespace: "zeus"
	};
}