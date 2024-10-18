from flask import Flask, render_template,request, Blueprint, session, jsonify
from config import SHIFTS
from helper import get_data, write_data
from models.driver import Driver
from models.employee import Admin

drivers_bp = Blueprint("drivers_bp",__name__)


@drivers_bp.route("/drivers")
def view_drivers():
    destinations = []
    admin = Admin(name="", email="", password="")
    routes = get_data("routes.json")
    drivers = admin.view_drivers()
    return render_template("view_drivers.html", drivers=drivers, shifts = SHIFTS, routes = routes)


@drivers_bp.route("/drivers/add", methods=["POST"])
def add_driver():
    message_error = ""
    employees = get_data("users.json")
    drivers = get_data("drivers.json")
    email = request.json.get("email")
    name = request.json.get("name")
    start_point = request.json.get("startPoint")
    end_point = request.json.get("endPoint")
    shift = request.json.get("shift")
    car_capacity = request.json.get("carCapacity")
    admin = Admin(name="", email="", password="")
    for driver in drivers:
        if driver["email"] == email:
            if driver["shift"] == shift:
                message = "Registered before for the same shift"
                return jsonify({"message": message})
    for employee in employees:
        if employee["email"] == email:
            message = "Registered before for an employee"
            return jsonify({"message": message})


    new_driver_dict = admin.add_driver(email, name, start_point, end_point, shift, car_capacity)
    return new_driver_dict


@drivers_bp.route("/drivers/delete/<id>", methods = ["DELETE"])
def delete_driver(id):
    drivers = get_data("drivers.json")
    admin = Admin(name="", email="", password="")
    deleted_driver = admin.delete_driver(id)
    return deleted_driver

            



    

    
