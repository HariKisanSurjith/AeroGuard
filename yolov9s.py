print("Script started")
from ultralytics import YOLO
import cv2 as cv

# Input image path
image_path = r"D:\Aerial Drone (UAV) Surveillance & Threat Detection this sounds good\1.png"

# Load YOLO model
model = YOLO('best.pt')

# Load class names from file
with open("coco1.txt", "r") as file:
    classNames = [line.strip() for line in file if line.strip()]

# Debugging: Print loaded class names
print("Loaded class names:", classNames)

# Read the image
img = cv.imread(image_path)

# Run YOLO model on image
results = model(img)

# Process detection results
for r in results:
    for box in r.boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])  # Bounding box coordinates
        cls_id = int(box.cls[0])  # Get class ID

        # Debugging: Check detected class ID
        print(f"Detected cls_id: {cls_id}")

        # Ensure cls_id is valid
        if 0 <= cls_id < len(classNames):
            cls_name = classNames[cls_id]  # Get class name
        else:
            cls_name = "Unknown"

        # Debugging: Print detected object name
        print(f"Detected Object: {cls_id} -> {cls_name}")

        # Draw bounding box
        cv.rectangle(img, (x1, y1), (x2, y2), (1, 255, 0), 2)  # Green box, thickness=3

        # Display class name on image
        cv.putText(img, cls_name, (x1, max(y1 - 10, 20)), cv.FONT_HERSHEY_SIMPLEX, 
                   1, (255, 0, 0), 2, cv.LINE_AA)  # Blue text, thickness=3

# Show the image with detections
cv.imshow('Detected Objects', img)
cv.waitKey(0)
cv.destroyAllWindows()
