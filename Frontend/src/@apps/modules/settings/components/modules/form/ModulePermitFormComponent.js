import { ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage } from "@apps/utility/common"
import { yupResolver } from "@hookform/resolvers/yup"
import React from "react"
import { Plus } from "react-feather"
import { useForm } from "react-hook-form"
import { Button, Col, Form, Row, Table } from "reactstrap"
import * as Yup from "yup"

const ModulePermitForm = (props) => {
  const validateSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .min(2, useFormatMessage("validate.min", { num: 2 }))
      .required(useFormatMessage("validate.required"))
      .test(
        "checkName",
        useFormatMessage("validate.exists", {
          name: useFormatMessage("manage.permit.name")
        }),
        async (value) => {
          if (
            typeof value !== undefined &&
            value !== undefined &&
            value !== null &&
            value !== "" &&
            value.length >= 2
          ) {
            for (const item of props.data) {
              if (item.name === value) {
                return false
              }
            }
            return true
          } else {
            return true
          }
        }
      )
  })
  const onSubmit = (values) => {
    values.default = false
    props.setPermitData(values)
    reset()
  }
  const methods = useForm({
    mode: "all",
    resolver: yupResolver(validateSchema)
  })
  const { handleSubmit, reset } = methods
  return (
    <React.Fragment>
      <Form className="row" onSubmit={handleSubmit(onSubmit)}>
        <Col md="3">
          <ErpInput
            useForm={methods}
            type="text"
            name="name"
            id="permitName"
            placeholder=""
            label={useFormatMessage("manage.permit.name")}
            required
          />
        </Col>
        <Col md="4">
          <ErpInput
            useForm={methods}
            type="text"
            name="description"
            id="permitDescription"
            placeholder=""
            label={useFormatMessage("manage.permit.description")}
            required
          />
        </Col>
        <Col md="4">
          <ErpInput
            useForm={methods}
            type="text"
            name="route"
            id="permitRoute"
            placeholder=""
            label={useFormatMessage("manage.permit.route")}
          />
        </Col>
        <Col md="1 mt-2">
          <Button.Ripple
            color="primary"
            outline
            className="btn-icon rounded-circle"
            type="submit">
            <Plus size="16" />
          </Button.Ripple>
        </Col>
      </Form>
    </React.Fragment>
  )
}

const ModulePermitFormComponent = (props) => {
  const { permits, setPermits } = props
  const setPermitData = (values) => {
    const newData = [...permits, values]
    setPermits(newData)
  }
  const removePermit = (position) => {
    const newData = [...permits]
    newData.splice(position, 1)
    setPermits(newData)
  }
  return (
    <React.Fragment>
      <Row>
        <Col md="12">
          <ModulePermitForm
            data={permits}
            {...props}
            setPermitData={setPermitData}
          />
        </Col>
        <Col md="12">
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>{useFormatMessage("manage.permit.name")}</th>
                <th>{useFormatMessage("manage.permit.description")}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {permits.map((item, index) => {
                return (
                  <tr key={index}>
                    <td scope="row">{item.name}</td>
                    <td>{item.description}</td>
                    <td>
                      {!item.default && (
                        <Button.Ripple
                          outline
                          color="flat-success"
                          className="btn btn-icon float-end"
                          onClick={() => removePermit(index)}>
                          <i className="fal fa-trash" />
                        </Button.Ripple>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default ModulePermitFormComponent
