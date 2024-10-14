from models.driver import Driver
from helper import write_user, get_users


class Employee:
    def __init__(self, name, email, password, role):
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

    

