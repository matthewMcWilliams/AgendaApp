from flask import render_template
# from flask_login import login_manager
# from apps.database import User
from apps import create_app

# to rebuild CSS:    npx tailwindcss -o .apps\static\styles\output.css --watch

app = create_app()



@app.route('/')
def home():
    return render_template('home.html')





if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)