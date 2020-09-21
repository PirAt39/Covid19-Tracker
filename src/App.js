import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./header";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import LineGraph from "./LineGraph";
import { Card, CardContent } from "@material-ui/core";
import "leaflet/dist/leaflet.css";
import { prettyPrintStat } from "./util";
import numeral from "numeral";

function App() {
  const [countryCode, setCountryCode] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => setCountryInfo(data));
  }, []);

  const onCountryChange = async (countryCode) => {
    setCountryCode(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);

        if (countryCode === "worldwide") {
          setMapCenter([34.80746, -40.4796]);
          setMapZoom(3);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        }
      });
  };
  const countryData = (data) => {
    // console.log(data);
    setTableData(data);
  };
  const mapCountry = (data) => {
    setMapCountries(data);
  };

  return (
    <div className="app">
      <div className="app__left">
        {/* header */}
        <Header
          onCountryChange={onCountryChange}
          countryData={countryData}
          mapCountry={mapCountry}
        />

        {/* infoBoxes */}
        <div className="app__stats">
          <InfoBox
            className="infoBox"
            onClick={(e) => setCasesType("cases")}
            isRed
            title="Coronavirus Cases"
            active={casesType === "cases"}
            total={numeral(countryInfo.cases).format("0.0a")}
            cases={prettyPrintStat(countryInfo.todayCases)}
          />
          <InfoBox
            className="infoBox"
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            total={numeral(countryInfo.recovered).format("0.0a")}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
          />
          <InfoBox
            className="infoBox"
            title="Deaths"
            onClick={(e) => setCasesType("deaths")}
            isRed
            active={casesType === "deaths"}
            total={numeral(countryInfo.deaths).format("0.0a")}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
          />
        </div>

        {/*---- map ----*/}
        <Map
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
          casesType={casesType}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          {/* table */}
          <Table countries={tableData} />

          {/*  */}
          <h3 className="chartHeader">Worldwide new {casesType}</h3>
          {/* graph */}
          <LineGraph casesType={casesType} />
          {/* <LineGraph casesType="death" />
          <LineGraph casesType="recoverd" /> */}
        </CardContent>
        <h5>PirAte</h5>
      </Card>
    </div>
  );
}

export default App;
