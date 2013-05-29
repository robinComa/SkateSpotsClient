angular.module('SkateSpots.filters', []).filter('i18n', ['$rootScope', function($rootScope) {
    return function (input) {
        return $rootScope.i18n.get(input);
    };
}]).filter('cloudinary', ['$rootScope', function($rootScope) {
    return function (img, filter) {
    	var transformation = {
    		mini : 'w_40,h_40,c_fill',
    		small : 'w_100,h_100,c_fill',
    		medium : 'w_150,h_150,c_fill',
    		large : 'w_800,h_800,c_fill'
    	};
        return 'http://res.cloudinary.com/diuymnnec/image/upload/'+transformation[filter]+'/'+img+'.jpg';
    };
}]).filter('dateDelta', ['$rootScope', function($rootScope) {
    return function (date) {
		var dateStr = '';
		var MINUTES = 1000*60;
		var HOUR = MINUTES*60;
		var DAY = HOUR*24;
		var MONTH = DAY * 30;
		var YEAR = DAY * 365;
		var delta = (new Date()).getTime() - parseInt(date);
    	if(delta > YEAR){
    		dateStr = Math.floor(new Date(delta) / YEAR) + " " + $rootScope.i18n.get('date.year');
    	}else if(delta > MONTH){
    		dateStr = Math.floor(new Date(delta) / MONTH) + " " + $rootScope.i18n.get('date.month');
    	}else if(delta > DAY){
    		dateStr = Math.floor(new Date(delta) / DAY) + " " + $rootScope.i18n.get('date.day');
    	}else if(delta > HOUR){
    		dateStr = Math.floor(new Date(delta) / HOUR) + " " + $rootScope.i18n.get('date.hour');
    	}else if(delta > MINUTES){
    		dateStr = Math.floor(new Date(delta) / MINUTES) + " " + $rootScope.i18n.get('date.minute');
    	}else{
    		dateStr = $rootScope.i18n.get('date.now');
    	}
        return dateStr;
    };
}]);