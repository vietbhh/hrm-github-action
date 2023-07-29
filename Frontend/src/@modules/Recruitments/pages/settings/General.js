// ** React Imports
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import { ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { payrollsSettingApi } from "@modules/Payrolls/common/api"
import { recruitmentsApi } from "@modules/Recruitments/common/api"
import { useContext, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { Button, CardTitle, Col, Row } from "reactstrap"
import RecruitmentSettingLayout from "./RecruitmentSettingLayout"

import { AbilityContext } from "utility/context/Can"
const General = (props) => {
  // ** Props
  const ability = useContext(AbilityContext)
  const settings = useSelector((state) => state.auth.settings)
  const [state, setState] = useMergedState({
    loading: false
  })
  useEffect(() => {
    loadData()
    //loadAttendanceDate()
  }, [])

  const loadData = () => {
    setState({ loading: true })
  }

  const loadAttendanceDate = () => {
    payrollsSettingApi.lastAttendance().then((res) => {
      setState({ lastAttendanceDate: res.data.last_attendances_date })
    })
  }

  const onSubmit = (values) => {
    const data = { ...values }
    recruitmentsApi
      .saveGeneral(data)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
      })
      .catch((err) => {
        setState({ loading: false })
        notification.showError(useFormatMessage("notification.save.error"))
      })
  }

  const methods = useForm({
    mode: "onSubmit"
  })

  const { handleSubmit, setValue, getValues } = methods

  const addBtn = (
    <Button className="btn" color="primary" type="sub">
      {useFormatMessage("button.save")}
    </Button>
  )
  return (
    <>
      <RecruitmentSettingLayout
        breadcrumbs={
          <Breadcrumbs
            list={[
              { title: useFormatMessage("menu.recruitments") },
              {
                title: useFormatMessage("menu.settings")
              },
              {
                title: useFormatMessage(
                  "modules.attendance_setting.text.general"
                )
              }
            ]}
          />
        }>
        <CardTitle tag="h4">
          <Button.Ripple
            tag="span"
            className="btn-icon rounded-circle me-1"
            color="primary"
            style={{
              padding: "0.5rem"
            }}>
            <i className="fal fa-exclamation-circle"></i>
          </Button.Ripple>{" "}
          <span
            style={{
              fontSize: "1.2rem",
              color: "black"
            }}>
            {useFormatMessage("modules.attendance_setting.text.general")}
          </span>
        </CardTitle>

        <FormProvider {...methods}>
          <Row>
            <Col sm={12}>
              <div className="d-flex align-items-center">
                <div className="w-25">Recruitment Email *</div>
                <div className="w-25">
                  <ErpInput
                    defaultValue={settings.recruitment_email}
                    name="recruitment_email"
                    useForm={methods}
                  />
                </div>
              </div>
            </Col>

            <Col sm={12} className="d-flex mt-2">
              <form onSubmit={handleSubmit(onSubmit)}>{addBtn}</form>
            </Col>
          </Row>
        </FormProvider>
      </RecruitmentSettingLayout>
    </>
  )
}

export default General
