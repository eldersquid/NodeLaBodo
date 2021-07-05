window.onload = function profile_fetch() {
    var placeID = document.getElementById("placeID").innerHTML
    console.log(placeID);
    fetch("https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=" + placeID + "&key=AIzaSyDhR62_UUROPzt6A8IOhVZBppjp9e51w2w",
  
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.Response === "False") {
          console.log("Error found!!");
        } else {
          console.log("Following data is taken : ")
          console.log(placeID)
          var test= data;
          console.log(test);
          document.getElementById("rating").innerHTML = test["result"]["rating"];
          document.getElementById("mon").innerHTML = test["result"]["opening_hours"]["weekday_text"][0];
          document.getElementById("tues").innerHTML = test["result"]["opening_hours"]["weekday_text"][1];
          document.getElementById("wed").innerHTML = test["result"]["opening_hours"]["weekday_text"][2];
          document.getElementById("thurs").innerHTML = test["result"]["opening_hours"]["weekday_text"][3];
          document.getElementById("fri").innerHTML = test["result"]["opening_hours"]["weekday_text"][4];
          document.getElementById("sat").innerHTML = test["result"]["opening_hours"]["weekday_text"][5];
          document.getElementById("sun").innerHTML = test["result"]["opening_hours"]["weekday_text"][6];
          document.getElementById("review1name").innerHTML = test["result"]["reviews"][0]["author_name"];
          document.getElementById("review2name").innerHTML = test["result"]["reviews"][1]["author_name"];
          document.getElementById("review3name").innerHTML = test["result"]["reviews"][2]["author_name"];
          document.getElementById("review4name").innerHTML = test["result"]["reviews"][3]["author_name"];
          document.getElementById("review5name").innerHTML = test["result"]["reviews"][4]["author_name"];
          document.getElementById("review1rating").innerHTML = test["result"]["reviews"][0]["rating"];
          document.getElementById("review2rating").innerHTML = test["result"]["reviews"][1]["rating"];
          document.getElementById("review3rating").innerHTML = test["result"]["reviews"][2]["rating"];
          document.getElementById("review4rating").innerHTML = test["result"]["reviews"][3]["rating"];
          document.getElementById("review5rating").innerHTML = test["result"]["reviews"][4]["rating"];
          document.getElementById("review1time").innerHTML = test["result"]["reviews"][0]["relative_time_description"];
          document.getElementById("review2time").innerHTML = test["result"]["reviews"][1]["relative_time_description"];
          document.getElementById("review3time").innerHTML = test["result"]["reviews"][2]["relative_time_description"];
          document.getElementById("review4time").innerHTML = test["result"]["reviews"][3]["relative_time_description"];
          document.getElementById("review5time").innerHTML = test["result"]["reviews"][4]["relative_time_description"];
          document.getElementById("review1").innerHTML = test["result"]["reviews"][0]["text"];
          document.getElementById("review2").innerHTML = test["result"]["reviews"][1]["text"];
          document.getElementById("review3").innerHTML = test["result"]["reviews"][2]["text"];
          document.getElementById("review4").innerHTML = test["result"]["reviews"][3]["text"];
          document.getElementById("review5").innerHTML = test["result"]["reviews"][4]["text"];
          document.getElementById("avatar1").src = test["result"]["reviews"][0]["profile_photo_url"];
          document.getElementById("avatar2").src = test["result"]["reviews"][1]["profile_photo_url"];
          document.getElementById("avatar3").src = test["result"]["reviews"][2]["profile_photo_url"];
          document.getElementById("avatar4").src = test["result"]["reviews"][3]["profile_photo_url"];
          document.getElementById("avatar5").src = test["result"]["reviews"][4]["profile_photo_url"];
          document.getElementById("coord_lat").innerHTML = test["result"]["geometry"]["location"]["lat"];
          document.getElementById("coord_lng").innerHTML = test["result"]["geometry"]["location"]["lng"];
          document.getElementById("type1").innerHTML = test["result"]["types"][0];
          document.getElementById("type2").innerHTML = test["result"]["types"][1];
          document.getElementById("type3").innerHTML = test["result"]["types"][2];
          document.getElementById("type4").innerHTML = test["result"]["types"][3];
        }
      }) 
      .catch((error) => {
        console.log(error);
      });
  }
  