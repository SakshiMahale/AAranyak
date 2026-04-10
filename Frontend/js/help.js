async function sendMessage() {
    const input = document.getElementById("input");
    const messages = document.getElementById("messages");

    const text = input.value;
    if (!text) return;

    messages.innerHTML += `<div class="user">${text}</div>`;
    input.value = "";

    const res = await fetch("http://127.0.0.1:5000/help-chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    messages.innerHTML += `<div class="bot">${data.reply}</div>`;
    messages.scrollTop = messages.scrollHeight;
}