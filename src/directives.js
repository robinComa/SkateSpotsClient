angular.module('SkateSpots.directives', []).directive('butterbar', ['$http',
    function($http) {
        return {
            link: function(scope, element, attrs) {
            	$http.defaults.transformRequest.push(function (data) {
            		element.html('<i class="icon-download-alt"> </i>');
                    return data;
                });
                $http.defaults.transformResponse.push(function(data){ 
                    element.html('<i class="icon-refresh"> </i>');
                    return data;
                })
            }
        };
    }
]);