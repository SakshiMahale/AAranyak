const animals = [
    { name: "Tiger 🐅", count: 3682, status: "normal" },
    { name: "Lion 🦁", count: "674", status: "warning", message: "⚠️ Asiatic lions limited to Gir forest" },
    { name: "Leopard 🐆", count: 13874, status: "normal" },

    { name: "Deer 🦌", count: "500K+", status: "normal" },
    { name: "Sambar Deer 🦌", count: "260K", status: "normal" },
    { name: "Hog Deer 🦌", count: "Declining", status: "warning", message: "⚠️ Habitat loss affecting population" },

    { name: "Elephant 🐘", count: "29,964", status: "warning", message: "⚠️ Human-elephant conflict rising" },

    { name: "Sloth Bear 🐻", count: "20K", status: "warning", message: "⚠️ Vulnerable species" },

    { name: "Indian Wolf 🐺", count: "3K", status: "warning", message: "⚠️ Endangered in many regions" },
    { name: "Striped Hyena 🐺", count: "5K", status: "warning", message: "⚠️ Population decreasing" },

    { name: "Dhole (Wild Dog) 🐕", count: "2.5K", status: "danger", message: "🚨 Endangered species!" },

    { name: "Golden Jackal 🦊", count: "80K+", status: "normal" },

    { name: "Indian Gaur 🐃", count: "13K", status: "normal" },

    { name: "Nilgai 🐂", count: "100K+", status: "normal" },

    { name: "Wild Boar 🐗", count: "1M+", status: "normal" },

    { name: "Crocodile 🐊", count: "8K", status: "normal" },

    { name: "King Cobra 🐍", count: "Declining", status: "danger", message: "🚨 Save forests to protect them!" },
    { name: "Snake 🐍", count: "Wide population", status: "normal" },
    { name: "Common Krait 🐍", count: "Stable", status: "normal" },
    { name: "Rat Snake 🐍", count: "Stable", status: "normal" },

    { name: "Monitor Lizard 🦎", count: "Declining", status: "warning", message: "⚠️ Illegal hunting threat" },

    { name: "Tortoise 🐢", count: "Declining", status: "warning", message: "⚠️ Illegal pet trade risk" },

    { name: "Owl 🦉", count: "Stable", status: "normal" },
    { name: "Spotted Owlet 🦉", count: "Stable", status: "normal" },

    { name: "Serpent Eagle 🦅", count: "Stable", status: "normal" },
    { name: "Black Kite 🦅", count: "Common", status: "normal" },

    { name: "Peacock 🐦", count: "Protected", status: "normal" },

    { name: "Kingfisher 🐦", count: "Stable", status: "normal" },

    { name: "Flamingo 🦩", count: "500K+", status: "normal" },

    { name: "Langur 🐒", count: "200K+", status: "normal" },

    { name: "Indian Civet 🐾", count: "Declining", status: "warning", message: "⚠️ Habitat destruction risk" },

    { name: "Rusty-Spotted Cat 🐈", count: "Rare", status: "danger", message: "🚨 One of the rarest wild cats!" },

    { name: "Porcupine 🐾", count: "Stable", status: "normal" },

    { name: "Palm Squirrel 🐾", count: "Very Common", status: "normal" },

    { name: "Camel 🐪", count: "0.25M", status: "warning", message: "⚠️ Population decreasing!" },

    { name: "Cattle 🐄", count: "193M", status: "normal" },
    { name: "Goat 🐐", count: "148M", status: "normal" },

    { name: "Stray Dogs 🐕", count: "15.3M", status: "warning", message: "⚠️ Control population humanely" },

    { name: "Sparrow 🐦", count: "Declining", status: "danger", message: "🚨 Save Sparrows! Plant trees & reduce pollution!" }
];

const container = document.getElementById("statsContainer");
const popup = document.getElementById("alertPopup");

animals.forEach(animal => {

    let card = document.createElement("div");
    card.className = "stat-card";

    if (animal.status === "danger") card.classList.add("danger");
    if (animal.status === "warning") card.classList.add("warning");

    // 🌿 GRAPH BAR (NEW 🔥)
    let barWidth = typeof animal.count === "number"
        ? Math.min(animal.count / 150, 100)
        : 60;

    card.innerHTML = `
        <h3>${animal.name}</h3>
        <p>${animal.count}</p>

        <div style="
            height: 8px;
            background: #1b5e20;
            border-radius: 10px;
            overflow: hidden;
            margin-top: 10px;
        ">
            <div style="
                width: ${barWidth}%;
                height: 100%;
                background: ${animal.status === "danger" ? "red" : animal.status === "warning" ? "orange" : "#22c55e"};
            "></div>
        </div>
    `;

    // 🚨 ALERT POPUP
    card.onclick = () => {
        if (animal.status !== "normal") {
            popup.innerText = animal.message;
            popup.style.display = "block";

            setTimeout(() => {
                popup.style.display = "none";
            }, 3000);
        }
    };

    container.appendChild(card);
});