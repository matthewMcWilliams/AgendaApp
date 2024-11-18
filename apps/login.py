from flask import Blueprint, request, redirect, url_for, flash, render_template
from apps.database import db, User
from flask_login import login_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash

login_bp = Blueprint('login', __name__)


from flask_login import login_manager
from apps.database import User
from apps import db


@login_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user_id = request.form['username']
        password = request.form['password']
        user = db.session.execute(db.select(User).filter_by(username=user_id)).scalar_one_or_none()

        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            return redirect(url_for('dashboard.dashboard'))
        else:
            flash('Invalid username or password.')

    return render_template('login.html')



@login_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        user_id = request.form['username']
        password = request.form['password']
        password_confirm = request.form['passwordconf']
        user = db.session.execute(db.select(User).filter_by(username=user_id)).scalar_one_or_none()

        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            return redirect(url_for('dashboard'))
        elif user:
            flash('Username already taken.')
        elif password_confirm == password:
            new_user = User(username=user_id, password_hash=generate_password_hash(password))
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user)
            return redirect(url_for('dashboard'))

    return render_template('signup.html')


@login_bp.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('home'))