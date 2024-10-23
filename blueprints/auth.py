from flask import render_template, request, Blueprint, session, jsonify
from helper import get_data, write_data
from models.employee import Employee, Admin
from config import SHIFTS
import uuid

auth = Blueprint("auth", __name__)

# Register route
@auth.route("/register", methods = ["POST", "GET"])
def register():
    message = ""
    if request.method == "POST":
        # Get the data from the form
        data = request.get_json()
        email = data.get("email")
        password = data.get('password')
        user_name = data.get('user_name')
        users = get_data("users.json")
        user_id = str(uuid.uuid4())
        
        # Check if the email is already registered
        if not email.strip() == "" :
                for user in users:
                    if user["email"].lower() == email.lower():
                        message = "You already registered before !"
                if message == "":
                    new_employee = Employee(user_id, user_name, email, password)
                    new_employee_dict = new_employee.to_dict()
                    users.append(new_employee_dict)
                    check_write = write_data(users, "users.json")
                    message = "Registered successfully! You can log in now"
        else:
            message = "There is an issue! "
        return jsonify({"message":message})
    # If the request is GET, render the register page
    return render_template("register.html", message = message)


# Login route
@auth.route("/login", methods = ["POST", "GET"])
def login():
    user_name = ""
    if request.method == "POST":
        # Get the data from the form
        data = request.get_json()
        user_email = data.get("email")
        password = data.get("password")
        for user in get_data("users.json"):
            # Check if the email and password are correct
            if user["email"] == user_email and user["password"] == password:
                session["id"] = user["id"]
                if user["id"] == "111":
                    # To be used in local storage to show some messages
                    return jsonify({"redirectURL":"/drivers", "name": user["name"],  "message":"Drivers Details: "})
                else:
                    # To be used in local storage to show some messages
                    return jsonify({"redirectURL":"/view_booked_rides", "name": user["name"], "message":"Your Booked Rides: ", "messageavaliable": "Avaliable Rides: "})
        return jsonify({"message_login":"Incorrect email or password"})
    return render_template("homepage.html")
    
# Admin login route 
@auth.route("/admin_dashboard")
def admin_dashboard():
    if session.get("id") == "111":
        return render_template("admin_dashboard.html")
    return render_template("homepage.html")

# Admin logout route
@auth.route("/logout")
def logout():
    session.pop('id', None)
    return render_template("homepage.html")


