var myApp = angular.module('MyApp', ['onsen', 'ui.router']);

myApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        // 初期表示設定
        $urlRouterProvider.otherwise("/");

        // メイン画面(初期表示)
        $stateProvider.state('main', {
            url: '/',
            templateUrl: 'main.html'
        });

        // 各画面
        $stateProvider
            .state('page-A', {
                url: '/pageA',
                templateUrl: 'pageA.html',
    			onEnter: ['$rootScope', function($rootScope) {
					$rootScope.navi.pushPage('pageA.html');
				}]                
            })
            .state('page-A-1', {
                url: '/pageA-1',
                templateUrl: 'pageA-1.html',
				onEnter: ['$rootScope', function($rootScope) {
					$rootScope.navi.pushPage('pageA-1.html');
				}]                
            })
            .state('page-A-1-1', {
                url: '/pageA-1-1',
                templateUrl: 'pageA-1-1.html',
				onEnter: ['$rootScope', function($rootScope) {
					$rootScope.navi.pushPage('pageA-1-1.html');
				}]                
            })
            .state('page-A-1-2', {
                url: '/pageA-1-2',
                templateUrl: 'pageA-1-2.html',
				onEnter: ['$rootScope', function($rootScope) {
					$rootScope.navi.pushPage('pageA-1-2.html');
				}]                
            })
            .state('page-A-2', {
                url: '/pageA-2',
                templateUrl: 'pageA-2.html',
				onEnter: ['$rootScope', function($rootScope) {
					$rootScope.navi.pushPage('pageA-2.html');
				}],
				// 戻ってきた値を受け取る可能性があるため、params指定
				params: {
					sample: null
				}                
            })
            .state('page-A-2-1', {
                url: '/pageA-2-1',
                templateUrl: 'pageA-2-1.html',
    			onEnter: ['$rootScope', function($rootScope) {
					$rootScope.navi.pushPage('pageA-2-1.html');
				}],
				// 引数を受け取る
				params: {
					sample: null
				}
            })
            .state('page-A-2-2', {
                url: '/pageA-2-2',
                templateUrl: 'pageA-2-2.html',
				onEnter: ['$rootScope', function($rootScope) {
					$rootScope.navi.pushPage('pageA-2-2.html');
				}],
				// 引数を受け取る
				params: {
					sample: null
				}                
            })
            // 入れ子
            .state('page-A.page-A-sub1', {
                url: '/pageA/page-A-sub1',
                templateUrl: 'page-A-sub1.html',
				onEnter: ['$rootScope', function($rootScope) {
					$rootScope.navi.pushPage('page-A-sub1.html');
				}]                
            })
            .state('page-A.page-A-sub2', {
                url: '/pageA/page-A-sub2',
                templateUrl: 'page-A-sub2.html',
				onEnter: ['$rootScope', function($rootScope) {
					$rootScope.navi.pushPage('page-A-sub2.html');
				}]                
            })
            ;

    }]);


// 戻る機能のコントローラの割り当て
myApp.controller('BackController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {

    // ツールバーの戻るアイコン押下時の処理
    $scope.backNavi = function() {
        // 戻る処理実行
        console.log("backNavi");
        stateBack($rootScope, $state, null);
    };
    
}]);

// Page2の値受け渡し処理
myApp.controller('PageA2Controller', ['$rootScope', '$scope', '$state', '$stateParams', function($rootScope, $scope, $state, $stateParams) {

	// 値が設定されている場合、スコープに再設定する
	if ($stateParams.sample) {
		$scope.sample = $stateParams.sample;
	}

    // 画面遷移の処理
    $scope.jump = function(to) {
        console.log("jump sample="+ $scope.sample);
        // パラメータ付で次に渡す
        $state.go(to, {"sample": $scope.sample});
    };
}]);

// Page2の値受け取り処理①
myApp.controller('PageA21Controller', ['$rootScope', '$scope', '$state', '$stateParams', function($rootScope, $scope, $state, $stateParams) {

	// 値が設定されている場合、スコープに再設定する
	if ($stateParams.sample) {
		$scope.sample = $stateParams.sample;
	}
}]);

// Page2の値受け取り処理②
myApp.controller('PageA22Controller', ['$rootScope', '$scope', '$state', '$stateParams', function($rootScope, $scope, $state, $stateParams) {
	
	console.log("sample: "+ $stateParams.sample);
	
	// 値が設定されている場合、スコープに再設定する
	if ($stateParams.sample) {		
		if (isNumber($stateParams.sample)) {
			// 数値の場合、計算して表示する
			var num = eval($stateParams.sample);
			$scope.result = num + " * 2 = "+ (num * 2);
		}
		else {
			// 数値以外の場合、エラーメッセージ
			$scope.result = '数値以外が受け渡されました: '+ $stateParams.sample;
		}
	}
}]);

// 数値/数字文字列チェック
function isNumber(x){ 
    if( typeof(x) != 'number' && typeof(x) != 'string' )
        return false;
    else 
        return (x == parseFloat(x) && isFinite(x));
}

// 画面遷移時の処理
myApp.run(['$rootScope', '$transitions', '$state', function($rootScope, $transitions, $state){
    // main 画面への遷移（初期表示）
    $transitions.onSuccess({to: 'main'}, function(trans){
        // main画面読み込み成功

        // 画面スタック初期化
        $rootScope.pages = [];
    });

    // main 画面以外への遷移（初期表示以外）
    $transitions.onBefore({to: function(state){ return state != 'main' }}, function(trans){
        // main以外の場合
        console.log("$transitions.onBefore: "+ trans.$from() +" -> "+ trans.$to() +" / "+ trans.params());

        if (trans.$from() != trans.$to()) {
            // 遷移情報（from→toの両方+パラメータを保持）を画面スタック
            $rootScope.pages.push(trans);

            console.log("push: "+ trans.$to());
        }
    });

    // Android の戻るキー押下時処理
    document.addEventListener("backbutton", function(e){
        // 戻る処理実行（イベントを引き継ぐ）
        console.log("backbutton");
        stateBack($rootScope, $state, e);
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
   
	if ($rootScope.pages.length < 1) {
		// キューがない場合、アプリを終了するか確認する
		ons.notification.confirm({
			title: "終了確認",
			message: "アプリを終了させてもよろしいですか？",
			callback: function(answer) {
				if (answer) {
					navigator.app.exitApp();
				}
			}
		});
		
		return;
	}

    // 現在のステート
    console.log("current: "+ $state.current);
    console.log("current.name: "+ $state.current.name);
    console.log("current.url: "+ $state.current.url);
    console.log("$rootScope.pages.length: "+ $rootScope.pages.length);

    console.log("* * * *"); 

    // 最新の遷移情報（from→toの両方を保持）を取得する
    var nowPage = $rootScope.pages[$rootScope.pages.length - 1];
    // 画面スタックをポップする
    $rootScope.pages.pop();

    console.log("* back: "+ $state.current.name + " => "+ nowPage);
    console.log(nowPage.$from().name);
    console.log(nowPage.params());

    // 最新の遷移情報のfromを元に、戻る方向（前画面）の遷移を実行する
    // パラメータもそのまま再設定する
    $state.go(nowPage.$from().name, nowPage.params());
    // 遷移して追加されたので除去しておく
    $rootScope.pages.pop();

    // 戻る処理実行後のステート
    console.log("current: "+ $state.current);
    console.log("current.name: "+ $state.current.name);
    console.log("current.url: "+ $state.current.url);
    console.log("$rootScope.pages.length: "+ $rootScope.pages.length);
}
