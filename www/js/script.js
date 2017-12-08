var myApp = angular.module('MyApp', ['onsen', 'ui.router']);

myApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('person', {
				url: '/person',
				templateUrl: 'person.html'
			})
			.state('url', {
				url: '/url',
				templateUrl: 'url.html'
			})
		
	}]);

myApp.controller('PersonController', ['$scope', 'MyDBService', function($scope, MyDBService) {
	
	MyDBService.test();
	
	loadList();
	
	// リスト読込処理
	function loadList() {
		// リスト取得
		MyDBService.connect().then(
			function(db) {
				// PERSONテーブルを全件検索
				return MyDBService.select(db, new PersonTableCls());
			}
		).then(
			function(resultList) {
				// 検索結果を画面に設定する
				$scope.results = resultList;
				
				// 一旦初期化
				$scope.person_id = "";
				$scope.person_sei = "";
				$scope.person_mei = "";
				$scope.person_birthday = "";
				$scope.person_sex = "";
			}
		);
	};
	
	// 保存ボタン押下時処理
	$scope.save = function() {
		var data = new PersonTableCls($scope.person_id, $scope.person_sei, $scope.person_mei, $scope.person_birthday, $scope.person_sex);
		console.log(data);

		// 登録実行
		MyDBService.connect().then(
			function(db) {
				return MyDBService.save(db, data);
			}
		).then(
			function(result) {
				console.log("result = "+ result);
				if (result) {
					// 保存成功したら、リスト再読み込み
					loadList();
				}
				else {
					// 保存失敗
					ons.notification.alert("保存失敗");
				}
			}
		);
	}
	
	// 削除ボタン押下時処理
	$scope.delete = function() {
		var data = new PersonTableCls($scope.person_id, $scope.person_sei, $scope.person_mei, $scope.person_birthday, $scope.person_sex);
		console.log(data);

		// 登録実行
		MyDBService.connect().then(
			function(db) {
				return MyDBService.delete(db, data);
			}
		).then(
			function(result) {
				console.log("result = "+ result);
				if (result) {
					// 削除成功したら、リスト再読み込み
					loadList();
				}
				else {
					// 削除失敗
					ons.notification.alert("保存失敗");
				}
			}
		);
	}
	
	$scope.search = function() {
		var condition = new PersonTableCls(null, $scope.person_sei, $scope.person_mei, $scope.person_birthday, $scope.person_sex);
		console.log(condition);

		// リスト取得
		MyDBService.connect().then(
			function(db) {
				// PERSONテーブルを条件指定検索
				return MyDBService.select(db, condition);
			}
		).then(
			function(resultList) {
				// 検索結果を画面に設定する
				$scope.results = resultList;
				
				// 一旦初期化
				$scope.person_id = "";
				$scope.person_sei = "";
				$scope.person_mei = "";
				$scope.person_birthday = "";
				$scope.person_sex = "";
			}
		);		
	}
	
	// リスト項目押下時
	$scope.modify = function(r) {
		// 入力フォームに値設定
		$scope.person_id = r.col_id;
		$scope.person_sei = r.col_sei;
		$scope.person_mei = r.col_mei;
		$scope.person_birthday = r.col_birthday;
		$scope.person_sex = r.col_sex;
	}
	
}]);




myApp.controller('UrlController', ['$scope', 'MyDBService', function($scope, MyDBService) {
	
	MyDBService.test();
	
	loadList();
	
	// リスト読込処理
	function loadList() {
		// リスト取得
		MyDBService.connect().then(
			function(db) {
				// URLテーブルを全件検索
				return MyDBService.select(db, new UrlTableCls());
			}
		).then(
			function(resultList) {
				// 検索結果を画面に設定する
				$scope.results = resultList;
				
				// 一旦初期化
				$scope.url_id = "";
				$scope.url_name = "";
				$scope.url_url = "";
			}
		);
	};
	
	// 保存ボタン押下時処理
	$scope.save = function() {
		var data = new UrlTableCls($scope.url_id, $scope.url_name, $scope.url_url);
		console.log(data);

		// 登録実行
		MyDBService.connect().then(
			function(db) {
				return MyDBService.save(db, data);
			}
		).then(
			function(result) {
				console.log("result = "+ result);
				if (result) {
					// 保存成功したら、リスト再読み込み
					loadList();
				}
				else {
					// 保存失敗
					ons.notification.alert("保存失敗");
				}
			}
		);
	}
	
	// 削除ボタン押下時処理
	$scope.delete = function() {
		var data = new UrlTableCls($scope.url_id, $scope.url_name, $scope.url_url);
		console.log(data);

		// 登録実行
		MyDBService.connect().then(
			function(db) {
				return MyDBService.delete(db, data);
			}
		).then(
			function(result) {
				console.log("result = "+ result);
				if (result) {
					// 削除成功したら、リスト再読み込み
					loadList();
				}
				else {
					// 削除失敗
					ons.notification.alert("保存失敗");
				}
			}
		);
	}
	
	$scope.search = function() {
		var condition = new UrlTableCls(null, $scope.url_name, $scope.url_url);
		console.log(condition);

		// リスト取得
		MyDBService.connect().then(
			function(db) {
				// URLテーブルを条件指定検索
				return MyDBService.select(db, condition);
			}
		).then(
			function(resultList) {
				// 検索結果を画面に設定する
				$scope.results = resultList;
				
				// 一旦初期化
				$scope.url_id = "";
				$scope.url_name = "";
				$scope.url_url = "";
			}
		);		
	}
	
	// リスト項目押下時
	$scope.modify = function(r) {
		// 入力フォームに値設定
		$scope.url_id = r.col_id;
		$scope.url_name = r.col_name;
		$scope.url_url = r.col_url;
	}
	
}]);











