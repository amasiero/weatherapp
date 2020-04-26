import React from 'react';
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import SearchInput from './components/searchInput';
import getImageForWeather from './helpers/getImageForWeather';
import {fetchLocationId, fetchWeather} from './helpers/api';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: false,
      location: '',
      temperature: 0,
      weather: ','
    }
  }

  componentDidMount() {
    this.handleUpdateLocation('São Paulo');
  }

  handleUpdateLocation = async city => {
    if(!city) return;

    this.setState({loading: true}, async () => {
      try {
          const locationId = await fetchLocationId(city);
          const {location, weather, temperature} = await fetchWeather(locationId);
          this.setState({
              loading: false,
              error: false,
              location,
              weather,
              temperature,
          });
      } catch (e) {
          this.setState({
              loading: false,
              error: true,
          });
      }
    });
    this.setState({
        location: city,
    });
  }


  render() {
    const {
      loading,
      error,
      location,
      weather,
      temperature,
    } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <ActivityIndicator
          animating={loading}
          color="white"
          size="large"
        />
        {!loading && (
          <View>
            {error && (
              <Text style={[styles.smallText, styles.textError]}>
                Could not load weather, please try a different city.
              </Text>
            )}

            {!error && (
              <View>
                <Image source={getImageForWeather(weather)} 
                  style={styles.image}
                />
                <Text style={[styles.largeText, styles.textStyle]}>
                    {location}
                </Text>
                <Text style={[styles.smallText, styles.textStyle]}>
                    {weather}
                </Text>
                <Text style={[styles.largeText, styles.textStyle]}>
                    {`${Math.round(temperature)}`}&deg;
                </Text>
              </View>
            )}
          </View>
        )}
        <SearchInput 
          placeholder='Procure pela cidade desejada' 
          onSubmit={this.handleUpdateLocation} 
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2b2b2b',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: 'Roboto',
    color: 'white'
  },
  largeText: {
    fontSize: 44
  },
  smallText: {
    fontSize: 18
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
    alignSelf: 'center'
  },
  textError: {
    textAlign: 'center',
    color: '#a30000',
    padding: 20
  }
});

export default App;
