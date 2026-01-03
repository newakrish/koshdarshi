from flask import request, jsonify
from config import app, db
from models import Project

@app.route("/project",methods=["GET"])
def get_details():
    details = Project.query.all()
    json_details = list (map(lamda x: x.to_json(),details))
    return jsonify({"contacts": json_details})
if __name__=="__main__":
with app.app_context():
    db.create_all()

    app.run(debug=True)