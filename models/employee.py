from models.driver import Driver
from helper import write_data, get_data
import json
import uuid


class Employee:
    def __init__(self, id, name, email, password):
        self.id = id
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

    def view_booked_rides(self):
        users = get_data("users.json")
        booked_rides = [{}]
        for user in users:
            if user["id"] == self.id:
                booked_rides = user["booked_rides"]
        return booked_rides

    def book_ride(self, day, start_point, end_point, shift, driver_id):
        users = get_data("users.json")
        drivers = get_data("drivers.json")
        for driver in drivers:
            if driver["id"] == driver_id:
                driver["avaliable_seats_on_days"][day] -= 1
                break
        check_write = write_data(drivers, "drivers.json")
        for user in users:
            if user["id"] == self.id:
                booked_ride = {
                    "id": str(uuid.uuid4()),
                    "driver_id": driver_id,
                    "day": day,
                    "start_point": start_point,
                    "end_point": end_point,
                    "shift": shift
                }
                user["booked_rides"].append(booked_ride)
                break
        check_write = write_data(users, "users.json")
        return booked_ride
    

    def delete_ride(self, ride_id):
        users = get_data("users.json")
        drivers = get_data("drivers.json")
        
        updated_users = []
        
        # Iterate over the users
        for user in users:
            if user["id"] == self.id:  # Find the correct user
                updated_rides = []
                
                # Iterate over the user's booked rides
                for ride in user["booked_rides"]:
                    if ride["id"] != ride_id:  # Keep rides that don't match the ride_id
                        updated_rides.append(ride)
                    else:
                        # Ride found for deletion; now update driver’s available seats
                        for driver in drivers:
                            if driver["id"] == ride["driver_id"]:  # Find the correct driver
                                if ride["day"] in driver["avaliable_seats_on_days"]:
                                    driver["avaliable_seats_on_days"][ride["day"]] += 1
                                break  # No need to continue looping drivers once found
                
                # Update the user’s booked rides after the deletion
                user["booked_rides"] = updated_rides
            
            # Append the modified user back into the updated list
            updated_users.append(user)

        # Write the updated users and drivers back to their respective JSON files
        check_write = write_data(updated_users, "users.json")
        write_data(drivers, "drivers.json")  # Also update the drivers file

        return json.dumps({"message": "done"})





class Admin(Employee):
    def __init__(self, id, name, email, password):
        super().__init__(id, name, email, password)
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
        users = get_data("users.json")
        drivers = get_data("drivers.json")
        updated_users = []
        updated_drivers = []
        for user in users:
            # To append to it for each iteration the updated rides
            updated_rides = []
            # As users.json has a list of users, not all of them with booked rides
            if "booked_rides" in user:
                for ride in user["booked_rides"]:
                    if ride["driver_id"] != driver_id: 
                        updated_rides.append(ride)
                user["booked_rides"] = updated_rides
        
            updated_users.append(user)
        # Check for each driver in drivers.json if the driver to be deleted is found
        for driver in drivers:
            if driver["id"] != driver_id: 
                updated_drivers.append(driver)
            else:
                deleted_driver = {
                    "name": driver["name"],
                    "shift": driver["shift"],
                    "start_point": driver["start_point"],
                    "end_point": driver["end_point"]
                }
        
        check_write = write_data(updated_users, "users.json")
        check_write = write_data(updated_drivers, "drivers.json")
        return deleted_driver
        
    def edit_driver(self,data):
        drivers = get_data("drivers.json")
        users = get_data("users.json")
        updated_drivers = []
            
        edited_data = {}
        for driver in drivers:
            # Set the new values for the driver to be edited
            if driver["id"] == data["driverId"]:
                driver["shift"] = data["driverShiftEdit"]
                driver["start_point"] = data["driverStartPointEdit"]
                driver["end_point"] = data["driverEndPointEdit"]
                # Add new days to the driver if found in the request
                for day in data["driverDaysEdit"]:
                    if day not in driver["avaliable_seats_on_days"]:
                        driver["avaliable_seats_on_days"][day] = driver["car_capacity"]
                # Remove days from the driver if not found in the request
                for day in list(driver["avaliable_seats_on_days"]):  
                    if day not in data["driverDaysEdit"]:
                        del driver["avaliable_seats_on_days"][day]
                
                edited_data = driver

            updated_drivers.append(driver)  

        # Check for each user in users.json if the user has booked rides with the driver to be edited 
        for user in users:
            if "booked_rides" in user:
                user["booked_rides"] = [
                    ride for ride in user["booked_rides"]
                    if not (
                        ride["driver_id"] == edited_data["id"] and 
                        (ride["day"] not in edited_data["avaliable_seats_on_days"] or ride["shift"] != edited_data["shift"])
                    )
                ]
        check = write_data(users, "users.json")
        check = write_data(updated_drivers, "drivers.json")
        return edited_data
                    








