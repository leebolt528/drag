function tableMove(tableMoveId, mouseType) {
    //整体的元素选择器
    var includeTableMoveId = tableMoveId + ' ';
    //监听事件的jQuery对象
    var liDom = $(includeTableMoveId + '.ul .block .li');
    //移动事件所用的jQuery对象
    var moveDiv = $(includeTableMoveId + '#moveDiv');
    var coverDiv = $(includeTableMoveId + '#cover');
    //监听悬浮事件所用的jQuery对象
    var listLineDiv = $(includeTableMoveId + '.list-line.point-events');
    var blockDom = $(includeTableMoveId + '.ul .block');
    var body = $(tableMoveId);
    var offsetLeft = 0;
    var offsetTop = 0;
    var curLiDom = null;
    var preRowsDom = null;
    var afterRowsDom = null;
    var moving = false; //判断是否启用事件
    var count; //点击时该行块的个数
    var innerStatus; //是否进入多块行
    //步骤监听事件
    liDom.bind(mouseType, function(e) {
        offsetFuc();
        moving = true;
        moveDiv.empty().append($(this).clone()).css("display", "block");
        changePosition(e);
        body.addClass("active");
        count = $(this).parent().siblings().length;
        if (count == 0) {
            curLiDom = $(this).parent().parent().addClass("absolute");
            afterRowsDom = curLiDom.nextAll(".list-line:eq(0)").addClass("higher");
            preRowsDom = curLiDom.prevAll(".list-line:eq(0)").removeClass("point-events");
        } else {
            curLiDom = $(this).parent().addClass("absolute").after("<div class='block frame'></div>");
        }
        listLineDiv.bind("mouseenter", function(e) {
            if (!moving) {
                return;
            } else {
                innerStatus = false;
                mouseEnterList(this, e);
            }
        });
        blockDom.bind("mouseenter", function(e) {
            if (!moving) {
                return;
            } else {
                innerStatus = true;
                mouseEnterBlock(this, e);
            }
        });
    });
    body.bind("mousemove", function(e) {
        changePosition(e);
    });
    $(document).bind("mouseup", function() {
        listLineDiv.removeClass("higher");
        $(".frame").remove();
        if (innerStatus) {
            if (afterRowsDom != null && curLiDom != null) {
                if (count == 0) {
                    afterRowsDom.after(curLiDom.children(".block"));
                    curLiDom.remove();
                    preRowsDom.remove();
                } else {
                    afterRowsDom.after(curLiDom);
                }
            }
        } else {
            if (afterRowsDom != null && curLiDom != null) {
                if (count == 0) {
                    afterRowsDom.before(preRowsDom.addClass("point-events"));
                    afterRowsDom.before(curLiDom);
                } else {
                    afterRowsDom.before(curLiDom);
                    curLiDom.wrap("<div class='rows'></div>").parent().before("<div class='list-line point-events'></div>");
                    listLineDiv = $(includeTableMoveId + '.list-line.point-events');
                }
            }
        }
        initAttr();
    });
    var offsetFuc = function() {
        offsetLeft = body.offset().left;
        offsetTop = body.offset().top;
    }
    var changePosition = function(e) {
        var yy = e.pageY - offsetTop;
        moveDiv.css("top", yy - moveDiv.height() / 2);
        var xx = e.pageX - offsetLeft;
        moveDiv.css("left", xx - moveDiv.width() / 2);
    }
    var mouseEnterList = function(dom, ee) {
        $(".frame").remove();
        if (afterRowsDom != null) {
            afterRowsDom.removeClass("higher");
        }
        afterRowsDom = $(dom).addClass("higher");
    }
    var mouseEnterBlock = function(dom, ee) {
        $(".frame").remove();
        if (afterRowsDom != null) {
            afterRowsDom.removeClass("higher");
        }
        $(dom).after("<div class='block frame'></div>");
        afterRowsDom = $(dom);
    }
    var initAttr = function() {
        curLiDom = null;
        preRowsDom = null;
        afterRowsDom = null;
        moving = false;
        liDom.removeClass("hover").parent().removeClass("absolute");
        liDom.removeClass("hover").parent().parent().removeClass("absolute");
        moveDiv.css("display", "none");
        body.removeClass("active");
    }
}