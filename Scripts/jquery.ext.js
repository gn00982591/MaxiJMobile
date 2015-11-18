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