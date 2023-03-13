import { useFormatMessage, useMergedState } from "@apps/utility/common"
import React, { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { Card, CardBody, CardHeader } from "reactstrap"
import "../assets/scss/setting_member.scss"
import { settingMemberApi } from "../common/api"
import FormSetting from "../components/SettingMember/FormSetting"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"

const SettingMember = () => {
  const [state, setState] = useMergedState({
    // field
    personalInfoField: [],
    addressField: [],
    bankInfoField: [],
    socialNetwork: [],
    otherField: [],
    jobField: [],
    payrollField: [],

    loadPage: true
  })

  // ** useEffect
  useEffect(() => {
    setState({ loadPage: true })
    const personalInfoField = [],
      addressField = [],
      bankInfoField = [],
      socialNetwork = [],
      otherField = [],
      jobField = [],
      payrollField = []
    settingMemberApi
      .getMetas()
      .then((res) => {
        _.forEach(res.data, (value) => {
          if (value.field_enable) {
            const field = {
              id: value.id,
              module: value.module,
              field: value.field,
              field_enable: value.field_enable,
              setting_member:
                value.field_options.settingMember === undefined ||
                value.field_options.settingMember
            }
            if (
              value.field_options &&
              value.field_options.form &&
              value.field_options.form.tabId === "general"
            ) {
              personalInfoField.push(field)
            }

            if (
              value.field_options &&
              value.field_options.form &&
              value.field_options.form.tabId === "contact"
            ) {
              addressField.push(field)
            }

            if (
              value.field_options &&
              value.field_options.form &&
              value.field_options.form.tabId === "bankaccount"
            ) {
              bankInfoField.push(field)
            }

            if (
              value.field_options &&
              value.field_options.form &&
              value.field_options.form.tabId === "social"
            ) {
              socialNetwork.push(field)
            }

            if (
              value.field_options &&
              value.field_options.form &&
              value.field_options.form.tabId === "other"
            ) {
              otherField.push(field)
            }

            if (
              value.field_options &&
              value.field_options.form &&
              value.field_options.form.tabId === "job"
            ) {
              jobField.push(field)
            }

            if (
              value.field_options &&
              value.field_options.form &&
              value.field_options.form.tabId === "payroll"
            ) {
              payrollField.push(field)
            }
          }
        })

        setState({
          personalInfoField: personalInfoField,
          addressField: addressField,
          bankInfoField: bankInfoField,
          socialNetwork: socialNetwork,
          otherField: otherField,
          jobField: jobField,
          payrollField: payrollField,
          loadPage: false
        })
      })
      .catch((err) => {
        setState({ loadPage: false })
      })
  }, [])

  return (
    <div className="setting-member">
      <Card>
        <CardHeader>
          <div className="menu-icon green">
            <i className="fa-solid fa-user-gear"></i>
          </div>
          <span className="title">
            {useFormatMessage("layout.setting_member")}
          </span>
        </CardHeader>
      </Card>

      {state.loadPage && (
        <Card>
          <CardBody>
            <DefaultSpinner />
          </CardBody>
        </Card>
      )}

      {!state.loadPage && (
        <Fragment>
          <FormSetting
            data={state.personalInfoField}
            setData={(value) => setState({ personalInfoField: value })}
            title={useFormatMessage(
              "modules.employees.tabs.general.personal_info"
            )}
          />

          <FormSetting
            data={state.addressField}
            setData={(value) => setState({ addressField: value })}
            title={useFormatMessage("modules.employees.tabs.general.address")}
          />

          <FormSetting
            data={state.bankInfoField}
            setData={(value) => setState({ bankInfoField: value })}
            title={useFormatMessage(
              "modules.employees.tabs.general.bank_information"
            )}
          />

          <FormSetting
            data={state.socialNetwork}
            setData={(value) => setState({ socialNetwork: value })}
            title={useFormatMessage(
              "modules.employees.tabs.general.social_network"
            )}
          />

          <FormSetting
            data={state.otherField}
            setData={(value) => setState({ otherField: value })}
            title={useFormatMessage("modules.employees.tabs.general.other")}
          />

          <FormSetting
            data={state.jobField}
            setData={(value) => setState({ jobField: value })}
            title={useFormatMessage(
              "modules.employees.tabs.job.job_informations"
            )}
          />

          <FormSetting
            data={state.payrollField}
            setData={(value) => setState({ payrollField: value })}
            title={useFormatMessage(
              "modules.employees.tabs.payroll.payroll_informations"
            )}
          />
        </Fragment>
      )}
    </div>
  )
}

export default SettingMember
