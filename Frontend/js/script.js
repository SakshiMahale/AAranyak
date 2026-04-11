// ================= AUTO INIT TICKET DB =================
if (window.location.pathname.includes("ticket.html")) {

    import("./firebase.js").then(({ db }) => {
        import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js").then(({ ref, get, set }) => {

            const systemRef = ref(db, "ticketSystem");

            get(systemRef).then((snapshot) => {

                // ✅ If NOT exists → create automatically
                if (!snapshot.exists()) {

                    set(systemRef, {
                        totalSeats: 100,
                        onlineLimit: 75,
                        bookedOnline: 0
                    });

                    console.log("✅ Ticket system initialized automatically");
                }

            });

        });
    });

}
// ====================================ROLE BASED NAVBAR==========================================

document.addEventListener("DOMContentLoaded", function () {

    const nav = document.getElementById("navLinks");
    if (!nav) return;

    const role = localStorage.getItem("role");

    // 👑 ADMIN NAVBAR
    if (role === "admin") {
        nav.innerHTML = `
        <a href="Role_Index.html">Home</a>
        <a href="ticket.html">Online Ticket Booking</a>
        <a href="jeep.html">Jeep Tracker</a>
        <a href="AdminPanel.html">Admin Panel</a>
        <a href="history.html">History</a>
        <button onclick="logout()">Logout</button>
    `;
    }
    // 👤 USER NAVBAR
    else if (role === "user") {
        nav.innerHTML = `
            <a href="Role_Index.html">Home</a>
            <a href="map.html">Map</a>
            <a href="safariDetail.html">Safari Details</a>
            <a href="ticket.html">Book Ticket</a>
            <a href="help.html">Help & Support</a>
            <a href="animalStats.html">AnimalStats</a>
            <button onclick="logout()">Logout</button>
        `;
    }

    // 🌿 NO ROLE → NO NAVBAR
    else {
        nav.innerHTML = ``; // 🔥 EMPTY (IMPORTANT)
    }

});

//=============================LOGIN/Register USER===============================================
document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');

    if (!loginBtn || !registerBtn || !loginForm || !registerForm) return;

    function showLogin() {
        loginForm.classList.add('active-form');
        registerForm.classList.remove('active-form');
        loginBtn.classList.add('active');
        registerBtn.classList.remove('active');
    }

    function showRegister() {
        registerForm.classList.add('active-form');
        loginForm.classList.remove('active-form');
        registerBtn.classList.add('active');
        loginBtn.classList.remove('active');
    }

    // Top toggle buttons
    loginBtn.addEventListener('click', showLogin);
    registerBtn.addEventListener('click', showRegister);

    // Toggle via text links inside forms
    if (switchToRegister) switchToRegister.addEventListener('click', showRegister);
    if (switchToLogin) switchToLogin.addEventListener('click', showLogin);
});

// ============================= FIREBASE AUTH (SAFE) =============================
if (document.getElementById("loginForm") || document.getElementById("registerForm")) {

    import("./firebase.js").then(({ auth, db }) => {

        import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js").then((authModule) => {
            import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js").then((dbModule) => {

                const {
                    createUserWithEmailAndPassword,
                    signInWithEmailAndPassword
                } = authModule;

                const { ref, set, get, child } = dbModule;

                // ================= REGISTER =================
                document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
                    e.preventDefault();

                    const username = document.getElementById("regUsername").value;
                    const email = document.getElementById("regEmail").value;
                    const password = document.getElementById("regPassword").value;
                    const confirmPassword = document.getElementById("regConfirmPassword").value;

                    if (password !== confirmPassword) {
                        alert("Passwords do not match!");
                        return;
                    }

                    try {
                        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                        const user = userCredential.user;

                        await set(ref(db, "users/" + user.uid), {
                            username,
                            email
                        });

                        alert("Registration successful!");
                    } catch (error) {
                        alert(error.message);
                    }
                });

                // ================= LOGIN =================
                document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
                    e.preventDefault();

                    const username = document.getElementById("loginUsername").value;
                    const password = document.getElementById("loginPassword").value;

                    // 👑 ADMIN LOGIN (HARDCODED)
                    if (username === "admin" && password === "admin123") {
                        localStorage.setItem("role", "admin");
                        window.location.href = "Role_Index.html";
                        return;
                    }

                    try {
                        const dbRef = ref(db);
                        const snapshot = await get(child(dbRef, "users"));

                        let foundUser = null;

                        if (snapshot.exists()) {
                            snapshot.forEach((childSnap) => {
                                const data = childSnap.val();
                                if (data.username === username) {
                                    foundUser = data;
                                }
                            });
                        }

                        if (!foundUser) {
                            alert("User not found!");
                            return;
                        }

                        await signInWithEmailAndPassword(auth, foundUser.email, password);

                        // 👤 USER LOGIN
                        localStorage.setItem("role", "user");

                        window.location.href = "Role_Index.html";

                    } catch (error) {
                        alert("Login failed: " + error.message);
                    }
                });

            });
        });

    });

}

//=============================TICKET BOOKING===============================================
let selectedSeats = [];

// Create seats
document.addEventListener("DOMContentLoaded", function () {

    let seatBox = document.getElementById("seatBox");

    if (seatBox) {

        seatBox.innerHTML = ""; // prevent duplication

        for (let i = 1; i <= 12; i++) {

            let div = document.createElement("div");
            div.className = "ticket-box";
            div.innerText = i;

            div.onclick = function () {

                if (selectedSeats.includes(i)) {
                    selectedSeats = selectedSeats.filter(s => s !== i);
                    div.classList.remove("selected");
                } else {
                    selectedSeats.push(i);
                    div.classList.add("selected");
                }

                console.log("Selected Seats:", selectedSeats); // DEBUG
                updateTotal();
            };

            seatBox.appendChild(div);
        }
    }

    // user can select valid dates only 
    const dateInput = document.getElementById("date");
    if (!dateInput) return;

    const today = new Date();

    // Format YYYY-MM-DD
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    const minDate = `${yyyy}-${mm}-${dd}`;

    // ✅ Restrict past dates
    dateInput.setAttribute("min", minDate);

    // update total on input change
    ["male", "female", "child"].forEach(id => {
        document.getElementById(id)?.addEventListener("input", updateTotal);
    });

});


// Pricing logic (UPDATED)
function updateTotal() {

    let male = parseInt(document.getElementById("male").value) || 0;
    let female = parseInt(document.getElementById("female").value) || 0;
    let child = parseInt(document.getElementById("child").value) || 0;

    let total = (male * 500) + (female * 400) + (child * 200);

    document.getElementById("total").innerText = "Total: ₹" + total;
}


// Booking function
function bookTicket() {

    let name = document.getElementById("name").value;
    let age = document.getElementById("age").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;

    let male = parseInt(document.getElementById("male").value) || 0;
    let female = parseInt(document.getElementById("female").value) || 0;
    let child = parseInt(document.getElementById("child").value) || 0;

    let warning = document.getElementById("warning");
    warning.innerText = "";

    let totalPeople = male + female + child;
    let totalSeats = selectedSeats.length;

    if (!name || !age || !date || !time) {
        warning.innerText = "⚠️ Please fill all fields!";
        return;
    }

    if (totalSeats !== totalPeople) {
        warning.innerText = `⚠️ Seats (${totalSeats}) must equal people (${totalPeople})`;
        return;
    }

    let totalAmount = (male * 500) + (female * 400) + (child * 200);

    let data = {
        name, age, date, time,
        male, female, child,
        seats: selectedSeats,
        totalAmount
    };

    // ✅ STORE DATA
    localStorage.setItem("bookingData", JSON.stringify(data));

    // ✅ REDIRECT TO PAYMENT
    window.location.href = "payment.html";
}

//==========Ticket booking======================
// ================= PAYMENT GATEWAY =================
let selectedMethod = "";

// select payment method
function selectMethod(method) {
    selectedMethod = method;

    document.getElementById("selected").innerText =
        "Selected: " + method;
}

//UI CONTROL FOR ONLINE TICKET SYSTEM ADMIN
let role = localStorage.getItem("role");

document.addEventListener("DOMContentLoaded", () => {

    if (window.location.pathname.includes("payment.html")) {

        if (role === "admin") {

            let container = document.querySelector(".payment-options");

            if (container) {
                container.innerHTML = `
                    <button onclick="selectMethod('GPay')">GPay</button>
                    <button onclick="selectMethod('Cash')">Cash</button>
                `;
            }

            let title = document.querySelector(".payment-container h2");
            if (title) {
                title.innerText = "Admin Payment Panel";
            }
        }

    }

});

function getSlotTimings(slot) {

    const today = new Date();

    let start, end;

    if (slot === "6-9") {
        start = new Date(today.setHours(6, 0, 0, 0));
        end = new Date(today.setHours(9, 0, 0, 0));
    }
    else if (slot === "10-1") {
        start = new Date(today.setHours(10, 0, 0, 0));
        end = new Date(today.setHours(13, 0, 0, 0));
    }
    else if (slot === "3-6") {
        start = new Date(today.setHours(15, 0, 0, 0));
        end = new Date(today.setHours(18, 0, 0, 0));
    }

    return {
        startTime: start.getTime(),
        endTime: end.getTime()
    };
}

// pay button
async function payNow() {

    let status = document.getElementById("status");

    if (!selectedMethod) {
        status.innerText = "⚠️ Select payment method!";
        status.style.color = "red";
        return;
    }

    status.style.color = "yellow";
    status.innerText = "⏳ Processing Payment...";

    setTimeout(async () => {

        try {

            const { db, auth } = await import("./firebase.js");

            const {
                ref,
                get,
                update,
                push,
                set
            } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js");

            const currentUser = auth.currentUser;

            if (!currentUser) {
                alert("❌ User not logged in");
                return;
            }

            const uid = currentUser.uid;

            let role = localStorage.getItem("role");

            let data = JSON.parse(localStorage.getItem("bookingData"));

            if (!data) {
                status.innerText = "❌ No booking data!";
                return;
            }

            let seatsRequested = data.seats.length;

            // ================= TICKET SYSTEM =================
            const systemRef = ref(db, "ticketSystem");
            const snapshot = await get(systemRef);

            if (!snapshot.exists()) {
                alert("❌ Ticket system not initialized");
                return;
            }

            const dbData = snapshot.val();

            let booked = dbData.bookedOnline;
            let limit = dbData.onlineLimit;

            let remaining = limit - booked;

            if (remaining <= 0) {
                status.innerText = "❌ Booking full.";
                return;
            }

            if (seatsRequested > remaining) {
                status.innerText = `⚠️ Only ${remaining} seats left`;
                return;
            }

            // ================= SAVE USER =================
            const slotData = getSlotTimings(data.time);

            // calculate jeep start time (15 min delay)
            let jeepIndexUsed = 0;

            // await set(ref(db, "safariSystem/user/" + uid), {
            //     name: data.name,
            //     bookingDate: data.date,
            //     seatsBooked: seatsRequested,
            //     slot: data.time,
            //     startTime: jeepStartTime,
            //     endTime: slotData.endTime
            // });

            console.log("👤 User saved:", uid);

            // ================= JEEP ASSIGN =================
            let assignedJeepId = null;

            for (let i = 1; i <= 6; i++) {

                let jeepId = "jeep" + i;

                let jeepRef = ref(db, "safariSystem/jeep/" + jeepId);
                let jeepSnap = await get(jeepRef);
                let jeep = jeepSnap.val();

                let currentSeats = jeep?.seatCount || 0;

                if (!jeep || currentSeats + seatsRequested <= 12) {

                    // ✅ Calculate staggered time (15 min gap)
                    const jeepStartTime = slotData.startTime + ((i - 1) * 15 * 60 * 1000);

                    // // ✅ SAVE USER (ONLY HERE)
                    // await set(ref(db, "safariSystem/user/" + uid), {
                    //     name: data.name,
                    //     bookingDate: data.date,
                    //     seatsBooked: seatsRequested,
                    //     slot: data.time,
                    //     startTime: jeepStartTime,
                    //     endTime: slotData.endTime,
                    //     jeepId: jeepId
                    // });

                    // ✅ CREATE or UPDATE JEEP
                    if (!jeep) {
                        await set(jeepRef, {
                            driver: "Driver " + i,
                            seatCount: seatsRequested,
                            users: {
                                [uid]: seatsRequested
                            },
                            startTime: jeepStartTime,
                            endTime: slotData.endTime,
                            location: { x: 800, y: 600 }
                        });
                    } else {
                        let updatedUsers = jeep.users || {};
                        updatedUsers[uid] = seatsRequested;

                        await update(jeepRef, {
                            [`users/${uid}`]: (jeep?.users?.[uid] || 0) + seatsRequested,
                            seatCount: currentSeats + seatsRequested
                        });
                    }

                    assignedJeepId = jeepId;
                    break;
                }
            }

            // ✅ SAVE USER AFTER JEEP ASSIGNED
            const userRef = ref(db, "safariSystem/user/" + uid);
            const existingUserSnap = await get(userRef);

            let newSeatCount = seatsRequested;

            if (existingUserSnap.exists()) {
                const oldData = existingUserSnap.val();
                newSeatCount += oldData.seatsBooked || 0;
            }

            await set(userRef, {
                name: data.name,
                bookingDate: data.date,
                seatsBooked: newSeatCount, // ✅ accumulated
                slot: data.time,
                startTime: slotData.startTime,
                endTime: slotData.endTime,
                jeepId: assignedJeepId
            });
            if (!assignedJeepId) {
                alert("❌ All jeeps full");
                return;
            }

            console.log("🚙 Assigned Jeep:", assignedJeepId);

            // ================= UPDATE SEATS =================
            await update(systemRef, {
                bookedOnline: booked + seatsRequested
            });

            // ================= SAVE BOOKING =================
            await push(ref(db, "confirmedBookings"), {
                ...data,
                userId: uid,
                jeepId: assignedJeepId,
                paymentMethod: selectedMethod,
                paymentStatus: "SUCCESS",
                bookedBy: role,
                timestamp: Date.now()
            });

            console.log("✅ Booking saved");

            // ================= UI =================
            status.style.color = "lightgreen";
            status.innerText = "✅ Payment Successful!";

            // ✅ SAVE INVOICE DATA BEFORE CLEARING
            localStorage.setItem("invoiceData", JSON.stringify({
                ...data,
                paymentMethod: selectedMethod,
                paymentStatus: "SUCCESS",
                jeepId: assignedJeepId || "Not Assigned Yet"
            }));

            localStorage.removeItem("bookingData");

            // ✅ REDIRECT TO INVOICE PAGE
            setTimeout(() => {
                window.location.href = "invoice.html";
            }, 2000);

            window.onload = () => {
                setTimeout(downloadInvoice, 1000);
            };

            const delay = slotData.endTime - Date.now();

            if (delay > 0) {

                setTimeout(async () => {

                    try {

                        const historyRef = ref(db, "history/" + uid);
                        const userRef = ref(db, "safariSystem/user/" + uid);

                        const userSnap = await get(userRef);

                        if (userSnap.exists()) {

                            const userData = userSnap.val();

                            // ✅ MOVE TO HISTORY
                            await push(historyRef, {
                                ...userData,
                                completedAt: Date.now()
                            });

                            // ✅ REMOVE USER
                            await set(userRef, null);

                            // ✅ REMOVE FROM ONLY ASSIGNED JEEP
                            const jeepId = userData.jeepId;

                            await set(ref(db, `safariSystem/jeep/${jeepId}/users/${uid}`), null);

                            console.log("📦 Moved to history AFTER slot end");
                        }

                    } catch (err) {
                        console.error("History move error:", err);
                    }

                }, delay);

            } else {
                console.log("⚠️ Slot already expired → not scheduling history move");
            }

        } catch (error) {
            console.error("🔥 ERROR:", error);
            status.innerText = "❌ Booking failed!";
        }

    }, 1500);
}

// 🔥 MAKE FUNCTIONS GLOBAL
window.logout = logout;
window.bookTicket = bookTicket;
window.selectMethod = selectMethod;
window.payNow = payNow;

function logout() {
    localStorage.removeItem("role");
    window.location.href = "index.html";
}

import { db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const sensorRef = ref(db, "sensor");

onValue(sensorRef, (snapshot) => {

    const data = snapshot.val();

    if (!data) {
        console.log("No sensor data found!");
        return;
    }

    console.log("🔥 SENSOR DATA:", data); // DEBUG

    const temp = data.temp || 0;
    const humidity = data.humidity || 0;
    const gas = data.gas || 0;
    const motion = data.motion || 0;

    // ✅ Update UI
    document.getElementById("temp").innerText = temp;
    document.getElementById("humidity").innerText = humidity;
    document.getElementById("wind").innerText = gas;

    // ✅ Status
    updateStatus("tempStatus", temp, 30, 40);
    updateStatus("humidityStatus", humidity, 70, 85);
    updateStatus("windStatus", gas, 2000, 3000);

    // 🔥 Fire
    detectFire(temp, gas, motion);
});

function updateStatus(id, value, warn, danger) {

    const el = document.getElementById(id);

    if (value > danger) {
        el.innerText = "CRITICAL";
        el.className = "status-tag danger";
    }
    else if (value > warn) {
        el.innerText = "WARNING";
        el.className = "status-tag warning";
    }
    else {
        el.innerText = "NORMAL";
        el.className = "status-tag normal";
    }
}

function detectFire(temp, gas, motion) {

    let fire = false;

    if (
        temp > 45 ||
        gas > 2500 ||
        (gas > 2000 && motion == 1)
    ) {
        fire = true;
    }

    const fireElement = document.getElementById("fireStatus");

    if (fire) {
        fireElement.innerHTML = "🔥 FIRE DETECTED!";
        fireElement.style.color = "red";
    } else {
        fireElement.innerHTML = "✔️ NO FIRE DETECTED";
        fireElement.style.color = "#4CAF50";
    }
}

// PHONE NUMBER POPUP VET 

function showPopup(message) {

    let popup = document.createElement("div");
    popup.className = "custom-popup";
    popup.innerHTML = `
        <div class="popup-box">
            <p>${message}</p>
            <button onclick="this.parentElement.parentElement.remove()">OK</button>
        </div>
    `;

    document.body.appendChild(popup);
}

document.addEventListener("DOMContentLoaded", function () {

    const role = localStorage.getItem("role");
    const popup = document.getElementById("vetPopup");

    if (popup && role === "admin") {
        popup.style.display = "block";
    }

});

// ================= HISTORY PAGE LOGIC =================
if (window.location.pathname.includes("history.html")) {

    import("./firebase.js").then(({ db }) => {
        import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js")
            .then(({ ref, onValue }) => {

                const tableBody = document.getElementById("historyTableBody");
                if (!tableBody) return;

                const historyRef = ref(db, "history");

                onValue(historyRef, (snapshot) => {

                    tableBody.innerHTML = "";

                    if (!snapshot.exists()) {
                        tableBody.innerHTML = `<tr><td colspan="5">No history found</td></tr>`;
                        return;
                    }

                    const entries = [];

                    snapshot.forEach((userSnap) => {

                        const data = userSnap.val();

                        entries.push(data); // store first, don't render yet
                    });

                    // 🔥 SORT latest first using completedAt
                    entries.sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

                    // 🔥 NOW render
                    entries.forEach((data) => {

                        const row = document.createElement("tr");

                        row.innerHTML = `
                        <td>${data.name || "N/A"}</td>
                        <td>${data.bookingDate || "N/A"}</td>
                        <td>${data.seatsBooked || 0}</td>
                        <td>${data.slot || "N/A"}</td>
                    `;

                        tableBody.appendChild(row);
                    });

                });

            });
    });

}