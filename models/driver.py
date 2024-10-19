import uuid
class Driver:
    def __init__(self, email, name, start_point, end_point, shift, car_capacity, avaliable_days):
        self.id = str(uuid.uuid4())
        self.email = email
        self.name = name
        self.start_point = start_point
        self.end_point = end_point
        self.shift = shift
        self.car_capacity = int(car_capacity)
        self.avaliable_seates_on_days = {}
        for day in avaliable_days:
            self.avaliable_seates_on_days[day] = int(self.car_capacity)
        
    def to_dict(self):
        driver_dict = {
            "id": self.id,
            "email": self.email,
            "name" : self.name,
            "start_point" : self.start_point,
            "end_point": self.end_point,
            "shift": self.shift,
            "car_capacity": self.car_capacity,
            "avaliable_seats_on_days": self.avaliable_seates_on_days
        }
        return driver_dict
    
        