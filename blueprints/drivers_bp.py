from flask import Flask, render_template,request, Blueprint, session
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
    name = request.json.get("name")
    start_point = request.json.get("startPoint")
    end_point = request.json.get("endPoint")
    shift = request.json.get("shift")
    car_capacity = request.json.get("carCapacity")
    admin = Admin(name="", email="", password="")
    new_driver_dict = admin.add_driver(name,start_point, end_point,shift,car_capacity)
    return new_driver_dict

@drivers_bp.route("/drivers/delete/<id>", methods = ["DELETE"])
def delete_driver(id):
    drivers = get_data("drivers.json")
    admin = Admin(name="", email="", password="")
    deleted_driver = admin.delete_driver(id)
    return deleted_driver

            



    

    
