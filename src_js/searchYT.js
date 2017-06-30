var regex = /(\r\n|\n|\r)/gm;
var supported_files = ["txt", "csv"];
var contents_list;
var YTSearchURL = "https://www.youtube.com/results?search_query=";

function fileSelect(evt) {
  var file = evt.target.files[0];

  try {
    if (!file) {
      throw "Failed to load file.";
    }

    var file_ext = file.name.split(".").pop();
    if (!(supported_files.indexOf(file_ext) > -1)) {
      var err_msg = "Unsupported file: " + file_ext + ".\nSupported files: ";
      for (var i = 0; i < supported_files.length; i++) {
        err_msg += supported_files[i] + " ";
      }
      throw err_msg;
    }
    readFile(file);
  } catch (err) {
    alert(err);
  }
}

function readFile(file) {
  var reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function(e) {
    console.log(
      "Filename: " +
        file.name +
        "\n" +
        "Type: " +
        file.type +
        "\n" +
        "Size: " +
        file.size +
        " bytes\n"
    );

    var contents = e.target.result;

    generateContent(contents);
  };
}

function readText() {
  var text = document.getElementById("inputtext").value;
  generateContent(text);
}

function generateContent(textContent) {
  // Splits each line and removes unnecessary symbols
  contents_list = textContent
    .split("\n")
    .filter(function(e) {
      return e.replace(regex, "");
    })
    .sort();
  //console.log(contents_list);        // DEBUG
  generateLinks();
}

function generateLinks() {
  var output = "<ul><h2>Links to Youtube.com:</h2><ul>";
  for (var name = 0; name < contents_list.length; name++) {
    var url = createURL(contents_list[name]);
    output += "<li><a href=" + url + " target='_blank'>" + url + "</a></li>";
  }
  document.getElementById("list").innerHTML = "</ul>" + output + "</ul>";
  document.getElementById("entrylist").style.display = "block"; // Displays list of searches
}

function createURL(entry) {
  entry = entry.replace(/ /g, "+"); // Replace all spaces with '+'
  url = YTSearchURL + entry;
  return url;
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
  var url = createURL(entry);
  window.open(url, "_blank");
}
