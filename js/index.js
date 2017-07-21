function pagingJs(ele,options) {
    var def = {
        length: 0, // 数据总长度
        pageNum: 5, // 显示几页
        amount: 8, // 一页显示几条
    }
    this.set = this.extend({}, def, options);   // 扩展默认参数
    this.targetNode = typeof ele === "string" ? document.querySelector(ele) : ele;
   	this.firstPage = 1;             // 起始页
   	this.lastPage = Math.ceil(this.set.length / this.set.amount);   // 最后一页
   	this.currentPage = 1;    // 当前页
    this.sub(1);     // 生成分页
    this.addHigh(this.currentPage);   // 给当前页添加高量
    this.toggleNode();            // 显示隐藏省略号
    this.bindEvent();             // 绑定事件
}
pagingJs.prototype = {
    constructor: pagingJs,
    bindEvent:function(){
    	var firstNode = this.targetNode.childNodes[0].firstChild,
    		lastNode = this.targetNode.childNodes[0].lastChild;
    	this.targetNode.addEventListener("click",function(e){
    		var event = e || event,
    			target = e.target || event.srcElement;
    		if(!isNaN(target.innerText)){
    			this.sub(target.innerText*1);
    		}else if(target.innerText === "«"){
    			this.currentPage > 1 && (this.sub(--this.currentPage))
    		}else if(target.innerText === "»"){
    			this.currentPage < this.lastPage && (this.sub(++this.currentPage));
    		}
    		this.addHigh(this.currentPage);
    		this.toggleNode();
    	}.bind(this),false);
    },
    addHigh:function(page){
    	this.targetNode.querySelectorAll("li").forEach(function(item){
    		if(item.innerText == page){
    			item.classList.add("high");
    		}else{
    			item.classList.remove("high");
    		}
    	})
    },
    toggleNode:function(){
    	var firstS = this.targetNode.querySelectorAll(".first"),
    		lastS = this.targetNode.querySelectorAll(".last");
    	(this.currentPage >= this.set.pageNum) ? this.addStyle(firstS,"display:block;") : this.addStyle(firstS,"display:none;");
    	(this.firstPage <= this.lastPage - this.set.pageNum) ? this.addStyle(lastS,"display:block;") : this.addStyle(lastS,"display:none;");
    },
    addStyle:function(dom,style){
    	for(var i=0,len=dom.length;i<len;i++){
    		dom[i].style.cssText = style;
    	}
    },
    sub: function(page) {
        if(page > this.lastPage){return}
       	this.firstPage = page >= this.set.pageNum ? page - Math.floor(this.set.pageNum / 2) : 1;
        (this.firstPage > this.lastPage - this.set.pageNum) && (this.firstPage = this.lastPage - this.set.pageNum + 1);
        this.createNode(this.setPage(this.set.length, this.set.amount, this.set.pageNum, this.firstPage),this.lastPage);
        this.currentPage = page;
    },
    createNode:function(pagesNode,lastPage){
    	this.targetNode.innerHTML = "<ul class='nav-list'><li>&laquo;</li><li class='first'>1</li><li class='first'>···</li>"+pagesNode+"<li class='last'>···</li><li class='last'>"+lastPage+"</li><li>&raquo;</li></ul>";
    },
    setPage: function(len, amount, pageNum, firstPage) {
        var pagesNode = "",
            page = Math.ceil(len / amount),
            begin = page <= pageNum ? 1 : firstPage,
            end = page <= pageNum ? page : firstPage + pageNum;
        for (var i = begin; i < end; i++) {
            pagesNode += "<li>"+i+"</li>";
        }
        return pagesNode;
    },
    extend: function() {
        for (var i = 1, len = arguments.length; i < len; i++) {
            for (key in arguments[i]) {
                arguments[0][key] = arguments[i][key];
            }
        }
        return arguments[0];
    }
}