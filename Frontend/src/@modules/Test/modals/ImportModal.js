import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import {
  ExportData,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import notification from "@apps/utility/notification"
import UILoader from "@core/components/ui-loader"
import Uppy from "@uppy/core"
import "@uppy/core/dist/style.css"
//import "@uppy/dashboard/dist/style.css"
import { DragDrop } from "@uppy/react"
import { isEmpty } from "lodash"
import { Fragment, useEffect } from "react"
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
  Table
} from "reactstrap"
//import "uppy/dist/uppy.css"
import { testApi } from "../common/api"

import { FieldHandle } from "@apps/utility/FieldHandler"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import * as XLSX from "xlsx"

const skipTypes = ["upload_one", "upload_multiple", "upload_image"]
const ImportModal = (props) => {
  const { modal, handleImportModal, infoTest, loadData } = props
  const modules = useSelector((state) => state.app.modules.test)
  const module = modules.config
  const moduleName = module.name
  const metas = modules.metas
  const options = modules.options
  const [state, setState] = useMergedState({
    readOnly: true,
    saving: false,
    loading: false,
    averageStar: 0,
    data: [],
    tableData: [],
    value: [],
    errors: {}
  })
  const methods = useForm({
    mode: "onSubmit"
  })
  const {
    handleSubmit,
    errors,
    control,
    register,
    reset,
    setValue,
    getValues
  } = methods

  const uppy = new Uppy({
    restrictions: { maxNumberOfFiles: 1 },
    autoProceed: true
  })

  uppy.on("complete", (result) => {
    const reader = new FileReader()
    reader.onloadstart = () => {
      setState({ loading: true })
    }
    reader.onload = function () {
      const fileData = reader.result

      const wb = XLSX.read(fileData, { type: "binary" })
      wb.SheetNames.forEach(function (sheetName) {
        const rowObj = XLSX.utils.sheet_to_row_object_array(
          wb.Sheets[sheetName]
        )
        getTableData(rowObj, result.successful[0].data.name)
      })
    }
    if (result.successful[0].extension === "xlsx") {
      reader.readAsBinaryString(result.successful[0].data)
      setState({ loading: false })
    } else {
      notification.showError({
        text: useFormatMessage("notification.import.errorFileType")
      })
    }
    reader.onloadend = () => {
      setState({ loading: false })
    }
  })

  const headArr = state.tableData.length
    ? state.tableData.map((col, index) => {
        if (index === 0)
          return Object.keys(col)
            .filter((item) => !skipTypes.includes(item))
            .map((item) => col[item])
        else return null
      })
    : []

  const dataArr = state.value.length
    ? state.filteredData
    : state.tableData.length && !state.value.length
    ? state.tableData
    : null

  const getTableData = (arr, name) => {
    setState({
      tableData: arr,
      name: name
    })
  }

  const renderTableBody = () => {
    if (dataArr !== null && dataArr.length) {
      return dataArr
        .filter((col, index) => index !== 0)
        .map((col, index) => {
          const keys = Object.keys(col)
          const renderTd = keys
            .filter((item) => !skipTypes.includes(item))
            .map((key, cellIndex) => {
              const value = col[key]
              return (
                <td style={{ whiteSpace: "nowrap" }} key={cellIndex}>
                  {value.toString()}
                  {!isEmpty(state.errors[index]) &&
                    !isEmpty(state.errors[index][key]) && (
                      <Alert color="danger" className="m-0">
                        <div className="alert-body">
                          <AlertCircle size={15} />{" "}
                          <span>{state.errors[index][key].join()}</span>
                        </div>
                      </Alert>
                    )}
                </td>
              )
            })
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              {renderTd}
            </tr>
          )
        })
    } else {
      return null
    }
  }

  const renderTableHead = () => {
    if (headArr.length) {
      return headArr[0].map((head, index) => {
        return <th key={index}>{head}</th>
      })
    } else {
      return null
    }
  }

  const handleDownTemplate = (e) => {
    const arrQuest = []
    arrQuest.push([
      "title",
      "answer",
      "type",
      "answer",
      "type",
      "answer",
      "type",
      "answer",
      "type"
    ])
    arrQuest.push([
      "title",
      "answer 1",
      "type 1",
      "answer 2",
      "type 2",
      "answer 3",
      "type 3",
      "answer 4",
      "type 4"
    ])
    if (infoTest.id) {
      testApi.getQuestion(infoTest.id).then((result) => {
        const dataDisc = result.data.questions
        Object.keys(dataDisc).map((item, key) => {
          const arrDataT = []
          const titleQuest = dataDisc[item].title
          arrDataT.push(titleQuest)
          dataDisc[item]["answers"].map((item, key) => {
            arrDataT.push(item.title)
            arrDataT.push(item.point)
          })
          arrQuest.push(arrDataT)
        })

        ExportData("discExport", "xlsx", arrQuest)
      })
    }
    if (!infoTest.id) ExportData("discExport", "xlsx", arrQuest)
  }
  const onSubmit = (values) => {
    infoTest.title = values?.title
    infoTest.type = values?.type
    testApi.postImport(state.insertData, infoTest).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.save.success")
      })
      loadData()
      setState({ tableData: [], insertData: [] })
      handleImportModal()
    })
  }
  const fieldDefineArr = {}

  const cellHandle = (data, index, arrOfData, arrayOfCheckDuplicate) => {
    const columnCode = [...Object.keys(data)]
    const column = {}
    let error = {}

    columnCode.map((item, colIndex) => {
      const value = data[item]
      const field = fieldDefineArr[item]

      if (!isEmpty(value)) {
        return (column[item] = value)
      } else {
        if (field.field_form_require) {
          const fieldError = isEmpty(error[item]) ? [] : [...error[item]]
          error = {
            ...error,
            [item]: [...fieldError, "required"]
          }
        }
      }
      return (column[item] = value)
    })
    return {
      column,
      error
    }
  }

  const handleData = async () => {
    setState({ loading: true })
    const arr = state.tableData
    let arrayInsert = []

    arrayInsert = arr
      .filter((col, index) => index !== 0)
      .map((col, index) => {
        const cell = cellHandle(col, index, arr)
        return cell.column
      })

    setState({
      insertData: arrayInsert,
      errors: {},
      loading: false
    })
  }

  useEffect(() => {
    if (!isEmpty(state.tableData)) handleData()
  }, [state.tableData, state.format])
  return (
    <Modal
      isOpen={modal}
      toggle={() => {
        setState({ tableData: [] })
        handleImportModal({})
      }}
      className="new-modal detail-candidate"
      backdrop={"static"}
      size="lg"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader
        toggle={() => {
          setState({ tableData: [] })
          handleImportModal({})
        }}>
        <span>
          {!infoTest?.id
            ? useFormatMessage("modules.test.title.new_test")
            : useFormatMessage("modules.test.text.edit_test")}
        </span>
      </ModalHeader>

      <FormProvider {...methods}>
        <ModalBody>
          <Row className="mt-2">
            <Col sm="12">
              <p
                className="text-primary cursor-pointer"
                onClick={handleDownTemplate}>
                {!infoTest?.id
                  ? useFormatMessage("module.default.import.template")
                  : useFormatMessage("modules.test.text.template_current")}
              </p>
            </Col>
            <Col sm="3">
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.title
                }}
                useForm={methods}
                options={options}
                updateData={infoTest?.title}
              />
            </Col>
            <Col sm="3">
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.type
                }}
                inline
                useForm={methods}
                options={options}
                updateData={infoTest?.type}
              />
            </Col>
            <Col sm="12">
              <div className="drag-cv">
                <DragDrop
                  uppy={uppy}
                  locale={{
                    strings: {
                      dropHereOr: useFormatMessage(
                        "modules.test.text.drop_file"
                      ),
                      browse: "browse"
                    }
                  }}
                />
              </div>
            </Col>
            <Col sm="12 mt-2">
              <UILoader blocking={state.loading} loader={<DefaultSpinner />}>
                {state.tableData.length ? (
                  <Card>
                    <CardHeader className="justify-content-between flex-wrap">
                      <CardTitle tag="h4">{state.name}</CardTitle>
                    </CardHeader>
                    <CardBody>
                      {!isEmpty(state.errors) && (
                        <Alert color="danger">
                          <div className="alert-body">
                            <AlertCircle size={15} />
                            <span>
                              {useFormatMessage("module.default.import.error")}
                            </span>
                          </div>
                        </Alert>
                      )}

                      <Table size="sm" striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>#</th>
                            {renderTableHead()}
                          </tr>
                        </thead>
                        <tbody>{renderTableBody()}</tbody>
                      </Table>
                    </CardBody>
                    {state.format && (
                      <CardFooter>
                        <Alert color="warning" className="m-0">
                          <div className="alert-body">
                            <AlertTriangle size={15} />{" "}
                            <span className="ms-1">
                              {useFormatMessage("module.default.import.notice")}
                            </span>
                            {state.formatModule.length > 0 && (
                              <Fragment>
                                <br />
                                {useFormatMessage(
                                  "module.default.import.relateModuleFormat"
                                )}
                                {state.formatModule &&
                                  state.formatModule.map((item, index) => (
                                    <span
                                      key={index}
                                      className="fw-bolder text-primary">
                                      {" "}
                                      <Link to={`/${item}`} target="blank">
                                        {item}
                                      </Link>
                                    </span>
                                  ))}
                              </Fragment>
                            )}
                          </div>
                        </Alert>
                      </CardFooter>
                    )}
                  </Card>
                ) : null}
              </UILoader>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Button.Ripple
              color="primary"
              type="submit"
              disabled={!isEmpty(state.errors) || state.loading}>
              {state.loading && <Spinner size="sm" className="me-50" />}
              {useFormatMessage("app.save")}
            </Button.Ripple>
          </form>
        </ModalFooter>
      </FormProvider>
    </Modal>
  )
}
export default ImportModal
