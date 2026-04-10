import requests

def call_ollama_help(prompt):
    try:
        res = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama2",
                "prompt": prompt,
                "stream": False
            },
            timeout=120
        )
        return res.json()["response"]

    except Exception as e:
        return f"Error: {str(e)}"