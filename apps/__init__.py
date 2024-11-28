from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from flask_login import LoginManager

socketio = SocketIO()
db = SQLAlchemy()
login_manager = LoginManager()

from .database import User


def create_app():
    app = Flask(__name__)

    # Configure the database connection
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///assignmenthq.db'  # Example: SQLite
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Avoid overhead warnings

    # Initialize the database with the app
    db.init_app(app)

    global socketio
    socketio = SocketIO(app, cors_allowed_origins="*")


    app.secret_key = 'supersecretkey123'
    login_manager.init_app(app)
    login_manager.login_view = 'login.login'


    # Import blueprints or routes here
    from .dashboard import dashboard_bp
    from .login import login_bp
    from .study import study_bp
    from .lobby import lobby_bp
    from .towerdefense import towerdefense_bp
    from .api import api_bp

    # Register blueprints
    app.register_blueprint(login_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(study_bp)
    app.register_blueprint(lobby_bp)
    app.register_blueprint(towerdefense_bp)
    app.register_blueprint(api_bp)

    # Create tables (only for development/testing; use migrations for production)
    with app.app_context():
        db.create_all()


    return app




@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, user_id)