function validateForm(e) {
  let requiredInputs = e.querySelectorAll("[data-valid=required]");
  let requiredError = [];
  requiredInputs.forEach((item) => {
    if (item.value.trim() == "") {
      requiredError.push(item);
      if (item.classList.contains("border") == false) {
        item.classList.add("border");
        item.classList.add("border-danger");
      }
    } else {
      if (item.classList.contains("border")) {
        item.classList.remove("border");
        item.classList.remove("border-danger");
      }
    }
  });
  if (requiredError.length > 0) {
    toastr.warning("Renkli alanlar boş bırakılamaz!", "Dikkat!");
    return false;
  } else {
    return true;
  }
}

function validateFormSubmit(event, e) {
  let requiredInputs = e.querySelectorAll("[data-valid=required]");
  let requiredError = [];
  requiredInputs.forEach((item) => {
    if (item.value.trim() == "") {
      requiredError.push(item);
      if (item.classList.contains("border") == false) {
        item.classList.add("border");
        item.classList.add("border-danger");
      }
    } else {
      if (item.classList.contains("border")) {
        item.classList.remove("border");
        item.classList.remove("border-danger");
      }
    }
  });
  if (requiredError.length > 0) {
    toastr.warning("Renkli alanlar boş bırakılamaz!", "Dikkat!");
    event.preventDefault()
  }
}

function validateChangePassword(event, e) {
  let passwords = e.querySelectorAll("[data-valid-password=password]")
    if (passwords[0].value != passwords[1].value){
      toastr.warning("Şifreler aynı diil", "Dikkat!");
      event.preventDefault()
    }
}

function validateFields(fields, event, index) {
  const paragraph = eval(`ckEditor[${index}].getData()`)
  const regex = /\$\$[^$]+\$\$/g
  const found = paragraph.match(regex);
  if (found){
    if (isEqual(fields, found))
      return true
  }
  toastr.error(fields.toString(), "Aşağıdakilerin Hepsini İçerdiğine Emin Olun!");
  event.preventDefault()
}

function isEqual(a, b){
  return !!(a.length === b.length && a.every((v, i) => v === b[i]));
}