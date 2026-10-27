import React from 'react';
import './ControlPanel.css';

function ControlPanel({ conf, setConf, iou, setIou }) {
    return (
        <div className="control-panel glass-panel">
            <h3>Inference Controls</h3>
            <p className="control-subtitle">Tune YOLOv9 parameters</p>

            <div className="slider-group">
                <div className="slider-header">
                    <label htmlFor="conf-slider">Confidence Threshold</label>
                    <span className="slider-value">{conf.toFixed(2)}</span>
                </div>
                <input
                    id="conf-slider"
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={conf}
                    onChange={(e) => setConf(parseFloat(e.target.value))}
                />
                <p className="helper-text">Filters out weak detections.</p>
            </div>

            <div className="slider-group">
                <div className="slider-header">
                    <label htmlFor="iou-slider">IoU Threshold</label>
                    <span className="slider-value">{iou.toFixed(2)}</span>
                </div>
                <input
                    id="iou-slider"
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={iou}
                    onChange={(e) => setIou(parseFloat(e.target.value))}
                />
                <p className="helper-text">Controls overlapping bounding boxes.</p>
            </div>
        </div>
    );
}

export default ControlPanel;
