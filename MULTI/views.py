"""
Routes and views for the flask application.
"""

from datetime import datetime
from re import A
from flask import render_template, request, redirect, url_for, jsonify, session
from MULTI import app
from functools import wraps
import os

#setting the current working folder for project
dirPath = os.path.dirname(os.path.realpath(__file__))
dirPathData = os.path.join(dirPath, r"static\data.txt")
os.chdir(dirPath)

Email = "a"

@app.route('/')

@app.route('/home')
def home():
    return render_template(
        'index.html',
        title='Home Page',
        year=datetime.now().year,
    )

@app.route('/contact')
def contact():
    return render_template(
        'contact.html',
        title='Contact',
        year=datetime.now().year,
        message='Your contact page.'
    )

@app.route('/about')
def about():
    return render_template(
        'about.html',
        title='About',
        year=datetime.now().year,
        message='Your application description page.'
    )

@app.route('/login')
def login():
    return render_template(
        'login.html',
        title='Login',
        year=datetime.now().year,
        message='Your application description page.'
    )

@app.route('/forgetPassword')
def forgetPassword():
    return render_template(
        'forgetPassword.html',
        title='Forget Password',
        year=datetime.now().year,
    )

@app.route('/forgetPasswordFail')
def forgetPasswordFail():
    return render_template(
        'forgetPasswordFail.html',
        title='Forget Password',
        year=datetime.now().year,
    )

@app.route('/resetPassword')
def resetPassword():
    return render_template(
        'resetPassword.html',
        title='Reset Password',
        year=datetime.now().year,
    )

@app.route('/resetPasswordFail')
def resetPasswordFail():
    return render_template(
        'resetPasswordFail.html',
        title='Reset Password',
        year=datetime.now().year,
    )

@app.route('/vgumap')
def vgumap():
    """Renders the login page."""
    return render_template(
        'vgumap.html',
        title='Map',
        year=datetime.now().year,
        message='Map'
    )

@app.route('/register')
def register():
    return render_template(
        'register.html',
        title='Register'
        )

@app.route('/logout')
def logout():
    # Clear the session
    session.pop('user_id', None)
    
    # Set headers to prevent caching
    response = redirect(url_for('home'))
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    
    return response

@app.route('/checkEmail', methods=['POST','GET'])
def checkEmail():
    
    email = request.form.get("email").strip()
    mailList = []
    
    with open(dirPathData, "r") as file:
        Lines = file.readlines()
        for line in Lines:
            try:
                usernameFile, passwordFile, emailFile = line.strip().split(':') 
            except:
                continue
            else:
                usernameFile, passwordFile, emailFile = line.strip().split(':') 
                mailList.append(emailFile)
        
    if request.method == 'POST':
        if email in mailList:
            global Email
            Email = email
            return redirect(url_for("resetPassword"))
        else:
            return redirect(url_for("forgetPasswordFail"))

@app.route('/checkRegister', methods=['POST','GET'])
def checkRegister():
    
    email = request.form.get("email").strip()
    username = request.form.get("username").strip()
    password = request.form.get("password")
    passwordConfirm = request.form.get("passwordConfirm")
    dictCheck = {}
    emailCheck = []
    
    with open(dirPathData, "r") as file:
        Lines = file.readlines()
        for line in Lines:
            try:
                usernameFile, passwordFile, emailFile = line.strip().split(':') 
            except:
                continue
            else:
                usernameFile, passwordFile, emailFile = line.strip().split(':') 
                dictCheck.update({usernameFile : passwordFile})
                emailCheck.append(emailFile)
                 
    if request.method == 'POST':
        if (username not in dictCheck.keys()) and ((email in emailCheck) == False) and (password == passwordConfirm):
            with open(dirPathData, "a") as file:
                file.write(username + ":" + password)
                file.write(":" + email + "\n")
            return redirect(url_for("registerSuccess"))
        else:
            return redirect(url_for("registerFail"))

@app.route('/registerSuccess', methods=['POST','GET'])
def registerSuccess():
    return render_template(
        'registerSuccess.html',
        title='Register Success'
        )

@app.route('/registerFail', methods=['POST','GET'])
def registerFail():
    return render_template(
        'registerFail.html',
        title='Register Fail'
        )

@app.route('/checkLogin', methods=['POST','GET'])
def checkLogin():
    
    usernameInput = request.form.get("username").strip()
    passwordInput = request.form.get("password").strip()
    dictCheck = {}
    
    with open(dirPathData, "r") as file:
        Lines = file.readlines()
        for line in Lines:
            try:
                usernameFile, passwordFile, emailFile = line.strip().split(':') 
            except:
                continue
            else:
                usernameFile, passwordFile, emailFile = line.strip().split(':') 
                dictCheck.update({usernameFile : passwordFile})
        
        if request.method == 'POST':
            if usernameInput in dictCheck and dictCheck[usernameInput] == passwordInput:
                return redirect(url_for("vgumap"))
            else:
                return redirect(url_for("login"))
        else:
            return redirect(url_for("home"))

@app.route('/checkResetPassword', methods=['POST','GET'])
def checkResetPassword():
    
    global Email
    email = Email
    usernameFile = "a"
    newPassword = request.form.get("password")
    newPasswordConfirm = request.form.get("passwordConfirm")
    userCheck = []
    emailCheck = []
    emailIndex = 0
    data = []
    
    with open(dirPathData, "r") as file:
        data = Lines = file.readlines()
        for line in Lines:
            try:
                usernameFile, passwordFile, emailFile = line.strip().split(':') 
            except:
                continue
            else:
                usernameFile, passwordFile, emailFile = line.strip().split(':') 
                userCheck.append(usernameFile)
                emailCheck.append(emailFile)
                
    emailIndex = emailCheck.index(email)
                 
    if request.method == 'POST':
        if newPassword == newPasswordConfirm:
            data[emailIndex] = userCheck[emailIndex] + ":" + newPassword + ":" + email + "\n"
            with open(dirPathData, "w") as file:
                file.writelines(data)
            return redirect(url_for("login"))
        else:
            return redirect(url_for("resetFail"))

@app.after_request
def set_response_headers(response):
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated

@app.route('/protected_page')
@requires_auth
def protected_page():
    # This page is only accessible if the user is authenticated
    return 'Hello, authenticated user!'