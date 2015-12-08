(function ($, undefined) {
    $.extend({
        /*跳出訊息*/
        "alert": function (str) { $("#dialog").text(str).dialog({ autoOpen: true, modal: true }); },
        /*取得tCode的明細*/
        "getCode": function (obj) {
            if ($.isEmptyObject(obj)) { $.alert("X1：getCode-obj不存在!!!"); return; }
            if (obj.url == "") { $.alert("X2：getCode-網址資料(objt.url)不存在!!!"); return; }
            if (!$.isFunction(obj.done)) { $.alert("X3：getCode-網址資料(objt.done)不存在!!!"); return; }
            $.post(obj.url, { "cupid": obj.cupid })
                .done(function (d) {
                    if ($.isEmptyObject(d) && d.length <= 0) { $.alert("X4：getCode-無明細資料!!!"); }
                    obj.done(d);
                });
        }
    });
    $.fn.extend({
        /*table設定資料內容
         *  Prop
         *      title   :string,    設定資料表的 Title
         *      data    :json,      資料陣列
         *      th      :[],        文字，以「,」分隔，依序：抬頭文字，資料屬性，資料格式
         *      hidden  :[],        隱藏資料
         *  Func
         *      setTr   :客制資料內的tr
         */
        "tableData": function (obj) {
            return this.each(function () {
                var t = $(this);
                if ($.isEmptyObject(t)) { $.alert("XX：綁定的 Element 不存在!!!"); return; }
                t.empty();
                /*設定資料表的 Title*/
                if (obj.title != "") { t.append("<span class='title'>" + obj.title + "</span>"); }
                var tb = $("<table/>", { "class": "main" }),
                tr = $("<tr/>");
                /*欄位名稱*/
                $(obj.th).each(function (i, e) { tr.append("<th>" + (/,/.test(e) ? e.split(",")[0] : e) + "</th>"); });
                tb.append(tr);
                /*內容*/
                if (obj.data.length <= 0 || $.isEmptyObject(obj.data)) { tb.append("<td colspan='" + obj.th.length + "' class='c'>無資料</td>"); }
                else {
                    $(obj.data).each(function (i, e) {
                        var itr = $("<tr/>");
                        $(obj.th).each(function (ii, ee) {
                            if (/,/.test(ee) && ee.split(",").length > 1) {
                                var iee = ee.split(",");
                                var td = $("<td>", { "name": iee[1] });
                                if (ee.split(",").length > 2) {
                                    switch (iee[2]) {
                                        case "bool":
                                            itr.append(td.addClass("c").append("<input type='checkbox' disabled='disabled' " + (e[iee[1]] ? "checked='checked'" : "") + " />"));
                                            break;
                                        case "num":
                                            str = e[iee[1]].toString();
                                            itr.append(td.addClass("r").append(str.replace(/\./.test(str) ? (/(\d{1,3})(?=(\d{3})+\.)/g) : (/(\d{1,3})(?=(\d{3})+$)/g), "$1,")));
                                            break;
                                        default: itr.append(td.append(e[iee[1]])); break;
                                    }
                                } else { itr.append(td.append(e[iee[1]])); }
                            }
                        });
                        /*客制資料內的tr*/
                        if ($.isFunction(obj.setTr)) { obj.setTr(itr, e); }
                        /*隱藏資料*/
                        if (!$.isEmptyObject(obj.hidden) && obj.hidden.length > 0) {
                            $(obj.hidden).each(function (ii, ee) {
                                itr.find("td:eq(0)").append("<input type='hidden' name='" + ee + "' value='" + e[ee] + "' />");
                            });
                        }
                        tb.append(itr);
                    });
                }
                t.append(tb);
            });
        },
        /*select設定選項*/
        "selecteOpt": function (obj) {
            var t = $(this).empty();
            if (obj.first != "" && obj.first != null) { t.append("<option value=''>" + obj.first + "</option>"); }
            if (!$.isEmptyObject(obj.data) && obj.data.length > 0) {
                $(obj.data).each(function (i, e) {
                    t.append("<option value='" + e[obj.value] + "'>" + e[obj.name] + (obj.name == obj.value ? "" : ("(" + e[obj.value] + ")")) + "</option>");
                });
            }
            t.find("option:eq(0)").prop("selected", "selected");
            return t;
        },
        /*select設定「全部」選項*/
        "selecteAll": function (obj) { return $(this).selecteOpt($.extend({}, obj, { first: "全部" })); },
        /*select設定「請選擇…」選項*/
        "selectePls": function (obj) { return $(this).selecteOpt($.extend({}, obj, { first: "請選擇…" })); },
        /*清除元件的val()的空白*/
        "totrim": function () { return this.each(function () { var t = $(this); t.val($.trim(t.val())); }); },
        /*清除元件的val()的空白，並轉大寫*/
        "totrimupper": function () { return this.each(function () { var t = $(this); t.val($.trim(t.val().toUpperCase())); }); }
    });
})(jQuery);

/*Prpo*/
/*查詢項的a tab被選取用的class*/
var aselect = "hvr-bounce-to-bottom-selected";

$(window).load(function () {
    preloadersec = preloadersec <= 0 ? 500 : preloadersec;
    $('.preloader__img').fadeOut(preloadersec);
    setTimeout(function () { $('.preloader').addClass('active').delay(preloadersec * 2).fadeOut(preloadersec); }, (preloadersec * 2));
    /*a tab選取時class更換*/
    $(".searcher a").click(function () { $(".searcher a").removeClass(aselect); $(this).addClass(aselect); });
    /*ajax 全域設定*/
    $.ajaxSetup({
        "complete": function (d) { $.unblockUI(); },
        "error": function (d) { $("#debug").text(d.responseText); }
    });
    $(document).ajaxStart(function (h) {
        $.blockUI({
            css: {
                border: 'none',
                padding: '15px',
                backgroundColor: '#fff',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: .5,
                color: '#000'
            },
            "message": '<img alt="讀取中…" title="讀取中…" src="/Content/images/loading.gif">讀取中…</div>'
        });
    });
});