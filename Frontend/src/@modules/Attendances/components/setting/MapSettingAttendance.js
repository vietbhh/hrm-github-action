import React from "react"
import {
  Circle,
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs
} from "react-google-maps"

const defaultLatLng = {
  lat: 21.0297887,
  lng: 105.7884217
}

const GoogleMapExample = withGoogleMap((props) => (
  <GoogleMap
    defaultZoom={15}
    defaultCenter={props.mapDefault}
    onClick={props.handleClickMap}>
    <>
      <Marker position={props.mapDefault} />
      <Circle
        defaultCenter={defaultLatLng}
        center={props.positonMarker}
        radius={props.radius}
        options={{
          strokeColor: "#0022ff",
          fillColor: "#FF0000",
          fillOpacity: 0.1,
          strokeWeight: 0
        }}
        onClick={props.handleClickMap}
      />
    </>
  </GoogleMap>
))

const MapSettingAttendance = (props) => {
  const mapDefault = props.positonMarker
    ? props.positonMarker
    : defaultLatLng

  return (
    <GoogleMapExample
      {...props}
      containerElement={
        <div
          style={{
            height: `350px`,
            borderRadius: "10px !important"
          }}
          className="map-containerElement"
        />
      }
      mapDefault={mapDefault}
      mapElement={
        <div
          style={{
            height: `100%`
          }}
          className="map-mapElement"
        />
      }
    />
  )
}

export default withScriptjs(MapSettingAttendance)
