myApp.service('MyDBService', ['$q', '$timeout', function($q, $timeout){
	// サービスで取り扱うテーブル一覧(クラスで管理)
	var TABLES = [
			new PersonTableCls(),
			new UrlTableCls()
		];
	// 初期化時に登録するデータ
	var INITIALIZE = [
			new PersonTableCls(null, "山田", "花子", "2000-12-25", 2),
			new UrlTableCls(null, "モナカプレス", "https://press.monaca.io/")
		];
		
	// テストメソッド
	this.test = function() {
		for (var tbl of TABLES) {
			// テーブルクラス
			console.log(tbl);
			
			// カラムリスト
			console.log(tbl.getColumns());
			
			// IDを除いたカラムリスト
			console.log(tbl.getColumnsIgnoreId());
		}
		
		for (var data of INITIALIZE) {
			console.log(data);
			
			// 値リスト
			console.log(data.getValues());
			
			// IDを除いた値リスト
			console.log(data.getValuesIgnoreId());
		}		
	}
	
	// DBへの接続
	// DBに何らかの処理を行う際には、必ずこれを通す
 	this.connect = function () {
		var deferred = $q.defer();
		
		$timeout(function(){
            console.log('Start connect');
            var db = window.openDatabase("MyDatabase", "", "My Database", 1024 * 1024);

			// バージョン管理付DB
			var M = new Migrator(db);
			// ver.1 (初回生成)
			M.migration(1, function(tx){
				console.log("create db ver.1");
				// テーブル作成 ---------------
				
				for (var id in TABLES) {
					// リストにあるテーブルを作成していく
					var tbl = TABLES[id];
					
					// 一旦既存のがあったら削除する
					var sql = 'DROP TABLE IF EXISTS '+ tbl.table_name;
					console.log(sql);
	                tx.executeSql(sql);
	                
	                // 改めてテーブルを作成する
	                sql = 'CREATE TABLE IF NOT EXISTS '+ tbl.table_name +' (col_id integer primary key autoincrement, '+ tbl.getColumnsIgnoreId().join(',') +')';
					console.log(sql);
	                tx.executeSql(sql);
				}
				
				for (var data of INITIALIZE) {
					console.log(data);
					
					var params = data.getValuesIgnoreId();
					
					// 値の数だけqueryを生成しておく
					var query = [];
					for (var p of params) {
						query.push("?");
					}
					
					// 初期データを投入する
					var sql = 'INSERT INTO '+ data.table_name +' ('+ data.getColumnsIgnoreId().join(',') +') VALUES ('+ query.join(',') +')';
					console.log(sql);
	                tx.executeSql(sql, params);
				}
			});
            
			M.doIt();            
            
            console.log('End connect');
			deferred.resolve(db);
		}, 0);
		
		return deferred.promise;
    };
    
    // 検索条件を元にデータを返す
    // db: conncectで取得したdbクラス
    // condtion: BaseTableClsのサブクラス
    this.select = function(db, condition) {
		var deferred = $q.defer();
		
		var resultList = [];
		
		$timeout(function(){
			db.readTransaction(
                function(tx){
                	console.log("select 開始 TBL="+ condition.table_name);
                	
                	var sql = 'SELECT * FROM '+ condition.table_name;
                	var columns = [];
                	var values = [];
                	
                	// 条件オブジェクトで値が入っているものを条件として加える
                	for (var p in condition) {
						if (p.toLowerCase().indexOf("col_") == 0 && condition[p]) {
							columns.push(p);
							values.push(condition[p]);
						}
                	}
                	
                	var whereSql = "";
                	if ( columns.length > 0 ) {
                		// 条件があった場合、WHERE句追加
                		whereSql = " WHERE ";
                		for (var i = 0; i < columns.length; i++) {
                			if (i > 0) {
                				// 1個以上の場合、AND追加
                				whereSql += " AND ";
                			}
                			whereSql += columns[i] + " = ?";
                		}
                		
                		console.log(whereSql);
                	}
                	
                	sql += whereSql;
                	
                	console.log(sql);
                	
                    tx.executeSql(sql , values
                    	, function(tx, rs){
                    		// 成功時
		                    for (var i = 0; i < rs.rows.length; i++) {
		                        var row = rs.rows.item(i);
		                    	// console.log(row);
		                    	
		                    	// 検索条件のコンストラクタからオブジェクト再生成
		                    	var Const = condition.constructor;
	                    		var data = new Const();
	                    		
	                    		// 検索結果をオブジェクトに設定
		                    	for (var r in row) {
		                    		data[r] = row[r];
		                    	}
		                    	
	                    		console.log(data); 
	                    		
	                    		resultList.push(data);
		                    }                    		
				            
				            console.log("resultList.length: "+ resultList.length);
							deferred.resolve(resultList);
                    	}, function(tx, err) {
                    		// SELECT失敗時
							console.error("select 失敗: TBL="+ condition.table_name);
							console.error(err);
							deferred.resolve(null);
                    	});
                }, 
                function(err){
                    // トランザクション失敗時
					console.error("select TRANSACTION 失敗: TBL="+ condition.table_name);
					console.error(err);
                }, 
                function(){
                    // トランザクション成功時
					console.log("select TRANSACTION 成功: TBL="+ condition.table_name);
                }
			);
		}, 0);
		
		return deferred.promise;
    }
    
    // IDを元に、追加または更新を実行する
    // db: conncectで取得したdbクラス
    // data: BaseTableClsのサブクラス
    this.save = function(db, data) {
		var deferred = $q.defer();
		
		$timeout(function(){
			db.transaction(
                function(tx){
                	console.log("save 開始 TBL="+ data.table_name);
                	
					var params = data.getValuesIgnoreId();
					
					var sql = "";
					if (data.col_id) {
						// IDがある場合、更新
						var columns = data.getColumnsIgnoreId();
						var sets = [];
						
						for (var c of columns) {
							sets.push(c +" = ? ");
						}
						
						sql = 'UPDATE '+ data.table_name +' SET '+ sets.join(',') + " WHERE col_id = "+ data.col_id;
					}
					else {
						// IDがない場合、追加
					
						// 値の数だけqueryを生成しておく
						var query = [];
						for (var p of params) {
							query.push("?");
						}
						
						sql = 'INSERT INTO '+ data.table_name +' ('+ data.getColumnsIgnoreId().join(',') +') VALUES ('+ query.join(',') +')';
					}
			
					console.log(sql);
					console.log(params);						
                	
                    tx.executeSql(sql, params
                    	, function(tx, rs){
                    		// 成功時
							console.log("save executeSql 成功: TBL="+ data.table_name);
							deferred.resolve(true);
                    	}, function(tx, err) {
                    		// 失敗時
							console.error("save executeSql 失敗: TBL="+ data.table_name);
							console.error(err);
                    	});
                }, 
                function(err){
                    // 失敗時
					console.error("save TRANSACTION 失敗: TBL="+ data.table_name);
					console.error(err);
                }, 
                function(){
                    // 成功時
					console.log("save TRANSACTION 成功: TBL="+ data.table_name);
				}
			);
		}, 0);
		
		return deferred.promise;
    }

    // IDを元に、削除を実行する
    // db: conncectで取得したdbクラス
    // data: BaseTableClsのサブクラス
    this.delete = function(db, data) {
		var deferred = $q.defer();
		
		$timeout(function(){
			db.transaction(
                function(tx){
                	console.log("delete 開始 TBL="+ data.table_name);
					
					var sql = 'DELETE FROM '+ data.table_name + " WHERE col_id = ?";
					console.log(sql);
					
					// IDのみを引数とし、SQL実行
                    tx.executeSql(sql, [data.col_id]
                    	, function(tx, rs){
                    		// 成功時
							console.log("delete executeSql 成功: TBL="+ data.table_name);
							deferred.resolve(true);
                    	}, function(tx, err) {
                    		// 失敗時
							console.error("delete executeSql 失敗: TBL="+ data.table_name);
							console.error(err);
                    	});
                }, 
                function(err){
                    // 失敗時
					console.error("delete TRANSACTION 失敗: TBL="+ data.table_name);
					console.error(err);
                }, 
                function(){
                    // 成功時
					console.log("delete TRANSACTION 成功: TBL="+ data.table_name);
				}
			);
		}, 0);
		
		return deferred.promise;
    }
    
}]);

// DBバージョン管理クラス
// 参考: http://blog.maxaller.name/2010/03/html5-web-sql-database-intro-to-versioning-and-migrations/
function Migrator(db){
	var migrations = [];
	this.migration = function(number, func){
		migrations[number] = func;
	};
	var doMigration = function(number){
		if(migrations[number]){
			db.changeVersion(db.version, String(number), function(t){
				migrations[number](t);
				}, function(err){
					if(console.error) console.error("Error!: %o", err);
				}, function(){
					doMigration(number+1);
				});
		}
	};
	this.doIt = function(){
		var initialVersion = parseInt(db.version) || 0;
		try {
			doMigration(initialVersion+1);
		} catch(e) {
			if(console.error) console.error(e);
		}
	}
}

