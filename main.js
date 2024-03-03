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

      $input.trigger("change");
    }
  });

  if ($("input[type='radio'][name='presence']:checked").val() === "yes") {
    $(".rsvp-question").attr("disabled", false);
    $("input[name='companion_presence']").attr("disabled", false);
    $("input[name='companion_name']").attr("disabled", false);
  } else {
    $("input[name='companion_presence']").attr("disabled", true);
    $("input[name='companion_name']").attr("disabled", true);
  }

  if (
    $("input[type='radio'][name='companion_presence']:checked").val() === "yes"
  ) {
    $("input[name='companion_name']").attr("required", true);
    $("input[name='companion_name']").attr("disabled", false);
  } else {
    $("input[name='companion_name']").attr("required", false);
    $("input[name='companion_name']").attr("disabled", true);
  }

  $("input[type='radio'][name='presence']").on("change", function () {
    if ($(this).val() === "yes") {
      const companionName = $("input[name='companion_name']");
      const companionPresence = $("input[name='companion_presence']:checked");
      $("input[name='companion_presence']").attr("disabled", false);
      if (companionPresence.val() === "yes")
        companionName.attr("disabled", false);
    } else {
      $("input[name='companion_presence']").attr("disabled", true);
      $("input[name='companion_name']")
        .attr("disabled", true)
        .parent()
        .find(".jsCustomPlaceholder")
        .removeClass("on-top");
      $("input[name='companion_name']").attr("required", false).val("");
    }
  });

  $("input[type='radio'][name='companion_presence']").on("change", function () {
    if ($(this).val() === "yes") {
      $("input[name='companion_name']").attr("disabled", false);
      $("input[name='companion_name']").attr("required", true);
    } else {
      $("input[name='companion_name']")
        .attr("disabled", true)
        .parent()
        .find(".jsCustomPlaceholder")
        .removeClass("on-top");
      $("input[name='companion_name']").attr("required", false).val("");
    }
  });

  $("input").on("invalid", function (event) {
    if (event.target.validity.valueMissing) {
      event.target.setCustomValidity($(this).attr("title"));
    }
  });

  $("input").on("keyup change", function (event) {
    event.target.setCustomValidity("");
  });

  $("form").on("submit", function (event) {
    event.preventDefault();
    //https://docs.google.com/forms/d/e/1FAIpQLSfMlbXeLoOHHnpex-nYEF8v824OnXi_NLhlhwNnCxFffZcgPA/formResponse?&submit=Submit?usp=pp_url&entry.1597741806=re&entry.877086558=yes&entry.1588402917=no&entry.2141206115=xasd
    const formDataArray = $(this).serializeArray();

    let formData = {};
    $.each(formDataArray, function (index, field) {
      formData[field.name] = field.value;
    });

    const { guest_name = "" } = formData;
    const { presence = "no" } = formData;
    const { companion_presence = "no" } = formData;
    const { companion_name = "" } = formData;

    $.ajax({
      url: `https://docs.google.com/forms/d/e/1FAIpQLSfMlbXeLoOHHnpex-nYEF8v824OnXi_NLhlhwNnCxFffZcgPA/formResponse?&submit=Submit?usp=pp_url&entry.1597741806=${guest_name}&entry.877086558=${presence}&entry.1588402917=${companion_presence}&entry.2141206115=${companion_name}`,
      type: "POST",
      // data: formData,
      success: function (response) {
        // Print the response
      },
      error: function (xhr, status, error) {
        // Handle errors
      },
    });
  });
});
