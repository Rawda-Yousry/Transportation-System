from flask import Flask, render_template,request, Blueprint, session, jsonify
from config import SHIFTS, DAYS
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
    return render_template("view_drivers.html", shifts = SHIFTS, routes = routes, days = DAYS, drivers = drivers)


@drivers_bp.route("/drivers/view_drivers_of_day", methods = ["POST"])
def view_drivers_of_day():
    data = request.get_json()
    drivers_found = []
    selected_day = data["selectedDay"]
    drivers = get_data("drivers.json")
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


    new_driver_dict = admin.add_driver(email, name, start_point, end_point, shift, car_capacity, avaliable_days)
    return new_driver_dict


@drivers_bp.route("/drivers/delete", methods = ["DELETE"])
def delete_driver():
    drivers = get_data("drivers.json")
    users = get_data("users.json")
    id = request.json.get("deletedId")
    admin = Admin(name="", email="", password="")
    deleted_driver = admin.delete_driver(id)
    print("Hiiiiiiiiii")
    print(type(str(id)))

    for user in users:
        if "booked_rides" in user:
            updated_rides = []
            for ride in user["booked_rides"]:
                print("Rideeeeeee")
                print(type(ride["driver_id"]) )
                if str(id) != str(ride["driver_id"]):
                    updated_rides.append(ride)
                else:    
                    user["notify"]= f"Your booked ride for day {ride['day']} and shift {ride['shift']} has been cancelled"
            user["booked_rides"] = updated_rides
        write_data(users, "users.json")
    return deleted_driver

            



    

    
