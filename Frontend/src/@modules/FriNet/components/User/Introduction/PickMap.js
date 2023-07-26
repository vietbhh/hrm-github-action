// ** React Imports
import { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { useMergedState, useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components
import MapSettingAttendance from "../../../../Attendances/components/setting/MapSettingAttendance"
import PlacesAuto from "../../../../Attendances/components/setting/PlacesAuto"
import { isJson } from "../../../common/common"

const PickMap = (props) => {
  const {
    // ** props
    fieldProps,
    // ** methods
    setEmployeeAddress
  } = props

  const fieldData = isJson(fieldProps.json) ? JSON.parse(fieldProps.json) : {}

  const [state, setState] = useMergedState({
    positonMarker: fieldData?.LatLng,
    googlePlaces: {
      address: fieldData?.address,
      place_id: fieldData?.place_id,
      LatLng: fieldData?.LatLng
    }
  })

  const settings = useSelector((state) => state.auth.settings)

  const handleSelecteAddress = (marker) => {
    setState({
      googlePlaces: {
        place_id: marker.place_id,
        address: marker.formatted_address,
        LatLng: {
          lat: marker.geometry.location.lat(),
          lng: marker.geometry.location.lng()
        }
      }
    })
  }

  const handleClickMap = (e) => {
    setState({ positonMarker: e.latLng })
  }

  // ** effect
  useEffect(() => {
    if (state.googlePlaces.address !== "") {
      setEmployeeAddress({
        [fieldProps.fieldData.field]: { ...state.googlePlaces }
      })
    }
  }, [state.googlePlaces])

  // ** render
  return (
    <Fragment>
      <div className="mb-1 custom-place-auto">
        <PlacesAuto
          handleSelecteAddress={handleSelecteAddress}
          handleClickMap={handleClickMap}
          positonInMap={state.positonMarker}
          address={state.googlePlaces?.address}
          place_id={state.googlePlaces?.place_id}
          loadingElement={
            <div
              style={{
                height: `100%`
              }}
              className="search-loadingElement"
            />
          }
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${settings.apiKey_googleMap}&v=3.exp&libraries=geometry,drawing,places`}
          key="search"
        />
      </div>
      <MapSettingAttendance
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${settings.apiKey_googleMap}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={
          <div
            style={{
              height: `100%`
            }}
            className="map-loadingElement"
          />
        }
        containerElement={
          <div
            style={{
              height: `350px`,
              borderRadius: "5px"
            }}
            className="map-containerElement"
          />
        }
        mapElement={
          <div
            style={{
              height: `100%`
            }}
            className="map-mapElement"
          />
        }
        handleClickMap={handleClickMap}
        handleSelecteAddress={handleSelecteAddress}
        positonMarker={state.positonMarker}
        radius={200}
        centerPositon={state.googlePlaces?.LatLng}
        googlePlaces={state.googlePlaces}
        key="map"
      />
    </Fragment>
  )
}

export default PickMap
