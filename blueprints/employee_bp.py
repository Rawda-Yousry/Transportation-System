from flask import Flask, render_template, request, Blueprint
from models.employee import Employee
from helper import get_data
from config import SHIFTS, DAYS

employee_bp = Blueprint("employee_bp", __name__)

@employee_bp.route("/employee_homepage/<id>")
def employee_dashboard(id):
    booked_rides = []
    print(id)
    routes = get_data("routes.json")
    users = get_data("users.json")
    for user in users:
        if user["id"] == id:
            booked_rides = user["booked_rides"]
    return render_template("employee_homepage.html", routes = routes, shifts = SHIFTS, booked_rides = booked_rides, days = DAYS, id= id)


@employee_bp.route("/book_ride/<id>", methods=["POST"])
def book_ride(id):
    employee = Employee("", "", "")
    data_ride = request.get_json()
    day = data_ride["day"]
    shift = data_ride["shift"]
    route = data_ride["route"]
    booked_ride = employee.book_ride(id, day, route, shift)
    return booked_ride

@employee_bp.route("/employee/delete_ride/<ride_id>", methods=["DELETE"])
def delete_ride(ride_id):
    employee = Employee("","","")
    user_id = request.get_json()
    check_write = employee.delete_ride(ride_id, user_id)
    return check_write





    
