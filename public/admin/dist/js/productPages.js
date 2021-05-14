let addGroupModal = async function () {
  var source = document.getElementById("addGroup-template").innerHTML;
  var template = await Handlebars.compile(source);
  var html = await template();
  document.getElementById("modalDiv").innerHTML = html;
  $("#addGroupModal").modal("show");
};

let editGroupModal = async function (groupName, order, id) {
  var source = document.getElementById("editGroup-template").innerHTML;
  var template = await Handlebars.compile(source);
  var html = await template({ groupName, order, id });
  document.getElementById("modalDiv").innerHTML = html;
  $("#editGroupModal").modal("show");
};

let removeGroupModal = async function (groupId) {
  var source = document.getElementById("removeGroup-template").innerHTML;
  var template = await Handlebars.compile(source);
  var html = await template({ groupId });
  document.getElementById("modalDiv").innerHTML = html;
  $("#removeGroupModal").modal("show");
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
  $("#optionType").val(data.optionType.toString());
};

let addOptionDetailName = function () {
  let optionDetailContent = document.getElementById("optionDetailContentList");
  var div = document.createElement("DIV");
  div.classList.add("row", "py-1");
  optionDetailContent.appendChild(div);
  div.innerHTML += `
                  <div class="col-8"><input type="text" data-valid="required" placeholder="Ürün Adı" class="form-control optionDetailContentInput"></div>
                  <div class="col-3"><input type="number" placeholder="Fiyat Farkı" class="form-control optionDetailPriceDifferenceInput"></div>
                  <div class="col-1 ">
                    <button type="button" class="close p-1 pt-2 float-left" onclick="this.parentNode.parentNode.remove()">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                    
                    
`;
};

let optionDataConverter = function () {
  let optionName = document.getElementById("optionName").value;
  let optionDisplayName = document.getElementById("optionDisplayName").value;
  let optionType = document.getElementById("optionType").value;
  let optionDetailContentList = document.getElementById(
    "optionDetailContentList"
  );
  let optionDetail = [];
  [].slice.call(optionDetailContentList.children).forEach(function (p) {
    optionDetail.push({
      optionDetailContent: p.querySelector(".optionDetailContentInput").value,
      optionPriceDifference: p.querySelector(
        ".optionDetailPriceDifferenceInput"
      ).value
        ? parseInt(p.querySelector(".optionDetailPriceDifferenceInput").value)
        : 0,
    });
  });

  return {
    optionName,
    optionDisplayName,
    optionType,
    optionDetail,
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

let addGroupSubmit = function (event) {
  event.preventDefault();
  if (validateForm(event.target)) {
    let groupName = document.getElementById("groupName").value;
    let order = document.getElementById("groupOrder").value;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/admin/addGroup", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = async function (event) {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let response = JSON.parse(this.response);
        if (response.err) {
          toastr.error(response.err, "Hata!");
        } else {
          toastr.success(response.data, "Başarılı");
        }
        getGroups();
        $("#addGroupModal").modal("hide");
      }
    };
    xhr.send(JSON.stringify({ groupName, order }));
  }
};

let editGroupSubmit = function (event, id) {
  event.preventDefault();
  if (validateForm(event.target)) {
    let groupName = document.getElementById("groupName").value;
    let order = +document.getElementById("groupOrder").value;
    console.log(order);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/admin/editGroup", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = async function (event) {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let response = JSON.parse(this.response);
        if (response.err) {
          $("#editGroupModal").modal("hide");
          toastr.error(response.err, "Hata!");
        } else {
          window.location.reload();
        }
      }
    };
    xhr.send(JSON.stringify({ groupName, order, id }));
  }
};

let removeGroupSubmit = function (event, id) {
  event.preventDefault();
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/admin/removeGroup", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = async function (event) {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let response = JSON.parse(this.response);
      if (response.err) {
        $("#removeGroupModal").modal("hide");
        toastr.error(response.err, "Hata!");
      } else {
        window.location.reload();
      }
    }
  };
  xhr.send(JSON.stringify({ id }));
};
