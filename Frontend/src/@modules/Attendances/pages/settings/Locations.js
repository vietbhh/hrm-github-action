// ** React Imports
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import { FormLoader } from "@apps/components/spinner/FormLoader"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useEffect } from "react"
import { Button, CardTitle, Col, Row } from "reactstrap"
import { attendanceSettingApi } from "../../common/api"
import CardOffices from "../../components/setting/CardOffices"
import FormEditOffices from "../../components/setting/FormEditOffices"
import AttendanceLayout from "./AttendanceLayout"
const Locations = (props) => {
  // ** Props

  const [state, setState] = useMergedState({
    dataList: [],
    isEdit: false,
    dataEdit: {},
    loading: false,
    positonMarker: {
      lat: 21.0297887,
      lng: 105.7884217
    },
    radius: 0,
    googlePlaces: {
      LatLng: {},
      address: "",
      place_id: ""
    }
  })
  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setState({ loading: true })
    attendanceSettingApi.getData().then((res) => {
      setState({
        dataList: res.data,
        loading: false
      })
    })
  }

  const handleEdit = (item) => {
    setState({ isEdit: !state.isEdit })
    attendanceSettingApi.infoAttendance(item.offices_id).then((res) => {
      const dataRes = res.data
      dataRes.offices_name = item.name
      dataRes.offices = item.offices_id
      setState({
        dataEdit: dataRes
      })
    })
  }

  const handleCancel = () => {
    setState({ isEdit: !state.isEdit })
  }

  const renderOffices = () => {
    return state.dataList?.map((item) => {
      return (
        <Col sm={12} key={item.id}>
          <CardOffices item={item} handleEdit={handleEdit} />
        </Col>
      )
    })
  }

  const renderEdit = (info) => {
    return (
      <FormEditOffices
        info={info}
        handleCancel={handleCancel}
        loadData={loadData}
      />
    )
  }

  return (
    <>
      <AttendanceLayout
        breadcrumbs={
          <Breadcrumbs
            list={[
              {
                title: useFormatMessage("menu.attendance_setting")
              },
              {
                title: useFormatMessage(
                  "modules.attendance_setting.text.locations_menu"
                )
              }
            ]}
          />
        }>
        <Row>
          <Col sm={12}>
            {!state.isEdit && (
              <CardTitle tag="h4">
                <Button.Ripple
                  tag="span"
                  className="btn-icon rounded-circle me-1"
                  color="primary"
                  style={{
                    padding: "0.5rem"
                  }}>
                  <i className="fal fa-location"></i>
                </Button.Ripple>{" "}
                <span
                  style={{
                    fontSize: "1.2rem",
                    color: "black"
                  }}>
                  {useFormatMessage(
                    "modules.attendance_setting.text.locations_menu"
                  )}
                </span>
              </CardTitle>
            )}

            {state.loading && <FormLoader />}
            {!state.loading && <Row>{!state.isEdit && renderOffices()}</Row>}
            {state.isEdit && renderEdit(state.dataEdit)}
          </Col>
        </Row>
      </AttendanceLayout>
    </>
  )
}

export default Locations
