var regex = /(\r\n|\n|\r)/gm;
var contents_list;

function readText() {
  var text = document.getElementById("inputtext").value;
  if (text == "") {
    document.getElementById("submitError").innerHTML =
      "<h2><font color='red'>Enter a value!</font></h2>";
    document.getElementById("submitError").style.display = "block";
    document.getElementById("entrylist").style.display = "none";
  } else {
    document.getElementById("submitError").style.display = "none";
    generateContent(text);
  }
}

function generateContent(textContent) {
  // Splits each line and removes unnecessary symbols
  contents_list = textContent
    .split("\n")
    .filter(function(e) {
      return e.replace(regex, "");
    })
    .sort();
  console.log(contents_list); // DEBUG
  generateLinks();
}

function generateLinks() {
  var output = "<ul><h2>Links:</h2><ul>";
  for (var name = 0; name < contents_list.length; name++) {
    var url = contents_list[name];
    output +=
      "<li><a href=" +
      url +
      " target='_blank'>" +
      contents_list[name] +
      "</a></li>";
  }
  document.getElementById("list").innerHTML = "</ul>" + output + "</ul>";
  document.getElementById("entrylist").style.display = "block"; // Displays list of searches
}

function openLinks() {
  var confirm_msg =
    "Open (" + contents_list.length + ") tabs in the current window?.";
  var cfm = confirm(confirm_msg);
  if (cfm) {
    for (var name = 0; name < contents_list.length; name++) {
      openInNewTab(contents_list[name]);
    }
  }
}

function openInNewTab(entry) {
  window.open(entry, "_blank");
}
