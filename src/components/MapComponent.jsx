import React, { useEffect, useRef } from 'react';

const MapComponent = () => {
    const mapRef = useRef(null);
    const hereApiKey = 'RDZ955b4FVsymS-8fDrYP5D--V1pR55u5S4dbuTNMa4'; // Thay thế bằng API key của bạn

    useEffect(() => {
        const platform = new H.service.Platform({
            apikey: hereApiKey
        });
        const defaultLayers = platform.createDefaultLayers();

        if (!mapRef.current._map) {
            const map = new H.Map(
                mapRef.current,
                defaultLayers.vector.normal.map,
                {
                    zoom: 14,
                    center: { lat: 16.0583, lng: 108.2070 }
                }
            );

            // Thêm các control vào bản đồ (tùy chọn)
            const ui = H.ui.UI.createDefault(map, defaultLayers);
            mapRef.current._map = map;
        }
    }, []);

    return (
        <div>
            <div ref={mapRef} id="map" style={{ width: '80%', height: '500px', marginLeft: '90px' }} />
        </div>
    );
};

export default MapComponent;
