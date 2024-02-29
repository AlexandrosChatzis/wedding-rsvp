jQuery(document).ready(function ($) {
  $(".form-group input").each(function () {
    var $input = $(this);
    var $customPlaceholder = $input.parent().find(".jsCustomPlaceholder");

    if ($customPlaceholder) {
      $input.on("input change", function (e) {
        var $text = $(e.target).val();

        if ($text) {
          $customPlaceholder.addClass("on-top");
        } else {
          $customPlaceholder.removeClass("on-top");
        }
      });

      $input.trigger("change"); // 20220518D
    }
  });
});
