 $(document).ready(function() {
     $('#productcatTable').DataTable( {

         columnDefs: [ {
             orderable: false,
             className: 'select',
             targets:   0,
             orderable: true
         } ],
         select: {
             style:    'multi',
             selector: 'td:first-child'
         },
         order: [[ 0, 'asc' ]]
     } );
 } );

 $(document).ready(function() {
    var oTable = $('#productcatTable').DataTable();
    var productcat = [];

    $('#productcatTable tbody').on('click', 'tr', function() {
     $(this).toggleClass('selected');
     var pos = oTable.row(this).index();
     var row = oTable.row(pos).data();
     productcat.push(row[0]);
     console.log(productcat);


    });

 $(document).ready(function () {
                    $("#selectMulti").on("click", function() {
                        var js_data = JSON.stringify(productcat);
                        $.ajax({
                            url: '/selectmulti',
                            type : 'post',
                            contentType: 'application/json',
                            dataType : 'json',
                            data : js_data
                        }).done(function(result) {
                            console.log(result);
                            window.location.reload();
                            $("#data").html(result);
                        }).fail(function(jqXHR, textStatus, errorThrown) {
                            console.log("fail: ",textStatus, errorThrown);
                        });
                    });
                });



  });
