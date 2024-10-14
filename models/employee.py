from models.driver import Driver
from helper import write_user, get_users
import uuid
import json


class Employee:
    def __init__(self, name, email, password, role):
        self.id = str(uuid.uuid4())
        self.name = name
        self.email = email
        self.password = password
        self.role = role

    def to_dict(self):
        employee_dict = {
            "name": self.name,
            "email": self.email,
            "password": self.password,
            "role": self.role
        }
        return employee_dict


class Admin(Employee):
    def __init__(self, name, email, password, role):
        super().__init__(name, email, password, role)

    def add_driver(self, name, route, shift):
        new_driver = Driver(name, route, shift)
        new_driver_dict = new_driver.to_dict()
        check_write = write_user(new_driver_dict , "drivers.json")
        return new_driver_dict
    
    def view_drivers(self):
        drivers = get_users("drivers.json")
        return drivers
    
    def delete_driver(self, driver_id):
        updated_drivers_list = []
        deleted_driver = dict()
        drivers = get_users("drivers.json")
        for driver in drivers:
            if driver["id"] != driver_id:
                updated_drivers_list.append(driver)
            else:
                deleted_driver = {
                    "name": driver["name"],
                    "route": driver["route"],
                    "shift": driver["shift"]
                }
        with open("data/drivers.json", "w") as file:
            json.dump(updated_drivers_list, file, indent=4)
        return deleted_driver
                



    

