var roadMode = "asphalt";

const insertMap = () => {
    //create element that embeds an openstreetmap with current gps coordinates, that will be inserted into a div with the id "map-container"
    var map = document.createElement("iframe");
    map.src = "https://www.openstreetmap.org/export/embed.html";
    map.id = "map";
    map.style.width = "100%";
    //height half of screen height
    map.style.height = window.innerHeight / 2 + "px";
    //no padding no margin
    map.style.padding = "0";
    map.style.margin = "0";
    map.style.border = "0";
    //insert map into div with id "map-container"
    document.getElementById("map-container").appendChild(map);
    //get current gps coordinates
    navigator.geolocation.getCurrentPosition(function (position) {
        //get current latitude and longitude
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        //set map src to current gps coordinates
        map.src = "https://www.openstreetmap.org/export/embed.html?bbox=" + lon + "%2C" + lat + "%2C" + lon + "%2C" + lat + "&amp;layer=mapnik&amp;marker=" + lat + "%2C" + lon;
    });
    //update map everytime gps coordinates change and not faster than every 2 seconds
    navigator.geolocation.watchPosition(function (position) {
        //get current latitude and longitude
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        console.log(JSON.stringify(position));
        console.log("JSON.stringify(position)");
        //set map src to current gps coordinates
        map.src = "https://www.openstreetmap.org/export/embed.html?bbox=" + lon + "%2C" + lat + "%2C" + lon + "%2C" + lat + "&amp;layer=mapnik&amp;marker=" + lat + "%2C" + lon;
    }, function (error) {
        console.log(error);
        console.log(error.code);
        console.log(error.message);
        console.log("error");
    }, {
        enableHighAccuracy: true,
        timeout: 2000, //2 seconds
        maximumAge: 0
    });
};

const createRoadButton = (type) => {
    //create button to commence road tracking
    var button = document.createElement("button");
    button.id = type + "-button";
    button.innerHTML = type;
    button.style.width = "100%";
    button.addEventListener("click", () => {
        //set road mode to type
        roadMode = type;
    });
    return button;
};

const insertButtons = () => {
    var asphaltButton = createRoadButton('Asphalt');
    var gravelButton = createRoadButton('Gravel');
    var dirtButton = createRoadButton('Dirt');
    var pavedButton = createRoadButton('Paved');

    //create button to stop tracking
    var stopButton = document.createElement("button");
    stopButton.id = "stop-button";
    stopButton.innerHTML = "Stop";
    stopButton.style.width = "100%";
    stopButton.addEventListener("click", () => {
        //stop tracking
        navigator.geolocation.clearWatch(watchID);
    });

    //create button to export logs
    var exportButton = document.createElement("button");
    exportButton.id = "export-button";
    exportButton.innerHTML = "Export";
    exportButton.style.width = "100%";
    exportButton.addEventListener("click", () => {
        //get logs from local storage
        var logs = JSON.parse(localStorage.getItem("logs"));
        //create csv string
        var csv = "type,latitude,longitude,timestamp,accuracy,altitude,altitudeAccuracy,heading,speed\n";
        //add logs to csv string
        logs.forEach(log => {
            csv += log.type + "," + log.latitude + "," + log.longitude + "," + log.timestamp + "," + log.accuracy + "," + log.altitude + "," + log.altitudeAccuracy + "," + log.heading + "," + log.speed + "\n";
        });
        //create a link to download the csv file
        var link = document.createElement("a");
        link.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
        link.target = "_blank";
        link.download = "logs.csv";
        link.click();
    });

    //insert buttons into div with id "button-container"
    document.getElementById("button-container").appendChild(asphaltButton);
    document.getElementById("button-container").appendChild(gravelButton);
    document.getElementById("button-container").appendChild(dirtButton);
    document.getElementById("button-container").appendChild(pavedButton);
    document.getElementById("button-container").appendChild(stopButton);
    document.getElementById("button-container").appendChild(exportButton);

};

//after page loaded, without jquery
window.addEventListener("load", async () => {
    //request location permission on mobile webbrowser
    if (navigator.permissions) {
        await navigator.permissions.query({
            name: 'geolocation'
        });
    }
    //insert button to press to trigger location permission request
    var button = document.createElement("button");
    button.id = "location-button";
    button.innerHTML = "Location";
    button.style.width = "100%";
    button.addEventListener("click", () => {
        //request location permission on mobile webbrowser
        if (navigator.permissions) {
            navigator.permissions.query({
                name: 'geolocation'
            });
        }
    });
    document.getElementById("button-container").appendChild(button);
    //on mobile devices overwrite console log to display console logs on screen instead of in console
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {

        //append a console container to the body
        var consoleContainer = document.createElement("div");
        consoleContainer.id = "console-container";
        document.body.appendChild(consoleContainer);
        console.log = function (message) {
            var log = document.createElement("p");
            log.innerHTML = message;
            document.getElementById("console-container").appendChild(log);
        };
    }
    //insert map
    insertMap();

    //insert buttons
    insertButtons();
});