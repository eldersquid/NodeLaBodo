function fetch_gmaps() {
  var title= document.getElementById("pac-input").value;
  fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + title + "&key=AIzaSyDhR62_UUROPzt6A8IOhVZBppjp9e51w2w")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.Response === "False") {
        console.log("Error found!!");
      } else {
        console.log(data);
        console.log(title);
      }
    })
    .catch((error) => {
      omdbErr.innerHTML = error;
    });
}
