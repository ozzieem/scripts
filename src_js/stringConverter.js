function isType(char, type) {
  var testVal = false;
  if (type == "digit") {
    testVal = /^\d+$/.test(char);
  }
  if (type == "alph") {
    testVal = /[A-Z]/.test(char);
  }
  return testVal;
}

function convertToASCII(incText) {
  var newText = "";
  for (var i = 0; i < incText.length; i++) {
    var char = incText[i];
    newText += char.charCodeAt(0) + " ";
  }
  return newText;
}

function convertToHex(incText) {
  var newText = "";
  console.log(incText);
  incText = incText.split(" ");
  for (var i = 0; i < incText.length; i++) {
    var char = parseInt(incText[i]);
    if (char >= 0) {
      console.log(char, char.toString(16));
      newText += char.toString(16).toUpperCase() + " ";
    }
  }
  return newText;
}

function convertFromHex(incText) {
  var newText = "";
  incText = incText.split(" ");
  console.log(incText);
  for (var i = 0; i < incText.length; i++) {
    var char = parseInt(incText[i], 16);
    console.log(char, String.fromCharCode(char));
    newText += String.fromCharCode(char);
  }
  return newText;
}

function convertText() {
  document.getElementById("convertedValue").innerHTML = "";

  preprocessed_text = document.getElementById("inputtext").value;

  var postprocessed_text = "";

  if (preprocessed_text == "") {
    document.getElementById("convertedValue").innerHTML =
      "<h2><font color='red'>Enter a value!</font></h2>";
  } else {
    var isASCIIChosen = document.getElementById("StringToASCII").checked;
    var isHexChosen = document.getElementById("ASCIIToHex").checked;
    var isFromHexChosen = document.getElementById("HexToString").checked;
    if (isASCIIChosen) {
      postprocessed_text = convertToASCII(preprocessed_text);
    } else if (isHexChosen) {
      postprocessed_text = convertToHex(preprocessed_text);
    } else if (isFromHexChosen) {
      postprocessed_text = convertFromHex(preprocessed_text);
    }

    document.getElementById("convertedValue").innerHTML =
      "<h2>" + preprocessed_text + "</>" + "<h1>" + postprocessed_text + "</>";
  }
}

function changePlaceholderText() {
  var isASCIIChosen = document.getElementById("StringToASCII").checked;
  var isHexChosen = document.getElementById("ASCIIToHex").checked;
  var isFromHexChosen = document.getElementById("HexToString").checked;
  if (isASCIIChosen) {
    document.getElementById("inputtext").placeholder = "e.g 'Hello World'";
  } else if (isHexChosen) {
    document.getElementById("inputtext").placeholder =
      "e.g '72 101 108 108 111 32 87 111 114 108 100'";
  } else if (isFromHexChosen) {
    document.getElementById("inputtext").placeholder =
      "e.g '48 65 6C 6C 6F 20 57 6F 72 6C 64'";
  }
}
