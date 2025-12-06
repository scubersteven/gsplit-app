from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

class Pub(db.Model):
    __tablename__ = 'pubs'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    place_id = db.Column(db.String(255), unique=True, nullable=False, index=True)
    name = db.Column(db.String(255), nullable=False)
    address = db.Column(db.Text, nullable=False)
    lat = db.Column(db.Numeric(10, 8), nullable=False)
    lng = db.Column(db.Numeric(11, 8), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    scores = db.relationship('Score', backref='pub', lazy='dynamic', cascade='all, delete-orphan')
    ratings = db.relationship('PubRating', backref='pub', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'place_id': self.place_id,
            'name': self.name,
            'address': self.address,
            'lat': float(self.lat),
            'lng': float(self.lng),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Score(db.Model):
    __tablename__ = 'scores'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    pub_id = db.Column(db.String(36), db.ForeignKey('pubs.id', ondelete='CASCADE'), nullable=False, index=True)
    username = db.Column(db.String(100))
    anonymous_id = db.Column(db.String(255))
    score = db.Column(db.Numeric(5, 2), nullable=False)
    split_image = db.Column(db.Text)  # Base64 or URL
    split_detected = db.Column(db.Boolean, default=False)
    feedback = db.Column(db.Text)
    ranking = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    def to_dict(self):
        return {
            'id': self.id,
            'pub_id': self.pub_id,
            'username': self.username or 'Anonymous',
            'score': float(self.score),
            'split_detected': self.split_detected,
            'feedback': self.feedback,
            'ranking': self.ranking,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class PubRating(db.Model):
    __tablename__ = 'pub_ratings'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    pub_id = db.Column(db.String(36), db.ForeignKey('pubs.id', ondelete='CASCADE'), nullable=False, index=True)
    username = db.Column(db.String(100))
    anonymous_id = db.Column(db.String(255))
    overall_rating = db.Column(db.Numeric(3, 2), nullable=False)
    taste = db.Column(db.Numeric(3, 2), nullable=False)
    temperature = db.Column(db.Numeric(3, 2), nullable=False)
    head = db.Column(db.Numeric(3, 2), nullable=False)
    price = db.Column(db.Numeric(6, 2))
    roast = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    def to_dict(self):
        return {
            'id': self.id,
            'pub_id': self.pub_id,
            'username': self.username or 'Anonymous',
            'overall_rating': float(self.overall_rating),
            'taste': float(self.taste),
            'temperature': float(self.temperature),
            'head': float(self.head),
            'price': float(self.price) if self.price else None,
            'roast': self.roast,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
