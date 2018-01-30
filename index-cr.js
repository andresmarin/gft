$(function() {
  /* Initialize cash register */
  let todaysCashRegister = initCashRegister([1, 5, 5, 10, 10, 10, 10, 10, 10]);

  /* Make a payment */
  $("#payment").click(function() {
    $("#results").html("");
    let denominations = [];
    let price = $("#price").val();
    let errors = [];

    //validates price
    if (price === "" || price === 0 || isNaN(price)) {
      errors.push("The price must be a number over 0.");
    }

    $("input.denominations").each(function() {
      let denomination = $(this).val();

      //validates denominatios

      if (denomination === "" || denomination === 0) {
        denominations.push(0);
      } else if (!isInt(denomination)) {
        errors.push(
          $($(this).prop("labels")).text() +
            " denomination must be a number with no decimals."
        );
      } else {
        denominations.push(denomination);
      }
    });

    if (errors.length > 0) {
      $("#results").append("<h3><strong>Error</h3><ul>");
      errors.forEach(function(error) {
        $("#results").append("<li>" + error + "</li>");
      });
      $("#results").append("</ul>");
    } else {
      let result = makePayment(price, denominations, todaysCashRegister);

      if (result.status === 0) {
        $("#results").append(
          '<p><strong>Error</strong>:<span id="error">' +
            result.message +
            "</span></p>"
        );
      } else {
        $("#results").append(
          '<p><strong>Change Due:</strong> <span id="changeDue">' +
            result.changeDue +
            "</span></p>"
        );
        $("#results").append(
          '<p><strong>Status:</strong> <span id="message">' +
            result.message +
            "</span></p>"
        );
        $("#results").append("<h3>Change</h3>");
        result.change.forEach(function(denomination) {
          $("#results").append(
            "<p><strong>" +
              denomination[0] +
              ":</strong> <span>" +
              denomination[1] +
              "</span></p>"
          );
        });
      }
    }
  });

  $("#square").click(function() {
    let todaySquare = square(todaysCashRegister);
    $("#results").html("");
    $("#results").append(
      '<p><strong>Total Sales:</strong> <span id="message">' +
        todaySquare.total +
        "</span></p>"
    );
    $("#results").append(
      '<p><strong>Total in cash:</strong> <span id="message">' +
        todaySquare.totalInRegister +
        "</span></p>"
    );
  });
});
