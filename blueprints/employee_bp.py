from flask import Flask, render_template, request, Blueprint, jsonify, session
from models.employee import Employee
from helper import get_data
from config import SHIFTS, DAYS
import uuid

employee_bp = Blueprint("employee_bp", __name__)


@employee_bp.route("/employee_homepage/<id>")
def employee_dashboard(id):
    booked_rides = []
    routes = get_data("routes.json")

    return render_template("employee_homepage.html", routes = routes, shifts = SHIFTS, days = DAYS, id= id)


@employee_bp.route("/book_ride", methods=["POST"])
def book_ride():
    users = get_data("users.json")
    employee = Employee(session["id"],"", "", "")
    data_ride = request.get_json()
    driver_id = data_ride["driverId"]
    day = data_ride["day"]
    shift = data_ride["shift"]
    start_point = data_ride["startPoint"]
    end_point = data_ride["endPoint"]
    for user in users:
        if user["id"] == session["id"]:
            for ride in user["booked_rides"]:
                if ride["day"] == day and ride["shift"] == shift:
                    return jsonify({"message": "You already booked for the shift and day before"})
    booked_ride = employee.book_ride(day, start_point, end_point, shift, driver_id)
    return jsonify({"message": "Booked Successfuly!"})

@employee_bp.route("/view_booked_rides")
def view_booked_rides():
    employee = Employee(session["id"],"", "", "")
    routes = get_data("routes.json")
    booked_rides = employee.view_booked_rides()
    return render_template("employee_homepage.html", booked_rides = booked_rides, id = session["id"], days = DAYS, shifts = SHIFTS, routes = routes )

@employee_bp.route("/view_booked_rides_of_day", methods=["POST"])
def view_booked_rides_of_day():
    message = ""
    data = request.get_json()
    users = get_data("users.json")
    booked_rides = []
    selected_day = data["selectedDay"]
    for user in users:
        if user["id"] == session["id"]: 
            if selected_day == "allDays":
                booked_rides = user["booked_rides"]
            else:
                for ride in user["booked_rides"]:
                    if ride["day"] == selected_day:
                        booked_rides.append(ride)
            break 
    if booked_rides == []:
        message+= "No Booked Rides"
    return jsonify({"message": message, "booked_rides": booked_rides})
  

@employee_bp.route("/employee/delete_ride", methods=["DELETE"])
def delete_ride():
    employee = Employee(session["id"],"","","")
    data = request.get_json()
    deleted_ride_id = data["deletedId"]
    check_write = employee.delete_ride(deleted_ride_id)
    return check_write

@employee_bp.route("/see_avaliable_cars", methods=["POST"])
def see_avaliable_cars():
    avaliable_cars = []
    check_day = False
    if request.method == "POST":
        is_found = False
        data = request.get_json()
        drivers = get_data("drivers.json")
        ride_shift = data["shift"]
        ride_day = data["day"]
        start_point = data["startPoint"]
        end_point = data["endPoint"]
        for driver in drivers:
            if ride_day in driver["avaliable_seats_on_days"]:
                if driver["avaliable_seats_on_days"][ride_day] > 0:
                    check_day = True
                    if driver["start_point"] == start_point and driver["end_point"] == end_point and driver["shift"] == ride_shift and check_day:
                        avaliable_cars.append(driver)
                        is_found = True
                else:
                    check_day = False

        if is_found != True:
            return jsonify({"message": "No Avaliable Rides Found"})
        else:
            return jsonify(avaliable_cars)
    return render_template("login.html")


    

    
