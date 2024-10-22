from flask import Flask, render_template,request, Blueprint, session, jsonify
from config import SHIFTS, DAYS
from helper import get_data, write_data
from models.driver import Driver
from models.employee import Admin

drivers_bp = Blueprint("drivers_bp",__name__)

@drivers_bp.route("/drivers")
def view_drivers():
    destinations = []
    admin = Admin(id=session["id"], name="admin", email="admin@gmail.com", password="1234555")
    routes = get_data("routes.json")
    drivers = admin.view_drivers()
    return render_template("view_drivers.html", shifts = SHIFTS, routes = routes, days = DAYS, drivers = drivers)


@drivers_bp.route("/drivers/view_drivers_of_day", methods = ["POST"])
def view_drivers_of_day():
    # Get the selected day from the request
    data = request.get_json()

    drivers_found = []
    selected_day = data["selectedDay"]
    drivers = get_data("drivers.json")

    if selected_day == "allDays":
            return jsonify(get_data("drivers.json"))
    # Loop through the drivers and check if the selected day is in the driver's available days
    for driver in drivers:
        for day in driver["avaliable_seats_on_days"]:
            if day == selected_day:
                drivers_found.append(driver)
    return jsonify(drivers_found)



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
    avaliable_days = request.json.get("avaliableDays")
    admin = Admin(id=session["id"],name="admin", email="admin@gmail.com", password="1234555")
    for driver in drivers:
        if driver["email"] == email:
            message = "This Email Registered Before"
            return jsonify({"message": message})
    for employee in employees:
        if employee["email"] == email:
            message = "Registered Before For An Employee"
            return jsonify({"message": message})

    new_driver_dict = admin.add_driver(email, name, start_point, end_point, shift, car_capacity, avaliable_days)
    return new_driver_dict


@drivers_bp.route("/drivers/delete", methods = ["DELETE"])
def delete_driver():
    drivers = get_data("drivers.json")
    users = get_data("users.json")
    # Get the id of the driver to be deleted from the request
    id = request.json.get("deletedId")
    admin = Admin(id=session["id"],name="admin", email="admin@gmail.com", password="1234555")
    deleted_driver = admin.delete_driver(id)

    # Loop through the users and check if the user has booked rides with the driver to be deleted
    for user in users:
        if "booked_rides" in user:
            updated_rides = []
            for ride in user["booked_rides"]:
                if str(id) != str(ride["driver_id"]):
                    updated_rides.append(ride)
                else:    
                    user["notify"]= f"Your booked ride for day {ride['day']} and shift {ride['shift']} has been cancelled"
            user["booked_rides"] = updated_rides
        write_data(users, "users.json")
    return deleted_driver


@drivers_bp.route("/drivers/get_edit_driver_data", methods=["POST"])
def get_driver_data():
    driver_id = request.json.get("driver_id")
    data = {}
    drivers = get_data("drivers.json")
    for driver in drivers:
        if driver["id"] == driver_id:
            data["driverShift"] = driver["shift"]
            data["driverDays"] = list(driver["avaliable_seats_on_days"].keys())
            data["driverStartPoint"] = driver["start_point"]
            data["driverEndPoint"] = driver["end_point"]
            break
    return data

@drivers_bp.route("/drivers/edit_data", methods=["POST"])
def edit_data():
    data = request.get_json()
    admin = Admin(id=session["id"],name="admin", email="admin@gmail.com", password="1234555")
    edited_data = admin.edit_driver(data)
    return edited_data





            
            

            



    

    
