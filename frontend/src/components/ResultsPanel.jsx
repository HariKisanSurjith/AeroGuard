import React from 'react';
import './ResultsPanel.css';

const ResultsPanel = ({ detections, filename, threatLevel, telemetry }) => {
    if (!detections) return null;

    // Calculate summary statistics
    const classCounts = detections.reduce((acc, det) => {
        acc[det.class_name] = (acc[det.class_name] || 0) + 1;
        return acc;
    }, {});

    const exportToCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Class Name,Confidence,Bounding Box (x1 y1 x2 y2)\n";

        detections.forEach(det => {
            const row = `${det.class_name},${det.confidence},"${det.bbox.x1} ${det.bbox.y1} ${det.bbox.x2} ${det.bbox.y2}"`;
            csvContent += row + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `detections_${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="results-panel glass-panel animate-fade-in">
            <div className={`results-header threat-${threatLevel?.toLowerCase() || 'clear'}`}>
                <div className="header-text">
                    <h2>Threat Assessment Report</h2>
                    <p className="filename">Target: {filename}</p>
                </div>
                {threatLevel && <div className="threat-badge">{threatLevel}</div>}
            </div>

            {telemetry && (
                <div className="telemetry-panel">
                    {telemetry.location && <div className="telemetry-item" style={{width: '100%', gridColumn: 'span 2'}}><span className="telemetry-label">ZONE:</span> {telemetry.location}</div>}
                    <div className="telemetry-item"><span className="telemetry-label">LAT:</span> {telemetry.lat}</div>
                    <div className="telemetry-item"><span className="telemetry-label">LON:</span> {telemetry.lon}</div>
                    <div className="telemetry-item"><span className="telemetry-label">ALT:</span> {telemetry.alt_m}m</div>
                    <div className="telemetry-item"><span className="telemetry-label">HDG:</span> {telemetry.heading}°</div>
                </div>
            )}

            <div className="summary-stats">
                <div className="stat-box">
                    <span className="stat-value">{detections.length}</span>
                    <span className="stat-label">Objects Found</span>
                </div>
                {Object.entries(classCounts).map(([className, count]) => (
                    <div className="stat-box class-stat" key={className}>
                        <span className="stat-value">{count}</span>
                        <span className="stat-label">{className}</span>
                    </div>
                ))}
            </div>

            <div className="results-actions">
                <button className="btn-secondary export-btn" onClick={exportToCSV}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Export to CSV
                </button>
            </div>

            <div className="detections-list-container">
                <h3>Detected Objects</h3>
                {detections.length > 0 ? (
                    <ul className="detections-list">
                        {detections.map((det, index) => (
                            <li key={index} className="detection-item">
                                <div className="detection-info">
                                    <span className="class-name">{det.class_name}</span>
                                    <span className="confidence-pill" style={{
                                        backgroundColor: `rgba(99, 102, 241, ${Math.min(1, Math.max(0.4, det.confidence))})`
                                    }}>
                                        {(det.confidence * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-results">No objects detected.</p>
                )}
            </div>
        </div>
    );
};

export default ResultsPanel;
