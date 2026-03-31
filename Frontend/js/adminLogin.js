function adminLogin() {
    const username = document.getElementById("adminUsername").value;
    const password = document.getElementById("adminPassword").value;

    if (username === "admin" && password === "admin1234") {
        localStorage.setItem("role", "admin");

        // redirect to admin panel
        window.location.href = "AdminPanel.html";
    } else {
        document.getElementById("loginError").innerText = "Invalid credentials!";
    }
}