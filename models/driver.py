import uuid
class Driver:
    def __init__(self, name, start_point, end_point, shift, car_capacity, avaliable_seats):
        self.id = str(uuid.uuid4())
        self.name = name
        self.start_point = start_point
        self.end_point = end_point
        self.shift = shift
        self.car_capacity = car_capacity
        self.avaliable_seats = car_capacity

    def to_dict(self):
        driver_dict = {
            "id": self.id,
            "name" : self.name,
            "start_point" : self.start_point,
            "end_point": self.end_point,
            "shift": self.shift,
            "car_capacity": int(self.car_capacity),
            "avaliable_seats": int(self.avaliable_seats)
        }
        return driver_dict
    
        