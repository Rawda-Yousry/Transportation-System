from flask import Flask, render_template
from auth import auth 

app = Flask(__name__)

app.secret_key = "SECRET_KEY"

app.register_blueprint(auth)

@app.route("/")
def index():
    return render_template("login.html")




