(function ($, undefined) {
    $.fn.extend({
        /*select設定「全部」選項*/
        "selecteAll": function () { return this.each(function () { $(this).html("").append("<option selected='selected'>全部</option>"); }); }
    });
})(jQuery);