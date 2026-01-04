from flask import request, jsonify, Blueprint
from config import app, db
from models import Project, Expenditure

# Create a blueprint
project_bp = Blueprint('project_bp', __name__)

# -------------------- PROJECT GET Routes --------------------

# Get all projects
@project_bp.route("/projects", methods=["GET"])
def get_projects():
    try:
        projects = Project.query.all()
        return jsonify({"projects": [p.to_json() for p in projects]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Get a single project by ID
@project_bp.route("/projects/<int:project_id>", methods=["GET"])
def get_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found."}), 404
    return jsonify({"project": project.to_json()}), 200


# -------------------- PROJECT DELETE Route --------------------

# Delete a project by ID
@project_bp.route("/projects/<int:project_id>", methods=["DELETE"])
def delete_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found."}), 404
    
    try:
        db.session.delete(project)
        db.session.commit()
        return jsonify({"message": f"Project {project_id} deleted successfully."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# -------------------- EXPENDITURE GET Routes ----------------

# Get all expenditures for a project
@project_bp.route("/projects/<int:project_id>/expenditures", methods=["GET"])
def get_expenditures(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found."}), 404
    
    expenditures = Expenditure.query.filter_by(project_id=project_id).all()
    return jsonify({"expenditures": [e.to_json() for e in expenditures]}), 200


# Get a single expenditure by ID
@project_bp.route("/projects/<int:project_id>/expenditures/<int:expenditure_id>", methods=["GET"])
def get_expenditure(project_id, expenditure_id):
    expenditure = Expenditure.query.filter_by(project_id=project_id, id=expenditure_id).first()
    if not expenditure:
        return jsonify({"error": "Expenditure not found."}), 404
    return jsonify({"expenditure": expenditure.to_json()}), 200


# -------------------- EXPENDITURE DELETE Route --------------------

# Delete an expenditure by ID
@project_bp.route("/projects/<int:project_id>/expenditures/<int:expenditure_id>", methods=["DELETE"])
def delete_expenditure(project_id, expenditure_id):
    expenditure = Expenditure.query.filter_by(project_id=project_id, id=expenditure_id).first()
    if not expenditure:
        return jsonify({"error": "Expenditure not found."}), 404
    
    try:
        project = Project.query.get(project_id)
        if project and project.left_budget is not None:
            project.left_budget += expenditure.amount  # restore budget when deleting
        db.session.delete(expenditure)
        db.session.commit()
        return jsonify({"message": f"Expenditure {expenditure_id} deleted successfully."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# -------------------- Register Blueprint --------------------
app.register_blueprint(project_bp)