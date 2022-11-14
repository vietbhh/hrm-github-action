// ** React Imports
import {
  getOptionValue,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { useEffect } from "react"
import { MyAttendanceApi } from "@modules/Attendances/common/api"
// ** Styles
import { Col, Row } from "reactstrap"
// ** Components
import { ErpSelect } from "@apps/components/common/ErpField"
import moment from "moment"

const AttendanceFilter = (props) => {
  const {
    // ** props
    optionsAttendanceDetail,
    // ** methods
    setFilters,
    setReloadAttendanceBodyAfterLoading
  } = props

  const [state, setState] = useMergedState({
    attendanceData: [],
    currentAttendance: {},
    loading: false
  })

  const statusOption = optionsAttendanceDetail.status.map((item) => {
    return { value: item.value, label: useFormatMessage(item.label) }
  })

  const locationOption = [
    {
      value: getOptionValue(
        optionsAttendanceDetail,
        "clock_in_location_type",
        "na"
      ),
      label: useFormatMessage("modules.attendance_details.filters.location.na")
    },
    {
      value: getOptionValue(
        optionsAttendanceDetail,
        "clock_in_location_type",
        "outside"
      ),
      label: useFormatMessage(
        "modules.attendance_details.filters.location.outside"
      )
    },
    {
      value: getOptionValue(
        optionsAttendanceDetail,
        "clock_in_location_type",
        "inside"
      ),
      label: useFormatMessage(
        "modules.attendance_details.filters.location.inside"
      )
    }
  ]

  const recordOption = [
    {
      value: "missing",
      label: useFormatMessage(
        "modules.attendance_details.filters.records.missing"
      )
    },
    {
      value: "edit_paid_time",
      label: useFormatMessage(
        "modules.attendance_details.filters.records.edit_paid_time"
      )
    },
    {
      value: "edit_overtime",
      label: useFormatMessage(
        "modules.attendance_details.filters.records.edit_overtime"
      )
    },
    {
      value: "non_working_days",
      label: useFormatMessage(
        "modules.attendance_details.filters.records.non_working_days"
      )
    }
  ]

  const handleChangeFilter = (filterName, el) => {
    if (el !== null) {
      setFilters({
        [filterName]: el.value
      })
    } else {
      setFilters({
        [filterName]: ""
      })
    }
    setReloadAttendanceBodyAfterLoading(true)
  }

  // ** effect
  useEffect(() => {
    let isMounted = true
    setState({
      loading: true
    })
    MyAttendanceApi.getListAttendanceForFilter().then((res) => {
      if (isMounted) {
        const currentDate = moment().format("YYYY-MM-DD")
        let infoAttendanceToday = {}
        const attendanceOption = res.data.results.map((item) => {
          if (
            moment(currentDate).isBetween(
              item.date_from,
              item.date_to,
              undefined,
              "[]"
            )
          ) {
            infoAttendanceToday = {
              value: item.id,
              label: item.name
            }
          }
          return {
            value: item.id,
            label: item.name
          }
        })
        setState({
          currentAttendance: infoAttendanceToday,
          attendanceData: attendanceOption
        })
        if (attendanceOption.length > 0) {
          setFilters({
            attendanceId: infoAttendanceToday?.value
          })
        }
        setState({
          loading: false
        })
        setReloadAttendanceBodyAfterLoading(true)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  // ** render
  const renderFilter = () => {
    return (
      <Row className="mt-2">
        <Col sm={2} className="mb-25">
          <ErpSelect
            nolabel={true}
            name="filter-attendance"
            options={state.attendanceData}
            placeholder={useFormatMessage(
              "modules.attendance_details.fields.attendance"
            )}
            defaultValue={state.currentAttendance}
            onChange={(el) => handleChangeFilter("attendanceId", el)}
            isClearable={false}
          />
        </Col>
        <Col sm={2} className="mb-25">
          <ErpSelect
            nolabel={true}
            name="filter-status"
            options={statusOption}
            placeholder={useFormatMessage(
              "modules.attendance_details.fields.status"
            )}
            onChange={(el) => handleChangeFilter("status", el)}
          />
        </Col>
        <Col sm={2} className="mb-25">
          <ErpSelect
            nolabel={true}
            name="filter-status"
            options={locationOption}
            placeholder={useFormatMessage(
              "modules.attendance_details.text.location"
            )}
            onChange={(el) => handleChangeFilter("location", el)}
          />
        </Col>
        <Col sm={2} className="mb-25">
          <ErpSelect
            nolabel={true}
            name="filter-status"
            options={recordOption}
            placeholder={useFormatMessage(
              "modules.attendance_details.text.records"
            )}
            onChange={(el) => handleChangeFilter("records", el)}
          />
        </Col>
      </Row>
    )
  }
  return !state.loading && renderFilter()
}

export default AttendanceFilter
