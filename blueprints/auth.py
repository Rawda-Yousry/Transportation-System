from flask import render_template, request, Blueprint, session, jsonify
from helper import get_data, write_data
from models.employee import Employee, Admin
from config import SHIFTS


auth = Blueprint("auth", __name__)


@auth.route("/register", methods = ["POST", "GET"])
def register():
    message = ""
    if request.method == "POST":
        data = request.get_json()
        email = data.get("email")
        password = data.get('password')
        user_name = data.get('user_name')
        if not email.strip() == "" and not password == "" and not user_name == "":
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
                    return jsonify({"redirectURL":"/employee_homepage"})
    return render_template("login.html", message="You should register first")
    
@auth.route("/admin_dashboard")
def admin_dashboard():
    return render_template("admin_dashboard.html")

@auth.route("/employee_homepage")
def employee_dashboard():
    routes = get_data("routes.json")
    return render_template("employee_homepage.html", routes = routes, shifts = SHIFTS)
