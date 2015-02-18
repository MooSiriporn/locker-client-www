angular.module('lockerClient.services', ['ngResource'])

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
    })

    .factory('LockerService', function($q, $resource, $http) {
    	var host = 'http://192.168.100.19:8080';

    	return {
    		login: function(user) {
    			return $http.post(host + '/login', user);
    		},
    		getLockers: function() {
    			return $http.get(host + '/lockers');
    		},
    		reserve: function(locker_logical_id) {
				// TODO: should be more secure in validating input
				return $http.post(host  + '/lockers/' + locker_logical_id + '/reserve');
    		},
    		open: function(locker_logical_id) {
    			return $http.post(host  + '/lockers/' + locker_logical_id + '/open');
    		},
    		close: function(locker_logical_id) {
    			return $http.post(host  + '/lockers/' + locker_logical_id + '/close');
    		},
    		release: function(locker_logical_id) {
    			return $http.post(host  + '/lockers/' + locker_logical_id + '/release');
    		}
    	}

    })

    ;

