import { db } from "./firebase.js";
import { auth } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🎯 ICONS
const userIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    iconSize: [32, 32]
});

const jeepIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    iconSize: [32, 32]
});

const animalIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    iconSize: [32, 32]
});

window.addEventListener("load", () => {

    if (!window.map) {
        console.error("Map not found");
        return;
    }

    let userMarker = null;
    let jeepMarker = null;
    let animalMarkers = {};
    let alertShown = {}; // prevent repeated alerts

    function getDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }


    onAuthStateChanged(auth, (currentUser) => {

        if (!currentUser) return;

        onValue(ref(db, "safariSystem"), (snapshot) => {

        const data = snapshot.val();
        if (!data) return;

        const currentUser = auth.currentUser;

        if (!currentUser) {
            console.log("Waiting for auth...");
            return;
        }

        // ✅ FIXED DATA PATHS
        const animals = data.animals || {};
        const jeeps = data.jeep || {};
        const users = data.user || {};

        // ⚠️ since you are NOT using UID mapping
        // const user = users["user1"]; // manually picking user
        const user = users[currentUser.uid];

        // ================= USER =================
        if (user) {
            const coord = [user.location.y, user.location.x];

            if (!userMarker) {
                userMarker = L.marker(coord, { icon: userIcon })
                    .addTo(map)
                    .bindPopup("👤 You");
            } else {
                userMarker.setLatLng(coord);
            }
        }

        // ================= JEEP =================
        let assignedJeep = null;

        for (let id in jeeps) {
            if (jeeps[id].users && jeeps[id].users[currentUser.uid]) {
                assignedJeep = jeeps[id];
                break;
            }
        }

        if (assignedJeep) {
            const coord = [assignedJeep.location.y, assignedJeep.location.x];

            if (!jeepMarker) {
                jeepMarker = L.marker(coord, { icon: jeepIcon })
                    .addTo(map)
                    .bindPopup("🚙 Jeep");
            } else {
                jeepMarker.setLatLng(coord);
            }
        }

        // ================= ANIMALS =================
        for (let id in animals) {

            let animal = animals[id];

            // ⚠️ SAFETY CHECK (important)
            if (!animal || !animal.location) continue;

            let coord = [animal.location.y, animal.location.x];

            if (!animalMarkers[id]) {

                let marker = L.marker(coord, {
                    icon: L.divIcon({
                        className: 'pulse'
                    })
                })
                .addTo(map)
                .bindPopup(`🐾 ${animal.type}`);

                animalMarkers[id] = marker;

            } else {
                animalMarkers[id].setLatLng(coord);
            }

            // ================= ALERT =================
            if (user && !alertShown[id]) {

                let distance = getDistance(
                    user.location.x,
                    user.location.y,
                    animal.location.x,
                    animal.location.y
                );

                if (distance < 120) {
                    alertShown[id] = true;
                    showAnimalAlert(animal.type, coord, id);
                }
            }
        }

    });

    });

    

});

function showAnimalAlert(type, coord, id) {

    const alertBox = document.createElement("div");

    alertBox.innerHTML = `
        <div style="
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: rgba(0, 50, 0, 0.95);
            border: 1px solid #00ff88;
            padding: 16px 20px;
            border-radius: 12px;
            color: white;
            z-index: 9999;
            box-shadow: 0 0 20px rgba(0,255,100,0.3);
            font-family: Arial;
        ">
            <b>⚠️ ${type} nearby!</b><br><br>
            Stay alert. Do you want to view location?
            <br><br>
            <button id="viewBtn" style="
                background:#00ff88;
                border:none;
                padding:6px 10px;
                border-radius:6px;
                cursor:pointer;
                margin-right:10px;
            ">View</button>

            <button id="closeBtn" style="
                background:#222;
                color:white;
                border:none;
                padding:6px 10px;
                border-radius:6px;
                cursor:pointer;
            ">Ignore</button>
        </div>
    `;

    document.body.appendChild(alertBox);

    document.getElementById("viewBtn").onclick = () => {
        map.setView(coord, -1);
        alertBox.remove();
    };

    document.getElementById("closeBtn").onclick = () => {
        alertBox.remove();
    };
}