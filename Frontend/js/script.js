
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

    // Store booking data
    localStorage.setItem("bookingData", JSON.stringify(data));

    // Redirect to payment page
    window.location.href = "payment.html";
}

//=============================PAYMENT PAGE===============================================
    let selectedMethod = "";

    window.onload = function () {

    let data = JSON.parse(localStorage.getItem("bookingData"));

    if (!data) {
        document.getElementById("details").innerText = "No booking data found!";
        return;
    }

    document.getElementById("details").innerHTML = `
        <p><b>Name:</b> ${data.name}</p>
        <p><b>Date:</b> ${data.date}</p>
        <p><b>Time:</b> ${data.time}</p>
        <p><b>Seats:</b> ${data.seats.join(", ")}</p>
        <p><b>Total:</b> ₹${data.totalAmount}</p>
    `;
};

function selectMethod(method) {
    selectedMethod = method;
    alert(method + " selected");
}

function payNow() {

    let status = document.getElementById("status");

    if (!selectedMethod) {
        status.innerText = "⚠️ Please select a payment method!";
        status.style.color = "red";
        return;
    }

    status.style.color = "yellow";
    status.innerText = "⏳ Processing Payment...";

    // Fake delay
    setTimeout(() => {
        status.style.color = "lightgreen";
        status.innerText = " Payment Successful! \n Ticket Booked";

        // optional: clear data
        localStorage.removeItem("bookingData");

    }, 2000);
}