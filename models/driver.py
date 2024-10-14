import uuid
class Driver:
    def __init__(self, name, route, shift):
        self.id = str(uuid.uuid4())
        self.name = name
        self.route = route
        self.shift = shift

    def to_dict(self):
        driver_dict = {
            "id": self.id,
            "name" : self.name,
            "route" : self.route,
            "shift": self.shift
        }
        return driver_dict
    
        