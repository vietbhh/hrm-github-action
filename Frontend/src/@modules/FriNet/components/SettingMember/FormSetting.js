import { ErpSwitch } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"
import { settingMemberApi } from "@modules/FriNet/common/api"
import React, { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { Card, CardBody, CardHeader, Col, Row, Spinner } from "reactstrap"

const FormSetting = (props) => {
  const { data, setData, title } = props
  const [state, setState] = useMergedState({
    loadingSubmit: false
  })

  // ** function
  const handleShowHide = (checked, field, id, index, key) => {
    const _data = [...data]
    if (!state.loadingSubmit) {
      setState({ loadingSubmit: true })
      const params = {
        id: id,
        key: key,
        checked: checked
      }

      settingMemberApi
        .postShowHideInfo(params)
        .then((res) => {
          const keyUpdate = key === "settingMember" ? "setting_member" : key
          _data[index] = { ...data[index], [keyUpdate]: checked }
          setData(_data)
          setState({ loadingSubmit: false })
        })
        .catch((err) => {
          setState({ loadingSubmit: false })
          notification.showError({
            text: useFormatMessage("notification.something_went_wrong")
          })
        })
    }
  }

  return (
    <Card>
      <CardHeader>
        <span className="title">{title}</span>
      </CardHeader>
      <CardBody>
        <Row className="table-header">
          <Col sm="4" className="text-bold">
            {useFormatMessage("modules.setting_member.field_name")}
          </Col>
          <Col sm="4" className="text-bold text-center">
            {useFormatMessage("modules.setting_member.show_hide_info")}
          </Col>
          <Col sm="4" className="text-bold text-center">
            {useFormatMessage("modules.setting_member.updatable")}
          </Col>
        </Row>
        {_.map(data, (value, index) => {
          return (
            <Fragment key={index}>
              <Row>
                <Col sm="4" className="text-bold">
                  {useFormatMessage(`modules.employees.fields.${value.field}`)}
                </Col>
                <Col sm="4" className="text-center">
                  <ErpSwitch
                    nolabel
                    checked={value.setting_member}
                    onChange={(e) => {
                      handleShowHide(
                        e.target.checked,
                        value.field,
                        value.id,
                        index,
                        "settingMember"
                      )
                    }}
                  />
                </Col>
                <Col sm="4" className="text-center">
                  <ErpSwitch
                    nolabel
                    checked={value.updatable}
                    onChange={(e) => {
                      handleShowHide(
                        e.target.checked,
                        value.field,
                        value.id,
                        index,
                        "updatable"
                      )
                    }}
                  />
                </Col>
              </Row>
              <hr />
            </Fragment>
          )
        })}
      </CardBody>
    </Card>
  )
}

export default FormSetting
