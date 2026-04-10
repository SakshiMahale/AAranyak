from flask import Flask, request, jsonify
from flask_cors import CORS

# ==============================
# 🔥 CREATE APP FIRST (ALWAYS)
# ==============================
app = Flask(__name__)
CORS(app)

# ==============================
# 🔥 IMPORTS (AFTER APP)
# ==============================
from help_bot import call_ollama_help



# ==============================
# 🏠 HOME ROUTE
# ==============================
@app.route("/")
def home():
    return "Aaranyak Backend Running 🚀"


# ==============================
# 🌿 HELP CHATBOT (ONLY ONCE)
# ==============================
@app.route("/help-chat", methods=["POST"])
def help_chat():
    try:
        user_msg = request.json.get("message", "")

        prompt = f"""
        You are Aaranyak Help Assistant 🌿

        Your job:
        - Explain system features
        - Help with errors
        - Guide users on dashboard usage
        - Explain alerts (gas, motion, YOLO detection)

        Keep answers simple and helpful.

        User: {user_msg}
        """

        reply = call_ollama_help(prompt)

        return jsonify({
            "status": "success",
            "reply": reply
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "reply": str(e)
        })

# ==============================
# 🚀 RUN SERVER
# ==============================
if __name__ == "__main__":
    app.run(debug=True, port=5000)