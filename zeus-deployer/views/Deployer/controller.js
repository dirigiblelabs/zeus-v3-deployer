angular.module('page', []);
angular.module('page')
.factory('$messageHub', [function(){
	var messageHub = new FramesMessageHub();

	var message = function(evtName, data){
		messageHub.post({data: data}, 'zeus.zeus-deployer.Applications.' + evtName);
	};

	var on = function(topic, callback){
		messageHub.subscribe(callback, topic);
	};

	return {
		message: message,
		on: on,
		onClusterModified: function(callback) {
			on('zeus.zeus-accounts.Clusters.modified', callback);
		},
		onTemplateModified: function(callback) {
			on('zeus.zeus-templates.Templates.modified', callback);
		}, 
		messageEntityModified: function() {
			message('modified');
		}
	};
}])
.controller('PageController', function ($scope, $http, $messageHub) {

	var api = '/services/v3/js/zeus-deployer/api/Applications.js';
	var clusterOptionsApi = '/services/v3/js/zeus-accounts/api/Clusters.js';
	var templateOptionsApi = '/services/v3/js/zeus-templates/api/Templates.js';

	$scope.clusterOptions = [];

	function clusterOptionsLoad() {
		$http.get(clusterOptionsApi)
		.success(function(data) {
			$scope.clusterOptions = data;
		});
	}
	clusterOptionsLoad();

	function templateOptionsLoad() {
		$http.get(templateOptionsApi)
		.success(function(data) {
			$scope.templateOptions = data;
		});
	}
	templateOptionsLoad();

	$scope.openNewDialog = function() {
		$scope.actionType = 'new';
		$scope.entity = {};
		toggleEntityModal();
	};

	$scope.openEditDialog = function(entity) {
		$scope.actionType = 'update';
		$scope.entity = entity;
		toggleEntityModal();
	};

	$scope.openDeleteDialog = function(entity) {
		$scope.actionType = 'delete';
		$scope.entity = entity;
		toggleEntityModal();
	};

	$scope.close = function() {
		load();
		toggleEntityModal();
	};

	$scope.create = function() {
		$http.post(api, JSON.stringify($scope.entity))
		.success(function(data) {
			toggleEntityModal();
			$messageHub.messageEntityModified();
		}).error(function(data) {
			alert(JSON.stringify(data));
		});
			
	};

	$messageHub.onClusterModified(clusterOptionsLoad);
	$messageHub.onTemplateModified(templateOptionsLoad);

	function toggleEntityModal() {
		$('#entityModal').modal('toggle');
	}
});