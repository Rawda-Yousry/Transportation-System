from flask import render_template, url_for, request, Blueprint, redirect, flash


auth = Blueprint("auth", __name__)


@auth.route("/register", methods = ["POST", "GET"])
def register():
    if request.method == "POST":
        email = request.form.get('email')
        password = request.form.get('password')
        return redirect(url_for('auth.login'))
    
    return render_template('register.html')

@auth.route("/login")
def login():
    return render_template("login.html")
