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
