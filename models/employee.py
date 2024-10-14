from models.driver import Driver
class Employee:
    def __init__(self, name, email, password, role):
        self.name = name
        self.email = email
        self.password = password
        self.role = role


class Admin(Employee):
    def __init__(self, name, email, password, role):
        super().__init__(name, email, password, role)

    def add_driver(self, driver, drivers_list):
        drivers_list.append(driver)
    

