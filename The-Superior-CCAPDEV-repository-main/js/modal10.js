
var modal5 = document.getElementById("myModal5");

var btn10 = document.getElementById("myBtn10");

var span5 = document.getElementById("close5");


btn10.onclick = function() {
  modal5.style.display = "block";
}

span5.onclick = function() {
  modal5.style.display = "none";
}

window.addEventListener("click", function(event) {
  if (event.target == modal5) {
    modal5.style.display = "none";
  }
});