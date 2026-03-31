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

            status.style.color = "lightgreen";
            status.innerText = "✅ Payment Successful!";

            let data = JSON.parse(localStorage.getItem("bookingData"));

            if (!data) {
                status.innerText = "❌ No booking data!";
                return;
            }

            const { db } = await import("./firebase.js");
            const { ref, get, update, push } = await import(
                "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"
            );

            const systemRef = ref(db, "ticketSystem");
            const snapshot = await get(systemRef);

            if (!snapshot.exists()) {
                alert("❌ Ticket system not initialized");
                return;
            }

            const dbData = snapshot.val();

            let booked = dbData.bookedOnline;
            let limit = dbData.onlineLimit;

            let seatsRequested = data.seats.length;
            let remaining = limit - booked;

            if (remaining <= 0) {
                status.innerText = "❌ Booking full. Try offline.";
                return;
            }

            if (seatsRequested > remaining) {
                status.innerText = `⚠️ Only ${remaining} seats left`;
                return;
            }

            if (remaining <= 5) {
                alert(`🔥 Hurry! Only ${remaining} seats left`);
            }

            // ✅ UPDATE SEATS
            await update(systemRef, {
                bookedOnline: booked + seatsRequested
            });

            // ✅ SAVE BOOKING
            await push(ref(db, "confirmedBookings"), {
                ...data,
                paymentMethod: selectedMethod,
                paymentStatus: "SUCCESS",
                timestamp: Date.now()
            });

            console.log("✅ SAVED TO FIREBASE");

            localStorage.removeItem("bookingData");

            setTimeout(() => {
                window.location.href = "Role_Index.html";
            }, 2000);

        } catch (error) {
            console.error("🔥 Firebase Error:", error);
            status.innerText = "❌ Error saving booking!";
        }

    }, 2000);
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