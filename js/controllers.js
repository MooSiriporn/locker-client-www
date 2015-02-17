var host = '192.168.100.19:8080';
angular.module('lockerClient.controllers', ['ionic'])

.controller('AppCtrl', function($scope, $window, $state) {
	$scope.signout = function() {
		delete $window.localStorage.token;
		$state.go('login');
	}
})

.controller('LoginCtrl', function($scope, $http, $window, $state, $ionicPopup) {
	// $scope.isAuthenticated = false;

	if ($window.localStorage.token) {
		$state.go('app.lockers');
	}

	// move to service
	$scope.signin = function(user) {

		if (user === undefined ||
			user.username === undefined || user.username == '' ||
			user.password === undefined || user.password == '') {
			$ionicPopup.alert({ template: 'ชื่อผู้ใช้หรือรหัสผ่านเป็นค่าว่าง', okType: 'button-balanced' });
			return;
		}

		$http.post('http://' + host + '/login', user)
			.success(function(data) {
				$window.localStorage.token = data.token;
				$state.go('app.lockers');
				// $scope.isAuthentic/ated = true;
			})
			.error(function(data) {
				console.log(data);
				$ionicPopup.alert({ template: data.message, okType: 'button-balanced' });
			
				// delete $window.localStorage.token;
			});
	}
})

.controller('ReservationCtrl', function($scope, $http, $stateParams, $state) {
	$scope.locker_logical_id = $stateParams.locker_id;

	// Move to service
	$scope.reserve = function() {
		// TODO: should be more secure in validating input
		$http.post('http://' + host  + '/lockers/' + $scope.locker_logical_id + '/reserve')
		.success(function(data) {
			console.log('/lockers/' + $scope.locker_logical_id + '/command');
			$state.go('command', {locker_id: $scope.locker_logical_id});
			// $location.path('/lockers/' + $scope.locker_logical_id + '/command');
		});
	}
})


.controller('LockersCtrl', function($scope, $window, $state, Lockers) {
	$scope.lockers = Lockers.query();
})

.controller('LockerCtrl', function($scope, $stateParams) {

})

.controller('CommandCtrl', function($scope, $stateParams, $ionicPopup, $http, $state) {
	$scope.locker_logical_id = $stateParams.locker_id;

	$scope.showReleaseConfirm = function() {
		var confirmPopup = $ionicPopup.confirm({
			title: 'เลิกใช้ล็อกเกอร์',
			template: 'คุณต้องการเลิกใช้ล็อกเกอร์หมายเลข ' + $scope.locker_logical_id + ' หรือไม่?'
		});
		// move to service
		confirmPopup.then(function(res) {
			if(res) {
				console.log('You are sure');
				$http.post('http://' + host  + '/lockers/' + $scope.locker_logical_id + '/release')
				.success(function(data) {
					console.log('locker ' + $scope.locker_logical_id + ' released');
					$state.go('app.lockers', {}, {location: 'replace'});
				})
			}
		});
	};

	$scope.open = function() {
		$http.post('http://' + host  + '/lockers/' + $scope.locker_logical_id + '/open')
		.success(function(data) {
			console.log('locker ' + $scope.locker_logical_id + ' opened');
		})
	};

	$scope.close = function() {
		$http.post('http://' + host  + '/lockers/' + $scope.locker_logical_id + '/close')
		.success(function(data) {
			console.log('locker ' + $scope.locker_logical_id + ' closed');
		})
	};

})
