$("#photoUpload").on("change", function () {
  let image = $("#photoUpload")[0].files[0];
  console.log("This is where you show the image lol");
  console.log(image);
  console.log(document.getElementById("google_location").value);
  let formdata = new FormData();
  formdata.append("photoUpload", image);
  $.ajax({
    url: "/admin/hospitalLogoUpload",
    type: "POST",
    data: formdata,
    contentType: false,
    processData: false,
    'success': (data) => {
      $("#hospital_image").attr("src", data.file);
      $("#photoURL").attr("value", data.file); // sets posterURL hidden field
      if (data.err) {
        $("#photoErr").show();
        $("#photoErr").text(data.err.message);
      } else {
        $("#photoErr").hide();
      }
    },
  });
});
