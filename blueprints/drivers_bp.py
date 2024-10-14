from flask import Flask, render_template, url_for, request, Blueprint
from helper import get_users, write_user
from models.driver import Driver
from models.employee import Admin

drivers_bp = Blueprint("drivers_bp",__name__)

def to_dict(name, route, shift):
    driver = {
        "name":name,
        "route": route,
        "shift": shift
    }
    return driver
    

@drivers_bp.route("/drivers")
def view_drivers():
    drivers = get_users("drivers.json")
    return render_template("view_drivers.html", drivers=drivers)

@drivers_bp.route("/drivers/add", methods=["POST"])
def add_driver():
    name = request.json.get("name")
    route = request.json.get("route")
    shift = request.json.get("shift")
    new_driver = Driver(name, route, shift)
    new_driver_dict = new_driver.to_dict()
    check_write = write_user(new_driver_dict , "drivers.json")
    return new_driver_dict


    

    
