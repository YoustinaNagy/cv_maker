import os
import sqlite3

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import login_required, convertToBinaryData


# Configure application
app = Flask(__name__)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///cv_maker.db")

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    personal_info = db.execute("SELECT * FROM personal_info WHERE user_id = ?", session['user_id'])
    personal_info = personal_info[0] if personal_info else {}

    work_experiences = db.execute("SELECT * FROM experience WHERE user_id = ?", session['user_id'])
    certificates = db.execute("SELECT * FROM certificate WHERE user_id = ?", session['user_id'])
    
    skills = db.execute("SELECT * FROM skills WHERE user_id = ?", session['user_id'])
    languages = db.execute("SELECT * FROM language WHERE user_id = ?", session['user_id'])
    references = db.execute("SELECT * FROM reference WHERE user_id = ?", session['user_id'])

    return render_template("index.html", personal_info=personal_info, work_experiences=work_experiences, certificates = certificates,skills=skills, languages=languages, references=references)

@app.route("/logout", methods=["GET"])
def logout():
    # clear
    session.clear()

    # Redirect 
    return redirect("/")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        # Ensure email was submitted
        if not request.form.get("username"):
            return render_template('error.html', errorMsg='must provide username',code='403')


        # Ensure password was submitted
        elif not request.form.get("password"):
            return render_template('error.html', errorMsg='must provide password',code='403')

        # print(request.form.get("username"), request.form.get("password"))

        # select username
        rows = db.execute("SELECT * FROM user WHERE username = ?", request.form.get("username"))

        # Ensure username exists and password is correct
        if len(rows) != 1 or rows[0]["password"] != request.form.get("password"):
            return render_template('error.html', errorMsg='invalid username and/or password',code='403')

        session["user_id"] = rows[0]['id']
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    return render_template("login.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == 'POST':
        username = request.form.get("username")
        password = request.form.get("password")


        if not username or not password:
            return render_template('error.html', errorMsg='empty username/password',code='400')
        
        # Query database for username
        rows = db.execute("SELECT * FROM user WHERE username = ?", request.form.get("username"))

        if len(rows) > 0:
            return render_template('error.html', errorMsg='username exists',code='404')


        db.execute("INSERT INTO user(username, password) VALUES(?, ?)" , username, password)

        return redirect('/')

    return render_template("register.html")

@app.route("/personal", methods=["GET", "POST"])
@login_required
def personal():
    if request.method == 'POST':
        firstname = request.form.get('firstname') 
        lastname = request.form.get('lastname') 
        date_of_birth = request.form.get('dateOfBirth') 
        summary = request.form.get('summery')
        address = request.form.get('address')
        email = request.form.get('email')
        linkedin = request.form.get('linkedin')
        phone = request.form.get('phone')
        photo_url = request.form.get('photo')

        # update if possible
        existing_record = db.execute('DELETE FROM personal_info WHERE user_id = ?', session['user_id'])
        personal_info = db.execute('''INSERT INTO personal_info (user_id,first_name,last_name, summary,date_of_birth,address,email,linkedin,phone,photo_url) 
        VALUES (?,?,?,?,?,?,?,?,?,?)''', session["user_id"],firstname,lastname,summary,date_of_birth,address,email,linkedin,phone,photo_url)
    
    rows = db.execute('select * from personal_info where user_id = ?', session['user_id'])
    personal_info = rows[0] if rows else {} 
    print(personal_info)
    return render_template('personal_info.html', personal_info=personal_info)

    

@app.route("/experience", methods=["GET", "POST"])
@login_required
def experience():
    if request.method == 'POST':
        experiences = request.json
        db.execute("DELETE FROM experience WHERE user_id = ?", session["user_id"])
        for experience in experiences:
            db.execute('''INSERT INTO experience (user_id, date, company, title, description) 
            VALUES (?,?,?,?,?)''', session["user_id"],experience['date'], experience['company'],experience['title'],experience['description'])
    
    experiences = db.execute('''SELECT * FROM experience WHERE user_id = ?''', session["user_id"])
    # print(experiences)
    return render_template('experience.html', experiences=experiences)

@app.route("/learning&certifications", methods=["GET", "POST"])
@login_required
def learning():
    if request.method == 'POST':
        certificates = request.json
        db.execute("DELETE FROM certificate WHERE user_id = ?", session["user_id"])
        for certificate in certificates:
            db.execute('''INSERT INTO certificate (user_id, date, certificate_name, description) 
            VALUES (?,?,?,?)''', session["user_id"],certificate['date'], certificate['certificate_name'],certificate['description'])

    certificates = db.execute('''SELECT * FROM certificate WHERE user_id = ?''', session["user_id"])
    print(certificates)
    return render_template('learning&Certifications.html',certificates = certificates)

@app.route("/skills", methods=["GET", "POST"])
@login_required
def skills():
    if request.method == 'POST':
        skills = request.json
        db.execute('DELETE FROM skills WHERE user_id = ?', session["user_id"])
        for skill in skills:
            db.execute('INSERT INTO skills (user_id,skill,profeciency) VALUES(?,?,?)', session["user_id"],skill['skill'], skill['profeciency']) 
    skills = db.execute('SELECT * FROM skills WHERE user_id = ?', session["user_id"]) 
    print(skills)
    return render_template('skills.html', skills=skills)

@app.route("/languages", methods=["GET", "POST"])
@login_required
def languages():
    if request.method == 'POST':
        languages = request.json
        db.execute('DELETE FROM language WHERE user_id = ?', session["user_id"])
        for language in languages:
            db.execute('INSERT INTO language(user_id,name,fluency) VALUES(?,?,?)', session["user_id"],language['name'], language['fluency']) 
    languages = db.execute('SELECT * FROM language WHERE user_id = ?', session["user_id"]) 
    return render_template('languages.html', languages=languages)

@app.route("/references", methods=["GET", "POST"])
@login_required
def references():
    if request.method == 'POST':
        references = request.json
        db.execute('DELETE FROM reference WHERE user_id = ?', session["user_id"])
        for reference in references:
            db.execute('INSERT INTO reference(user_id,name,quote) VALUES(?,?,?)', session["user_id"],reference['name'], reference['quote']) 
    references = db.execute('SELECT * FROM reference WHERE user_id = ?', session["user_id"]) 
    return render_template('references.html', references=references)



