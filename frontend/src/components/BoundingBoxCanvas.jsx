import React, { useEffect, useRef, useState } from 'react';
import './BoundingBoxCanvas.css';

const colorPalette = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#f43f5e'
];

const BoundingBoxCanvas = ({ imageUrl, detections }) => {
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        // We only need to rerender canvas when image loads or dimensions change
        const updateCanvas = () => {
            const img = imageRef.current;
            const canvas = canvasRef.current;
            const container = containerRef.current;

            if (!img || !canvas || !container) return;

            // Ensure the image has loaded completely to get natural sizes
            if (img.naturalWidth === 0) return;

            const imgWidth = img.naturalWidth;
            const imgHeight = img.naturalHeight;

            // Set canvas size to match the original image size exactly
            canvas.width = imgWidth;
            canvas.height = imgHeight;

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (detections && detections.length > 0) {
                detections.forEach(det => {
                    const { x1, y1, x2, y2 } = det.bbox;
                    const rectWidth = x2 - x1;
                    const rectHeight = y2 - y1;
                    const label = `${det.class_name} ${(det.confidence * 100).toFixed(1)}%`;

                    const color = colorPalette[det.class_id % colorPalette.length];

                    // Draw Box
                    ctx.strokeStyle = color;
                    ctx.lineWidth = Math.max(2, imgWidth * 0.005);
                    ctx.beginPath();
                    ctx.rect(x1, y1, rectWidth, rectHeight);
                    ctx.stroke();

                    // Font setup for label based on image size
                    const fontSize = Math.max(14, imgWidth * 0.02);
                    ctx.font = `600 ${fontSize}px sans-serif`;

                    // Calculate text width for background
                    const padding = fontSize * 0.4;
                    const textMetrics = ctx.measureText(label);
                    const textWidth = textMetrics.width;
                    const textHeight = fontSize;

                    // Draw label background
                    ctx.fillStyle = color;
                    // Top left of label background is at (x1, y1 - textHeight - 2*padding)
                    const rectY = Math.max(0, y1 - textHeight - 2 * padding);
                    ctx.fillRect(x1, rectY, textWidth + 2 * padding, textHeight + 2 * padding);

                    // Draw label text
                    ctx.fillStyle = '#ffffff';
                    ctx.textBaseline = 'top';
                    ctx.fillText(label, x1 + padding, rectY + padding);
                });
            }
        };

        updateCanvas();

        // Setup resize observer for the container just in case
        const handleResize = () => {
            if (imageRef.current) {
                setDimensions({
                    width: imageRef.current.clientWidth,
                    height: imageRef.current.clientHeight
                });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }, [imageUrl, detections, dimensions.width, dimensions.height]);

    return (
        <div className="canvas-container glass-panel animate-fade-in" ref={containerRef}>
            <img
                ref={imageRef}
                src={imageUrl}
                alt="Uploaded"
                className="source-image"
                onLoad={() => {
                    setDimensions({
                        width: imageRef.current.clientWidth,
                        height: imageRef.current.clientHeight
                    });
                }}
            />
            <canvas ref={canvasRef} className="overlay-canvas" />
        </div>
    );
};

export default BoundingBoxCanvas;
