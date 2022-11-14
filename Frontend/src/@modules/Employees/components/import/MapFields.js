import { ErpSelect } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { Table } from "antd"
import { indexOf, isEmpty, map } from "lodash"
import { Fragment, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Button, Card, CardBody, Col, Row } from "reactstrap"

const MapFields = (props) => {
  const { current, next, prev, metas, data, setDataMapFields, dataMapFields } =
    props
  const [state, setState] = useMergedState({
    loading: false
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const methods = useForm({
    mode: "all",
    reValidateMode: "onChange"
  })
  const { handleSubmit, formState, errors } = methods

  useEffect(() => {
    if (!isEmpty(errors)) {
      notification.showError({
        text: useFormatMessage(
          "modules.employees.import.notification.errorMapField"
        )
      })
    }
  }, [methods])

  const onSubmit = (values) => {
    setDataMapFields(values)
    next()
  }

  const MapSelect = (name, field, required) => {
    const defaultValue =
      indexOf(data.header, field) !== -1 ? { value: field, label: field } : null
    const options = [
      ...map(data.header, (value, index) => {
        return { value: value, label: value }
      })
    ]
    return (
      <ErpSelect
        options={options}
        defaultValue={defaultValue}
        name={name}
        required={required}
        useForm={methods}
      />
    )
  }

  const MapTable = () => {
    const columns = [
      {
        title: useFormatMessage(
          "modules.employees.import.map_fields.grove_field"
        ),
        dataIndex: "grove_field",
        key: "grove_field",
        render: (text, record) => {
          const field = text[0]
          const require = text[1] === true ? " * " : ""
          const type =
            text[2] === "select_option" || text[2] === "select_module"
              ? "Dropdown"
              : text[2]
          return (
            <>
              {field}
              {require}
              <span className="text_span_mapfield">&nbsp; | {type}</span>
            </>
          )
        }
      },
      {
        title: useFormatMessage("modules.employees.import.map_fields.mapping"),
        dataIndex: "mapping",
        key: "mapping"
      },
      {
        title: useFormatMessage(
          "modules.employees.import.map_fields.upload_file_header"
        ),
        dataIndex: "upload_file_header",
        key: "upload_file_header",
        render: (text, record) => {
          return MapSelect(text[0], text[1], text[2])
        }
      }
    ]

    const dataTable = [
      ...map(metas, (value, index) => {
        const field_metas = value.field
        let field = value.field + (value.field_form_require === true ? "*" : "")
        if (dataMapFields[field_metas] !== undefined) {
          if (dataMapFields[field_metas] === null) {
            field = dataMapFields[field_metas]
          } else {
            if (dataMapFields[field_metas].value !== undefined) {
              field = dataMapFields[field_metas].value
            }
          }
        }

        return {
          key: index,
          grove_field: [
            value.field,
            value.field_form_require,
            value.field_type
          ],
          mapping: <i className="fal fa-arrow-right"></i>,
          upload_file_header: [value.field, field, value.field_form_require]
        }
      })
    ]

    return <Table columns={columns} dataSource={dataTable} pagination={false} />
  }

  return (
    <Fragment>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardBody className="border-box">
              <div className="d-flex flex-wrap w-100 mb-7">
                <div className="d-flex align-items-center">
                  <i className="fal fa-info-circle icon-instruction"></i>
                  <span className="instruction-bold">
                    {useFormatMessage(
                      "modules.employees.import.map_fields.almost_there_title"
                    )}
                  </span>
                </div>
              </div>
              <div className="d-flex flex-wrap w-100 mb-7">
                <div className="d-flex align-items-center">
                  <span className="">
                    {useFormatMessage(
                      "modules.employees.import.map_fields.almost_there_text"
                    )}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap w-100 mb-7">
                <div className="d-flex align-items-center">
                  <i className="fas fa-exchange icon-circle bg-icon-green"></i>
                  <span className="instruction-bold">
                    {useFormatMessage(
                      "modules.employees.import.map_fields.default_fields_mapping_title"
                    )}
                  </span>
                </div>
              </div>
              <div className="d-flex flex-wrap w-100 mb-40">
                <div className="d-flex align-items-center">
                  <span className="">
                    {useFormatMessage(
                      "modules.employees.import.map_fields.default_fields_mapping_text"
                    )}
                  </span>
                </div>
              </div>
              <Row>
                <Col sm="12" className="map_table">
                  {MapTable()}
                </Col>
              </Row>
            </CardBody>
          </Card>

          {current === 1 && (
            <Card>
              <CardBody>
                <Row>
                  <Col sm={12}>
                    <Button
                      type="button"
                      color="secondary"
                      className="me-10"
                      onClick={() => prev()}>
                      <i className="fas fa-arrow-left me-7"></i>
                      {useFormatMessage("modules.employees.import.button.back")}
                    </Button>
                    <Button color="primary" type="submit">
                      {useFormatMessage(
                        "modules.employees.import.button.preview"
                      )}
                      <i className="fas fa-arrow-right ms-7"></i>
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          )}
        </form>
      </FormProvider>
    </Fragment>
  )
}

export default MapFields
