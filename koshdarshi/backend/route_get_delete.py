from flask import request, jsonify
from config import app, db
from models import Project

@app.route("/project",methods=["GET"])
def get_contacts():
    contacts = Project.query.all()
    json_contacts = list (map(lamda x: x.to_json(),contacts))
    return jsonify({"contacts": json_contacts})
if __name__=="__main__":
with app.app_context():
    db.create_all()

    app.run(debug=True)