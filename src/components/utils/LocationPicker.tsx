'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({
  onSelect,
}: {
  onSelect: (coords: { lat: number; lng: number }) => void;
}) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
    locationfound(e) {
      setPosition(e.latlng);
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setPosition(coords as L.LatLng);
        onSelect(coords);
      },
      () => console.log('موقع المستخدم غير متاح')
    );
  }, [onSelect]);

  return position === null ? null : <Marker position={position} icon={markerIcon} />;
}

export default function LeafletLocationPicker({
  onLocationSelect,
}: {
  onLocationSelect: (coords: { lat: number; lng: number }) => void;
}) {
  return (
    <MapContainer
      center={[33.3152, 44.3661]}
      zoom={13}
      scrollWheelZoom
      style={{ height: '300px', width: '100%', borderRadius: '8px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
      />
      <LocationMarker onSelect={onLocationSelect} />
    </MapContainer>
  );
}
