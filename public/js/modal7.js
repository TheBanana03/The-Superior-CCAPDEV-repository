
var modal4 = document.getElementById("myModal4");

var btn7 = document.getElementById("myBtn7");

var span4 = document.getElementById("close4");


btn7.onclick = function() {
  modal4.style.display = "block";
}

span4.onclick = function() {
  modal4.style.display = "none";
}

window.addEventListener("click", function(event) {
  if (event.target == modal4) {
    modal4.style.display = "none";
  }
});