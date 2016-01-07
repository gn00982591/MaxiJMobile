(function ($, undefined) {
    $.extend({
        /*跳出訊息*/
        "alert": function (str) { $("#dialog").text(str).dialogopen(); },
        /*取得tCode的明細*/
        "getCode": function (obj) {
            if ($.isEmptyObject(obj)) { $.alert("X1：getCode-obj不存在!!!"); return; }
            if (!$.isFunction(obj.done)) { $.alert("X3：getCode-網址資料(objt.done)不存在!!!"); return; }
            $.post("/Select/getCodeEnable", { "cupid": obj.cupid })
                .done(function (d) {
                    if ($.isEmptyObject(d) && d.length <= 0) { $.alert("X4：getCode-無明細資料!!!"); }
                    obj.done(d);
                });            
        },
        /*input不可空白*/
        "isNoneEmpty": function (o) {
            var lii = o.totrim().css("background-color", "white")
                .filter(function (i) { return $(this).val() == ""; });
            if (lii.length) {
                lii.css("background-color", "yellow");
                $.alert("X1：每個欄位皆為必填欄位!!!"); return true;
            }
            return false;
        },
        /*取得正在運作的子頁tab*/
        "getTabId": function () { return $(".searcher a").filter(function () { return $(this).hasClass(aselect); }).prop("id"); }
    });
    $.fn.extend({
        /*table設定資料內容
         *  Prop
         *      title   :string,    設定資料表的 Title
         *      data    :json,      資料陣列
         *      th      :[],        資料內容處理
         *          n   :string,    表格抬頭文字
         *          v   :string,    資料內容的col
         *          t   :string,    資料格式，或產生形式
         *          f   :function,  資料格式內，對應指定產生形式而綁定執行功能
         *      hidden  :[],        隱藏資料
         *      ths     :{},        資料內容分二階處理
         *          k   :string,    第一層的主索引
         *          v   :string,    主索引取出的數值    
         *          pk  :string,    主索引
         *          fk  :string,    對應主索引的外部索引
         *          th  :[],        設定方式與 Prop 的 th 相同
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
                $(obj.th).each(function (i, e) { tr.append("<th>" + e.n + "</th>"); });
                tb.append(tr);
                /*內容*/
                if (obj.data.length <= 0 || $.isEmptyObject(obj.data)) { tb.append("<td colspan='" + obj.th.length + "' class='c'>無資料</td>"); }
                else {
                    function setLast(e, th, t) {
                        var itr = $("<tr/>");
                        $(th).each(function (ii, ee) {
                            var td = $("<td>", { "name": ee.v });
                            switch (ee.t) {
                                case "bool":
                                    td.addClass("c").append("<input type='checkbox' disabled='disabled' " + (e[ee.v] ? "checked='checked'" : "") + " />");
                                    break;
                                case "bool-lab":
                                    td.addClass("c").append("<input type='checkbox' disabled='disabled' " + (e[ee.v] ? "checked='checked'" : "") + " />" + ee.n);
                                    break;
                                case "bool-select":
                                    var inpuname = "isselect";
                                    td.addClass("c").append($("<input>", { "type": "checkbox", "name": inpuname }).click(function () {
                                        var isc = $(this).prop("checked");
                                        $("input[name='" + inpuname + "']:checked").prop("checked", false);
                                        $(this).prop("checked", isc);
                                        if ($.isFunction(ee.f)) { ee.f(e); }
                                    }));
                                    break;
                                case "num":
                                    str = e[ee.v].toString();
                                    td.addClass("r").append(str.replace(/\./.test(str) ? (/(\d{1,3})(?=(\d{3})+\.)/g) : (/(\d{1,3})(?=(\d{3})+$)/g), "$1,"));
                                    break;
                                case "btn":
                                    var btn = $("<button/>").text(ee.n).click(function () { if ($.isFunction(ee.f)) { ee.f(e, btn); } });
                                    if (ee.elename != null && ee.elename != "") { btn.prop("name", ee.elename); }
                                    td.addClass("c").append(btn);
                                    break;
                                case "txt-c": td.addClass("c").append(e[ee.v]); break;
                                case "txt-most":
                                    var cstr = 5;
                                    if (e[ee.v] != "" && e[ee.v].length > cstr) {
                                        td.removeProp("name").addClass("pointer").click(function () { $.alert(e[ee.v]); })
                                            .append("<input type='hidden' name='" + ee.v + "' value='" + e[ee.v] + "' />")
                                            .append(e[ee.v].substr(0, cstr) + "...");
                                    } else { td.append(e[ee.v]); }
                                    break;
                                case "other":
                                    //使用bind來綁定func
                                    break;
                                default: td.append(e[ee.v]); break;
                            }
                            itr.append(td);
                        });
                        switch (t) {
                            case 1:
                                itr.find("td").css({ "background-color": "#7495f4", "color": "#fff" });
                                itr.find("td:last").prop("colspan", obj.th.length - obj.ths.th).addClass("l");
                                break;
                        }
                        /*客制資料內的tr*/
                        if ($.isFunction(obj.setTr)) { obj.setTr(itr, e); }
                        /*隱藏資料*/
                        if (!$.isEmptyObject(obj.hidden) && obj.hidden.length > 0) {
                            $(obj.hidden).each(function (ii, ee) { itr.find("td:eq(0)").append("<input type='hidden' name='" + ee + "' value='" + e[ee] + "' />"); });
                        }
                        return itr;
                    }
                    /*一般資料呈現*/
                    if ($.isEmptyObject(obj.ths)) { $(obj.data).each(function (i, e) { tb.append(setLast(e, obj.th)); }); }
                    else {
                        if ($.isEmptyObject(obj.ths.v)) {
                            var kli = [], kliup = [];
                            for (var i in obj.data) {
                                if ($.inArray(obj.data[i][obj.ths.k], kliup) < 0) {
                                    kli.push(obj.data[i]);
                                    kliup.push(obj.data[i][obj.ths.k]);
                                }
                            }
                            for (var i in kli) {
                                tb.append(setLast(kli[i], obj.ths.th, 1));
                                $(obj.data).filter(function () { return kli[i][obj.ths.k] == this[obj.ths.k]; }).each(function (x, y) {
                                    tb.append(setLast(y, obj.th));
                                });
                            }
                        } else {
                            $(obj.data).filter(function () { return this[obj.ths.k] == obj.ths.v; }).each(function (i, e) {
                                /*有層階式呈現-第一層*/
                                tb.append(setLast(e, obj.ths.th, 1));
                                /*有層階式呈現-第二層*/
                                $(obj.data).filter(function () { return e[obj.ths.pk] == this[obj.ths.fk] && this[obj.ths.fk] != obj.ths.v; }).each(function (x, y) {
                                    tb.append(setLast(y, obj.th));
                                });
                            });
                        }
                    }
                }
                t.css("vertical-align", "top").append(tb);
            });
        },
        "charts": function (obj) {
            var t = $(this);
            if ($.isEmptyObject(t)) { $.alert("XX：綁定的 Element 不存在!!!"); return; }
            if (obj.data.length <= 0 || $.isEmptyObject(obj.data)) { tb.append("<div class='w c'>無資料</div>"); }
            Highcharts.getOptions().plotOptions.pie.colors = (function () {
                var colors = [], base = Highcharts.getOptions().colors[0], i;
                for (i = 0; i < 30; i += 1) { colors.push(Highcharts.Color(base).brighten((i - 3) / 7).get()); }
                return colors;
            }());
            $(this).highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: 0,
                    plotShadow: false,
                    borderRadius: 10,
                    width: 400,
                    height: 200
                },
                title: {
                    text: obj.title,
                    align: 'center',
                    verticalAlign: 'middle',
                    y: 70
                },
                tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' },
                credits: { enabled: false },  /*隱藏官方連結*/
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            distance: 0,
                            style: { fontWeight: 'bold', color: 'white', textShadow: '0px 1px 2px black' }
                        },
                        startAngle: -90,
                        endAngle: 90,
                        center: ['50%', '75%']
                    }
                },
                series: [{
                    type: 'pie',
                    name: '佔比',
                    innerSize: '30%',
                    data: obj.data
                }]
            });
        },
        /*dialog*/
        "dialogopen": function () { $(this).dialog({ autoOpen: true, modal: true, width: "auto" }); return $(this); },
        /*datepicker*/
        "datepickeropen": function () {
            $(this).datepicker({
                showOtherMonths: true,
                selectOtherMonths: true,
                changeMonth: true,
                changeYear: true,
                dateFormat: "yy/mm/dd"
            });
            return $(this);
        },
        /*select tCode*/
        "selecteCode": function (dx) { $(this).selecteOpt({ "data": dx, "value": "cKey", "name": "cDesc" }); return $(this); },
        /*select設定選項*/
        "getCodeOpt": function (obj) {
            var $t = $(this).empty();
            $.getCode({
                "cupid": obj.cupid,
                "done": function (dx) {
                    $t.selecteCode(dx);
                    if ($.isFunction(obj.done)) { obj.done(dx); }
                }
            });
            return $t;
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