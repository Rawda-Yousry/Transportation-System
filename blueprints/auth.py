from flask import render_template, request, Blueprint, session, jsonify
from helper import get_data, write_data
from models.employee import Employee, Admin
from config import SHIFTS
import re

auth = Blueprint("auth", __name__)


@auth.route("/register", methods = ["POST", "GET"])
def register():
    message = ""
    if request.method == "POST":
        data = request.get_json()
        email = data.get("email")
        password = data.get('password')
        user_name = data.get('user_name')
        if not email.strip() == "" :
                for user in get_data("users.json"):
                    if user["email"].lower() == email.lower():
                        message = "You already registered before !"
                if message == "":
                    new_employee = Employee(user_name, email, password)
                    new_employee_dict = new_employee.to_dict()
                    check_write = write_data(new_employee_dict, "users.json")
                    message = "Registered successfully! You can log in now"
        else:
            message = "There is an issue! "
        return jsonify({"message":message})
    return render_template("register.html", message = message)

@auth.route("/login", methods = ["POST", "GET"])
def login():
    if request.method == "POST":
        data = request.get_json()
        user_name = data.get("name")
        password = data.get("password")
        for user in get_data("users.json"):
            if user["user_name"] == user_name and user["password"] == password:
                if user["role"] == "admin":
                    session["role"] = "admin"
                    return jsonify({"redirectURL":"/admin_dashboard"})
                else:
                    session["id"] = user["id"]
                    return jsonify({"redirectURL":"/employee_homepage/<id>"})
    return render_template("login.html")
    
@auth.route("/admin_dashboard")
def admin_dashboard():
    return render_template("admin_dashboard.html")

@auth.route("/employee_homepage/<id>")
def employee_dashboard(id):
    booked_rides = []
    routes = get_data("routes.json")
    users = get_data("users.json")
    for user in users:
        if user["id"] == id:
            booked_rides = user["booked_rides"]
    return render_template("employee_homepage.html", routes = routes, shifts = SHIFTS, booked_rides = booked_rides)
