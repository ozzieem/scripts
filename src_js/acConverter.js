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

function convertToTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function changePlaceholderText() {
  var isPhoneticChosen = document.getElementById("ToPhonetic").checked;
  if (isPhoneticChosen) {
    document.getElementById("inputtext").placeholder = "e.g 'BAC749'";
  } else {
    document.getElementById("inputtext").placeholder =
      "e.g 'Bravo Alpha Charlie 749'";
  }
}

function convertToPhonetic(incText) {
  var newText = "";
  for (var i = 0; i < incText.length; i++) {
    var char = incText[i];
    if (isType(char, "alph")) {
      newText += alphabet[char] + " ";
    } else if (isType(char, "digit")) {
      newText += digits[char] + " ";
    } else {
      newText += char + " ";
    }
  }
  return newText;
}

function convertFromPhonetic(incText) {
  var newText = "";

  incText = convertToTitleCase(incText).split(/[\s,.]+/);
  console.log(incText);

  var alphValues = Object.keys(alphabet).map(function(key) {
    return alphabet[key];
  });
  var digitValues = Object.keys(digits).map(function(key) {
    return digits[key];
  });

  for (var i = 0; i < incText.length; i++) {
    var word = incText[i];
    if (alphValues.indexOf(word) > -1) {
      newText += word[0].toUpperCase();
    } else if (digitValues.indexOf(word) > -1) {
      newText += digitValues.indexOf(word);
    } else {
      newText += word;
    }
  }
  return newText;
}

function convertText() {
  document.getElementById("convertedValue").innerHTML = "";

  preprocessed_text = document.getElementById("inputtext").value.toUpperCase();
  var postprocessed_text = "";

  if (preprocessed_text == "") {
    document.getElementById("convertedValue").innerHTML =
      "<h2><font color='red'>Enter a value!</font></h2>";
  } else {
    var isPhoneticChosen = document.getElementById("ToPhonetic").checked;
    if (isPhoneticChosen) {
      postprocessed_text = convertToPhonetic(preprocessed_text);
    } else {
      postprocessed_text = convertFromPhonetic(preprocessed_text);
    }

    document.getElementById("convertedValue").innerHTML =
      "<h2>" + preprocessed_text + "</>" + "<h1>" + postprocessed_text + "</>";
  }
}

var digits = {
  0: "Ze-ro",
  1: "Wun",
  2: "Too",
  3: "Tree",
  4: "Fow-er",
  5: "Fife",
  6: "Six",
  7: "Sev-en",
  8: "Ait",
  9: "Nin-er"
};

var alphabet = {
  A: "Alpha",
  B: "Bravo",
  C: "Charlie",
  D: "Delta",
  E: "Echo",
  F: "Foxtrot",
  G: "Golf",
  H: "Hotel",
  I: "India",
  J: "Juliet",
  K: "Kilo",
  L: "Lima",
  M: "Mike",
  N: "November",
  O: "Oscar",
  P: "Papa",
  Q: "Quebec",
  R: "Romeo",
  S: "Sierra",
  T: "Tango",
  U: "Uniform",
  V: "Victor",
  W: "Whiskey",
  X: "Xray",
  Y: "Yankee",
  Z: "Zulu"
};
