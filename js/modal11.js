
var modal6 = document.getElementById("myModal6");

var btn11 = document.getElementById("myBtn11");

var span6 = document.getElementById("close6");


btn11.onclick = function() {
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