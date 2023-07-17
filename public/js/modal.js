
var modal1 = document.getElementById("myModal1");

var button = document.getElementById("myButton");

var span1 = document.getElementById("close1");


button.onclick = function() {
  modal1.style.display = "block";
}

span1.onclick = function() {
  modal1.style.display = "none";
}

window.addEventListener("click", function(event) {
  if (event.target == modal1) {
    modal1.style.display = "none";
  }
});