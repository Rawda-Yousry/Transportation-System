from flask import Flask, render_template, url_for, request, Blueprint
import json

drivers_bp = Blueprint("drivers",__name__)


@drivers_bp.route("/drivers")
def view_drivers():
    with open("data/drivers.json") as file:
        drivers = json.load(file)
    return render_template("view_drivers.html", drivers=drivers)

# @drivers_bp.route("/drivers/add")
# def view_drivers():
#     with open("data/drivers.json") as file:
#         drivers = json.load(file)
#     return render_template("view_drivers", drivers=drivers)
