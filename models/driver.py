class Driver:
    def __init__(self, name, route, shift):
        self.name = name
        self.route = route
        self.shift = shift

    def to_dict(self):
        driver_dict = {
            "name" : self.name,
            "route" : self.route,
            "shift": self.shift
        }
        return driver_dict
    
        