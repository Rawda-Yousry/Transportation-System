import uuid
class Driver:
    def __init__(self, name, start_point, end_point, shift, car_capacity):
        self.id = str(uuid.uuid4())
        self.name = name
        self.start_point = start_point
        self.end_point = end_point
        self.shift = shift
        self.car_capacity = car_capacity
        self.avaliable_seats_on_days = {
            "Sunday": car_capacity,
            "Monday": car_capacity,
            "Tuesday": car_capacity,
            "Wednesday": car_capacity,
            "Thursday": car_capacity
        }
        
    def to_dict(self):
        driver_dict = {
            "id": self.id,
            "name" : self.name,
            "start_point" : self.start_point,
            "end_point": self.end_point,
            "shift": self.shift,
            "car_capacity": int(self.car_capacity),
            "avaliable_seats_on_days": {
                "Sunday": int(self.car_capacity),
                "Monday": int(self.car_capacity),
                "Tuesday": int(self.car_capacity),
                "Wednesday": int(self.car_capacity),
                "Thursday": int(self.car_capacity)
            }
        }
        return driver_dict
    
        