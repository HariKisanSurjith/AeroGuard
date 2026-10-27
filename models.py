from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
import datetime

class DetectionHistory(Base):
    __tablename__ = "detection_history"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Inference parameters used
    confidence_threshold = Column(Float, default=0.25)
    iou_threshold = Column(Float, default=0.7)
    
    # Summary of detections (e.g., "Person: 2, Car: 1")
    detection_summary = Column(String)
    
    # Total objects detected
    total_objects = Column(Integer, default=0)
    
    # Tactical UAV Data
    threat_level = Column(String, default="Clear")  # Clear, Elevated, Critical
    telemetry_data = Column(String)  # JSON-like string of GPS/Altitude
