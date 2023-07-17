
var modal6 = document.getElementById("myModal6");

var btn12 = document.getElementById("myBtn12");

var span6 = document.getElementById("close6");


btn12.onclick = function() {
  modal6.style.display = "block";
}

span6.onclick = function() {
  modal6.style.display = "none";
}

window.addEventListener("click", function(event) {
  if (event.target == modal6) {
    modal6.style.display = "none";
  }
});