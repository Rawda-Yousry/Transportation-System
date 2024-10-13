from flask import Flask, render_template, url_for, request, Blueprint
import json
from helper import get_users, write_user

drivers_bp = Blueprint("drivers",__name__)

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
    driver = to_dict(name, route, shift)
    check_write = write_user(driver, "drivers.json")
    return driver


    

    
