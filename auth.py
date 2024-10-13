from flask import render_template, url_for, request, Blueprint, redirect, flash
import json

auth = Blueprint("auth", __name__)

def get_users():
    with open("data/users.json") as file:
        users = json.load(file)
    return users

def write_user(user):
    with open("data/users.json", "a") as file:
        json.dump(user, file, indent=4)
    return True
    

@auth.route("/register", methods = ["POST", "GET"])
def register():
    message = ""
    if request.method == "POST":
        email = request.form.get('email')
        password = request.form.get('password')
        user_name = request.form.get('user_name')
        role = request.form.get('role')
        if not email.strip() == "" and not password == "" and not user_name == "":
            check_write = write_user({"email": email, "password": password, "user_name": user_name, "role": role})
            message = "Registered successfully! You can log in now"
        else:
            message = "There is an issue! "
    return render_template('register.html', message = message)

@auth.route("/login")
def login():
    return render_template("admin_dashboard.html")
