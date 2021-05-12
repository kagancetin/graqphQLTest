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

let loginPost = async (e) => {
  e.preventDefault();
  console.log($("#loginPostForm").serializeArray());
  var formData = $("#loginPostForm").serializeArray();
  let data = {};
  formData.forEach(function (p) {
    data[p.name] = p.value;
  });
  console.log(data);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/login", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function (event) {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let response = JSON.parse(this.response);
      console.log(response);
      if (response.err) {
        toastr.error(response.err, "Hata!");
      } else {
        location.reload();
      }
    }
  };
  xhr.send(JSON.stringify(data));
};
