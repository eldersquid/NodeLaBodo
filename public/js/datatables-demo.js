// Call the dataTables jQuery plugin
$(document).ready(function() {
    $('#hospitalTable').DataTable( {

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
        order: [[ 5, 'asc' ]]
    } );
} );

$(document).ready(function() {
   var oTable = $('#hospitalTable').DataTable();
   var hospitals = [];

   $('#hospitalTable tbody').on('click', 'tr', function() {
    $(this).toggleClass('selected');
    var pos = oTable.row(this).index();
    var row = oTable.row(pos).data();
    hospitals.push(row[0]);
    console.log(hospitals);


   });

$(document).ready(function () {
                   $("#deleteMulti").on("click", function() {
                       var js_data = JSON.stringify(hospitals);
                       $.ajax({
                           url: '/deletemulti',
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

   $("#btnAll").on("click", function() {
     var oAll = [];
     $('#example tbody tr.selected').each(function() {
       var pos = oTable.row(this).index();
       var row = oTable.row(pos).data();
       oAll.push(row);
     });
     console.log(oAll);
     alert(oAll);
   });

 });

 // Call the dataTables jQuery plugin
 $(document).ready(function() {
     $('#occupationTable').DataTable( {

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
    var oTable = $('#occupationTable').DataTable();
    var hospitals = [];

    $('#occupationTable tbody').on('click', 'tr', function() {
     $(this).toggleClass('selected');
     var pos = oTable.row(this).index();
     var row = oTable.row(pos).data();
     hospitals.push(row[0]);
     console.log(hospitals);


    });

 $(document).ready(function () {
                    $("#deleteMulti").on("click", function() {
                        var js_data = JSON.stringify(hospitals);
                        $.ajax({
                            url: '/occupation_multi',
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

    $("#btnAll").on("click", function() {
      var oAll = [];
      $('#example tbody tr.selected').each(function() {
        var pos = oTable.row(this).index();
        var row = oTable.row(pos).data();
        oAll.push(row);
      });
      console.log(oAll);
      alert(oAll);
    });

  });



  // Call the dataTables jQuery plugin
  $(document).ready(function() {
      $('#guestTable').DataTable( {

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
          order: [[ 5, 'asc' ]]
      } );
  } );


// Call the dataTables jQuery plugin
$(document).ready(function() {
    $('#dataTable2').DataTable( {

        columnDefs: [ {
            orderable: false,
            className: 'select-checkbox',
            targets:   0
        } ],
        select: {
            style:    'multi',
            selector: 'td:first-child'
        },
        order: [[ 1, 'asc' ]]
    } );
} );

$(document).ready(function() {
    $('#dataTable').DataTable( {

        columnDefs: [ {
            orderable: false,
            className: 'select-checkbox',
            targets:   0
        } ],
        select: {
            style:    'multi',
            selector: 'td:first-child'
        },
        order: [[ 1, 'asc' ]]
    } );
} );

// Call datatables for hotel rooms
$(document).ready(function() {
    $('#HotelRooms').DataTable( {

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
        order: [[ 1, 'asc' ]]
    } );
} );
