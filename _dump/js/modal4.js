
var modal2 = document.getElementById("myModal2");

var btn4 = document.getElementById("myBtn4");

var span2 = document.getElementById("close2");


btn4.onclick = function() {
  modal2.style.display = "block";
}

span2.onclick = function() {
  modal2.style.display = "none";
}

window.addEventListener("click", function(event) {
  if (event.target == modal2) {
    modal2.style.display = "none";
  }
});