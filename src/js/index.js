import jQuery from "jquery";
import "../sass/style.scss";

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
      $("input[name='companion_presence'][value='no'").prop("checked", true);

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
    const formDataArray = $(this).serializeArray();

    let formData = {};
    $.each(formDataArray, function (index, field) {
      formData[field.name] = field.value;
    });

    const { API_KEY, SPREADSHEET_ID, SCOPE } = process.env;

    fetch(`https://api.sheetson.com/v2/sheets/${SCOPE}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "X-Spreadsheet-Id": SPREADSHEET_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response && !!response.type && response.type === "SheetsonError") {
          alert("Κάτι πήγε στραβά επικοινωνήστε με τον προγραμματιστή.");
          return;
        }
        alert("Ευχαριστούμε για την απάντηση σας");
      });
  });
});
