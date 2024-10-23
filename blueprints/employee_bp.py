from flask import Flask, render_template, request, Blueprint, jsonify, session
from models.employee import Employee
from helper import get_data
from config import SHIFTS, DAYS
import uuid

employee_bp = Blueprint("employee_bp", __name__)


# Route user to his homepage after login
@employee_bp.route("/employee_homepage/<id>")
def employee_dashboard(id):
    routes = get_data("routes.json")
    return render_template("employee_homepage.html", routes = routes, shifts = SHIFTS, days = DAYS, id= id)


# Route to book a ride for the employee
@employee_bp.route("/book_ride", methods=["POST", "GET"])
def book_ride():
    # Get the data from the request
    users = get_data("users.json")

    # Make object to be able to use the book_ride method
    employee = Employee(session["id"],"", "", "")
    data_ride = request.get_json()
    driver_id = data_ride["driverId"]
    day = data_ride["day"]
    shift = data_ride["shift"]
    start_point = data_ride["startPoint"]
    end_point = data_ride["endPoint"]

    # Check if the user already booked for the same day and shift
    for user in users:
        if user["id"] == session["id"]:
            for ride in user["booked_rides"]:
                if ride["day"] == day and ride["shift"] == shift:
                    return jsonify({"message": "You already booked for the shift and day before"})
    booked_ride = employee.book_ride(day, start_point, end_point, shift, driver_id)
    if session["id"]:
        return jsonify({"message": "Booked Successfuly!"})
    else:
        return render_template("homepage.html")


# Route to view the booked rides of the employee
@employee_bp.route("/view_booked_rides")
def view_booked_rides():
    # Make object to be able to use the view_booked_rides method
    employee = Employee(session["id"],"", "", "")

    # Get the data from the request
    routes = get_data("routes.json")
    booked_rides = employee.view_booked_rides()
    if session["id"]:
        return render_template("employee_homepage.html", booked_rides = booked_rides, id = session["id"], days = DAYS, shifts = SHIFTS, routes = routes )
    else:
        return render_template("homepage.html")

# Route to view the booked rides of the employee of a specific day
@employee_bp.route("/view_booked_rides_of_day", methods=["POST", "GET"])
def view_booked_rides_of_day():
    message = ""
    data = request.get_json()
    users = get_data("users.json")
    booked_rides = []
    selected_day = data["selectedDay"]

    # Loop through the users and check if the selected day is in the user's booked rides
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
    if session["id"]:
        return jsonify({"message": message, "booked_rides": booked_rides})
    else:
        return render_template("homepage.html")
  

# Route to delete a ride for the employee
@employee_bp.route("/employee/delete_ride", methods=["DELETE", "GET"])
def delete_ride():
    # Make object to be able to use the delete_ride method
    employee = Employee(session["id"],"","","")
    data = request.get_json()
    deleted_ride_id = data["deletedId"]
    check_write = employee.delete_ride(deleted_ride_id)
    if session["id"]:
        return check_write
    else:
        return render_template("homepage.html")

# Route to see avaliable cars for the employee
@employee_bp.route("/see_avaliable_cars", methods=["POST", "GET"])
def see_avaliable_cars():
    avaliable_cars = []
    check_day = False
    if request.method == "POST":
        is_found = False
        # Get the data from the request
        data = request.get_json()
        drivers = get_data("drivers.json")
        ride_shift = data["shift"]
        ride_day = data["day"]
        start_point = data["startPoint"]
        end_point = data["endPoint"]

        # Loop through the drivers and check if the selected day is in the driver's available days
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
    return render_template("homepage.html")


    

    
