import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import classNames from "classnames"
import { Fragment } from "react"
import { Card, CardBody } from "reactstrap"
import Import from "../components/import/Import"
import MapFields from "../components/import/MapFields"
import Preview from "../components/import/Preview"
import UploadFile from "../components/import/UploadFile"

const ImportPayroll = () => {
  const [state, setState] = useMergedState({
    current: 0,
    import_type: "salary",
    data: {
      header: [],
      body: []
    },
    fileName: "",
    disabledNextUploadFile: true,
    dataMapFields: {}
  })

  const setDefault = () => {
    setState({ current: 0, fileName: "", disabledNextUploadFile: true })
  }

  const setData = (header, body) => {
    setState({
      data: {
        header: header,
        body: body
      }
    })
  }

  const setImportType = (props) => {
    setState({ import_type: props })
  }

  const setFileName = (props) => {
    setState({ fileName: props })
  }

  const setDisabledNextUploadFile = (props) => {
    setState({ disabledNextUploadFile: props })
  }

  const setDataMapFields = (props) => {
    setState({ dataMapFields: props })
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

  let metas = []
  if (state.import_type === "salary") {
    metas = [
      {
        field: "Username",
        field_form_require: true,
        field_type: "Text"
      },
      {
        field: "Amount",
        field_form_require: true,
        field_type: "Number"
      },
      {
        field: "Valid from",
        field_form_require: true,
        field_type: "Date"
      },
      {
        field: "Valid to",
        field_form_require: false,
        field_type: "Date"
      }
    ]
  }
  if (state.import_type === "recurring") {
    metas = [
      {
        field: "Username",
        field_form_require: true,
        field_type: "Text"
      },
      {
        field: "Payment name",
        field_form_require: true,
        field_type: "Text"
      },
      {
        field: "Valid from",
        field_form_require: true,
        field_type: "Date"
      },
      {
        field: "Valid to",
        field_form_require: false,
        field_type: "Date"
      }
    ]
  }

  const steps = [
    {
      content: (
        <Import
          next={next}
          setImportType={setImportType}
          import_type={state.import_type}
        />
      )
    },
    {
      content: (
        <UploadFile
          import_type={state.import_type}
          next={next}
          prev={prev}
          data={state.data}
          setData={setData}
          fileName={state.fileName}
          setFileName={setFileName}
          disabledNextUploadFile={state.disabledNextUploadFile}
          setDisabledNextUploadFile={setDisabledNextUploadFile}
          setDefault={setDefault}
          setDataMapFields={setDataMapFields}
        />
      )
    },
    {
      content: (
        <MapFields
          next={next}
          prev={prev}
          data={state.data}
          dataMapFields={state.dataMapFields}
          setDataMapFields={setDataMapFields}
          metas={metas}
        />
      )
    },
    {
      content: (
        <Preview
          import_type={state.import_type}
          next={next}
          prev={prev}
          data={state.data}
          setDefault={setDefault}
          dataMapFields={state.dataMapFields}
          metas={metas}
        />
      )
    }
  ]

  const renderTypeName = () => {
    if (state.import_type === "salary") {
      return "title_salary"
    }
    if (state.import_type === "recurring") {
      return "title_recurring"
    }
    return ""
  }

  return (
    <Fragment>
      {state.current !== 0 && (
        <>
          <Breadcrumbs
            className="team-attendance-breadcrumbs"
            list={[
              {
                title: useFormatMessage(`modules.payrolls.title`)
              },
              {
                title: useFormatMessage(
                  `modules.payrolls.import.${renderTypeName()}`
                )
              }
            ]}
          />

          <Card>
            <CardBody>
              <div className="d-flex flex-wrap w-100">
                <div className="d-flex align-items-center step-div">
                  <i
                    className={classNames(
                      "far fa-angle-right icon-circle step-i",
                      {
                        "active-i": state.current === 1
                      }
                    )}></i>
                  <span
                    className={classNames("step-text", {
                      "active-text": state.current === 1
                    })}>
                    1. {useFormatMessage("modules.employees.import.step_1")}
                  </span>
                </div>
                <div className="d-flex align-items-center step-div">
                  <i
                    className={classNames(
                      "far fa-angle-right icon-circle step-i",
                      {
                        "active-i": state.current === 2
                      }
                    )}></i>
                  <span
                    className={classNames("step-text", {
                      "active-text": state.current === 2
                    })}>
                    2. {useFormatMessage("modules.employees.import.step_2")}
                  </span>
                </div>
                <div className="d-flex align-items-center step-div">
                  <i
                    className={classNames(
                      "far fa-angle-right icon-circle step-i",
                      {
                        "active-i": state.current === 3
                      }
                    )}></i>
                  <span
                    className={classNames("step-text", {
                      "active-text": state.current === 3
                    })}>
                    3. {useFormatMessage("modules.employees.import.step_3")}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </>
      )}

      {steps[state.current].content}
    </Fragment>
  )
}

export default ImportPayroll
