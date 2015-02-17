angular.module('lockerClient.services', ['ngResource'])

    .factory('Lockers', function($resource) {
        return $resource('http://192.168.100.19:8080/lockers');
    })

    .factory('AuthInterceptor', function($rootScope, $q, $window, $location) {
    	return {
    		request: function(config) {
    			config.headers = config.headers || {};
    			if ($window.localStorage.token) {
    				config.headers.Authorization = "Bearer " + $window.localStorage.token;
    			}
    			return config;
    		},
    		responseError: function(response) {
    			if (response.status === 401) {
        			// handle the case where the user is not authenticated
        			$location.path('/login');
        			return $q.reject(response);
    			} else {
    				return $q.reject(response);
    			}
    		}	
    	};
    });

