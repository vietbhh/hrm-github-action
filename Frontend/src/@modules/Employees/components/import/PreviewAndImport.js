import { ErpRadio } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { employeesApi } from "@modules/Employees/common/api"
import { Collapse, Table } from "antd"
import { filter, map } from "lodash"
import { Fragment, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Alert, Button, Card, CardBody, Col, Row, Spinner } from "reactstrap"

const { Panel } = Collapse

const PreviewAndImport = (props) => {
  const {
    current,
    next,
    prev,
    metas,
    data,
    dataMapFields,
    setDefaultCurrent,
    data_tab
  } = props
  const [state, setState] = useMergedState({
    loading: false,
    loading_import: false,
    arr_data: [],
    record_created: 0,
    record_duplicated: 0,
    record_duplicated_2: 0,
    record_skipped: 0,
    record_unmapped: 0,
    data_created: [],
    data_unmapped: [],
    data_duplicated: [],
    data_skipped: [],
    data_tab_error: [],
    $data_tab_import: []
  })

  const loadData = () => {
    setState({ loading: true })
    const unmapped = filter(
      map(dataMapFields, (value, index) => {
        if (value === null) return index
      }),
      (value) => {
        return value
      }
    )
    data.dataMapFields = dataMapFields
    data.unmapped = unmapped
    data.data_tab = data_tab
    employeesApi.postDataPreview(data).then((res) => {
      setState({
        loading: false,
        record_unmapped: res.data.record_unmapped,
        data_unmapped: res.data.unmapped,
        record_created: res.data.record_created,
        data_created: res.data.created,
        record_duplicated: res.data.record_duplicated,
        data_duplicated: res.data.duplicated,
        record_skipped: res.data.record_skipped,
        data_skipped: res.data.skipped,
        record_duplicated_2: res.data.record_duplicated_2,
        arr_data: res.data.arr_data,
        data_tab_error: res.data.data_tab_error,
        data_tab_import: res.data.data_tab_import
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
  const { handleSubmit } = methods

  const apiSubmit = (data) => {
    setState({ loading_import: true })
    employeesApi
      .postImportSubmit(data)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("modules.employees.import.preview.imported")
        })
        setState({ loading_import: false })
        setDefaultCurrent()
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
    values.record_duplicated_2 = state.record_duplicated_2
    values.data_duplicated = state.data_duplicated
    values.arr_data = state.arr_data
    values.dataMapFields = dataMapFields
    values.data_tab_import = state.data_tab_import

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
    const columns = [
      {
        title: "",
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
        title: "",
        dataIndex: "email",
        key: "email"
      }
    ]

    return (
      <Table
        locale={{ emptyText: " " }}
        columns={columns}
        dataSource={state.data_created}
        pagination={false}
        showHeader={false}
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
        dataIndex: "email",
        key: "email"
      }
    ]

    return map(state.data_duplicated, (value, index) => {
      const dataTable = [
        ...map(value.table, (val, ind) => {
          return {
            key: ind,
            radio: [index, ind, val.row],
            row: [val.type, val.row],
            email: val.email
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
    const columns = [
      {
        title: "",
        dataIndex: "file",
        key: "file",
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
        render: (text, record) => {
          return (
            <>
              <span className="text-field">
                {useFormatMessage("modules.employees.import.preview.value")}
              </span>
              {": "}
              {text}
            </>
          )
        }
      },
      {
        title: "",
        dataIndex: "description",
        key: "description"
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
          <div style={{ width: "25%" }}>{data.email}</div>
          <div style={{ width: "10%" }}>
            {data.error}{" "}
            {useFormatMessage("modules.employees.import.preview.errors")}
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

  const headerUnmapped = () => {
    return (
      <>
        <Row className="collapse-row">
          <Col sm={12}>
            <span className="collapse-title">
              <span className="collapse-title-orange">
                {state.record_unmapped}{" "}
                {useFormatMessage("modules.employees.import.preview.unmapped")}
              </span>{" "}
              {useFormatMessage("modules.employees.import.preview.fields")}
            </span>
          </Col>
          <Col sm={12}>
            <span className="">
              {useFormatMessage(
                "modules.employees.import.preview.unmapped_text"
              )}
            </span>
          </Col>
        </Row>
      </>
    )
  }
  const bodyUnmapped = () => {
    const columns = [
      {
        title: "",
        dataIndex: "row",
        key: "row",
        render: (text, record) => {
          return (
            <>
              {text[0]}
              <span className="text_span_mapfield">&nbsp; | {text[1]}</span>
            </>
          )
        }
      }
    ]

    const dataTable = [
      ...map(state.data_unmapped, (value, index) => {
        return {
          key: index,
          row: [value.field, value.type]
        }
      })
    ]

    return (
      <Table
        locale={{ emptyText: " " }}
        columns={columns}
        dataSource={dataTable}
        pagination={false}
        showHeader={false}
      />
    )
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
                      <Col sm={6}>{bodyCreated()}</Col>
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
                      <Col sm={6}>{bodyDuplicated()}</Col>
                    </Row>
                    {state.record_duplicated_2 > 0 ? (
                      <Row>
                        <Col sm={12} className="mt-10">
                          <Alert color="warning" className="alert-edit">
                            {useFormatMessage(
                              "modules.employees.import.preview.warning_duplicated"
                            )}
                          </Alert>
                        </Col>
                      </Row>
                    ) : (
                      ""
                    )}
                  </Panel>
                </Collapse>
              </CardBody>
            </Card>

            <Card style={{ display: "none" }}>
              <CardBody className="collapse-edit">
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
              <CardBody className="collapse-edit">
                <Collapse
                  defaultActiveKey={state.record_unmapped > 0 ? ["1"] : []}
                  ghost>
                  <Panel header={headerUnmapped()} key="1">
                    <Row>
                      <Col sm={6}>{bodyUnmapped()}</Col>
                    </Row>
                  </Panel>
                </Collapse>
              </CardBody>
            </Card>

            {!_.isEmpty(state.data_tab_error) && (
              <Card>
                <CardBody className="collapse-edit">
                  <Row>
                    <Col sm={12}>
                      {_.map(state.data_tab_error, (value, index) => {
                        return (
                          <Alert
                            key={index}
                            color="warning"
                            className="alert-edit"
                            style={{ marginBottom: 0 }}>
                            {useFormatMessage(
                              `modules.employees.import.preview.${value}`
                            )}{" "}
                            {useFormatMessage(
                              `modules.employees.import.preview.error_email_missing`
                            )}
                          </Alert>
                        )
                      })}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            )}

            {current === 2 && (
              <Card>
                <CardBody>
                  <Row>
                    <Col sm={12}>
                      <Button
                        color="secondary"
                        className="me-10"
                        onClick={() => prev()}>
                        <i className="fas fa-arrow-left me-7"></i>
                        {useFormatMessage(
                          "modules.employees.import.button.back"
                        )}
                      </Button>
                      <Button
                        type="submit"
                        color="primary"
                        disabled={
                          (state.record_created === 0 &&
                            state.record_duplicated_2 === 0 &&
                            state.record_duplicated === 0) ||
                          state.record_duplicated_2 > 0
                        }>
                        {useFormatMessage(
                          "modules.employees.import.button.import"
                        )}
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            )}
          </form>
        </FormProvider>
      )}

      {state.loading && !state.loading_import && (
        <Card>
          <CardBody>
            <Row className="spinner-edit">
              <Col size="12" className="text-center">
                <Spinner size="sm" className="me-50" />
              </Col>
            </Row>
          </CardBody>
        </Card>
      )}

      {state.loading_import && (
        <Card>
          <CardBody>
            <Row className="spinner-edit">
              <Col sm="12" className="text-center">
                <Spinner size="sm" className="me-50" />
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

export default PreviewAndImport
