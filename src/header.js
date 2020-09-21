import React, { Component } from "react";
import "./App.css";
import { FormControl, Select, MenuItem } from "@material-ui/core";
import { sortData } from "./util";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: [],
      country: "worldwide",
    };
  }

  componentDidMount() {
    fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }));
        const sortedData = sortData(data);
        // console.log(sortedData);
        this.props.countryData(sortedData);
        this.setState({ countries });
        this.props.mapCountry(data);
      });
    // console.log("1");
  }
  onCountryChange = (event) => {
    this.setState({ country: event.target.value });
    this.props.onCountryChange(event.target.value);
  };
  render() {
    return (
      <div className="app__header">
        <h1>COVID-19 Tracker</h1>
        <FormControl className="app_dropdown">
          <Select
            varient="outlined"
            value={this.state.country}
            onChange={this.onCountryChange}
          >
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {this.state.countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
  }
}

export default Header;
