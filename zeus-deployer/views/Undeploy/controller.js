angular.module('page', []);
angular.module('page')
.factory('$messageHub', [function(){
	var messageHub = new FramesMessageHub();

	var message = function(evtName, data){
		messageHub.post({data: data}, 'zeus.Explore.Applications.' + evtName);
	};

	var on = function(topic, callback){
		messageHub.subscribe(callback, topic);
	};

	return {
		message: message,
		on: on,
		onApplicationRefresh: function(callback) {
			on('zeus.Explore.Applications.refresh', callback);
		},
		messageEntityModified: function() {
			message('modified');
		},
		messageApplicationsRefresh: function() {
			messageHub.post({data: null}, 'zeus.Explore.Applications.refresh');
		},
		messageContainersRefresh: function() {
			messageHub.post({data: null}, 'zeus.Explore.Containers.refresh');
		},
		messageServicesRefresh: function() {
			messageHub.post({data: null}, 'zeus.Explore.Services.refresh');
		},
		messageEndpointsRefresh: function() {
			messageHub.post({data: null}, 'zeus.Explore.Endpoints.refresh');
		},
		messageVariablesRefresh: function() {
			messageHub.post({data: null}, 'zeus.Explore.Variables.refresh');
		}
	};
}])
.controller('PageController', function ($scope, $http, $messageHub) {

	var api = '/services/v3/js/zeus-deployer/api/Applications.js';
	var applicationOptionsApi = '/services/v3/js/zeus-applications/api/Explore/Applications.js';

	$scope.applicationOptions = [];

	function applicationOptionsLoad() {
		$http.get(applicationOptionsApi)
		.success(function(data) {
			$scope.applicationOptions = data;
		});
	}
	applicationOptionsLoad();

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
		toggleEntityModal();
	};

	$scope.delete = function() {
		$http.delete(api + '/' + $scope.entity.applicationId)
		.success(function(data) {
			$messageHub.messageEntityModified();
			$messageHub.messageApplicationsRefresh();
			$messageHub.messageContainersRefresh();
			$messageHub.messageServicesRefresh();
			$messageHub.messageEndpointsRefresh();
			$messageHub.messageVariablesRefresh();
			toggleEntityModal();
		}).error(function(data) {
			alert(JSON.stringify(data));
		});
			
	};

	$messageHub.onApplicationRefresh(applicationOptionsLoad);

	function toggleEntityModal() {
		$('#entityModal').modal('toggle');
	}
});