$("#photoUpload").on("change", function () {
  let image = $("#photoUpload")[0].files[0];
  let formdata = new FormData();
  formdata.append("posterUpload", image);
  $.ajax({
    url: "/admin/hospitalLogoUpload",
    type: "POST",
    data: formdata,
    contentType: false,
    processData: false,
    success: (data) => {
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
