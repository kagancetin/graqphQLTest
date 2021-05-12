$.fn.dataTable.ext.search.push(function (
  settings,
  searchData,
  index,
  rowData,
  counter
) {
  var row = settings.aoData[index].nTr;
  if (document.getElementById("showDeleted").classList.contains("active")) {
    if (row.dataset.deleted == "true") {
      return $(this);
    }
  } else {
    if (row.dataset.deleted == "false") {
      return $(this);
    }
  }
});

$("#showDeleted").on("click", function () {
  let button = this;
  if (button.classList.contains("active")) {
    button.classList.remove("active");
    button.innerText = "Silinenleri Göster";
  } else {
    button.classList.add("active");
    button.innerText = "Silinenleri Gizle";
  }
  table.draw();
});
