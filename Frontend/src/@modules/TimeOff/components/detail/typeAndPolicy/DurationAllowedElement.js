// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { getOptionValue, getOptionLabel } from "@modules/TimeOff/common/common"
// ** Styles
import { Row, Card, CardBody, FormGroup } from "reactstrap"
// ** Components
import { ErpRadio } from "@apps/components/common/ErpField"
import SwAlert from "@apps/utility/SwAlert"

const DurationAllowedElement = (props) => {
  const {
    // ** props
    options,
    dataForm,
    editDurationAllowed,
    isEditPolicy,
    // ** methods
    methods
  } = props

  const [state, setState] = useMergedState({
    showDurationAllowedWarning: false,
    chosenDurationAllowed: dataForm?.duration_allowed?.value
  })
  const { watch, setValue, getValues } = methods
  const watchDurationAllowed = watch("duration_allowed", 0)

  const durationAllowedDurationHalfDayOption = getOptionValue(
    options,
    "duration_allowed",
    "halfday"
  )
  const durationAllowedOption = options.duration_allowed

  const handleChangeDurationAllowed = (value) => {
    let status = false
    if (parseInt(value) === durationAllowedDurationHalfDayOption) {
      status = true
    }
    setState({
      showDurationAllowedWarning: status
    })
  }

  const handleClickDurationAllowed = (val) => {
    if (isEditPolicy) {
      const optionChose = useFormatMessage(
        getOptionLabel(options, "duration_allowed", val)
      )
      SwAlert.showWarning({
        title: useFormatMessage(
          "modules.time_off_holidays.text.warning_change_duration_allowed"
        ),
        html: `${useFormatMessage(
          "modules.time_off_holidays.text.text_warning_duration_allowed.ul",
          {
            duration_allowed_change: optionChose
          }
        )}  <br> <ul><li>${useFormatMessage(
          "modules.time_off_holidays.text.text_warning_duration_allowed.row_1",
          {
            duration_allowed_change: optionChose
          }
        )}</li><li>${useFormatMessage(
          "modules.time_off_holidays.text.text_warning_duration_allowed.row_2"
        )}</li></ul><p>${useFormatMessage(
          "modules.time_off_holidays.text.wish_change"
        )}</p>`
      }).then((res) => {
        if (res.isConfirmed === true) {
          setValue("duration_allowed", val)
          setState({
            chosenDurationAllowed: val
          })
        } else {
          setValue("duration_allowed", state.chosenDurationAllowed)
        }
      })
    }
  }

  // ** effect
  useEffect(() => {
    handleChangeDurationAllowed(watchDurationAllowed)
  }, [watchDurationAllowed])

  // ** render
  const renderWarningDurationAllowed = () => {
    return (
      <p>
        {useFormatMessage(
          "modules.time_off_policies.text.duration_allowed_description.caution_halfday"
        )}
      </p>
    )
  }

  return (
    <div>
      {durationAllowedOption.map((item) => {
        return (
          <Row className="mt-0 mb-0" key={`duration_allowed_${item.value}`}>
            <Card className="duration-allowed-card">
              <CardBody>
                <div className="mb-1">
                  <div className="d-flex align-items-center">
                    <ErpRadio
                      name="duration_allowed"
                      id={`erp_checkbox_duration_allowed_${item.value}`}
                      className="me-50"
                      useForm={methods}
                      defaultValue={item.value}
                      readOnly={
                        (parseInt(item.value) ===
                          durationAllowedDurationHalfDayOption &&
                          isEditPolicy) ||
                        editDurationAllowed
                      }
                      defaultChecked={
                        item.value === dataForm?.duration_allowed?.value
                      }
                      onClick={(el) => handleClickDurationAllowed(item.value)}
                    />
                    <span>{useFormatMessage(item.label)}</span>
                  </div>
                </div>
                <p
                  dangerouslySetInnerHTML={{
                    __html: useFormatMessage(
                      `modules.time_off_policies.text.duration_allowed_description.${item.name_option}`
                    )
                  }}
                />
                {parseInt(item.value) ===
                  durationAllowedDurationHalfDayOption &&
                  state.showDurationAllowedWarning &&
                  renderWarningDurationAllowed()}
              </CardBody>
            </Card>
          </Row>
        )
      })}
    </div>
  )
}

export default DurationAllowedElement
