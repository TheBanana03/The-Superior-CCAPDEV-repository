console.log("like.js loaded")

$(document).ready(function () {
    $(".like-button").on("click", function (e) {
        console.log("Like button clicked")
        e.preventDefault();
        let self = $(this);
        let actionUrl = self.attr("href");
        let likeCount = self.find(".actiontext");
    
        $.ajax({
            url: actionUrl,
            type: "POST",
            dataType: "json",
            success: function (data) {
                console.log(data);
                likeCount.css("color", "#000000");
                likeCount.text("");
    
                if (!data.isLiked) {
                    self.attr("data-liked", "true");
                    self.find("object").attr("data", "/static/assets/heart-solid.svg");
                } else {
                    self.attr("data-liked", "false");
                    self.find("object").attr("data", "/static/assets/heart-regular.svg");
                }
    
                setTimeout(function () {
                    likeCount.text(data.likeCount);
                }, 10);
            },
            error: function (error) {
                console.error("Error while liking:", error);
                likeCount.css("color", "#ed4343");
    
                if (error.status === 401) {
                    likeCount.text("Login");
                } else {
                    likeCount.text("Error");
                }
            }
        });
    });
});