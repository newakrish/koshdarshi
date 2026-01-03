from flask import request, jsonify, Blueprint
from config import app, db
from models import Project, Expenditure
from datetime import datetime

# create a blueprint
pp_bp = Blueprint('pp_bp', __name__)

#allowed status values
allowed_status = ['ongoing', 'completed', 'on-hold', 'cancelled']

#allowed category values
allowed_category = ['local','national']

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

    #validate category
    category = data.get('category')
    if category.lower() not in allowed_category:
        return jsonify({"error": f"Invalid category value. Must be one of: {allowed_category}"}), 400

    try:
        new_project = Project(
            project_name=data['project_name'],
            description=data.get('description'),
            budget=data['budget'],
            deadline=datetime.strptime(data['deadline'], '%Y-%m-%d').date(),
            address=data['address'],
            project_manager=data['project_manager'],
            status=status,
            category=category.lower()
        )
        db.session.add(new_project)
        db.session.commit()
        return jsonify(new_project.to_json()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

# Patch Route to update an existing project
@pp_bp.route('/projects/<int:project_id>', methods=['PATCH'])
def update_project(project_id):
    data = request.get_json()
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found."}), 404

    # Update status if provided
    if 'status' in data:
        if data['status'] not in allowed_status:
            return jsonify({"error": f"Invalid status value. Must be one of: {allowed_status}"}), 400
        project.status = data['status']

    # Update total budget if provided
    if 'budget' in data:
        try:
            project.budget = float(data['budget'])
        except ValueError:
            return jsonify({"error": "Budget must be a number"}), 400
    
    # Update 'project_manager' if provided
    if 'project_manager' in data:
        project.project_manager = data['project_manager']
    
    # Update 'deadline' if provided
    if 'deadline' in data:
        try:
            project.deadline = datetime.strptime(data['deadline'],'%Y-%m-%d').date()
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYY-MM-DD"}),400

    # Commit changes
    try:
        db.session.commit()
        return jsonify(project.to_json()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

# Post Route to create a new expenditure
@pp_bp.route('/projects/<int:project_id>/expenditures', methods=['POST'])
def create_expenditure(project_id):
    data = request.get_json()
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found."}), 404
    
    #validate mandatory fields
    mandatory_field = ['expenditure_name', 'amount', 'date']
    for field in mandatory_field:
        if not data.get(field):
            return jsonify({"error": f"'{field}' is a mandatory field."}), 400

    try:
        new_expenditure = Expenditure(
            project_id=project.id,
            expenditure_name=data['expenditure_name'],
            amount=data['amount'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            description=data.get('description')
        )
        if project.left_budget is None:
            project.left_budget = project.budget
        
        if new_expenditure.amount > project.left_budget:
            return jsonify({"error": "Expenditure amount exceeds left budget."}), 400
        
        project.left_budget -= new_expenditure.amount
        db.session.add(new_expenditure)
        db.session.commit()
        return jsonify(new_expenditure.to_json()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    