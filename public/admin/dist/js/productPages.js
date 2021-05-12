let addGroupModal = async function () {
  var source = document.getElementById("addGroup-template").innerHTML;
  var template = await Handlebars.compile(source);
  var html = await template();
  document.getElementById("modalDiv").innerHTML = html;
  $("#addGroupModal").modal("show");
};
let addOptionModal = async function () {
  var source = document.getElementById("addOption-template").innerHTML;
  var template = await Handlebars.compile(source);
  var html = await template();
  document.getElementById("modalDiv").innerHTML = html;
  $("#addOptionModal").modal("show");
};

let removeProductModal = async function () {
  var source = document.getElementById("removeProduct-template").innerHTML;
  var template = await Handlebars.compile(source);
  var html = await template();
  document.getElementById("modalDiv").innerHTML = html;
  $("#removeProductModal").modal("show");
};

let removeOptionModal = async function (optionId) {
  var source = document.getElementById("removeOption-template").innerHTML;
  var template = await Handlebars.compile(source);
  var html = await template({ optionId: optionId });
  document.getElementById("modalDiv").innerHTML = html;
  $("#removeOptionModal").modal("show");
};

let editOptionModal = async function (dataString) {
  let data = JSON.parse(dataString);
  var source = document.getElementById("editOption-template").innerHTML;
  var template = await Handlebars.compile(source);
  var html = await template(data);
  document.getElementById("modalDiv").innerHTML = html;
  $("#editOptionModal").modal("show");
  $("#optionDetailType").val(data.optionDetailType.toString());
};

let addOptionDetailName = function () {
  let optionDetailContent = document.getElementById("optionDetailContentList");
  var div = document.createElement("DIV");
  div.classList.add("d-flex", "py-2");
  optionDetailContent.appendChild(div);
  div.innerHTML += `
                    <input type="text" data-valid="required" class="form-control optionDetailContentInput">
                    <button type="button" class="close px-3" onclick="this.parentNode.remove()">
                        <i class="fas fa-trash"></i>
                    </button>
`;
};

let optionDataConverter = function () {
  let optionName = document.getElementById("optionName").value;
  let optionDisplayName = document.getElementById("optionDisplayName").value;
  let optionDetailType = document.getElementById("optionDetailType").value;
  let optionDetailContentInput = document.querySelectorAll(
    ".optionDetailContentInput"
  );
  let optionDetailContent = [].slice
    .call(optionDetailContentInput)
    .map(function (p) {
      return p.value;
    });

  return {
    optionName,
    optionDisplayName,
    optionDetailType,
    optionDetailContent,
  };
};

let addOptionSubmit = function (event) {
  event.preventDefault();
  if (validateForm(event.target)) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/admin/addOption", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = async function (event) {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let response = JSON.parse(this.response);
        if (response.err) {
          toastr.error(response.err, "Hata!");
        } else {
          toastr.success(response.data, "Başarılı");
        }
        getOptions();
        $("#addOptionModal").modal("hide");
      }
    };
    xhr.send(JSON.stringify(optionDataConverter()));
  }
};

let editOptionSubmit = function (event, _id) {
  event.preventDefault();
  if (validateForm(event.target)) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/admin/editOption", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = async function (event) {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let response = JSON.parse(this.response);
        if (response.err) {
          toastr.error(response.err, "Hata!");
        } else {
          toastr.success(response.data, "Başarılı");
        }
        getOptions();
        $("#editOptionModal").modal("hide");
      }
    };
    xhr.send(JSON.stringify({ ...{ _id }, ...optionDataConverter() }));
  }
};

let removeOptionSubmit = function (event, optionId) {
  event.preventDefault();
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/admin/removeOption", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = async function (event) {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let response = JSON.parse(this.response);
      if (response.err) {
        toastr.error(response.err, "Hata!");
      } else {
        toastr.success(response.data, "Başarılı");
      }
      getOptions();
      $("#removeOptionModal").modal("hide");
    }
  };
  xhr.send(JSON.stringify({ optionId }));
};
