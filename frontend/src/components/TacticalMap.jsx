import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './TacticalMap.css';

// Fix for default marker icons not loading correctly in generic React-Leaflet setups
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// A custom tactical red dot icon
const tacticalIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const TacticalMap = ({ telemetry, threatLevel }) => {
    if (!telemetry) return null;

    const position = [telemetry.lat, telemetry.lon];
    const isCritical = threatLevel === 'Critical';

    return (
        <div className="tactical-map-wrapper animate-fade-in">
            <div className="map-header">
                <h3>Live GIS Tracking</h3>
                <span className="live-indicator">● LIVE</span>
            </div>
            <div className="map-container-frame">
                <MapContainer center={position} zoom={14} scrollWheelZoom={false} className="leaflet-tactical-map">
                    {/* Dark Matter Base Map for Tactical Feel */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    
                    <Marker position={position} icon={isCritical ? tacticalIcon : new L.Icon.Default()}>
                        <Popup>
                            <strong>Target Acquired</strong><br />
                            {telemetry.location && <span style={{color: '#10b981', display: 'block', marginBottom: '4px'}}>Zone: {telemetry.location}</span>}
                            Lat: {telemetry.lat}<br />
                            Lon: {telemetry.lon}<br />
                            Alt: {telemetry.alt_m}m
                        </Popup>
                    </Marker>

                    {/* Threat Radius Circle */}
                    <Circle 
                        center={position} 
                        pathOptions={{ 
                            color: isCritical ? '#ef4444' : '#10b981', 
                            fillColor: isCritical ? '#ef4444' : '#10b981', 
                            fillOpacity: 0.2 
                        }} 
                        radius={500} // 500 meter radius
                    />
                </MapContainer>
                <div className="map-crosshair"></div>
            </div>
        </div>
    );
};

export default TacticalMap;
