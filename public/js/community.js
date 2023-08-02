$(document).ready(function () {
    $("#submit-button").on("click", function (e) {
      e.preventDefault();
      let self = $(this);

      let form = self.closest(".community-form");
  
      form.find("#error-message").text("");
  
      const name = form.find("#name").val();
      const tagline = form.find("#tagline").val();
      const description = form.find("#description").val();
      console.log("Trying to submit form with name:", name);
  
      if (name.trim() === "") {
        showError("Name cannot be empty");
      } else if (name.length < 3 || name.length > 24) {
        showError("Name must be 3-24 characters long");
      } else if (tagline.trim() === "") {
        showError("Tagline cannot be empty");
      } else if (tagline.length < 3 || tagline.length > 32) {
        showError("Tagline must be 3-32 characters long");
      } else if (description.trim() === "") {
        showError("Description cannot be empty");
      } else if (description.length < 3 || description.length > 256) {
        showError("Description must be 3-256 characters");
      } else {
        console.log("Submitting form");
        form.submit();
      }
    });
  
    function showError(message) {
        $(".community-form").find("#error-message").text(message);
    }
  });