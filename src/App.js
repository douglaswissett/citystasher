import React, { Component } from 'react';
import './App.css';
import MapWithAMarker from './MapWithAMarker';

let url = 'https://nameless-castle-51857.herokuapp.com/api/v1/stashpoints';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      params: '',
      center: {lat: 0, lng: 0},
      loadData: false,
      loadMap: false,
      loading: true,
      nearby_filter: '',
      error: false
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

        // fetch init api data
        this.handleFetch(url);

      }, (error) => { 
        if (error.code === error.PERMISSION_DENIED) {
          this.setState({
            error: true,
            loading: false
          });
        }
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  handleFetch(url) {
    fetch(url)
    .then(response => response.json())
    .then((data) => {
      this.setState({
        data: data,
        loadData: true,
        loading: false
      });
    });
  }

  updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
      return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
      return uri + separator + key + "=" + value;
    }
  }

  removeQueryStringParameter(sourceURL, key) {
    var rtn = sourceURL.split("?")[0],
      param,
      params_arr = [],
      queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
      params_arr = queryString.split("&");
      for (var i = params_arr.length - 1; i >= 0; i -= 1) {
        param = params_arr[i].split("=")[0];
        if (param === key) {
          params_arr.splice(i, 1);
        }
      }
      rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
  }

  handleFilterByRadius() {
    const { nearby_filter, center } = this.state;

    this.setState({loading: true});

    if (nearby_filter.length > 0) {
      url = this.updateQueryStringParameter(url, 'centre_lat', center.lat)
      url = this.updateQueryStringParameter(url, 'centre_lon', center.lng);
      url = this.updateQueryStringParameter(url, 'nearby_radius', nearby_filter);
    } else {
      url = this.removeQueryStringParameter(url, 'centre_lat');
      url = this.removeQueryStringParameter(url, 'centre_lon');
      url = this.removeQueryStringParameter(url, 'nearby_radius');
    }

    this.handleFetch(url);
  }

  handleSortByDistance(e) {
    const { center } = this.state;

    this.setState({loading: true});

    if (e.target.checked) {
      url = this.updateQueryStringParameter(url, 'centre_lat', center.lat)
      url = this.updateQueryStringParameter(url, 'centre_lon', center.lng);
      url = this.updateQueryStringParameter(url, 'by_distance', true);
    } else {
      url = this.removeQueryStringParameter(url, 'by_distance');
    }

    this.handleFetch(url);
  }

  updateInputValue(e) {
    this.setState({
      nearby_filter: e.target.value
    });
  }

  render() {
    const { center, data, loadData, loadMap, loading, error } = this.state;

    return (
      <div className="app">

        { loading ? (<div className="loader" />) : (null)}
        { error ? (<p>Please allow location mode to use this service.</p>) : (null)}

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
          <label htmlFor="sort_dist">Sort distance</label>
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
