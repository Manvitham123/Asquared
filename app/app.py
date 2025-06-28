from flask import Flask


app = Flask(__name__)



@app.route('/about')
def about():
    return "This is the about page."

@app.route('/user/<username>')
def greet_user(username):
    return f"Hello, {username}!"


