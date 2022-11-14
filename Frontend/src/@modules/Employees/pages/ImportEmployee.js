import GoBack from "@apps/components/common/GoBack"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment } from "react"
import { Button, Card, CardBody, Col, Row } from "reactstrap"
import classNames from "classnames"
import UploadFile from "../components/import/UploadFile"
import MapFields from "../components/import/MapFields"
import PreviewAndImport from "../components/import/PreviewAndImport"
import { filter, map, orderBy } from "lodash"
import { useSelector } from "react-redux"

const ImportEmployee = () => {
  const [state, setState] = useMergedState({
    current: 0,
    fileName: "",
    data: {
      header: [],
      body: []
    },
    disabledMap: true,
    dataMapFields: {},
    data_tab: []
  })

  const moduleData = useSelector((state) => state.app.modules.employees)
  const metas = moduleData.metas
  const newMetas = orderBy(
    map(
      filter(metas, (field) => {
        if (
          (field.field_options.import === undefined ||
            field.field_options.import === true) &&
          (field.field_options.form === undefined ||
            field.field_options.form.tabId === undefined ||
            field.field_options.form.tabId !== "payroll")
        ) {
          return field
        }
      })
    ),
    (field) => parseInt(field.field_table_order),
    "asc"
  )

  const setDefaultCurrent = () => {
    setState({ current: 0, fileName: "", disabledMap: true })
  }

  const next = () => {
    setState({
      current: state.current + 1
    })
  }

  const prev = () => {
    setState({
      current: state.current - 1
    })
  }

  const setFileName = (props) => {
    setState({ fileName: props })
  }

  const setData = (header, body) => {
    setState({
      data: {
        header: header,
        body: body
      }
    })
  }

  const setDisabledMap = (props) => {
    setState({ disabledMap: props })
  }

  const setDataMapFields = (props) => {
    setState({ dataMapFields: props })
  }

  const steps = [
    {
      content: (
        <UploadFile
          fileName={state.fileName}
          setFileName={setFileName}
          setData={setData}
          setDataTab={(data_tab) => {
            setState({ data_tab: data_tab })
          }}
          setDisabledMap={setDisabledMap}
        />
      )
    },
    {
      content: (
        <MapFields
          current={state.current}
          next={next}
          prev={prev}
          metas={newMetas}
          data={state.data}
          data_tab={state.data_tab}
          setDataMapFields={setDataMapFields}
          dataMapFields={state.dataMapFields}
        />
      )
    },
    {
      content: (
        <PreviewAndImport
          current={state.current}
          next={next}
          prev={prev}
          metas={newMetas}
          data={state.data}
          data_tab={state.data_tab}
          dataMapFields={state.dataMapFields}
          setDefaultCurrent={setDefaultCurrent}
        />
      )
    }
  ]

  return (
    <Fragment>
      <Card>
        <CardBody style={{ padding: 0 }}>
          <div className="d-flex flex-wrap w-100">
            <div className="d-flex align-items-center">
              <GoBack />
            </div>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <div className="d-flex flex-wrap w-100">
            <div className="d-flex align-items-center step-div">
              <i
                className={classNames("far fa-angle-right icon-circle step-i", {
                  "active-i": state.current === 0
                })}></i>
              <span
                className={classNames("step-text", {
                  "active-text": state.current === 0
                })}>
                1. {useFormatMessage("modules.employees.import.step_1")}
              </span>
            </div>
            <div className="d-flex align-items-center step-div">
              <i
                className={classNames("far fa-angle-right icon-circle step-i", {
                  "active-i": state.current === 1
                })}></i>
              <span
                className={classNames("step-text", {
                  "active-text": state.current === 1
                })}>
                2. {useFormatMessage("modules.employees.import.step_2")}
              </span>
            </div>
            <div className="d-flex align-items-center step-div">
              <i
                className={classNames("far fa-angle-right icon-circle step-i", {
                  "active-i": state.current === 2
                })}></i>
              <span
                className={classNames("step-text", {
                  "active-text": state.current === 2
                })}>
                3. {useFormatMessage("modules.employees.import.step_3")}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

      {steps[state.current].content}

      {state.current === 0 && (
        <Card>
          <CardBody>
            <Row>
              <Col sm={12}>
                <Button
                  color="primary"
                  disabled={state.disabledMap}
                  onClick={() => {
                    next()
                    setDataMapFields({})
                  }}>
                  {useFormatMessage(
                    "modules.employees.import.button.mapping_fields"
                  )}
                  <i className="fas fa-arrow-right ms-7"></i>
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      )}
    </Fragment>
  )
}

export default ImportEmployee
