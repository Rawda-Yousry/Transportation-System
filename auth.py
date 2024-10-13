from flask import render_template, url_for, request, Blueprint, redirect, flash
import json
import os
from helper import get_users, write_user

auth = Blueprint("auth", __name__)


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

@auth.route("/login", methods = ["POST", "GET"])
def login():
    if request.method == "POST":
        user_name = request.form.get("user_name")
        password = request.form.get("password")
        for user in get_users("users.json"):
            if user["user_name"] == user_name and user["password"] == password:
                if user["role"] == "admin":
                    return render_template("admin_dashboard.html")
                else:
                    return "Hii, Employee"
    return render_template("login.html", message="Logged in successfully!")
    
