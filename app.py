from flask import Flask, render_template, request, redirect, url_for, flash
from flask_login import UserMixin, LoginManager, login_user, logout_user, login_required, current_user

app = Flask(__name__)
app.secret_key = 'supersecretkey123'

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'



users = {
    "user1": {"id": "user1", "password": "password123"},
    "user2": {"id": "user2", "password": "password456"}
}


tasks = {
    'user1': [],
    'user2': []
}



class User(UserMixin):
    def __init__(self, id):
        self.id = id
    
    @staticmethod
    def get(user_id):
        user_data = users.get(user_id)
        if user_data:
            return User(user_id)
        return None



class Task:
    def __init__(self, id, title, description) -> None:
        self.id = id
        self.title = title
        self.description = description



@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user_id = request.form['username']
        password = request.form['password']
        user = User.get(user_id)

        if user and users[user_id]['password'] == password:
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
    user_tasks = tasks.get(current_user.id, [])
    return render_template('dashboard.html', tasks=user_tasks)


@app.route('/add_task', methods=['POST'])
@login_required
def add_task():
    user_id = request.form['user_id']
    task_title = request.form['title']
    task_description = request.form['description']

    new_task = Task(id=len(tasks[user_id]) + 1, title=task_title, description=task_description)
    tasks[user_id].append(new_task)

    return redirect(url_for('dashboard'))



if __name__ == '__main__':
    app.run(debug=True)