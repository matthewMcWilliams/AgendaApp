from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_required, current_user
from apps.database import db, Task

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/')
def home():
    return render_template('home.html')

@dashboard_bp.route('/dashboard')
def dashboard():
    user_tasks = db.session.execute(db.select(Task).filter_by(user_id=current_user.id).order_by(Task.priority)).scalars()
    return render_template('dashboard.html', tasks=user_tasks)


@dashboard_bp.route('/add_task', methods=['POST'])
@login_required
def add_task():
    task_title = request.form['title']
    task_description = request.form['description']

    if len(task_title) > 0:
        new_task = Task(title=task_title, description=task_description, user_id=current_user.id)
        db.session.add(new_task)
        db.session.commit()

        flash('Task created successfully!', 'success')
    else:
        flash('Error: Task title is required.', 'error')

    return redirect(url_for('dashboard.dashboard'))


@dashboard_bp.route('/edit_task', methods=['POST'])
@login_required
def edit_task():
    task_id = int(request.form['task_id'])
    task_title = request.form['title']
    task_description = request.form['description']

    task = db.session.get(Task, task_id)
    task.title = task_title
    task.description = task_description
    db.session.commit()

    return redirect(url_for('dashboard.dashboard'))


@dashboard_bp.route('/remove_task', methods=['POST'])
@login_required
def remove_task():
    task_id = int(request.form['task_id'])

    task = db.session.get(Task, task_id)
    db.session.delete(task)
    db.session.commit()

    return redirect(url_for('dashboard.dashboard'))


@dashboard_bp.route('/complete_task', methods=['POST'])
@login_required
def mark_completed():
    task_id = int(request.form['task_id'])
    
    task = db.session.get(Task, task_id)
    task.status = not task.status
    db.session.commit()

    return redirect(url_for('dashboard.dashboard'))

@dashboard_bp.route('/sort_tasks', methods=['POST'])
@login_required
def sort():
    discriminator = request.form['discriminator']
    if discriminator == 'name':
        key= (lambda x: x.title.casefold())
    elif discriminator == 'status':
        key= (lambda x: x.status)
    else:
        print('discriminator not found:  ' + discriminator)
    tasks = db.session.execute(db.select(Task).filter_by(user_id=current_user.id))
    new_order = sorted([t[0] for t in tasks], key=key)
    for task in new_order:
        task.priority = new_order.index(task)
    db.session.commit()

    return redirect(url_for('dashboard.dashboard'))