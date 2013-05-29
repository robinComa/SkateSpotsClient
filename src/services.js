/** Local static data Services */

angular.module('SkateSpots.services', ['ngResource']).factory('I18n', function($resource){
	return $resource('i18n/:lang.json', {lang:'@lang'});
}).factory('User', function($resource, $rootScope){
	return $resource($rootScope.backend, {'name' : 'user', id: '@id', 'method' : '@method'}, {
		login : {
			method:'GET'
		},
		create : {
			method:'POST'
		},
		getByCoordinatesFrame:{
			method:'POST',
			params : {
				method: 'getByCoordinatesFrame'
			}
		},
		updateBoardInfo : {
			method:'PUT',
			params:{
				method:'updateBoardInfo'
			}
		},
		addCheckIn : {
			method:'PUT',
			params:{
				method:'addCheckIn'
			}
		}
	});
}).factory('Spot', function($resource, $rootScope){
	return $resource($rootScope.backend, {'name' : 'spot', id: '@id', 'method' : '@method'}, {
		getByCoordinates:{
			method:'POST',
			params : {
				method: 'getByCoordinates'
			}
		},
		getByCoordinatesFrame:{
			method:'POST',
			params : {
				method: 'getByCoordinatesFrame'
			}
		},
		create:{
			method:'POST'
		},
		updateDescription:{
			method:'PUT',
			params : {
				method: 'updateDescription'
			}
		},
		createComment:{
			method:'POST',
			params : {
				method: 'createComment'
			}
		},
		deleteComment:{
			method:'PUT',//DELETE doesn't work
			params : {
				method: 'deleteComment'
			}
		},
		like:{
			method:'PUT',
			params : {
				method: 'like'
			}
		}
	});
}).factory('Picture', function($resource, $rootScope){
	return $resource($rootScope.backend, {'name' : '@resource', id: '@id', 'method' : '@method'}, {
		put:{
			method:'PUT'
		}
	});
});