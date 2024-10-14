from flask import Flask, render_template, url_for, request, Blueprint, session
from helper import get_users, write_user
from models.driver import Driver
from models.employee import Admin

drivers_bp = Blueprint("drivers_bp",__name__)


@drivers_bp.route("/drivers")
def view_drivers():
    admin = Admin(role=session["role"], name="", email="", password="")
    drivers = admin.view_drivers()
    return render_template("view_drivers.html", drivers=drivers)


@drivers_bp.route("/drivers/add", methods=["POST"])
def add_driver():
    name = request.json.get("name")
    route = request.json.get("route")
    shift = request.json.get("shift")
    admin = Admin(role=session["role"], name="", email="", password="")
    new_driver_dict = admin.add_driver(name,route,shift)
    return new_driver_dict

@drivers_bp.route("/drivers/delete/<id>", methods = ["DELETE"])
def delete_driver(id):
    drivers = get_users("drivers.json")
    admin = Admin(role=session["role"], name="", email="", password="")
    deleted_driver = admin.delete_driver(id)
    return deleted_driver

            



    

    
