console.log("Loaded Scripts.js");

$(document).ready(function () {
    $(".create-post-submit-btn").on("click", function (e) {
        e.preventDefault();
        console.log("Clicked submit button");

        let self = $(this);
        let form = self.closest(".create-post-form");
        console.log(form);

        let title = form.find(".create-post-form-title").val();
        let description = form.find(".create-post-form-description").val();
        console.log("Trying to submit form with title:", title);
        
        if (title.trim() === "") {
            showError("Title cannot be empty");
        } else if (description.trim() === "") {
            showError("Description cannot be empty");
        } else {
            console.log("Submitting form");
            form.submit();
        }
    });

    // $(".")

    function showError(message) {
        console.log("Showing error message:", message)
        $(".create-post-form").find("#error-message").text(message);
    }
});