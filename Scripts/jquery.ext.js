(function ($, undefined) {
    $.extend({
        /*跳出訊息*/
        "alert": function (str) { $("#dialog").text(str).dialog({ autoOpen: true, modal: true }); }
    });
    $.fn.extend({
        /*select設定「全部」選項*/
        "selecteAll": function () { return this.each(function () { $(this).html("").append("<option selected='selected'>全部</option>"); }); }
    });
})(jQuery);

$(window).load(function () {
    preloadersec = preloadersec <= 0 ? 500 : preloadersec;
    $('.preloader__img').fadeOut(preloadersec);
    setTimeout(function () { $('.preloader').addClass('active').delay(preloadersec * 2).fadeOut(preloadersec); }, (preloadersec * 2));
    /*ajax 全域設定*/
    $.ajaxSetup({
        "beforeSend": function () {
            var obj = $(".dvbtn");
            obj.children().hide();
            obj.append($("<img />", { id: "load", alt: "讀取中…", title: "讀取中…", src: "/Content/images/loading.gif" }));
        },
        "complete": function (d) {
            $("#load").remove();
            $(".dvbtn").children().show();
        },
        "error": function (d) { $("#debug").text(d.responseText); }
    });
});