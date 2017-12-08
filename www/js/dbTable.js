// テーブル：人物情報
var PersonTableCls = (function () {
    // コンストラクタ
    function PersonTableCls(id, sei, mei, birthday, sex) {
        // 親クラスのコンストラクタ呼び出し
        BaseTableCls.call(this, "PERSON_TBL", id);

        // カラム：姓
		this.col_sei = sei;
		
		// カラム：名
		this.col_mei = mei;
		
		// カラム：生年月日
		this.col_birthday = birthday;
		
		// カラム：性別
		this.col_sex = sex;
    }
    
    // configure prototype
    PersonTableCls.prototype = new BaseTableCls();
    PersonTableCls.prototype.constructor = PersonTableCls;

    return PersonTableCls; // return constructor
})();


var UrlTableCls = (function () {
    // コンストラクタ
    function UrlTableCls(id, name, url) {
        // 親クラスのコンストラクタ呼び出し
        BaseTableCls.call(this, "URL_TBL", id);

        // サブクラス自身のプロパティ
		// カラム：サイト名称
		this.col_name = name;
		
		// カラム：サイトURL
		this.col_url = url;
    }
    
    // configure prototype
    UrlTableCls.prototype = new BaseTableCls();
    UrlTableCls.prototype.constructor = UrlTableCls;

    return UrlTableCls; // return constructor
})();


function BaseTableCls(tableName, id) {
	this.table_name = tableName;
	
	// ID (オートインクリメント用)
	this.col_id = id;
	
	// カラムリストを返す
	this.getColumns = function() {
		var columns = [];
		
		// 自身の中で"col_"から始まるのだけ抽出する
		for (var p in this) {
			if (p.toLowerCase().indexOf("col_") == 0) {
				columns.push(p);
			}
		}
		
		return columns;
	}
	
	// IDを除いたカラムリストを返す
	this.getColumnsIgnoreId = function() {
		var columns = [];
		
		// 自身の中で"col_"から始まるのだけ抽出する
		// ただしIDは除く
		for (var p in this) {
			if (p.toLowerCase().indexOf("col_") == 0 && p.toLowerCase() != "col_id") {
				columns.push(p);
			}
		}
		
		return columns;
	}
	
	// 値リストを返す
	this.getValues = function() {
		var values = [];
		
		// 自身の中で"col_"から始まるのだけ抽出する
		for (var p in this) {
			if (p.toLowerCase().indexOf("col_") == 0) {
				values.push(this[p]);
			}
		}
		
		return values;
	}
	
	// IDを除いた値リストを返す
	this.getValuesIgnoreId = function() {
		var values = [];
		
		// 自身の中で"col_"から始まるのだけ抽出する
		// ただしIDは除く
		for (var p in this) {
			if (p.toLowerCase().indexOf("col_") == 0 && p.toLowerCase() != "col_id") {
				values.push(this[p]);
			}
		}
		
		return values;
	}
	
}



