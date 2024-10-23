import json

# Function to get the data from a file
def get_data(file):
    with open(f"data/{file}") as file:
        data = json.load(file)
    return data

# Function to write data to a file
def write_data(new_data, file):
    with open(f"data/{file}", "w") as file:
        json.dump(new_data, file, indent=4)
    return True
