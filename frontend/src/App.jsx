import { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import BoundingBoxCanvas from './components/BoundingBoxCanvas';
import ResultsPanel from './components/ResultsPanel';
import SignIn from './components/SignIn';
import ControlPanel from './components/ControlPanel';
import DetectionHistory from './components/DetectionHistory';
import TacticalMap from './components/TacticalMap';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [detections, setDetections] = useState(null);
  const [filename, setFilename] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [threatLevel, setThreatLevel] = useState(null);
  const [telemetry, setTelemetry] = useState(null);

  // New Major Features State
  const [conf, setConf] = useState(0.25);
  const [iou, setIou] = useState(0.7);
  const [showHistory, setShowHistory] = useState(false);

  const handleImageSelect = async (file) => {
    setSelectedImage(file);
    setImageUrl(URL.createObjectURL(file));
    setDetections(null);
    setThreatLevel(null);
    setTelemetry(null);
    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('conf', conf);
    formData.append('iou', iou);

    try {
      // Connect to FastAPI backend via proxy
      const response = await fetch('/detect', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Detection failed on the backend.');
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setDetections(data.detections);
      setFilename(data.filename);
      setThreatLevel(data.threat_level);
      setTelemetry(data.telemetry);
    } catch (err) {
      setError('An error occurred during detection. Ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImageUrl(null);
    setDetections(null);
    setThreatLevel(null);
    setTelemetry(null);
    setFilename('');
    setError(null);
  };

  return (
    <>
      {!isAuthenticated ? (
        <SignIn onSignIn={() => setIsAuthenticated(true)} />
      ) : (
        <div className="app-main">
          <header className="app-header animate-fade-in">
            <div className="header-top-bar">
              <h1 className="title-gradient">AeroGuard Tactical Systems</h1>
              <button className="btn-secondary history-btn" onClick={() => setShowHistory(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View History
              </button>
            </div>
            <p>Tactical UAV Object Acquisition & Threat Assessment System</p>
          </header>

          <main className={`main-content ${detections ? 'has-results' : ''}`}>
            <div className="left-column">
              <section className="upload-section">
                {!selectedImage ? (
                  <ImageUploader onImageSelect={handleImageSelect} isLoading={isLoading} />
                ) : (
                  <div className="visualization-area">
                    <div className="canvas-header">
                      <button className="btn-primary reset-btn" onClick={handleReset}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        Analyze New Image
                      </button>
                    </div>

                    {isLoading && (
                      <div className="loading-overlay glass-panel">
                        <div className="spinner"></div>
                        <p>Processing with YOLOv9...</p>
                      </div>
                    )}

                    <BoundingBoxCanvas
                      imageUrl={imageUrl}
                      detections={detections}
                    />

                    {telemetry && (
                      <TacticalMap telemetry={telemetry} threatLevel={threatLevel} />
                    )}
                  </div>
                )}

                {error && (
                  <div className="error-message glass-panel">
                    <p>{error}</p>
                  </div>
                )}
              </section>

              {!detections && !selectedImage && (
                <ControlPanel conf={conf} setConf={setConf} iou={iou} setIou={setIou} />
              )}
            </div>

            {detections && (
              <div className="right-column">
                <section className="results-section">
                  <ResultsPanel
                    detections={detections}
                    filename={filename}
                    threatLevel={threatLevel}
                    telemetry={telemetry}
                  />
                  <ControlPanel conf={conf} setConf={setConf} iou={iou} setIou={setIou} />
                </section>
              </div>
            )}
          </main>

          {showHistory && <DetectionHistory onClose={() => setShowHistory(false)} />}
        </div>
      )}
    </>
  );
}

export default App;
