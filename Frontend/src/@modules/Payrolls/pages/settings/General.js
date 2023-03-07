import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import {
  ErpInput,
  ErpSelect,
  ErpSwitch
} from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { useContext } from "react"
import { useSelector } from "react-redux"
import { Button, CardTitle, Col, Row } from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import { payrollsSettingApi } from "../../common/api"
import PayCyclesLayout from "./PayCyclesLayout"
import { Tabs } from "antd"
const Paycles = (props) => {
  // ** Props
  const modules = useSelector((state) => state.app.modules.attendance_setting)
  const settings = useSelector((state) => state.auth.settings)
  const module = modules.config
  const moduleName = module.name
  const ability = useContext(AbilityContext)
  const [state, setState] = useMergedState({
    payroll_setting_currency: settings.payroll_setting_currency,
    payroll_auto_send_mail_review: settings.payroll_auto_send_mail_review,
    payroll_setting_calculate_monthly:
      settings.payroll_setting_calculate_monthly,
    isSave: false
  })
  const indexOfArray = (arr, value) => {
    return arr.findIndex((item) => item.value === value)
  }
  const optionsCurrency = [
    { value: "USD", label: "USD" },
    { value: "VNĐ", label: "VNĐ" }
  ]
  const optionsCalculateMonthly = [
    { value: 1, label: useFormatMessage("calculate_monthly.1") },
    { value: 2, label: useFormatMessage("calculate_monthly.2") },
    { value: 21, label: useFormatMessage("calculate_monthly.21") },
    { value: 22, label: useFormatMessage("calculate_monthly.22") },
    { value: 23, label: useFormatMessage("calculate_monthly.23") },
    { value: 24, label: useFormatMessage("calculate_monthly.24") },
    { value: 25, label: useFormatMessage("calculate_monthly.25") },
    { value: 26, label: useFormatMessage("calculate_monthly.26") }
  ]
  const onSave = () => {
    setState({ isSave: !state.isSave })

    payrollsSettingApi
      .saveGeneral({
        payroll_setting_currency: state.payroll_setting_currency,
        payroll_setting_calculate_monthly:
          state.payroll_setting_calculate_monthly
      })
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        setState({ isSave: !state.isSave })
      })
      .catch((err) => {
        //props.submitError();
        setState({ isSave: !state.isSave })
        notification.showError(useFormatMessage("notification.save.error"))
      })
  }

  const handleUpdateSettingSendMail = (e) => {
    payrollsSettingApi
      .saveGeneral({
        payroll_auto_send_mail_review: e.target.checked
      })
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
      })
      .catch((err) => {
        notification.showError(useFormatMessage("notification.save.error"))
      })
  }

  const addBtn = ability.can("accessPayrollsSetting", "payrolls") ? (
    <Button className="btn" color="primary" type="sub" onClick={() => onSave()}>
      {useFormatMessage("button.save")}
    </Button>
  ) : (
    ""
  )

  const firstSetup = settings.payroll_setting_currency === "0" ?? true

  const itemsTab = [
    {
      label: useFormatMessage("modules.pay_cycles.fields.currency"),
      key: "tab-currency",
      children: (
        <Row>
          <Col sm={12}>
            <div className="d-flex align-items-center">
              <div className="w-25">
                {useFormatMessage("modules.pay_cycles.fields.currency")} *
              </div>
              <div className="w-25">
                <ErpSelect
                  options={optionsCurrency}
                  defaultValue={
                    optionsCurrency[
                      indexOfArray(
                        optionsCurrency,
                        settings.payroll_setting_currency
                      )
                    ]
                  }
                  readOnly={!firstSetup}
                  isClearable={false}
                  name="currency"
                  onChange={(e) => {
                    setState({
                      payroll_setting_currency: e.value
                    })
                  }}
                />
              </div>
            </div>
          </Col>
          <Col sm={12}>
            <div className="d-flex align-items-center d-none">
              <div className="w-25">
                {useFormatMessage("calculate_monthly.text")} *
              </div>
              <div className="w-25">
                <ErpSelect
                  options={optionsCalculateMonthly}
                  defaultValue={
                    optionsCalculateMonthly[
                      indexOfArray(
                        optionsCalculateMonthly,
                        parseInt(settings.payroll_setting_calculate_monthly)
                      )
                    ]
                  }
                  readOnly={!firstSetup}
                  onChange={(e) =>
                    setState({
                      payroll_setting_calculate_monthly: e.value
                    })
                  }
                  isClearable={false}
                  name="calculate_monthly"
                />
              </div>
            </div>
          </Col>

          {!firstSetup && (
            <Col sm={12} className="mt-0">
              <small>
                <i className="fal fa-exclamation-circle mr-1"></i>{" "}
                {useFormatMessage("modules.pay_cycles.note.general_note")}
              </small>
            </Col>
          )}
          {firstSetup && (
            <Col sm={12} className=" d-flex mt-3 ">
              {addBtn}
            </Col>
          )}
        </Row>
      )
    },
    {
      label: useFormatMessage("modules.pay_cycles.text.other"),
      key: "tab-other",
      children: (
        <Row>
          <Col sm={12} className="mt-1">
            <div className="d-flex align-items-center">
              <div className="w-25 title-attendance-setting ">
                <p className="mb-50">
                  {useFormatMessage(
                    "modules.pay_cycles.text.payroll_auto_send_mail_review"
                  )}
                </p>
              </div>
              <div className="w-50 ">
                <ErpSwitch
                  name="payroll_auto_send_mail_review"
                  id="payroll_auto_send_mail_review"
                  defaultChecked={
                    state.payroll_auto_send_mail_review === "true"
                  }
                  onChange={(e) => {
                    handleUpdateSettingSendMail(e)
                  }}
                />
              </div>
            </div>
          </Col>
        </Row>
      )
    }
  ]

  return (
    <>
      <PayCyclesLayout
        breadcrumbs={
          <Breadcrumbs
            list={[
              {
                title: useFormatMessage("menu.payrolls")
              },
              {
                title: useFormatMessage("menu.settings")
              },
              {
                title: useFormatMessage("modules.pay_cycles.text.general")
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
                  className="btn-icon rounded-circle "
                  color="primary">
                  <i className="fal fa-exclamation-circle"></i>
                </Button.Ripple>{" "}
                <span className="title-card">
                  {useFormatMessage("modules.pay_cycles.text.general")}
                </span>
              </CardTitle>
            )}

            <Tabs items={itemsTab} />
          </Col>
        </Row>
      </PayCyclesLayout>
    </>
  )
}

export default Paycles
