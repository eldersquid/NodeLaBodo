// ************************************************
// Shopping Cart API
// ************************************************

function ensureOneCheck(checkBoxName, messageId, submitId) {
	const checkBoxes = document.getElementsByName(checkBoxName);
	let checkCount = 0;
	for (let i=0; i < checkBoxes.length; i++){
		if (checkBoxes[i].checked)
			checkCount++;
	}
	if (checkCount === 0){
		document.getElementById(messageId).style.display = 'block';
		document.getElementById(submitId).disabled = true;
		return false;
	} else {
		document.getElementById(messageId).style.display = 'none';
		document.getElementById(submitId).disabled = false;
		return true;
	}
}

var bookingCart = (function() {
  // =============================
  // Private methods and propeties
  // =============================
  cart = [];
  console.log("Hello world!");

  // Constructor
  function Booking(roomType,bookInDate, bookOutDate, price, misc) {
    this.bookInDate = bookInDate;
    this.roomType = roomType;
    this.price = price;
    this.bookOutDate = bookOutDate;
    this.misc = misc;
  }

  // Save cart

  function saveCart() {
        sessionStorage.setItem("bookingCart", JSON.stringify(cart));



    }





    // Load cart
  function loadCart() {
    cart = JSON.parse(sessionStorage.getItem('bookingCart'));

    if (cart === null) {
      cart = [];
    }
  }

  loadCart();



  // =============================
  // Public methods and propeties
  // =============================
  var obj = {};

  // Add to cart
  obj.addItemToCart = function(bookInDate, bookOutDate, price, roomType) {
    var count = 0;
    for(var item in cart) {
      if(cart[item].roomType === RoomType) {
        alert(roomType + " already booked. Only one booking per person due to COVID restrictions.");
        count++;
        return;
      } 
    }
    if (count>0) {
      console.log("No way bro")
      return;

    } else {
      console.log("addBookingToCart:", bookInDate, bookOutDate, price, roomType);

      var item = new Booking(bookInDate, bookOutDate, price, roomType);
      cart.push(item);
      saveCart();

    }
  }
  // Set count from item
  obj.setCountForItem = function(name, count) {
    for(var i in cart) {
      if (cart[i].name === name) {
        cart[i].count = count;
        break;
      }
    }

    saveCart();

  };
  // Remove item from cart
  obj.removeItemFromCart = function(name) {
      for(var item in cart) {
        if(cart[item].name === name) {
          cart[item].count --;
          if(cart[item].count === 0) {
            cart.splice(item, 1);
          }
          break;
        }
    }
    saveCart();
  }

  // Remove all items from cart
  obj.removeItemFromCartAll = function(name) {
    for(var item in cart) {
      if(cart[item].name === name) {
        cart.splice(item, 1);
        break;
      }
    }
    saveCart();
  };

  // Clear cart
  obj.clearCart = function() {
    cart = [];
    saveCart();
  }

  // Count cart
  obj.totalCount = function() {
    var totalCount = 0;
    for(var item in cart) {
      totalCount ++;
    }
    return totalCount;
  };

  // Total cart
  obj.totalCart = function() {
    var totalCart = 0;
    for(var item in cart) {
      totalCart += cart[item].price;
    }
    return Number(totalCart.toFixed(2));
  }

  // List cart
  obj.listCart = function() {
    var cartCopy = [];
    console.log("Listing cart");
    console.log(cart);
    for(i in cart) {
      item = cart[i];
      itemCopy = {};
      for(var p in item) {
        itemCopy[p] = item[p];

      }
      itemCopy.total = Number(item.price).toFixed(2);
      cartCopy.push(itemCopy)
    }
    console.log("This is the shopping cart:")
    console.log(bookingCart);
    return cartCopy;
  }

  // cart : Array
  // Item : Object/Class
  // addItemToCart : Function
  // removeItemFromCart : Function
  // removeItemFromCartAll : Function
  // clearCart : Function
  // countCart : Function
  // totalCart : Function
  // listCart : Function
  // saveCart : Function
  // loadCart : Function
  return obj;
} ) ();

$(document).ready(function () {
                   $("#pay_now").on("click", function() {
                       var js_data = JSON.stringify(cart);
                       $.ajax({
                           url: '/payNowPls',
                           type : 'POST',
                           contentType: 'application/json',
                           dataType : 'json',
                           data : js_data
                       }).done(function(result) {
                           console.log(result);
                           window.location.href = "/cart_confirmation";
                           $("#data").html(result);
                       }).fail(function(jqXHR, textStatus, errorThrown) {
                           console.log("fail: ",textStatus, errorThrown);
                       });
                   });
               });


// *****************************************
// Triggers / Events
// *****************************************
// Add item
$('.add-to-cart').click(function(event) {
  event.preventDefault();
  $('.show-date').attr('data-bookInDate', document.getElementById("BookInDate").value);
  $('.show-date').attr('data-bookOutDate', document.getElementById("BookOutDate").value);
  var bookInDate = $(this).data('bookindate');
  var bookOutDate = $(this).data('bookoutdate');
  var name = $(this).data('name');
  var price = Number($(this).data('price'));
  console.log(name)
  console.log(price)
  console.log("Hi")
  bookingCart.addItemToCart(name, price, 1);
  displayCart();
});

// Clear items
$('.clear-cart').click(function() {
  bookingCart.clearCart();
  displayCart();
});


function displayCart() {
  var cartArray = bookingCart.listCart();
  var output = "";
  for(var i in cartArray) {
    output += "<tr>"
      + "<td>" + cartArray[i].name + "</td>"
      + "<td>($" + cartArray[i].price + ") </td>"
      + "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name=" + cartArray[i].name + ">-</button>"
      + "<input type='number' class=' item-count' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
      + "<button class='plus-item btn btn-primary input-group-addon' data-name=" + cartArray[i].name + ">+</button></div></td>"
      + "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">X</button></td>"
      + " = "
      + "<td>" + cartArray[i].total + "</td>"
      +  "</tr>";
  }
  $('.show-cart').html(output);
  $('.total-cart').html(bookingCart.totalCart());
  $('.total-count').html(bookingCart.totalCount());
}

// Delete item button

$('.show-cart').on("click", ".delete-item", function(event) {
  var name = $(this).data('name')
  bookingCart.removeItemFromCartAll(name);
  displayCart();
})


// -1
$('.show-cart').on("click", ".minus-item", function(event) {
  var name = $(this).data('name')
  var price = Number($(this).data('price'));
  var quantity = parseInt($(this).data('count'))
  bookingCart.removeItemFromCart(name, price, quantity);
  displayCart();
})
// +1
$('.show-cart').on("click", ".plus-item", function(event) {
  var name = $(this).data('name')
  var price = Number($(this).data('price'));
  var quantity = Number($(this).data('count'))
  bookingCart.addItemToCart(name, price, quantity);
  displayCart();
})

// Item count input
$('.show-cart').on("change", ".item-count", function(event) {
   var name = $(this).data('name');
   var count = Number($(this).val());
  bookingCart.setCountForItem(name, count);
  displayCart();
});

displayCart();
