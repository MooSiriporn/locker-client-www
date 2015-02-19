angular.module('lockerClient', ['ionic', 'lockerClient.controllers', 'lockerClient.services'])
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
	$httpProvider.interceptors.push('AuthInterceptor');
	$stateProvider

	.state('app', {
		url: "/app",
		abstract: true,
		templateUrl: "templates/menu.html",
		controller: 'AppCtrl'
	})

	.state('login', {
		url: "/login",
		templateUrl: "templates/login.html",
		controller: "LoginCtrl"
	})

	.state('app.lockers', {
		url: "/lockers",
		views: {
			'menuContent' :{
				templateUrl: "templates/lockers.html",
				controller: 'LockersCtrl'
			}
		}
	})

	.state('app.history', {
		url: "/lockers/history",
		views: {
			'menuContent' :{
				templateUrl: "templates/history.html",
				controller: 'HistoryCtrl'
			}
		}
	})

	.state('app.reservation', {
		url: "/lockers/:locker_id/reserve",
		views: {
			'menuContent' :{
				templateUrl: "templates/reservation.html",
				controller: 'ReservationCtrl'
			}
		}
	})

	.state('command', {
		url: "/lockers/:locker_id/command",
		templateUrl: "templates/command.html",
		controller: 'CommandCtrl'
	});

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});

