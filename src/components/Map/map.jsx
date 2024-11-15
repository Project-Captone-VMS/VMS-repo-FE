import React, { useEffect, useRef } from "react";

const Map = () => {
  const mapRef = useRef(null);
  const hereApiKey = "RDZ955b4FVsymS-8fDrYP5D--V1pR55u5S4dbuTNMa4";

  useEffect(() => {
    const platform = new H.service.Platform({
      apikey: hereApiKey,
    });
    const defaultLayers = platform.createDefaultLayers();

    if (!mapRef.current._map) {
      const map = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
        zoom: 14,
        center: { lat: 16.0583, lng: 108.207 },
      });

      const ui = H.ui.UI.createDefault(map, defaultLayers);
      mapRef.current._map = map;
    }
  }, []);

  return (
    <div className="border-4 p-3 m-3 rounded-lg shadow-sm">
      <div
        ref={mapRef}
        id="map"
        style={{ width: "90%", height: "500px", marginLeft: "30px" }}
        className="mx-auto"
      />
    </div>
  );
};

export default Map;
