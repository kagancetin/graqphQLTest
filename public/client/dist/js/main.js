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

let addProductToBasketModal = async function (product) {
  let data = JSON.parse(product);
  data.options = data.options.map(function (p) {
    if (p.optionType == 1) {
      p.optionDetail = p.optionDetail.map(function (k) {
        if (k.optionPriceDifference <= 0) {
          k.optionPriceDifference = null;
        }
        return k;
      });
      p.choose = true;
    }
    if (p.optionType == 2) p.out = true;
    return p;
  });
  console.log(data);
  var source = document.getElementById("addProductToBasketModal-template").innerHTML;
  var template = await Handlebars.compile(source);
  var html = await template(data);
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
