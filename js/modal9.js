
var modal5 = document.getElementById("myModal5");

var btn9 = document.getElementById("myBtn9");

var span5 = document.getElementById("close5");


btn9.onclick = function() {
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