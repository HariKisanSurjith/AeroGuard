# YOLOv9 Vision Pro - Object Detection App

A professional, full-stack object detection application utilizing the cutting-edge YOLOv9 computer vision model. This application seamlessly integrates a FastAPI Python backend with a modern React frontend, providing real-time AI image analysis with a premium user interface.

## 🚀 Key Features

* **High-Performance AI:** Powered by the Ultralytics YOLOv9 model for rapid and highly accurate object detection across 80 different classes (COCO dataset).
* **Interactive Control Panel:** Dynamically adjust inference parameters in real-time:
  * **Confidence Threshold:** Filter out low-confidence predictions.
  * **IoU (Intersection over Union):** Tune the non-maximum suppression for overlapping bounding boxes.
* **Smart Analytics & Summaries:** Get an instant aggregate count of all detected objects (e.g., "Person: 3, Car: 2, Traffic Light: 1") natively in the results panel.
* **Data Export:** Easily download your detection results bounds and confidence scores to a `.csv` file for professional reporting and analysis.
* **Persistent Detection History:** Every analysis is permanently logged to an onboard SQLite database. View your past detections via the "View History" modal.
* **Premium Glassmorphism UI:** A stunning dark-neon interface featuring fluid animations, dynamic gradient text, and responsive design mechanics.

---

## 💻 Tech Stack

* **Backend:** Python, FastAPI, Uvicorn, SQLAlchemy, OpenCV (`cv2`), Ultralytics (YOLO)
* **Frontend:** React, Vite, Vanilla CSS (Glassmorphism & animations)
* **Database:** SQLite (local persistent storage)

---

## ⚙️ How to Run the Project

You need to run both the backend server and the frontend client simultaneously.

### 1. Start the Backend API (FastAPI)
Open a terminal in the root project folder `c:\PROJECT` and run:
```bash
python main.py
```
*The API will start on `http://localhost:8000`.*

### 2. Start the Frontend (React/Vite)
Open a **new** terminal, navigate to the frontend folder `c:\PROJECT\frontend`, and run:
```bash
npm run dev
```
*The website will be available at `http://localhost:5174` (or `5173`).*

---

## 📖 Usage Guide

1. **Sign In:** Open the web app. You will be greeted by a secure glassmorphism sign-in portal. Enter any valid email format and a password (min. 6 characters) to access the dashboard.
2. **Configure Settings:** On the main dashboard, you can optionally adjust the **Confidence** and **IoU** sliders on the left-hand Control Panel *before* uploading an image.
3. **Upload an Image:** Drag and drop an image into the upload zone or click to browse your files. Supported formats include JPG, PNG, and JPEG.
4. **View Results:** The AI will process the image near-instantly. The right panel will appear showing:
   * **Visuals:** The image drawn with colored bounding boxes around recognized objects.
   * **Analytics:** Total objects found and a text breakdown.
   * **Details List:** A scrollable list detailing the exact coordinates and confidence of every single object.
5. **Export Data:** Click the **"Export to CSV"** button to download a spreadsheet of the results.
6. **Analyze New Image:** Click the **"Analyze New Image"** button above the canvas to reset the workspace and upload a new photo.
7. **View History:** At any time, click **"View History"** in the top right corner. A modal will appear showing a database log of every detection you have ever made, including timestamps and configurations.
