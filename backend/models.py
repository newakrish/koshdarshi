from config import db

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_name = db.Column(db.String(100),unique=False, nullable=False)
    description = db.Column(db.String(255),unique=False, nullable=True)
    budget = db.Column(db.Float,unique=False, nullable=False)
    deadline = db.Column(db.Date,unique=False, nullable=False)
    address = db.Column(db.String(255), unique=False, nullable=False)
    project_manager = db.Column(db.String(100), unique=False, nullable=False)  
    status = db.Column(db.String(20), default='ongoing', nullable=False)
    def to_json(self):
        return {
            "id": self.id,
            "project_name": self.project_name,
            "description": self.description,
            "budget": self.budget,
            "deadline": self.deadline,
            "address": self.address,
            "project_manager": self.project_manager,
            "status": self.status
        }