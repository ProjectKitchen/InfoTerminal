

var titleFormMax = 100
var textareaFormMax = 1000
var sites = []
updateContent()
document.getElementById("menuselect").onchange = function (event) {
  fillContent()
  
}

document.getElementById("title").setAttribute("maxlength", titleFormMax)
document.getElementById("text").setAttribute("maxlength", textareaFormMax)
function updateContent() {
  getJSON(location.origin + "/jsonsites", (status, data) => {
    document.getElementById("menuselect").innerHTML=""
    data.forEach(element => {
      document.getElementById("menuselect").innerHTML += '<option value="' + element.path + '">' + element.path + '</option>'
    });
    sites = data
    fillContent()
  })
}

function getJSON(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
}

function fillContent() {
  var selection = document.getElementById("menuselect");
  var position = 0
  var tableBody = document.getElementById("sites").getElementsByTagName("tbody")[0]
  tableBody.innerHTML = ""
  sites[selection.selectedIndex].subsites.forEach((side) => {
    var tableRow = document.createElement("tr")
    
    var order = document.createElement("td")
    order.innerHTML = position
    tableRow.appendChild(order)

    var pathname = document.createElement("td")
    pathname.innerHTML = side.path
    tableRow.appendChild(pathname)

    var buttonItem = document.createElement("td")
    var button = document.createElement("button")
    button.classList.add("btn")
    button.innerHTML = '<i class="fa fas fa-trash"></i>'
    button.onclick = function () {
      deleteSide(side.path)
    }
    buttonItem.appendChild(button)
    tableRow.appendChild(buttonItem)
    position++
    tableBody.appendChild(tableRow)
  })
  document.getElementById("order").setAttribute("max", sites[selection.selectedIndex].subsites.length - 1)
  document.getElementById("order").value = 0
}

function deleteSide(sidePathToDelete) {
  var deleteConfirm = confirm("Are you sure you want to delete this side?");
  if (deleteConfirm == true) {
    var selection = document.getElementById("menuselect");
    var selected = selection.options[selection.selectedIndex].value;
    var url = location.origin + "/deleteSide"
    var request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.onload = function () {
      var status = request.status;
      if (status === 200) {
        updateContent()
      } else {
        console.log(status)
        console.log(request.response)
      }
    }
    let password = document.getElementById("sidepassword").value
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send("sidePathToDelete=" + sidePathToDelete + "&menuselect=" + selected + "&password="+ password);
  }
}