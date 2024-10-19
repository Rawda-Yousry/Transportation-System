from flask import Flask, render_template, request, Blueprint, jsonify, session
from models.employee import Employee
from helper import get_data
from config import SHIFTS, DAYS

employee_bp = Blueprint("employee_bp", __name__)

@employee_bp.route("/employee_homepage/<id>")
def employee_dashboard(id):
    booked_rides = []
    routes = get_data("routes.json")
    return render_template("employee_homepage.html", routes = routes, shifts = SHIFTS, days = DAYS, id= id)


@employee_bp.route("/book_ride", methods=["POST"])
def book_ride():
    users = get_data("users.json")
    employee = Employee("", "", "")
    data_ride = request.get_json()
    employee_id = data_ride["id"]
    driver_id = data_ride["driverId"]
    day = data_ride["day"]
    shift = data_ride["shift"]
    start_point = data_ride["startPoint"]
    end_point = data_ride["endPoint"]
    for user in users:
        if user["id"] == employee_id:
            for ride in user["booked_rides"]:
                if ride["day"] == day and ride["shift"] == shift:
                    return jsonify({"message": "You already booked for the shift and day before"})
    booked_ride = employee.book_ride(employee_id, day, start_point, end_point, shift, driver_id)
    return jsonify({"message": "Booked Successfuly!"})

@employee_bp.route("/view_booked_rides")
def view_booked_rides():
    employee = Employee("", "", "")
    booked_rides = employee.view_booked_rides(session["id"])
    print(booked_rides)
    return render_template("employee_booked_rides.html", booked_rides = booked_rides)
    

@employee_bp.route("/employee/delete_ride/<ride_id>", methods=["DELETE"])
def delete_ride(ride_id):
    employee = Employee("","","")
    user_id = request.get_json()
    print(user_id)
    check_write = employee.delete_ride(ride_id, user_id)
    return check_write

@employee_bp.route("/see_avaliable_cars", methods=["POST"])
def see_avaliable_cars():
    avaliable_cars = []
    if request.method == "POST":
        is_found = False
        data = request.get_json()
        drivers = get_data("drivers.json")
        ride_shift = data["shift"]
        ride_day = data["day"]
        start_point = data["startPoint"]
        end_point = data["endPoint"]
        for driver in drivers:
            if driver["start_point"] == start_point and driver["end_point"] == end_point and driver["shift"] == ride_shift and driver["avaliable_seats_on_days"][ride_day] > 0:
                avaliable_cars.append(driver)
                is_found = True
        if is_found != True:
            return jsonify({"message": "No Avaliable Rides Found"})
        else:
            print(avaliable_cars)
            return jsonify(avaliable_cars)
    return render_template("login.html")


    

    