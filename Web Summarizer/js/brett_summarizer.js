var requested = false;

function handle_fetch_results(){
    if (this.status != 200)
        return;
    requested = false;
    const url = document.getElementById("url").value;
    document.getElementById("url").value = "";
    document.getElementById("results").innerHTML = this.responseText;
}

function handle_update_estimate(){
    console.log(this.responseText);
    if (this.status != 200)
        return;
    const json = JSON.parse(this.responseText);
    const element = document.getElementById("results");
    element.className = "";
    element.innerHTML = "Estimated Time Remaining: " + json.days + " Days " + json.hours + " Hours " + json.minutes + " Minutes " + json.seconds + " Seconds";
}

function check_for_completion(){
    if (!requested)
        return;
    const url = document.getElementById("url").value;

    if (url == null || url == "")
        return;

    const fetch_request = new XMLHttpRequest();
    fetch_request.onload = handle_fetch_results;
    fetch_request.open("POST", "https://cosc4p02.tpgc.me/s/request", true);
    fetch_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    fetch_request.send(url);
}

function summarize_url(){
    const url = document.getElementById("url").value;
    console.log(url);

    if (url == null || url == "")
    {
        alert("Please provide a URL!");
        return;
    }

    requested = true;

    const summarizer_request = new XMLHttpRequest();
    summarizer_request.open("POST", "https://cosc4p02.tpgc.me/s/request", true);
    summarizer_request.onload = function() {
        console.log(this.status);
    }
    summarizer_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    summarizer_request.send(url);

    const estimate_request = new XMLHttpRequest();
    estimate_request.onload = handle_update_estimate;
    estimate_request.open("POST", "https://cosc4p02.tpgc.me/s/request", true);
    estimate_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    estimate_request.send(url);
}

function init(){
    setInterval(check_for_completion, 5000);
    // setup event handlers
    document.getElementById('submit').onsubmit = summarize_url;
}
window.onload = init;