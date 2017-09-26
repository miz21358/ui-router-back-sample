var myApp = angular.module('MyApp', ['onsen', 'ui.router']);

myApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        // 初期表示設定
    	$urlRouterProvider.otherwise("/");

		// メイン画面(初期表示)
		$stateProvider.state('main', {
			url: '/',
			templateUrl: "main.html"
		});

        // 各画面
		$stateProvider
			.state('page-A', {
				url: '/pageA',
				templateUrl: 'pageA.html'
			})
            .state('page-A-1', {
    			url: '/pageA-1',
				templateUrl: 'pageA-1.html'
			})
            .state('page-A-1-1', {
    			url: '/pageA-1-1',
				templateUrl: 'pageA-1-1.html'
			})
            .state('page-A-1-2', {
    			url: '/pageA-1-2',
				templateUrl: 'pageA-1-2.html'
			})
            .state('page-A-2', {
    			url: '/pageA-2',
				templateUrl: 'pageA-2.html'
			})
            .state('page-A-2-1', {
    			url: '/pageA-2-1',
				templateUrl: 'pageA-2-1.html'
			})
            .state('page-A-2-2', {
    			url: '/pageA-2-2',
				templateUrl: 'pageA-2-2.html'
			})

	}]);


// ツールバーのコントローラの割り当て
myApp.controller('BackController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
    
	$scope.backNavi = function() {
		console.log("backNavi");
		stateBack($rootScope, $state, null);
	};	

}]);

// 画面遷移時の処理
myApp.run(['$rootScope', '$transitions', '$state', function($rootScope, $transitions, $state){
    // main 画面への遷移（初期表示）
    $transitions.onSuccess({to: 'main'}, function(trans){
		// インデックスページ読み込み成功
		
		// ページスタック初期化
		$rootScope.pages = [];
	});
	
    // main 画面以外への遷移（初期表示以外）
	$transitions.onBefore({to: function(state){ return state != 'main' }}, function(trans){
		// main以外の場合
		console.log("$transitions.onBefore: "+ trans.$from() +" -> "+ trans.$to() +" / "+ trans.params());
		
		if (trans.$from() != trans.$to()) {
			// ページスタック
			$rootScope.pages.push(trans);
			
			console.log("push: "+ trans.$to());
		}
	});
	
    // Android の戻るキー押下時処理
	document.addEventListener("backbutton", function(e){
		console.log("backbutton");
		stateBack($rootScope, $state, e)
	}, false);
	
}]);
	

// 戻る処理
var stateBack = function($rootScope, $state, e) {
    console.log("--------------------------");
	
	console.log("stateBack: $root="+ $rootScope +", $state="+ $state + ", e="+ e);
	
	if (e != null) {
		// イベントがある場合は一旦止める
		e.preventDefault();
	}
	
	// ステートを変更する
	console.log("current: "+ $state.current);
	console.log("current.name: "+ $state.current.name);
	console.log("current.url: "+ $state.current.url);
	console.log("$rootScope.pages.length: "+ $rootScope.pages.length);
	
	console.log("* * * *");	
	
	if ($rootScope.pages.length < 1) {
		// キューが1件のみの場合、アプリを終了する
		navigator.app.exitApp();
	}
	else {
		// 最新の遷移情報を取得する
		var current = $rootScope.pages[$rootScope.pages.length - 1];
		// ページスタックをポップする
		$rootScope.pages.pop();
		
    	console.log("* back: "+ $state.current.name + " => "+ current);
		
		// 戻る方向の遷移させる（パラメータも設定する）
		$state.go(current.$from().name, current.$from().params);
		// 遷移して追加されたので除去しておく
		$rootScope.pages.pop();
		
		console.log("current: "+ $state.current);
		console.log("current.name: "+ $state.current.name);
		console.log("current.url: "+ $state.current.url);
		console.log("$rootScope.pages.length: "+ $rootScope.pages.length);
	}
}
