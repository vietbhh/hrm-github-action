import { ErpRadio } from "@apps/components/common/ErpField"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { payrollsImportApi } from "@modules/Payrolls/common/api"
import { Collapse, Table } from "antd"
import { map } from "lodash"
import { Fragment, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Button, Card, CardBody, Col, Row, Spinner } from "reactstrap"
const { Panel } = Collapse

const Preview = (props) => {
  const { import_type, next, prev, data, setDefault, dataMapFields, metas } =
    props
  const [state, setState] = useMergedState({
    loading: false,
    loading_import: false,
    arr_data: [],
    record_created: 0,
    record_duplicated: 0,
    record_skipped: 0,
    data_created: [],
    data_duplicated: [],
    data_skipped: []
  })

  const loadData = () => {
    setState({ loading: true })
    data.dataMapFields = dataMapFields
    data.import_type = import_type
    data.metas = metas
    payrollsImportApi.postDataPreview(data).then((res) => {
      setState({
        loading: false,
        record_created: res.data.record_created,
        data_created: res.data.created,
        record_duplicated: res.data.record_duplicated,
        data_duplicated: res.data.duplicated,
        record_skipped: res.data.record_skipped,
        data_skipped: res.data.skipped,
        arr_data: res.data.arr_data
      })
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  const methods = useForm({
    mode: "all",
    reValidateMode: "onChange"
  })
  const { handleSubmit, formState, errors } = methods

  const apiSubmit = (data) => {
    setState({ loading_import: true })
    payrollsImportApi
      .postImport(data)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("modules.employees.import.preview.imported")
        })
        setState({ loading_import: false })
        setDefault()
      })
      .catch((err) => {
        setState({ loading_import: false })
        console.log(err)
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  const onSubmit = (values) => {
    values.data_created = state.data_created
    values.record_created = state.record_created
    values.record_duplicated = state.record_duplicated
    values.data_duplicated = state.data_duplicated
    values.arr_data = state.arr_data
    values.import_type = import_type

    apiSubmit(values)
  }

  const headerCreated = () => {
    return (
      <>
        <Row className="collapse-row">
          <Col sm={12}>
            <span className="collapse-title">
              <span className="collapse-title-green">
                {state.record_created}{" "}
                {state.record_created > 1
                  ? useFormatMessage("modules.employees.import.preview.records")
                  : useFormatMessage("modules.employees.import.preview.record")}
              </span>{" "}
              {useFormatMessage(
                "modules.employees.import.preview.ready_to_created"
              )}
            </span>
          </Col>
        </Row>
      </>
    )
  }
  const bodyCreated = () => {
    const renderColumn = () => {
      if (import_type === "salary") {
        return useFormatMessage("modules.payrolls.import.amount")
      } else {
        return useFormatMessage("modules.payrolls.import.payment_name")
      }
    }

    const columns = [
      {
        title: useFormatMessage("modules.employees.import.preview.row"),
        dataIndex: "row",
        key: "row",
        render: (text, record) => {
          return (
            <>
              {useFormatMessage("modules.employees.import.preview.row")} {text}
            </>
          )
        }
      },
      {
        title: useFormatMessage("modules.payrolls.import.username"),
        dataIndex: "username",
        key: "username"
      },
      {
        title: renderColumn(),
        dataIndex: "amount",
        key: "amount"
      },
      {
        title: useFormatMessage("modules.payrolls.import.valid_from"),
        dataIndex: "valid_from",
        key: "valid_from"
      },
      {
        title: useFormatMessage("modules.payrolls.import.valid_to"),
        dataIndex: "valid_to",
        key: "valid_to"
      }
    ]

    return (
      <Table
        locale={{ emptyText: " " }}
        columns={columns}
        dataSource={state.data_created}
        pagination={false}
      />
    )
  }

  const headerDuplicated = () => {
    return (
      <>
        <Row className="collapse-row">
          <Col sm={12}>
            <span className="collapse-title">
              <span className="collapse-title-orange">
                {state.record_duplicated}{" "}
                {state.record_duplicated > 1
                  ? useFormatMessage("modules.employees.import.preview.records")
                  : useFormatMessage("modules.employees.import.preview.record")}
              </span>{" "}
              {useFormatMessage("modules.employees.import.preview.duplicated")}
            </span>
          </Col>
          <Col sm={12}>
            <span className="">
              {useFormatMessage(
                "modules.employees.import.preview.duplicated_text"
              )}
            </span>
          </Col>
        </Row>
      </>
    )
  }
  const bodyDuplicated = () => {
    const columns = [
      {
        title: "",
        dataIndex: "radio",
        key: "radio",
        width: 50,
        render: (text, record) => {
          return (
            <ErpRadio
              id={`radio_${text[0]}_${text[1]}`}
              name={`duplicated_${text[0]}`}
              defaultValue={text[2]}
              useForm={methods}
              defaultChecked={text[1] === 0}
            />
          )
        }
      },
      {
        title: "",
        dataIndex: "row",
        key: "row",
        render: (text, record) => {
          return (
            <>
              {text[0] === "excel"
                ? useFormatMessage("modules.employees.import.preview.row") +
                  " " +
                  text[1]
                : useFormatMessage("modules.employees.import.preview.field")}
            </>
          )
        }
      },
      {
        title: "",
        dataIndex: "amount",
        key: "amount"
      },
      {
        title: "",
        dataIndex: "date",
        key: "date"
      }
    ]

    return map(state.data_duplicated, (value, index) => {
      const dataTable = [
        ...map(value.table, (val, ind) => {
          return {
            key: ind,
            radio: [index, ind, val.row],
            row: [val.type, val.row],
            amount: val.amount,
            date: val.date
          }
        })
      ]
      return (
        <Fragment key={index}>
          <div className="div-duplicated">
            {value.title}{" "}
            {useFormatMessage("modules.employees.import.preview.duplicate")}{" "}
            <span className="span-duplicated">{value.value}</span>
          </div>
          <Table
            className="mb-7"
            columns={columns}
            dataSource={dataTable}
            pagination={false}
            showHeader={false}
          />
        </Fragment>
      )
    })
  }

  const headerSkipped = () => {
    return (
      <Row className="collapse-row">
        <Col sm={12}>
          <span className="collapse-title">
            <span className="collapse-title-orange">
              {state.record_skipped}{" "}
              {state.record_skipped > 1
                ? useFormatMessage("modules.employees.import.preview.records")
                : useFormatMessage("modules.employees.import.preview.record")}
            </span>{" "}
            {useFormatMessage("modules.employees.import.preview.skipped")}
          </span>
        </Col>
        <Col sm={12}>
          <span className="">
            {useFormatMessage("modules.employees.import.preview.skipped_text")}
          </span>
        </Col>
      </Row>
    )
  }
  const bodySkipped = () => {
    const renderValue = (value) => {
      if (value === null) {
        return (
          <>
            <span className="text-primary">
              {useFormatMessage("modules.payrolls.import.empty")}
            </span>
          </>
        )
      }

      return value
    }

    const columns = [
      {
        title: "",
        dataIndex: "file",
        key: "file",
        width: 280,
        render: (text, record) => {
          return (
            <>
              <span className="text-field">
                {useFormatMessage("modules.employees.import.preview.field")}
              </span>
              {": "}
              {text}
            </>
          )
        }
      },
      {
        title: "",
        dataIndex: "uploaded_file_header",
        key: "uploaded_file_header",
        width: 370,
        render: (text, record) => {
          return (
            <>
              <span className="text-field">
                {useFormatMessage(
                  "modules.employees.import.preview.uploaded_file_header"
                )}
              </span>
              {": "}
              {text}
            </>
          )
        }
      },
      {
        title: "",
        dataIndex: "value",
        key: "value",
        width: 300,
        render: (text, record) => {
          return (
            <>
              <span className="text-field">
                {useFormatMessage("modules.employees.import.preview.value")}
              </span>
              {": "}
              {renderValue(text)}
            </>
          )
        }
      },
      {
        title: "",
        dataIndex: "description",
        key: "description",
        render: (text) => {
          return useFormatMessage(`modules.payrolls.import.error.${text}`)
        }
      }
    ]

    const headerSkippedChild = (data) => {
      return (
        <div
          className="collapse-row"
          style={{ display: "flex", width: "100%" }}>
          <div style={{ width: "10%" }}>
            {useFormatMessage("modules.employees.import.preview.row")}{" "}
            {data.row}
          </div>
          <div style={{ width: "25%" }}>{data.username}</div>
          <div style={{ width: "10%" }}>
            {data.error}{" "}
            {data.error > 1
              ? useFormatMessage("modules.employees.import.preview.errors")
              : useFormatMessage("modules.employees.import.preview.error")}
          </div>
        </div>
      )
    }

    return map(state.data_skipped, (value, index) => {
      const dataTable = [
        ...map(value.table_error, (val, ind) => {
          return {
            key: ind,
            file: val.field,
            uploaded_file_header: val.uploaded_file_header,
            value: val.value,
            description: val.description
          }
        })
      ]
      return (
        <Collapse ghost key={index}>
          <Panel
            header={headerSkippedChild(value.header)}
            key={index}
            className="collapse-border-header">
            <Row>
              <Col sm={12}>
                <Table
                  columns={columns}
                  dataSource={dataTable}
                  pagination={false}
                  showHeader={false}
                />
              </Col>
            </Row>
          </Panel>
        </Collapse>
      )
    })
  }

  return (
    <Fragment>
      {!state.loading && !state.loading_import && (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardBody className="border-box">
                <div className="d-flex flex-wrap w-100 mb-7">
                  <div className="d-flex align-items-center">
                    <i className="fal fa-info-circle icon-instruction"></i>
                    <span className="instruction-bold">
                      {useFormatMessage(
                        "modules.employees.import.preview.preview_title"
                      )}
                    </span>
                  </div>
                </div>
                <div className="d-flex flex-wrap w-100 mb-7">
                  <div className="d-flex align-items-center">
                    <span className="">
                      {useFormatMessage(
                        "modules.employees.import.preview.preview_text_1"
                      )}
                    </span>
                  </div>
                </div>
                <div className="d-flex flex-wrap w-100 mb-7">
                  <div className="d-flex align-items-center">
                    <span className="">
                      {useFormatMessage(
                        "modules.employees.import.preview.preview_text_2"
                      )}
                      <a
                        href="mailto:support@friday.vn"
                        className="import-mailto">
                        support@friday.vn
                      </a>
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="collapse-edit">
                <Collapse
                  defaultActiveKey={state.record_created > 0 ? ["1"] : []}
                  ghost>
                  <Panel header={headerCreated()} key="1">
                    <Row>
                      <Col sm={12}>{bodyCreated()}</Col>
                    </Row>
                  </Panel>
                </Collapse>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="collapse-edit">
                <Collapse
                  defaultActiveKey={state.record_duplicated > 0 ? ["1"] : []}
                  ghost>
                  <Panel header={headerDuplicated()} key="1">
                    <Row>
                      <Col sm={12}>{bodyDuplicated()}</Col>
                    </Row>
                  </Panel>
                </Collapse>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="collapse-edit import-skipped">
                <Collapse
                  defaultActiveKey={state.record_skipped > 0 ? ["1"] : []}
                  ghost>
                  <Panel header={headerSkipped()} key="1">
                    <Row>
                      <Col sm={12}>{bodySkipped()}</Col>
                    </Row>
                  </Panel>
                </Collapse>
              </CardBody>
            </Card>

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
                      {useFormatMessage("modules.payrolls.import.button.back")}
                    </Button>
                    <Button
                      color="primary"
                      type="submit"
                      disabled={
                        state.record_created === 0 &&
                        state.record_duplicated === 0
                      }>
                      {useFormatMessage(
                        "modules.payrolls.import.button.import"
                      )}
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </form>
        </FormProvider>
      )}

      {state.loading && !state.loading_import && (
        <Card>
          <CardBody style={{ minHeight: "300px", paddingTop: "110px" }}>
            <DefaultSpinner />
          </CardBody>
        </Card>
      )}

      {state.loading_import && (
        <Card>
          <CardBody>
            <Row className="spinner-edit">
              <Col sm="12" className="text-center">
                <Spinner size="sm" className="mr-50" />
              </Col>
              <Col sm="12" className="text-center">
                {useFormatMessage("modules.employees.import.preview.importing")}
              </Col>
            </Row>
          </CardBody>
        </Card>
      )}
    </Fragment>
  )
}

export default Preview
