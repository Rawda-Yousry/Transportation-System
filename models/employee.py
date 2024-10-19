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
        self.role = "employee"

    def to_dict(self):
        employee_dict = {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "password": self.password,
            "role": self.role,
            "booked_rides": []
        }
        return employee_dict

    def view_booked_rides(self, employee_id):
        users = get_data("users.json")
        booked_rides = [{}]
        for user in users:
            if user["id"] == employee_id:
                booked_rides = user["booked_rides"]
        return booked_rides

    def book_ride(self, employee_id, day, start_point, end_point, shift, driver_id):
        users = get_data("users.json")
        drivers = get_data("drivers.json")
        for driver in drivers:
            if driver["id"] == driver_id:
                driver["avaliable_seats_on_days"][day] -= 1
                break
        check_write = write_data(drivers, "drivers.json")
        for user in users:
            if user["id"] == employee_id:
                booked_ride = {
                    "id": str(uuid.uuid4()),
                    "day": day,
                    "start_point": start_point,
                    "end_point": end_point,
                    "shift": shift
                }
                user["booked_rides"].append(booked_ride)
                break
        check_write = write_data(users, "users.json")
        return booked_ride
    

    def delete_ride(self,ride_id, user_id):
        users = get_data("users.json")
        updated_users = []
        for user in users:
            if user["id"] != user_id:
                updated_users.append(user)
            else:
                user["booked_rides"] = [ride for ride in user["booked_rides"] if ride["id"] != ride_id]
                updated_users.append(user)
        check_write = write_data(updated_users, "users.json")
        return json.dumps({"message": "done"})





class Admin(Employee):
    def __init__(self, name, email, password):
        super().__init__(name, email, password)
        self.role = "admin"

    def add_driver(self, email, name, start_point, end_point, shift, car_capacity, avaliable_days):
        new_driver = Driver(email, name, start_point, end_point, shift, car_capacity, avaliable_days)
        new_driver_dict = new_driver.to_dict()
        drivers = get_data("drivers.json")
        drivers.append(new_driver_dict)
        check_write = write_data(drivers , "drivers.json")
        return new_driver_dict
    
    def view_drivers(self):
        drivers = get_data("drivers.json")
        return drivers
    
    def delete_driver(self, driver_id):
        deleted_driver = dict()
        drivers = get_data("drivers.json")
        updated_drivers_list = []
        for driver in drivers:
            if driver["id"] != driver_id:
                updated_drivers_list.append(driver)
            else:
                deleted_driver = {
                    "name": driver["name"],
                    "start_point": driver["start_point"],
                    "end_point": driver["end_point"],
                    "car_capacity": driver["car_capacity"]
                }
        check_write = write_data(updated_drivers_list, "drivers.json")
        return deleted_driver





    

