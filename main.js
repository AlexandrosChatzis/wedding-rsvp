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
    $(".rsvp-question").closest(".form-group").show();
    $("input[name='companion_presence']").closest(".form-group").show();
    $("input[name='companion_name']").closest(".form-group").show();
  } else {
    $(".rsvp-question").hide();
    $("input[name='companion_presence']").closest(".form-group").hide();
    $("input[name='companion_name']").closest(".form-group").hide();
  }

  if (
    $("input[type='radio'][name='companion_presence']:checked").val() === "yes"
  ) {
    $("input[name='companion_name']").attr("required", true);
    $("input[name='companion_name']").closest(".form-group").show();
  } else {
    $("input[name='companion_name']").attr("required", false);
    $("input[name='companion_name']").closest(".form-group").hide();
  }

  $("input[type='radio'][name='presence']").on("change", function () {
    if ($(this).val() === "yes") {
      $(".rsvp-question").fadeIn();
      const companionName = $("input[name='companion_name']");
      const companionPresence = $("input[name='companion_presence']:checked");
      companionPresence.closest(".form-group").fadeIn();
      if (companionPresence.val() === "yes")
        companionName.closest(".form-group").fadeIn();
    } else {
      $(".rsvp-question").fadeOut();
      $("input[name='companion_presence']").closest(".form-group").fadeOut();
      $("input[name='companion_name']")
        .closest(".form-group")
        .fadeOut()
        .find(".jsCustomPlaceholder")
        .removeClass("on-top");
      $("input[name='companion_name']").attr("required", false).val("");
    }
  });

  $("input[type='radio'][name='companion_presence']").on("change", function () {
    if ($(this).val() === "yes") {
      $("input[name='companion_name']").closest(".form-group").fadeIn();
      $("input[name='companion_name']").attr("required", true);
    } else {
      $("input[name='companion_name']")
        .closest(".form-group")
        .fadeOut()
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
    console.log(formData);
    const { guest_name } = formData;
    const { presence } = formData;
    const { companion_presence } = formData;
    const { companion_name } = formData;

    $.ajax({
      url: `https://docs.google.com/forms/d/e/1FAIpQLSfMlbXeLoOHHnpex-nYEF8v824OnXi_NLhlhwNnCxFffZcgPA/formResponse?&submit=Submit?usp=pp_url&entry.1597741806=${guest_name}&entry.877086558=${presence}&entry.1588402917=${companion_presence}&entry.2141206115=${companion_name}`,
      type: "POST",
      // data: formData,
      success: function (response) {
        // Print the response
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.error(xhr, status, error);
      },
    });
  });
});
