// ************************************************
// Shopping Cart API
// ************************************************


var shoppingCart = (function () {
  // =============================
  // Private methods and propeties
  // =============================
  cart = [];
  console.log("Hello world!");

  // Constructor
  function Item(name, price, count) {
    this.name = name;
    this.price = price;
    this.count = count;
  }

  // Save cart

  function saveCart() {
    sessionStorage.setItem("shoppingCart", JSON.stringify(cart));



  }





  // Load cart
  function loadCart() {
    cart = JSON.parse(sessionStorage.getItem('shoppingCart'));

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
  obj.addItemToCart = function (name, price, count) {
    for (var item in cart) {
      if (cart[item].name === name) {
        cart[item].count++;
        saveCart();
        return;
      }
    }

    console.log("addItemToCart:", name, price, count);

    var item = new Item(name, price, count);
    cart.push(item);
    saveCart();
  }
  // Set count from item
  obj.setCountForItem = function (name, count) {
    for (var i in cart) {
      if (cart[i].name === name) {
        cart[i].count = count;
        break;
      }
    }

    saveCart();

  };
  // Remove item from cart
  obj.removeItemFromCart = function (name) {
    for (var item in cart) {
      if (cart[item].name === name) {
        cart[item].count--;
        if (cart[item].count === 0) {
          cart.splice(item, 1);
        }
        break;
      }
    }
    saveCart();
  }

  // Remove all items from cart
  obj.removeItemFromCartAll = function (name) {
    for (var item in cart) {
      if (cart[item].name === name) {
        cart.splice(item, 1);
        break;
      }
    }
    saveCart();
  };

  // Clear cart
  obj.clearCart = function () {
    cart = [];
    saveCart();
  }

  // Count cart
  obj.totalCount = function () {
    var totalCount = 0;
    for (var item in cart) {
      totalCount += cart[item].count;
    }
    return totalCount;
  };

  // Total cart
  obj.totalCart = function () {
    var totalCart = 0;
    for (var item in cart) {
      totalCart += cart[item].price * cart[item].count;
    }
    return Number(totalCart.toFixed(2));
  }

  // List cart
  obj.listCart = function () {
    var cartCopy = [];
    console.log("Listing cart");
    console.log(cart);
    for (i in cart) {
      item = cart[i];
      itemCopy = {};
      for (var p in item) {
        itemCopy[p] = item[p];

      }
      itemCopy.total = Number(item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy)
    }
    console.log("This is the shopping cart:")
    console.log(shoppingCart);
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
})();

$(document).ready(function () {
  $("#pay_now").on("click", function () {
    var js_data = JSON.stringify(cart);
    $.ajax({
      url: '/payNowPls',
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: js_data
    }).done(function (result) {
      console.log(result);
      window.location.href = "/cart_confirmation";
      $("#data").html(result);
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log("fail: ", textStatus, errorThrown);
    });
  });
});


// *****************************************
// Triggers / Events
// *****************************************
// Add item
$('.add-to-cart').click(function (event) {
  event.preventDefault();
  var name = $(this).data('name');
  var price = Number($(this).data('price'));
  console.log(name)
  console.log(price)
  console.log("Hi")
  shoppingCart.addItemToCart(name, price, 1);
  displayCart();
});

// Clear items
$('.clear-cart').click(function () {
  shoppingCart.clearCart();
  displayCart();
});


function displayCart() {
  var cartArray = shoppingCart.listCart();
  var output = "";
  for (var i in cartArray) {
    output += "<tr>"
      + "<td>" + cartArray[i].name + "</td>"
      + "<td>($" + cartArray[i].price + ") </td>"
      + "<td><div class='input-group'><button class='minus-item input-group-addon btn-sm btn-primary' data-name=" + cartArray[i].name + ">-</button>"
      + "<input type='number' class=' item-count' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
      + "<button class='plus-item btn-sm btn-primary input-group-addon' data-name=" + cartArray[i].name + ">+</button></div></td>"
      + "<td><button class='delete-item btn-sm btn-danger' data-name=" + cartArray[i].name + ">X</button></td>"
      + " = "
      + "<td>" + cartArray[i].total + "</td>"
      + "</tr>";
  }
  $('.show-cart').html(output);
  $('.total-cart').html(shoppingCart.totalCart());
  $('.total-count').html(shoppingCart.totalCount());
}

// Delete item button

$('.show-cart').on("click", ".delete-item", function (event) {
  var name = $(this).data('name')
  shoppingCart.removeItemFromCartAll(name);
  displayCart();
})


// -1
$('.show-cart').on("click", ".minus-item", function (event) {
  var name = $(this).data('name')
  var price = Number($(this).data('price'));
  var quantity = parseInt($(this).data('count'))
  shoppingCart.removeItemFromCart(name, price, quantity);
  displayCart();
})
// +1
$('.show-cart').on("click", ".plus-item", function (event) {
  var name = $(this).data('name')
  var price = Number($(this).data('price'));
  var quantity = Number($(this).data('count'))
  shoppingCart.addItemToCart(name, price, quantity);
  displayCart();
})

// Item count input
$('.show-cart').on("change", ".item-count", function (event) {
  var name = $(this).data('name');
  var count = Number($(this).val());
  shoppingCart.setCountForItem(name, count);
  displayCart();
});

displayCart();
