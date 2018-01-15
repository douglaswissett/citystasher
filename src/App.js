import React, { Component } from 'react';
import './App.css';
import MapWithAMarker from './MapWithAMarker';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      api_data: [],
      data_sorted: [],
      center: {lat: 0, lng: 0},
      loadData: false,
      loadMap: false,
      loading: true,
      nearby_filter: ''
    }
  }

  componentDidMount() {

    // fetch user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          center: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          loadMap: true
        });
        this.fetchApiData(position);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  fetchApiData(position) {

    // fetch data
    fetch('https://nameless-castle-51857.herokuapp.com/api/v1/stashpoints')
    .then(response => response.json())
    .then((data) => {
      this.setState({
        data: data,
        api_data: data
      });

      // fetch sorted data
      fetch(`https://nameless-castle-51857.herokuapp.com/api/v1/stashpoints?centre_lat=${position.coords.latitude}&centre_lon=${position.coords.longitude}&by_distance=true`)
      .then(response => response.json())
      .then((data) => {
        this.setState({
          data_sorted: data,
          loadData: true,
          loading: false
        });
      });
    });
  }

  handleFilterByRadius() {
    const { nearby_filter, center } = this.state;

    this.setState({loading: true});

    if (this.refs.check_box.checked) {
      if (nearby_filter) {
        fetch(`https://nameless-castle-51857.herokuapp.com/api/v1/stashpoints?centre_lat=${center.lat}&centre_lon=${center.lng}&nearby_radius=${nearby_filter}&by_distance=true`)
        .then(response => response.json())
        .then((data) => {
          this.setState({
            data: data,
            loading: false
          });
        });
      } else {
        fetch(`https://nameless-castle-51857.herokuapp.com/api/v1/stashpoints?centre_lat=${center.lat}&centre_lon=${center.lng}&by_distance=true`)
        .then(response => response.json())
        .then((data) => {
          this.setState({
            data: data,
            loading: false
          });
        });
      }
    } else {
      if (nearby_filter) {
        fetch(`https://nameless-castle-51857.herokuapp.com/api/v1/stashpoints?centre_lat=${center.lat}&centre_lon=${center.lng}&nearby_radius=${nearby_filter}`)
        .then(response => response.json())
        .then((data) => {
          this.setState({
            data: data,
            loading: false
          });
        });
      } else {
        fetch(`https://nameless-castle-51857.herokuapp.com/api/v1/stashpoints?centre_lat=${center.lat}&centre_lon=${center.lng}`)
        .then(response => response.json())
        .then((data) => {
          this.setState({
            data: data,
            loading: false
          });
        });
      }
    }
  }

  handleSortByDistance(e) {
    const { nearby_filter, center, data_sorted, api_data } = this.state;

    this.setState({loading: true});

    if (nearby_filter.length > 0) {
      if (e.target.checked) {
        fetch(`https://nameless-castle-51857.herokuapp.com/api/v1/stashpoints?centre_lat=${center.lat}&centre_lon=${center.lng}&nearby_radius=${nearby_filter}&by_distance=true`)
        .then(response => response.json())
        .then((data) => {
          this.setState({
            data: data,
            loading: false
          });
        });
      } else {
        fetch(`https://nameless-castle-51857.herokuapp.com/api/v1/stashpoints?centre_lat=${center.lat}&centre_lon=${center.lng}&nearby_radius=${nearby_filter}`)
        .then(response => response.json())
        .then((data) => {
          this.setState({
            data: data,
            loading: false
          });
        });
      }
    } else {
      if (e.target.checked) {
        this.setState({
          data: data_sorted,
          loading: false
        });
      } else {
        this.setState({
          data: api_data,
          loading: false
        });
      }
    }
  }

  updateInputValue(e) {
    this.setState({
      nearby_filter: e.target.value
    });
  }

  render() {
    const { center, data, loadData, loadMap, loading } = this.state;

    return (
      <div className="app">

        { loading ? (<div className="loader" />) : (null)}

        <div className="map-container">
          { loadData && loadMap ? (
            <MapWithAMarker
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBRQJfPMLOKMiegBvbLsBlgKqIA8J_pinA&v=3.exp&libraries=geometry,drawing,places"
              center={center}
              data={data}
              loadingElement={<div style={{ height: `70vh` }} />}
              containerElement={<div style={{ height: `400px` }} />}
              mapElement={<div style={{ height: `70vh` }} />} />
            ) : (
            <p>Loading</p>
          )}
        </div>

        <header className="app-header">
          <p>Filter and sort by:</p>
          <input type="text" placeholder="radius in km" onChange={this.updateInputValue.bind(this)} />
          <button onClick={this.handleFilterByRadius.bind(this)}>Submit</button>
          <label for="sort_dist">Sort distance</label>
          <input ref="check_box" type="checkbox" id="sort_dist" onChange={this.handleSortByDistance.bind(this)} />
          <h1>Stashpoints</h1>
          <div className="stashpoints-container">
            { data.map((stashpoint) => {
              return (
                <div key={stashpoint.id}>
                  <p>{stashpoint.location_name}</p>
                </div>
              )
            })}
          </div>
        </header>
      </div>
    );
  }
}

export default App;
