import "../sass/core.scss";
import "../sass/vendor.scss";

$(document).ready(function () {
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

    $("input[name='companion_name']")
      .parent()
      .find(".form-label")
      .html('Ονοματεπώνυμο συνοδού <span class="required">*</span>');

    $("input[name='companion_name']").attr("disabled", false);
  } else {
    $("input[name='companion_name']").attr("required", false);
    $("input[name='companion_name']").attr("disabled", true);
    $("input[name='companion_name']")
      .parent()
      .find(".form-label")
      .html("Ονοματεπώνυμο συνοδού");
  }

  $("input[type='radio'][name='presence']").on("change", function () {
    if ($(this).val() === "yes") {
      const companionName = $("input[name='companion_name']");
      const companionPresence = $("input[name='companion_presence']:checked");
      $("input[name='companion_presence']").attr("disabled", false);
      if (companionPresence.val() === "yes")
        companionName.attr("disabled", false);
    } else {
      $("input[name='companion_presence'][value='no']").prop("checked", true);

      $("input[name='companion_presence']").attr("disabled", true);
      $("input[name='companion_name']")
        .attr("disabled", true)
        .parent()
        .find(".jsCustomPlaceholder")
        .removeClass("on-top");
      $("input[name='companion_name']").attr("required", false).val("");
      $("input[name='companion_name']")
        .parent()
        .find(".form-label")
        .html("Ονοματεπώνυμο συνοδού");
    }
  });

  $("input[type='radio'][name='companion_presence']").on("change", function () {
    const companionName = $("input[name='companion_name']");
    if ($(this).val() === "yes") {
      companionName.attr("disabled", false);
      companionName.attr("required", true);
      companionName
        .parent()
        .find(".form-label")
        .html('Ονοματεπώνυμο συνοδού <span class="required">*</span>');
    } else {
      companionName
        .attr("disabled", true)
        .parent()
        .find(".jsCustomPlaceholder")
        .removeClass("on-top");
      companionName.attr("required", false).val("");
      companionName.parent().find(".form-label").html("Ονοματεπώνυμο συνοδού");
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
    $(".jsFormMessage")
      .text("")
      .removeClass("form-messages--valid form-messages--invalid")
      .hide();

    const response = grecaptcha.getResponse();
    if (response === "") {
      $(".jsFormMessage")
        .addClass("form-messages--invalid")
        .text("Παρακαλώ επιβεβαιώστε ότι δεν είστε ρομπότ.")
        .fadeIn();
      return;
    }
    const submitBtn = $(".jsSubmit");
    const spinner = submitBtn.find(".spinner");
    submitBtn.attr("disabled", true);
    spinner.addClass("spinner--visible");

    const formDataArray = $(this).serializeArray();

    let formData = {};
    $.each(formDataArray, function (_index, field) {
      formData[field.name] = field.value;
    });

    formData["date"] = new Date().toString();

    const { API_KEY, SPREADSHEET_ID, SCOPE } = process.env;

    try {
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
          if (
            response &&
            !!response.type &&
            response.type === "SheetsonError"
          ) {
            $(".jsFormMessage")
              .addClass("form-messages--invalid")
              .text("Κάτι πήγε στραβά επικοινωνήστε με τον προγραμματιστή.")
              .fadeIn();
            return;
          }
          $(".jsFormMessage")
            .addClass("form-messages--valid")
            .text("Ευχαριστούμε για την απάντηση σας")
            .fadeIn();
          submitBtn.attr("disabled", false);
          spinner.removeClass("spinner--visible");
        });
    } catch (error) {
      $(".jsFormMessage")
        .addClass("form-messages--invalid")
        .text("Κάτι πήγε στραβά επικοινωνήστε με τον προγραμματιστή.")
        .fadeIn();
    }
  });

  const futureDate = new Date(2024, 8, 7, 19, 0, 0);

  function updateTimer() {
    const currentDate = new Date();
    const timeDifference = futureDate - currentDate;

    if (timeDifference <= 0) {
      clearInterval(timerInterval);
      $(".counter-subtitle").text("Παρήλθε");
      return;
    }

    const seconds = Math.floor((timeDifference / 1000) % 60);
    const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    $(".timer-days .timer-count").text(days);
    $(".timer-hours .timer-count").text(hours);
    $(".timer-minutes .timer-count").text(minutes);
    $(".timer-seconds .timer-count").text(seconds);
  }

  updateTimer();

  const timerInterval = setInterval(updateTimer, 1000);

  // waypoint animations
  var $waypoint = $(".js-waypoint");
  var waypointVisible = "is-visible";

  setTimeout(() => {
    $waypoint.each(function () {
      $(this).waypoint({
        handler: function () {
          $(this.element).addClass(waypointVisible);
          this.destroy();
        },
        offset: "75%",
      });
    });
  }, 250);
});
