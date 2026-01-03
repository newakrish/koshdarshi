from flask import request, jsonify, Blueprint
from config import app, db
from models import Project
from datetime import datetime

# create a blueprint
pp_bp = Blueprint('pp_bp', __name__)

#allowed status values
allowed_status = ['ongoing', 'completed', 'on-hold', 'cancelled']

# Post Route to create a new project
@pp_bp.route('/projects', methods=['POST'])
def create_project():
    data = request.get_json()

    #validate mandatory fields
    mandatory_field = ['project_name', 'budget', 'deadline', 'address', 'project_manager']
    for field in mandatory_field:
        if not data.get(field):
            return jsonify({"error": f"'{field}' is a mandatory field."}), 400

    #validate status
    status = data.get('status', 'ongoing')
    if status not in allowed_status:
        return jsonify({"error": f"Invalid status value. Must be one of: {allowed_status}"}), 400

    try:
        new_project = Project(
            project_name=data['project_name'],
            description=data.get('description'),
            budget=data['budget'],
            deadline=datetime.strptime(data['deadline'], '%Y-%m-%d').date(),
            address=data['address'],
            project_manager=data['project_manager'],
            status=status
        )
        db.session.add(new_project)
        db.session.commit()
        return jsonify(new_project.to_json()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400