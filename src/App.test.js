import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import MapWithAMarker from './MapWithAMarker';
import fetch from 'isomorphic-fetch'

let url = 'https://nameless-castle-51857.herokuapp.com/api/v1/stashpoints';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders map without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MapWithAMarker
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBRQJfPMLOKMiegBvbLsBlgKqIA8J_pinA&v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: `70vh` }} />}
              containerElement={<div style={{ height: `400px` }} />}
              mapElement={<div style={{ height: `70vh` }} />} />, div);
  ReactDOM.unmountComponentAtNode(div);
});

// test API
// it('should load api data', () => {
//   return fetch(url)
//   .then(data => {
//     expect(data).toBeDefined()
//     expect(data.entity.name).toEqual('Koen van Gilst')
//   })
// });