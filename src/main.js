function MainCtrl ($scope, $rootScope) {
	
	var domain = 'www.mygeopostcard.com';
	if(window.location.toString().match('localhost')){
		domain = 'localhost\\:8081';
	}
	$rootScope.backend = 'http://' + domain+'/SkateSpotsRESTfulServer/resource/:name/:method/:id/';
	
	$scope.closeAlert = function(){
		$rootScope.alert = {
			show : false,
			type : '',
			title : '',
			description : ''
		};
	};
}