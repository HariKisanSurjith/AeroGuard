from fastapi import FastAPI, File, UploadFile, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import cv2 as cv
import numpy as np
import os
import uvicorn
import random
import json

# Crucial: Disable underlying multithreading in PyTorch and OpenCV to prevent deadlocks in FastAPI
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"
cv.setNumThreads(0)

from ultralytics import YOLO
import database
import models

# Create the database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="YOLOv9 Object Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLO model (Custom Trained Weights)
model = YOLO('best.pt')

# Extract class names directly from the model weights file dynamically
# This makes the app plug-and-play for ANY custom model, no .txt file needed!
classNames = model.names

@app.post("/detect")
async def detect_objects(
    file: UploadFile = File(...),
    conf: float = Form(0.25),
    iou: float = Form(0.7),
    db: Session = Depends(database.get_db)
):
    # Read uploaded file contents asynchronously
    contents = await file.read()
    
    # Convert incoming bytes to a numpy array, then to an OpenCV image
    nparr = np.frombuffer(contents, np.uint8)
    img = cv.imdecode(nparr, cv.IMREAD_COLOR)
    
    if img is None:
        return {"error": "Invalid image file format"}

    # Run YOLO model on image synchronously
    # With PyTorch threading disabled, this is safe and will not deadlock the process
    results = model(img, conf=conf, iou=iou, imgsz=640)

    detections = []
    
    # Process detection results
    for r in results:
        for box in r.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])  # Bounding box coordinates
            cls_id = int(box.cls[0])  # Get class ID
            obj_conf = float(box.conf[0])  # Get confidence score

            # Retrieve class name from the model's internal dictionary
            cls_name = classNames.get(cls_id, "Unknown")

            detections.append({
                "class_id": cls_id,
                "class_name": cls_name,
                "confidence": round(obj_conf, 4),
                "bbox": {"x1": x1, "y1": y1, "x2": x2, "y2": y2}
            })
            
    # Generate detection summary and tactical threat level
    class_counts = {}
    for d in detections:
        c_name = d['class_name']
        class_counts[c_name] = class_counts.get(c_name, 0) + 1
        
    summary_str = ", ".join([f"{k}: {v}" for k, v in class_counts.items()])
    
    # Assess tactical threat level based on specific COCO classes (UAV prototype logic)
    threat_level = "Clear"
    critical_targets = {"truck", "aeroplane", "boat", "motorcycle", "bus", "tank", "Armata", "fighter", "bomber", "apc", "helicopter"}
    elevated_targets = {"person", "car", "soldier", "military_vehicle"}
    
    detected_classes = set(class_counts.keys())
    if detected_classes.intersection(critical_targets):
        threat_level = "Critical"
    elif detected_classes.intersection(elevated_targets):
        threat_level = "Elevated"
        
    # Global Conflict Zones Hardcoded
    conflict_zones = [
        {"name": "Donetsk, Eastern Ukraine", "lat": 48.0158, "lon": 37.8028},
        {"name": "Kyiv, Ukraine", "lat": 50.4501, "lon": 30.5234},
        {"name": "Gaza Strip", "lat": 31.3547, "lon": 34.3088},
        {"name": "Damascus, Syria", "lat": 33.5138, "lon": 36.2765},
        {"name": "Kabul, Afghanistan", "lat": 34.5553, "lon": 69.2075},
        {"name": "Baghdad, Iraq", "lat": 33.3152, "lon": 44.3661},
        {"name": "Sana'a, Yemen", "lat": 15.3694, "lon": 44.1910},
        {"name": "Donetsk, Eastern Ukraine", "lat": 48.01, "lon": 37.80},
        {"name": "Kyiv Outskirts, Ukraine", "lat": 50.45, "lon": 30.52},
        {"name": "Gaza Strip, Middle East", "lat": 31.42, "lon": 34.35},
        {"name": "Damascus, Syria", "lat": 33.51, "lon": 36.27},
        {"name": "Kabul, Afghanistan", "lat": 34.55, "lon": 69.20},
        {"name": "Baghdad, Iraq", "lat": 33.31, "lon": 44.36},
        {"name": "Sana'a, Yemen", "lat": 15.36, "lon": 44.19},
        {"name": "Mogadishu, Somalia", "lat": 2.04, "lon": 45.31},
        {"name": "Tripoli, Libya", "lat": 32.88, "lon": 13.19},
        {"name": "Khartoum, Sudan", "lat": 15.50, "lon": 32.55}
    ]
    zone = random.choice(conflict_zones)
    
    telemetry = {
        "location": zone["name"],
        "lat": round(zone["lat"] + random.uniform(-0.02, 0.02), 6), # Add slight randomization around the city
        "lon": round(zone["lon"] + random.uniform(-0.02, 0.02), 6),
        "alt_m": random.randint(150, 400),
        "heading": random.randint(0, 360)
    }
    
    # Save history to database
    history_record = models.DetectionHistory(
        filename=file.filename,
        confidence_threshold=conf,
        iou_threshold=iou,
        detection_summary=summary_str,
        total_objects=len(detections),
        threat_level=threat_level,
        telemetry_data=json.dumps(telemetry)
    )
    db.add(history_record)
    db.commit()
    db.refresh(history_record)

    return {
        "filename": file.filename, 
        "detections": detections, 
        "history_id": history_record.id,
        "threat_level": threat_level,
        "telemetry": telemetry
    }

@app.get("/history")
def get_history(skip: int = 0, limit: int = 50, db: Session = Depends(database.get_db)):
    records = db.query(models.DetectionHistory).order_by(models.DetectionHistory.timestamp.desc()).offset(skip).limit(limit).all()
    return records

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
