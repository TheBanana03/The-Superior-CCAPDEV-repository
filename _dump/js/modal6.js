
var modal3 = document.getElementById("myModal3");

var btn6 = document.getElementById("myBtn6");

var span3 = document.getElementById("close3");


btn6.onclick = function() {
  modal3.style.display = "block";
}

span3.onclick = function() {
  modal3.style.display = "none";
}

window.addEventListener("click", function(event) {
  if (event.target == modal3) {
    modal3.style.display = "none";
  }
});