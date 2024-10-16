from flask import Flask, render_template, request, redirect, url_for, flash
from flask_login import UserMixin, LoginManager, login_user, logout_user, login_required, current_user
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from werkzeug.security import generate_password_hash, check_password_hash
from flask_migrate import Migrate
import math

app = Flask(__name__)
app.secret_key = 'supersecretkey123'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///assignmenthq.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # To suppress warnings

convention = {
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)
db = SQLAlchemy(app, metadata=metadata)
migrate = Migrate(app, db)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


# to rebuild CSS:    npx tailwindcss -o ./static/styles/output.css --watch



class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

    tasks = db.relationship('Task', backref='owner', lazy=True)
    decks = db.relationship('StudyDeck', backref='owner', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'



class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    status = db.Column(db.Boolean, default=False)
    priority = db.Column(db.Integer, default=math.inf)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    deck_id = db.Column(db.Integer, db.ForeignKey('study_deck.id'), nullable=True)



class StudyDeck(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    tasks = db.relationship('Task', backref='deck', lazy=True)
    cards = db.relationship('StudyCard', backref='deck', lazy=True)



class StudyCard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    term = db.Column(db.String(200), nullable=False)
    definition = db.Column(db.String(500), nullable=False)
    mastery_level = db.Column(db.Integer, default=0)

    deck_id = db.Column(db.Integer, db.ForeignKey('study_deck.id'), nullable=False)

    


@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, user_id)


with app.app_context():
    db.create_all()


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user_id = request.form['username']
        password = request.form['password']
        user = db.session.execute(db.select(User).filter_by(username=user_id)).scalar_one()

        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password.')

    return render_template('login.html')


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('home'))


@app.route('/dashboard')
@login_required
def dashboard():
    user_tasks = db.session.execute(db.select(Task).filter_by(user_id=current_user.id).order_by(Task.priority)).scalars()
    return render_template('dashboard.html', tasks=user_tasks)


@app.route('/add_task', methods=['POST'])
@login_required
def add_task():
    task_title = request.form['title']
    task_description = request.form['description']

    if len(task_title) > 0:
        user_tasks = db.session.execute(db.select(Task).filter_by(user_id=current_user.id)).scalars()
        new_task = Task(title=task_title, description=task_description, user_id=current_user.id)
        db.session.add(new_task)
        db.session.commit()

        flash('Task created successfully!', 'success')
    else:
        flash('Error: Task title is required.', 'error')

    return redirect(url_for('dashboard'))


@app.route('/edit_task', methods=['POST'])
@login_required
def edit_task():
    task_id = int(request.form['task_id'])
    task_title = request.form['title']
    task_description = request.form['description']

    task = db.session.get(Task, task_id)
    task.title = task_title
    task.description = task_description
    db.session.commit()

    return redirect(url_for('dashboard'))


@app.route('/remove_task', methods=['POST'])
@login_required
def remove_task():
    task_id = int(request.form['task_id'])

    task = db.session.get(Task, task_id)
    db.session.delete(task)
    db.session.commit()

    return redirect(url_for('dashboard'))


@app.route('/complete_task', methods=['POST'])
@login_required
def mark_completed():
    task_id = int(request.form['task_id'])
    
    task = db.session.get(Task, task_id)
    task.status = not task.status
    db.session.commit()

    return redirect(url_for('dashboard'))

@app.route('/sort_tasks', methods=['POST'])
@login_required
def sort():
    discriminator = request.form['discriminator']
    if discriminator == 'name':
        key= (lambda x: x.title)
    elif discriminator == 'status':
        key= (lambda x: x.status)
    else:
        print(discriminator)
    tasks = db.session.execute(db.select(Task).filter_by(user_id=current_user.id))
    new_order = sorted([t[0] for t in tasks], key=lambda x: x.title.casefold())
    for task in new_order:
        task.priority = new_order.index(task)
    db.session.commit()

    return redirect(url_for('dashboard'))

@app.route('/study', methods=['GET'])
@login_required
def study():
    return render_template('study.html')


if __name__ == '__main__':
    app.run(debug=True)