// ✅ Create IMAGE-BASED MAP
var map = L.map('map', {
    crs: L.CRS.Simple   // 🔥 IMPORTANT
});

// ✅ Define image size (adjust if needed)
var bounds = [[0, 0], [800, 800]];


// ✅ Load your jungle image (same folder as HTML)
L.imageOverlay('jungle-map.jpeg', bounds).addTo(map);


// ✅ Fit map to image
map.fitBounds(bounds);


// 🐾 Add animals (use IMAGE coordinates now, not lat/lng)
function addAnimal(x, y, name, img) {

    var icon = L.divIcon({
        className: 'pulse'
    });

    L.marker([x, y], { icon: icon }).addTo(map)
        .bindTooltip(`
            <b>${name}</b><br>
            <img src="${img}" width="80">
        `, {
            permanent: true,
            direction: 'top'
        });
}


// 🐅 Example animals (IMPORTANT: use small values)
addAnimal(200, 300, "Tiger 🐅", "../assets/tiger.png");
addAnimal(400, 500, "Elephant 🐘", "../assets/elephant.png");
addAnimal(600, 200, "Leopard 🐆", "../assets/leopard.png");

//index page
// 🌙 Background animation (auto jungle effect)

setInterval(() => {
    document.body.style.background =
        document.body.style.background === "rgb(11, 29, 11)"
            ? "#061306"
            : "#0b1d0b";
}, 5000);

// 👤 Role buttons (basic logic)
document.querySelectorAll('.role-select button').forEach(btn => {
    btn.addEventListener('click', () => {
        alert("Redirect to " + btn.innerText + " Login Page");
    });
});

//online ticket booking 
// 🌙 Background animation (ALL pages safe)
setInterval(() => {
    document.body.style.background =
        document.body.style.background === "rgb(11, 29, 11)"
            ? "#061306"
            : "#0b1d0b";
}, 5000);


// 👤 ROLE BUTTONS (ONLY IF EXISTS)
let roleButtons = document.querySelectorAll('.role-select button');

if (roleButtons.length > 0) {
    roleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            alert("Redirect to " + btn.innerText + " Login Page");
        });
    });
}


// 🎟️ TICKET PAGE LOGIC (ONLY IF EXISTS)
document.addEventListener("DOMContentLoaded", function () {

    let ticketBox = document.getElementById("ticketBox");

    // 👉 RUN ONLY ON TICKET PAGE
    if (ticketBox) {

        console.log("Ticket page detected ✅");

        for (let i = 1; i <= 10; i++) {
            let div = document.createElement("div");
            div.className = "ticket-box";
            div.innerText = i;

            div.onclick = function () {
                document.querySelectorAll(".ticket-box")
                    .forEach(b => b.classList.remove("selected"));

                div.classList.add("selected");
            };

            ticketBox.appendChild(div);
        }
    }

});

//Safari Details Page
// 🚙 Custom Jeep Icon
var jeepIcon = L.icon({
    iconUrl: '../assets/jeep.png',   // add jeep image here
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});

// 🗺️ Path for jeep (image-map coordinates OR lat/lng depending on your map)
var path = [
    [200, 200],
    [300, 400],
    [500, 450],
    [600, 300]
];

var jeep = L.marker(path[0], { icon: jeepIcon }).addTo(map);

let i = 0;

setInterval(() => {
    i = (i + 1) % path.length;
    jeep.setLatLng(path[i]);
}, 2000);