
var modal3 = document.getElementById("myModal3");

var btn5 = document.getElementById("myBtn5");

var span3 = document.getElementById("close3");


btn5.onclick = function() {
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