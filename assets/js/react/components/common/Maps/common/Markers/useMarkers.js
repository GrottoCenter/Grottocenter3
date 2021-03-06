import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { anyPass, forEach, isEmpty, isNil, map as rMap } from 'ramda';
import { renderToString } from 'react-dom/server';
import { createGlobalStyle, keyframes } from 'styled-components';

const isNilOrEmpty = anyPass([isNil, isEmpty]);

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;
export const MarkerGlobalCss = createGlobalStyle`
  & .fade-in-markers {
   animation: 0.3s ${fadeIn} ease-out;
  }
`;

const useMarkers = (icon, popupContent = null, tooltipContent = null) => {
  const map = useMap();
  const [canvas] = useState(L.canvas());
  const [markers, setMarkers] = useState();
  const options = { icon, renderer: canvas };

  const makeMarkers = rMap((marker) => {
    const { latitude, longitude } = marker;
    if (!isNil(popupContent)) {
      if (!isNil(tooltipContent)) {
        return L.marker([latitude, longitude], options)
          .bindPopup(renderToString(popupContent(marker)))
          .bindTooltip(tooltipContent(marker), { direction: 'bottom' });
      }
      return L.marker([latitude, longitude], options).bindPopup(
        renderToString(popupContent(marker)),
      );
    }
    return L.marker([latitude, longitude], options);
  });

  const addMarkers = forEach((marker) => marker.addTo(map));
  const deleteMarkers = forEach((marker) => marker.remove(map));

  useEffect(() => {
    if (!isNilOrEmpty(markers)) {
      addMarkers(markers);
    }
  }, [markers]);

  const handleUpdateMarkers = (newMarkers) => {
    if (!isNilOrEmpty(markers)) {
      deleteMarkers(markers);
    }
    setMarkers(isNilOrEmpty(newMarkers) ? null : makeMarkers(newMarkers));
  };

  return handleUpdateMarkers;
};

export default useMarkers;
