from models.driver import Driver
from helper import write_data, get_data
import uuid
import json


class Employee:
    def __init__(self, name, email, password):
        self.id = str(uuid.uuid4())
        self.name = name
        self.email = email
        self.password = password

    def to_dict(self):
        employee_dict = {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "password": self.password
        }
        return employee_dict


class Admin(Employee):
    def __init__(self, name, email, password):
        super().__init__(name, email, password)
        self.role = "admin"

    def add_driver(self, name, route, shift, car_capacity):
        new_driver = Driver(name, route, shift, car_capacity, avaliable_seats=car_capacity)
        new_driver_dict = new_driver.to_dict()
        check_write = write_data(new_driver_dict , "drivers.json")
        return new_driver_dict
    
    def view_drivers(self):
        drivers = get_data("drivers.json")
        return drivers
    
    def delete_driver(self, driver_id):
        updated_drivers_list = []
        deleted_driver = dict()
        drivers = get_data("drivers.json")
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
                



    

