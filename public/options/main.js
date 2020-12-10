document.onload = openPage();

var checkboxes;
var engineRadio;

function openPage() {
    // SET UP PAGE AND LOAD SAVED VALUES

    //LOCATION
    var lat = localStorage.getItem("lattitude") || 0;
    var lon = localStorage.getItem("longitude") || 0;

    document.getElementById("lat").value = lat.toString();
    document.getElementById("lon").value = lon.toString();

    // BACKGROUND
    document.getElementById("cat").value = localStorage.getItem("search") || "nasa";
    checkboxes = document.querySelectorAll('input[type=checkbox]');
    engineRadio = document.getElementsByName("engine");

    for (var i = 0; i < checkboxes.length; i++) {
        var current = checkboxes[i];
        if (localStorage.getItem(current.value) != null) {
            if (localStorage.getItem(current.value) == "true") {
                current.checked = true;
            } else {
                current.checked = false;
            }
        } else {
            current.checked = true;
        }
    }

    var engine = localStorage.getItem("enginee") || "g";
    if (engine == "g") {
        document.getElementById("G").checked = true;
    } else if (engine == "d") {
        document.getElementById("D").checked = true;
    } else if (engine == "e") {
        document.getElementById("E").checked = true;
    } else if (engine == "w") {
        document.getElementById("W").checked = true;
    }
}

for (var i = 0; i < engineRadio.length; i++) {
    engineRadio[i].addEventListener('input', function () {
        localStorage.setItem("enginee", this.value);
    });
}

for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('change', function () {
        if (this.checked) {
            localStorage.setItem(this.value, this.checked);
        } else {
            localStorage.setItem(this.value, this.checked);
        }
    });
}

document.getElementById("get-location").addEventListener("click", getPos);

function getPos() {
    const options = {
        enableHighAccuracy: true
    };
    navigator.geolocation.getCurrentPosition(getLocation, getError, options);
}

function getLocation(position) {
    document.getElementById("lat").value = position.coords.latitude.toFixed(2);
    document.getElementById("lon").value = position.coords.longitude.toFixed(2);
    console.log(position);
}

function getError(error) {
    console.log("Error while getting location from settings page");
    console.log(error);
}

document.getElementById("save-location").addEventListener("click", saveCoords);

function saveCoords() {
    localStorage.setItem("lattitude", document.getElementById("lat").value);
    localStorage.setItem("longitude", document.getElementById("lon").value);
    localStorage.setItem("wooo", 0);
}

document.getElementById("save-category").addEventListener("click", saveCategory);

function saveCategory() {
    localStorage.setItem("search", document.getElementById("cat").value);
    localStorage.setItem("ttt", 0);
}