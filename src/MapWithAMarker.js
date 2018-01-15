/* Google Map Custom Component */
import React, { Component } from 'react';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";

const MapWithAMarker = withScriptjs(withGoogleMap(props =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: props.center.lat, lng: props.center.lng }}>
    { props.data.map ((marker) => {
      return (
        <Marker
          key={marker.id}
          position={{ lat: marker.latitude, lng: marker.longitude }} />
      )
    })}
  </GoogleMap>
));

export default MapWithAMarker;