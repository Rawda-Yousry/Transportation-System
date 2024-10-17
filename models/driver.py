import uuid
class Driver:
    def __init__(self, name, route, shift, car_capacity, avaliable_seats):
        self.id = str(uuid.uuid4())
        self.name = name
        self.route = route
        self.shift = shift
        self.car_capacity = car_capacity
        self.avaliable_seats = car_capacity

    def to_dict(self):
        driver_dict = {
            "id": self.id,
            "name" : self.name,
            "route" : self.route,
            "shift": self.shift,
            "car_capacity": self.car_capacity,
            "avaliable_seats": self.avaliable_seats
        }
        return driver_dict
    
        