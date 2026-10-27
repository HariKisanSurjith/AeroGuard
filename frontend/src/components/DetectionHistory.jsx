import React, { useState, useEffect } from 'react';
import './DetectionHistory.css';

function DetectionHistory({ onClose }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || '';
            const response = await fetch(\\/history\);
            if (!response.ok) throw new Error('Failed to fetch history');
            const data = await response.json();
            setHistory(data);
        } catch (err) {
            setError('Could not load detection history.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="history-modal-overlay">
            <div className="history-modal glass-panel">
                <div className="history-header">
                    <h2 className="title-gradient">Mission Logs</h2>
                    <button className="close-btn" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {loading ? (
                    <div className="history-loading">Loading records...</div>
                ) : error ? (
                    <div className="history-error">{error}</div>
                ) : history.length === 0 ? (
                    <div className="history-empty">No detection history found.</div>
                ) : (
                    <div className="table-container">
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Image Target</th>
                                    <th>Threat Level</th>
                                    <th>Telemetry (Lat, Lon)</th>
                                    <th>Summary</th>
                                    <th>Total Objects</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((record) => (
                                    <tr key={record.id} className={`history-row threat-row-${record.threat_level?.toLowerCase() || 'clear'}`}>
                                        <td>{new Date(record.timestamp).toLocaleString()}</td>
                                        <td className="filename-cell">{record.filename}</td>
                                        <td className={`threat-cell level-${record.threat_level?.toLowerCase() || 'clear'}`}>
                                            {record.threat_level || 'Clear'}
                                        </td>
                                        <td className="telemetry-cell">
                                            {(() => {
                                                if (!record.telemetry_data) return 'N/A';
                                                try {
                                                    const t = JSON.parse(record.telemetry_data);
                                                    return `${t.lat}, ${t.lon}`;
                                                } catch (e) {
                                                    return 'N/A';
                                                }
                                            })()}
                                        </td>
                                        <td className="summary-cell">{record.detection_summary || 'None'}</td>
                                        <td>{record.total_objects}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DetectionHistory;

