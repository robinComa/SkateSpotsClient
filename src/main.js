function MainCtrl ($scope, $rootScope, $route) {
	
	var domain = 'www.mygeopostcard.com';
	if(window.location.toString().match('localhost_')){
		domain = 'localhost\\:8081';
	}
	$rootScope.backend = 'http://' + domain+'/SkateSpotsRESTfulServer/resource/:name/:method/:id/';
	
	$scope.refresh = function(){
		$route.reload();
		return false;
	};
	
	$scope.closeAlert = function(){
		$rootScope.alert = {
			show : false,
			type : '',
			title : '',
			description : ''
		};
	};
}