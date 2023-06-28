// ** React Imports
import {
  ErpCheckbox,
  ErpInput,
  ErpSwitch
} from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
import { attendanceSettingApi } from "@modules/Attendances/common/api"
import { useContext, useEffect } from "react"
import { useSelector } from "react-redux"
import { Button } from "reactstrap"
import { TagInput } from "rsuite"
import { AbilityContext } from "utility/context/Can"
import MapSettingAttendance from "./MapSettingAttendance"
import PlacesAuto from "./PlacesAuto"
const FormEditOffices = (props) => {
  const { info, handleCancel, loadData } = props
  const modules = useSelector((state) => state.app.modules.attendance_setting)

  const settings = useSelector((state) => state.auth.settings)
  const module = modules.config
  const moduleName = module.name
  const metas = modules.metas
  const options = modules.options
  const [state, setState] = useMergedState({
    dataEdit: {
      id_devices: []
    },
    radius: parseInt(info.radius?.name_option),
    googlePlaces: info.google_places,
    positonMarker: info.google_places?.LatLng
  })
  // Tag
  const renderInputTag = (tags) => {
    const arrTag = tags ? JSON.parse(tags) : []
    return (
      <>
        <TagInput
          className="w-100 mt-50"
          defaultValue={arrTag}
          key={"tag" + arrTag.lenght}
          trigger={["Enter", "Comma"]}
          onChange={(value) => {
            info.id_devices = JSON.stringify(value)
            setState({
              dataEdit: { ...state.dataEdit, id_devices: JSON.stringify(value) }
            })
          }}
        />
      </>
    )
  }
  //

  const onSubmit = () => {
    const data = { ...info, ...state.dataEdit }
    if (data?.created_by) data.created_by = data.created_by.value
    if (data?.owner) data.owner = data.owner.value
    if (data?.updated_by) data.updated_by = data.updated_by.value
    if (data?.radius) data.radius = data.radius.value

    data.google_places = JSON.stringify(state.googlePlaces)
    data.address = state?.googlePlaces?.address
    // data.id_devices = JSON.stringify(tagifyRef.current.value)
    attendanceSettingApi
      .save(data)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        handleCancel()
        loadData()
        setState({ dataEdit: { id_devices: [] } })
      })
      .catch((err) => {
        setState({ loading: false })
        notification.showError(useFormatMessage("notification.save.error"))
      })
  }
  const handleClickMap = (e) => {
    setState({ positonMarker: e.latLng })
  }

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

  const handleChangeTimeMachine = (e) => {
    if (state.dataEdit?.webapp === true) {
      return false
    }

    setState({
      dataEdit: {
        ...state.dataEdit,
        time_machine: e.target.checked
      }
    })
  }

  const handleChangeDoorIntegrate = (e) => {
    if (state.dataEdit?.webapp === true) {
      return false
    }

    setState({
      dataEdit: {
        ...state.dataEdit,
        attendance_door_integrate: e.target.checked
      }
    })
  }

  useEffect(() => {
    if (info.id) {
      setState({
        dataEdit: info,
        positonMarker: info.google_places?.LatLng,
        googlePlaces: info.google_places,
        radius: parseInt(info.radius?.name_option)
      })
    }
  }, [info])
  const ability = useContext(AbilityContext)
  const addBtn = ability.can("accessAttendanceSetting", "attendances") ? (
    <>
      <Button
        className="btn"
        color="primary"
        type="button"
        onClick={() => onSubmit()}>
        {useFormatMessage("button.save")}
      </Button>

      <Button
        className="btn ms-2"
        color="secondary"
        onClick={() => handleCancel()}>
        {useFormatMessage("button.cancel")}
      </Button>
    </>
  ) : (
    <Button
      className="btn ms-2"
      color="secondary"
      onClick={() => handleCancel()}>
      {useFormatMessage("button.cancel")}
    </Button>
  )

  return (
    <>
      <h4>
        <span
          style={{
            fontSize: "1.2rem",
            color: "black"
          }}>
          {useFormatMessage("button.edit")} {info.offices_name}
        </span>
      </h4>
      <hr></hr>
      <div className="row">
        <div className="col-12  mt-1">
          <h4>
            {useFormatMessage(
              "modules.attendance_setting.fields.allow_clock_on"
            )}
          </h4>
        </div>
        <div className="col-12 mt-1">
          <div className="allow_clocking d-flex">
            {useFormatMessage("modules.attendance_setting.fields.webapp")}
            <ErpSwitch
              inline
              defaultChecked={false}
              id="webapp"
              checked={state.dataEdit.webapp}
              nolabel
              name="webapp"
              onChange={(e) =>
                setState({
                  dataEdit: {
                    ...state.dataEdit,
                    webapp: e.target.checked,
                    geofencing: !e.target.checked
                      ? false
                      : state.dataEdit.geofencing
                  }
                })
              }
              className="ms-2"
            />
          </div>
        </div>
        <div className="col-12 ">
          <div className="d-flex mt-1">
            <h4>
              {useFormatMessage("modules.attendance_setting.text.machine")}
            </h4>
            <ErpSwitch
              name="machine"
              id="machine"
              inline
              defaultChecked={false}
              checked={state.dataEdit?.time_machine}
              className="ms-2"
              nolabel
              onChange={(e) => handleChangeTimeMachine(e)}
              disabled={state.dataEdit.webapp}
            />
          </div>
        </div>
        <div className="col-12 ">
          <div className="d-flex mt-1">
            <h4>
              {useFormatMessage(
                "modules.attendance_setting.text.attendance_door_integrate"
              )}
            </h4>
            <ErpSwitch
              name="machine"
              id="machine"
              inline
              defaultChecked={false}
              checked={state.dataEdit?.attendance_door_integrate}
              className="ms-2"
              nolabel
              onChange={(e) => handleChangeDoorIntegrate(e)}
              disabled={state.dataEdit.webapp}
            />
          </div>
        </div>
        {state.dataEdit.time_machine && (
          <>
            <div className="col-12">
              <div className="mt-1">
                <label>
                  {useFormatMessage(
                    "modules.attendance_setting.fields.id_devices"
                  )}
                </label>
                {state.dataEdit?.id &&
                  renderInputTag(
                    state.dataEdit?.id_devices ? state.dataEdit?.id_devices : ""
                  )}
              </div>
            </div>

            <div className="col-12">
              <div className="d-flex align-items-center mt-2">
                <div className="w-100">
                  <ErpInput
                    id="url_time_machine"
                    name="url_time_machine"
                    placeholder="BackEnd api"
                    label="API URL"
                    defaultValue={
                      import.meta.env.VITE_APP_API_URL +
                      "/attendances-time-machine"
                    }
                    readOnly
                  />
                </div>
              </div>
            </div>
          </>
        )}
        <div className="col-12 d-flex  mt-3">
          <h4>
            {useFormatMessage("modules.attendance_setting.fields.geofencing")}
          </h4>
          <ErpSwitch
            name="geofencing"
            id="geofencing"
            inline
            nolabel
            defaultChecked={false}
            checked={state.dataEdit.geofencing}
            readOnly={!state.dataEdit?.webapp}
            className="ms-2"
            onChange={(e) =>
              setState({
                dataEdit: {
                  ...state.dataEdit,
                  geofencing: e.target.checked
                }
              })
            }
          />
        </div>

        {state.dataEdit.geofencing && (
          <>
            <div className="col-12 d-flex  mt-2 ">
              <ErpCheckbox
                name="primary"
                id="check_outside"
                inline
                checked={state.dataEdit.clock_outside}
                onChange={(e) =>
                  setState({
                    dataEdit: {
                      ...state.dataEdit,
                      clock_outside: e.target.checked
                    }
                  })
                }
              />
              <span>
                {useFormatMessage(
                  "modules.attendance_setting.fields.allow_clock_outside"
                )}
              </span>
            </div>
            {state.dataEdit.geofencing && (
              <>
                <div className="col-12 d-flex mt-2 ">
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
                  <div className="w-25 ms-1">
                    {" "}
                    <FieldHandle
                      module={moduleName}
                      fieldData={{
                        ...metas.radius
                      }}
                      options={options}
                      updateData={state.dataEdit.radius}
                      onChange={(e) => {
                        if (!e) return
                        setState({
                          dataEdit: {
                            ...state.dataEdit,
                            radius: e.value
                          },
                          radius: parseInt(e.name_option)
                        })
                      }}
                    />
                  </div>
                </div>
                <div className="col-12 d-flex  mt-2 ">
                  <div className="map_attendance">
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
                            height: `350px`
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
                      radius={state.radius}
                      centerPositon={state.googlePlaces?.LatLng}
                      googlePlaces={state.googlePlaces}
                      key="map"
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}
        <div className="col-12 d-flex  mt-4 ">{addBtn}</div>
      </div>
    </>
  )
}

export default FormEditOffices
