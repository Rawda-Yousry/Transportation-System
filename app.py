from flask import Flask, render_template
from blueprints.auth import auth
from blueprints.drivers_bp import drivers_bp
from blueprints.employee_bp import employee_bp

app = Flask(__name__)

app.secret_key = "SECRET_KEY"

app.register_blueprint(auth)
app.register_blueprint(drivers_bp)
app.register_blueprint(employee_bp)

@app.route("/")
def index():
    return render_template("login.html")




