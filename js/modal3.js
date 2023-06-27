
var modal2 = document.getElementById("myModal2");

var btn3 = document.getElementById("myBtn3");

var span2 = document.getElementById("close2");


btn3.onclick = function() {
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