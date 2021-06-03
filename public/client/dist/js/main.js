$(function () {
  $(document).scroll(function () {
    var $nav = $(".fixed-top");
    $nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
  });
});

let loginModal = async function () {
  var source = document.getElementById("loginModal-template").innerHTML;
  var template = await Handlebars.compile(source);
  var html = await template();
  document.getElementById("modals").innerHTML = html;
  $("#loginModal").modal("show");
};

let registerModal = async function () {
  var source = document.getElementById("registerModal-template").innerHTML;
  var template = await Handlebars.compile(source);
  var html = await template();
  document.getElementById("modals").innerHTML = html;
  $("#registerModal").modal("show");
};

let rePasswordModal = async function () {
  var source = document.getElementById("rePasswordModal-template").innerHTML;
  var template = await Handlebars.compile(source);
  var html = await template();
  document.getElementById("modals").innerHTML = html;
  $("#rePasswordModal").modal("show");
};

let addProductToBasketModal = async function () {
  var source = document.getElementById("addProductToBasketModal-template").innerHTML;
  var template = await Handlebars.compile(source);
  var html = await template();
  document.getElementById("modals").innerHTML = html;
  $("#addProductToBasketModal").modal("show");
};

let basketModal = async function () {
  var source = document.getElementById("basketModal-template").innerHTML;
  var template = await Handlebars.compile(source);
  var html = await template();
  document.getElementById("modals").innerHTML = html;
  $("#basketModal").modal("show");
};

let addAddressModal = async function () {
  var source = document.getElementById("addAddressModal-template").innerHTML;
  var template = await Handlebars.compile(source);
  var html = await template();
  document.getElementById("modals").innerHTML = html;
  $("#addAddressModal").modal("show");
};
