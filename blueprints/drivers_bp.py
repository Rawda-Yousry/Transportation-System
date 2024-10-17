from flask import Flask, render_template, url_for, request, Blueprint, session
from config import SHIFTS
from helper import get_data, write_data
from models.driver import Driver
from models.employee import Admin

drivers_bp = Blueprint("drivers_bp",__name__)


@drivers_bp.route("/drivers")
def view_drivers():
    admin = Admin(name="", email="", password="")
    drivers = admin.view_drivers()
    return render_template("view_drivers.html", drivers=drivers, shifts = SHIFTS)


@drivers_bp.route("/drivers/add", methods=["POST"])
def add_driver():
    name = request.json.get("name")
    route = request.json.get("route")
    shift = request.json.get("shift")
    car_capacity = request.json.get("car-capacity")
    admin = Admin(name="", email="", password="")
    new_driver_dict = admin.add_driver(name,route,shift,car_capacity)
    return new_driver_dict

@drivers_bp.route("/drivers/delete/<id>", methods = ["DELETE"])
def delete_driver(id):
    drivers = get_data("drivers.json")
    admin = Admin(name="", email="", password="")
    deleted_driver = admin.delete_driver(id)
    return deleted_driver

            



    

    
