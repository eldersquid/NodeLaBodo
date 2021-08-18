$("#photoUpload").on("change", function () {
  let image = $("#photoUpload")[0].files[0];
  console.log("This is where you show the image lol");
  console.log(image);
  let formdata = new FormData();
  formdata.append("photoUpload", image);
  $.ajax({
    url: "/admin/roomPictureUpload",
    type: "POST",
    data: formdata,
    contentType: false,
    processData: false,
    'success': (data) => {
      $("#hotel_image").attr("src", data.file);
      console.log("Test")
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
