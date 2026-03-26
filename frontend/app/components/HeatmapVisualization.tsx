'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet/dist/leaflet.css';

interface HeatmapVisualizationProps {
  heatmapData: Array<[number, number, number]>; // [lat, lng, intensity]
}

function HeatmapVisualization({ heatmapData }: HeatmapVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || !heatmapData.length) return;

    // Initialize map if not already done
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView(
        [40.7128, -74.006],
        12
      );

      // Add base layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    // Remove old heatmap layer if exists
    if (heatLayerRef.current) {
      mapRef.current.removeLayer(heatLayerRef.current);
    }

    // Create heatmap layer using leaflet.heat
    heatLayerRef.current = L.heatLayer(heatmapData, {
      max: 1,
      maxZoom: 17,
      radius: 25,
      blur: 15,
      gradient: {
        0.0: '#0000ff',
        0.25: '#00ffff',
        0.5: '#00ff00',
        0.75: '#ffff00',
        1.0: '#ff0000',
      },
    }).addTo(mapRef.current);

    // Fit bounds to heatmap data
    if (heatmapData.length > 0) {
      // Filter out invalid coordinates
      const validPoints = heatmapData.filter(
        (point) =>
          typeof point[0] === 'number' &&
          typeof point[1] === 'number' &&
          !isNaN(point[0]) &&
          !isNaN(point[1]) &&
          isFinite(point[0]) &&
          isFinite(point[1])
      );

      if (validPoints.length > 0) {
        const bounds = L.latLngBounds(
          validPoints.map((point) => L.latLng(point[0], point[1]))
        );
        if (bounds.isValid()) {
          mapRef.current?.fitBounds(bounds);
        }
      }
    }

    // Handle resize
    const handleResize = () => {
      mapRef.current?.invalidateSize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [heatmapData]);

  return <div ref={containerRef} style={{ width: '100%', height: '600px' }} />;
}

export default HeatmapVisualization;
