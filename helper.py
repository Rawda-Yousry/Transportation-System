import json

def get_users(file):
    with open(f"data/{file}") as file:
        users = json.load(file)
    return users

def write_user(user, file):
    users = get_users(file= file)
    users.append(user)
    with open(f"data/{file}", "w") as file:
        json.dump(users, file, indent=4)
    return True
