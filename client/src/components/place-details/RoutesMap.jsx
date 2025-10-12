import { useRef, useMemo, useEffect, useState } from "react";
import { GoogleMap, Polyline, InfoWindow } from "@react-google-maps/api";

// --- Decode Polyline Utility ---
function decodePolyline(encoded) {
  if (!encoded) return [];
  let points = [];
  let index = 0,
    len = encoded.length;
  let lat = 0,
    lng = 0;

  while (index < len) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
}

// --- Container Style ---
const containerStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const RoutesMap = ({ routesData }) => {
  const mapRef = useRef(null);
  const [activeRoute, setActiveRoute] = useState(null);

  const processedRoutes = useMemo(() => {
    if (!routesData || !routesData.length) return [];
    return routesData.map((r) => ({
      ...r,
      path: decodePolyline(r.polyline || ""),
    }));
  }, [routesData]);

  const shortestRoute = useMemo(() => {
    if (!processedRoutes.length) return null;
    return processedRoutes.reduce((a, b) =>
      a.duration_hr < b.duration_hr ? a : b
    );
  }, [processedRoutes]);

  useEffect(() => {
    if (mapRef.current && processedRoutes.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      processedRoutes.forEach((route) => {
        route.path.forEach((pt) => bounds.extend(pt));
      });
      mapRef.current.fitBounds(bounds);
    }
  }, [processedRoutes]);

  const onLoad = (map) => {
    mapRef.current = map;
    if (processedRoutes.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      processedRoutes.forEach((route) => {
        route.path.forEach((pt) => bounds.extend(pt));
      });
      map.fitBounds(bounds);
    }
  };

  const defaultCenter = processedRoutes?.[0]?.path?.[0] || {
    lat: 20.5937,
    lng: 78.9629,
  };

  return (
    <GoogleMap
      onLoad={onLoad}
      mapContainerStyle={containerStyle}
      options={{
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: "greedy",
      }}
      center={defaultCenter}
      zoom={6}
    >
      {processedRoutes.map((r, i) => (
        <Polyline
          key={i}
          path={r.path}
          options={{
            strokeColor:
              shortestRoute && r.mode === shortestRoute.mode
                ? "#1d4ed8" // dark-blue
                : "#6b7280", // gray
            strokeOpacity: 0.9,
            strokeWeight:
              shortestRoute && r.mode === shortestRoute.mode ? 6 : 4,
          }}
          onMouseOver={() => setActiveRoute(r)}
          onMouseOut={() => setActiveRoute(null)}
        />
      ))}

      {activeRoute && (
        <InfoWindow
          position={activeRoute.path[Math.floor(activeRoute.path.length / 2)]}
          onCloseClick={() => setActiveRoute(null)}
        >
          <div className="p-2 flex flex-col justify-between gap-0.5 bg-gray-800">
            <strong className="text-[16px] text-white font-bold capitalize">
              {activeRoute.mode}
            </strong>
            <p className="text-sm font-medium text-cyan-600">
              Duration: {activeRoute.duration}
            </p>
            <em className="text-xs font-normal text-gray-400">
              Cost:{" "}
              <span className="font-semibold tracking-wide">
                ₹{activeRoute.estimated_cost}
              </span>
            </em>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default RoutesMap;
