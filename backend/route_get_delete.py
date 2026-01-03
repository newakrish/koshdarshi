from flask import request, jsonify, Blueprint
from config import app, db
from models import Project

# Create a blueprint
project_bp = Blueprint('project_bp', __name__)

# -------------------- GET Routes --------------------

# Get all projects
@project_bp.route("/projects", methods=["GET"])
def get_projects():
    try:
        details = Project.query.all()
        json_details = list(map(lambda x: x.to_json(), details))
        return jsonify({"projects": json_details}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Get a single project by ID
@project_bp.route("/projects/<int:project_id>", methods=["GET"])
def get_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found."}), 404
    return jsonify(project.to_json()), 200


# -------------------- DELETE Route --------------------

# Delete a project by ID
@project_bp.route("/projects/<int:project_id>", methods=["DELETE"])
def delete_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found."}), 404
    
    try:
        db.session.delete(project)
        db.session.commit()
        return jsonify({"message": f"Project with ID {project_id} deleted successfully."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# -------------------- Register Blueprint --------------------
app.register_blueprint(project_bp)

# -------------------- MAIN --------------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        app.run(debug=True)