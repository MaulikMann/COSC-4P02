document.addEventListener("DOMContentLoaded", function() {
    var theme = localStorage.getItem('darkModeEnabled');
    if (theme === 'true') {
        // If the theme is 'dark', add the 'dark-theme' class to the body
        document.body.classList.add('dark-theme');
    } else {
        // If the theme is not 'dark', remove the 'dark-theme' class from the body
        document.body.classList.remove('dark-theme');
    }
});//moved to seperate Signedin file
function copyToClipboard() {
    var textToCopy = document.getElementById("ShortResultText").innerText;

    var tempTextArea = document.createElement("textarea");
    tempTextArea.value = textToCopy;

    tempTextArea.style.position = "absolute";
    tempTextArea.style.left = "-9999px";

    document.body.appendChild(tempTextArea);

    tempTextArea.select();
    document.execCommand("copy");

    document.body.removeChild(tempTextArea);

}
function copySummary() {
    var textToCopy = document.getElementById("sumResultText").innerText;

    var tempTextArea = document.createElement("textarea");
    tempTextArea.value = textToCopy;

    tempTextArea.style.position = "absolute";
    tempTextArea.style.left = "-9999px";

    document.body.appendChild(tempTextArea);

    tempTextArea.select();
    document.execCommand("copy");

    document.body.removeChild(tempTextArea);

}
function speakText() {
    var inputText = document.getElementById("sumResultText").innerText;

    if ('speechSynthesis' in window) {
        var synthesis = window.speechSynthesis;
        var utterance = new SpeechSynthesisUtterance(inputText)

        synthesis.speak(utterance);
    } else {
        alert("Your browser does not support the SpeechSynthesis API.");
    }
}
//Switches summarery page from main to result page
function sumResult(){
    var resultBody = document.getElementById("sumBody");
    var mainPage = document.getElementById("mainCon");

    if (resultBody.style.display !== "none") {
        resultBody.style.display = "none";
        mainPage.style.display = "block"; 
    } else {
        mainPage.style.display = "none";
        resultBody.style.display = "block";
    }
}
//Switches url page from main to result page
function urlResult(){
    var resultBody = document.getElementById("urlBody");
    var mainPage = document.getElementById("mainURLCon");

    if (resultBody.style.display !== "none") {
        resultBody.style.display = "none";
        mainPage.style.display = "block"; 
    } else {
        mainPage.style.display = "none";
        resultBody.style.display = "block";
    }
}

    function toggleDarkMode() {
      var darkModeToggle = document.getElementById('darkModeToggle');
      if (darkModeToggle.checked) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('darkModeEnabled', 'true'); // Store dark mode preference
      } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('darkModeEnabled', 'false'); // Remove dark mode preference
      }
    }

