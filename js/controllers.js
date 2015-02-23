angular.module('lockerClient.controllers', ['ionic', 'angularMoment', 'angular.filter'])
.constant('angularMomentConfig', { timezone: 'Asia/Bangkok' })

.run(function($ionicPlatform, $ionicPopup) {
    $ionicPlatform.ready(function() {
    	$ionicPopup.alert({ template: navigator.connection.type, okType: 'button-balanced' });
        if(window.Connection) {
            if(navigator.connection.type == Connection.NONE) {
                $ionicPopup.confirm({
                    title: "Internet Disconnected",
                    content: "The internet is disconnected on your device."
                })
                .then(function(result) {
                    if(!result) {
                        ionic.Platform.exitApp();
                    }
                });
            }
        }
	})
})

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		setTimeout(function() {
			navigator.splashscreen.hide();
		}, 1000);
	})
})

.controller('AppCtrl', function($scope, $window, $state) {
	$scope.username = $window.localStorage.username;

	$scope.signout = function() {
		delete $window.localStorage.token;
		delete $window.localStorage.username;
		$state.go('login');
	}
})

.controller('LoginCtrl', function($scope, $http, $window, $state, $ionicPopup, $log, LockerService) {

	// Check if user is authenticated
	if ($window.localStorage.token && $window.localStorage.token != undefined) {
		// If he/she is, then go directrly to lockers screen
		$state.go('app.lockers');
	}

	$scope.signin = function(user) {

		// simple client-side validation
		if (user === undefined ||
			user.username === undefined || user.username == '' ||
			user.password === undefined || user.password == '') {
			$ionicPopup.alert({ template: 'ชื่อผู้ใช้หรือรหัสผ่านเป็นค่าว่าง', okType: 'button-balanced' });
			return;
		}

		LockerService.login(user)
			.success(function(data) {
				$window.localStorage.token = data.token;
				$window.localStorage.username = user.username;
				$state.go('app.lockers');
			})
			.error(function(error) {
				$log.error('เข้าสู่ระยยไม่สำเร็จ', error)
				$ionicPopup.alert({ template: error.message, okType: 'button-balanced' });
			});

	}
})

.controller('HistoryCtrl', function($scope, $state, $log, $ionicScrollDelegate, amMoment, LockerService) {
	amMoment.changeLocale('th');

	LockerService.getHistory().then(
		function(resp) {
			$scope.histories = resp.data;
			$ionicScrollDelegate.scrollBottom();
		},
		function(error) {
			$log.error('ไม่สามรถรับข้อมูลประวัติการใช้งานได้', error);
			$ionicPopup.alert({ template: error.message, okType: 'button-balanced' });
		});
})

.controller('ReservationCtrl', function($scope, $state, $stateParams, $log, $ionicPopup, LockerService) {
	$scope.reserve = function() {
		var locker_logical_id = $stateParams.locker_id;

		LockerService.reserve(locker_logical_id)
			.success(function(data) {
				$state.go('command', {locker_id: locker_logical_id});
			})
			.error(function(error) {
				$log.error('ไม่สามารถจองล็อกเกอร์ได้', error);
				$ionicPopup.alert({ template: error.message, okType: 'button-balanced' });
			});
	}
})


.controller('LockersCtrl', function($scope, $window, $state, $ionicPopup, $log, LockerService) {

	LockerService.getIsUserHasReserved().then(
		function(resp) {
			if (resp.data.is_reserved != 'false') {
				$state.go('command', {locker_id: resp.data.is_reserved});
			}
		},
		function(error) {
			// TODO: should kick user out and check network connectivity
			$log.error('ไ่สามารถตรวจสอบสถานะการจองของผู้ใช้ได้', error);
			$ionicPopup.alert({ template: 'ไ่สามารถตรวจสอบสถานะการจองของผู้ใช้ได้', okType: 'button-balanced' });
		});

	// TODO: Show spinner while loading
	LockerService.getLockers().then(
		function(resp) {
			$scope.lockers = resp.data;
		},
		function(error) {
			$log.error('ไม่สามรถรับข้อมูลล็อกเกอร์ได้', error);
			$ionicPopup.alert({ template: error.message, okType: 'button-balanced' });
		});
})

.controller('LockerCtrl', function($scope, $stateParams) {

})

.controller('CommandCtrl', function($scope, $http, $state, $stateParams, $ionicPopup, $log, LockerService) {

	$scope.showReleaseConfirm = function() {
		var confirmPopup = $ionicPopup.confirm({
			title: 'เลิกใช้ล็อกเกอร์',
			template: 'คุณต้องการเลิกใช้ล็อกเกอร์หมายเลข ' + $stateParams.locker_id + ' หรือไม่?'
		});

		confirmPopup.then(function(ok) {
			if(ok) {
				LockerService.release($stateParams.locker_id)
					.success(function(resp) {
						$log.info('Released #' + $stateParams.locker_id);
						$state.go('app.lockers', {}, {location: 'replace'});
					})
					.error(function(error) {
						$log.error('ไม่สามารลิกใช้ได้', error);
						$ionicPopup.alert({ template: error.message, okType: 'button-balanced' });
					})
			}
		});
	};

	$scope.open = function() {
		LockerService.open($stateParams.locker_id)
			.success(function(resp) {
				$log.info('Open #' + $stateParams.locker_id);
			})
			.error(function(error) {
				$log.error('ไม่สามารถเปิดตู้ได้', error);
				$ionicPopup.alert({ template: error.message, okType: 'button-balanced' });
			})
	};

	$scope.close = function() {
		LockerService.close($stateParams.locker_id)
			.success(function(resp) {
				$log.info('Closed #' + $stateParams.locker_id);
			})
			.error(function(error) {
				$log.error('ไม่สามารถปิดตู้ได้', error);
				$ionicPopup.alert({ template: error.message, okType: 'button-balanced' });
			})
	};

})
