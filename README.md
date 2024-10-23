# MY FINAL PROJECT

This project is a transportation management system designed for a company where admin can add new drivers with certain routes, shifts and days. The admin also can edit, delete them.

- **What does it do?**  
  It allows employees to view available rides based on specific shifts and routes. Employees can also delete their assigned rides.

- **What is the "new feature" which you have implemented that we haven't seen before?**  
  Used Jinja templating to display data and enable editing, with the data to be edited appearing dynamically in a form. I also integrated modern JavaScript features, including using `fetch` to update certain components of the page without refreshing, improving user experience. Additionally, I learned about and implemented CSS variables for consistent styling and used the `forEach` loop in JavaScript for efficient data handling, explored HTML document features like nextSibling to improve DOM manipulation, learned about `js modules`.

## Prerequisites

To run this project, you'll need to install the following modules:

- Flask: `pip install flask`

## Project Checklist

- [x] It is available on GitHub.
- [x] It uses the Flask web framework.
- [x] It uses at least one module from the Python Standard Library other than the random module.
  - Module name: `uuid` and `json`
- [x] It contains at least one class written by you that has both properties and methods. It uses `__init__()` to initialize the object's attributes.
  - File name for the class definition: `employee.py` found in models
  - Line number(s) for the class definition: 7-98
  - Name of two properties: `id`, `name`
  - Name of two methods: `book_ride()`, `delete_ride()`
  - File name and line numbers where the methods are used:  
    `employee_bp.py` inside the blueprints folder, lines 38-93
- [x] It makes use of JavaScript in the front end and uses the localStorage of the web browser.
- [x] It uses modern JavaScript (for example, let and const rather than var).
- [x] It makes use of the reading and writing to the same file feature.
- [x] It contains conditional statements.
  - File name: `drivers_bp.py` inside blueprints folder
  - Line number(s): 65-69
- [x] It contains loops.
  - File name: `auth.py` inside blueprints folder
  - Line number(s): 49
- [x] It lets the user enter a value in a text box at some point.
      This value is received and processed by your back-end Python code.
- [x] It doesn't generate any error message even if the user enters a wrong input.
- [x] It is styled using your own CSS.
- [x] The code follows the code and style conventions introduced in the course, is fully documented using comments, and doesn't contain unused or experimental code.
- [x] All exercises have been completed as per the requirements and pushed to the respective GitHub repository.
