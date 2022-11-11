import { ErpImageUpload, ErpInput } from "@apps/components/common/ErpField"
import { objectMap, useFormatMessage } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button, Col, Form, Row } from "reactstrap"
import { generalApi } from "../../common/api"

const GeneralForm = (props) => {
  const methods = useForm()
  const { handleSubmit, setValue } = methods
  useEffect(() => {
    let fileArray = {}
    objectMap(props.data, (i, v) => {
      const element = document.getElementsByName(i)
      objectMap(element, (index, item) => {
        if (
          item.tagName &&
          item.tagName.toLowerCase() === "input" &&
          item.getAttribute("type") === "file"
        ) {
          fileArray = { ...fileArray, [i]: v }
        } else {
          setValue(i, v)
        }
      })
    })
  }, [props.data])

  const onSubmit = (data) => {
    const formData = new FormData()
    objectMap(data, (i, v) => {
      if (typeof v === "object") {
        objectMap(v, (index, item) => {
          formData.append(i, item)
        })
      } else {
        formData.append(i, v)
      }
    })
    const text = useFormatMessage("notification.save.success")
    generalApi
      .postUpdate(formData)
      .then(() => notification.showSuccess({ text }))
      .catch((err) => {
        notification.showError({ text: err.message })
      })
  }
  return (
    <Form className="setting-frm" onSubmit={handleSubmit(onSubmit)}>
      <Row className="setting-row">
        <label className="col-sm-3 col-form-label">
          {useFormatMessage("common.orgName")}
        </label>
        <Col sm="12" md="8">
          <ErpInput
            type="text"
            name="app_name"
            id="app_name"
            nolabel
            useForm={methods}
            placeholder={useFormatMessage("common.orgName")}
          />
        </Col>
      </Row>
      <Row className="setting-row">
        <label className="col-sm-3 col-form-label">
          {useFormatMessage("common.comLogo")}
        </label>
        <Col sm="12" md="4">
          <ErpImageUpload
            name="logo_default"
            id="logo_default"
            label="Default Logo Image"
            default={props.data.logo_default}
            useForm={methods}
            nolabel
          />
        </Col>
        <Col sm="12" md="4">
          <ErpImageUpload
            name="logo_white"
            id="logo_white"
            label="Logo White"
            default={props.data.logo_white}
            useForm={methods}
            nolabel
            darkbg
          />
        </Col>
      </Row>
      <Row className="setting-row">
        <label className="col-sm-3 col-form-label">
          {useFormatMessage("common.website")}
        </label>
        <Col sm="12" md="8">
          <ErpInput
            type="text"
            name="website"
            id="website"
            nolabel
            useForm={methods}
            label={useFormatMessage("common.website")}
            placeholder={useFormatMessage("common.website")}
          />
        </Col>
      </Row>
      <Row className="setting-row">
        <label className="col-sm-3 col-form-label">
          {useFormatMessage("common.address")}
        </label>
        <Col sm="12" md="8">
          <ErpInput
            type="text"
            name="address"
            id="address"
            nolabel
            useForm={methods}
            label={useFormatMessage("common.address")}
            placeholder={useFormatMessage("common.address")}
          />
        </Col>
      </Row>
      <Row className="setting-row">
        <label className="col-sm-3 col-form-label">
          {useFormatMessage("common.phone")}
        </label>
        <Col sm="12" md="8">
          <ErpInput
            type="text"
            name="phone"
            id="phone"
            nolabel
            useForm={methods}
            label={useFormatMessage("common.phone")}
            placeholder={useFormatMessage("common.phone")}
          />
        </Col>
      </Row>
      <Row className="setting-row">
        <label className="col-sm-3 col-form-label">
          {useFormatMessage("common.email")}
        </label>
        <Col sm="12" md="8">
          <ErpInput
            type="text"
            name="email"
            id="email"
            nolabel
            useForm={methods}
            label={useFormatMessage("common.email")}
            placeholder={useFormatMessage("common.email")}
          />
        </Col>
      </Row>
      <Row className="setting-row">
        <label className="col-sm-3 col-form-label">
          {useFormatMessage("common.introduce")}
        </label>
        <Col sm="12" md="8">
          <ErpInput
            type="textarea"
            name="bio"
            id="bio"
            nolabel
            useForm={methods}
            label={useFormatMessage("common.introduce")}
            placeholder={useFormatMessage("common.introduce")}
            rows="5"
          />
        </Col>
      </Row>
      <div
        className="row"
        style={{
          paddingTop: "1rem"
        }}>
        <Col className="text-start d-flex col-md-9 offset-md-3">
          <Button.Ripple
            className="me-50 btn-base"
            type="submit"
            color="primary">
            {useFormatMessage("app.save")}
          </Button.Ripple>
        </Col>
      </div>
    </Form>
  )
}

export default GeneralForm
