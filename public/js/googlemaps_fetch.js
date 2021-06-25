window.onload = function fetch_gmaps() {
  var location = document.getElementById("google_location").value;
  console.log(location);
  fetch("https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=" + location + "&key=AIzaSyDhR62_UUROPzt6A8IOhVZBppjp9e51w2w",

  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.Response === "False") {
        console.log("Error found!!");
      } else {
        console.log("Following data is taken : ")
        var test= data;
        console.log(test);
        document.getElementById("add").value = test["result"]["formatted_address"];
        document.getElementById("name").value = test["result"]["name"];
        var x = test["result"]["formatted_phone_number"].replace(/ /g,'');
        console.log(x);
        document.getElementById("contact").value = x;
        document.getElementById("website").value = test["result"]["website"];
        
      }
    }) 
    .catch((error) => {
      console.log(error);
    });
}
