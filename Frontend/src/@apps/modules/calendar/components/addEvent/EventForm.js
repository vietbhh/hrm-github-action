// ** React Imports
import { Fragment } from "react"
// ** Styles
import { Row, Col } from "reactstrap"
// ** Components
import { FieldHandle } from "@apps/utility/FieldHandler"
import SelectViewPermission from "./SelectViewPermission"

const EventForm = (props) => {
  const {
    // ** props
    currentCalendar,
    fileRemove,
    viewOnly,
    moduleName,
    metas,
    options,
    optionsModules,
    methods,
    // ** methods
    setFileRemove
  } = props

  const arrViewPermission = [
    { value: "everyone", label: "everyone" },
    { value: "department", label: "department" },
    { value: "office", label: "office" },
    { value: "specific_employee", label: "specific_employee" }
  ]

  const watchAllDay = methods.watch('allday')

  const handleRemoveFile = (file, fileIndex) => {
    const newFileRemove = [...fileRemove]
    newFileRemove.push({
      fileName: file.fileName
    })
    setFileRemove(newFileRemove)
  }

  const range = (start, end) => {
    const result = []

    for (let i = start; i < end; i++) {
      result.push(i)
    }

    return result
  }

  const disabledDateTime = () => ({
    disabledHours: () => range(0, 24),
    disabledMinutes: () => range(0, 60)
  })

  // ** render
  const renderSelectViewPermission = () => {
    return (
      <SelectViewPermission
        currentCalendar={currentCalendar}
        arrViewPermission={arrViewPermission}
        viewOnly={viewOnly}
        moduleName={moduleName}
        metas={metas}
        options={options}
        optionsModules={optionsModules}
        methods={methods}
      />
    )
  }

  return (
    <Fragment>
      <Row>
        <Col sm={8}>
          <FieldHandle
            module={moduleName}
            fieldData={metas.title}
            useForm={methods}
            updateData={currentCalendar?.title}
            readOnly={viewOnly}
          />
        </Col>
        <Col sm={2}>
          <FieldHandle
            module={moduleName}
            fieldData={metas.allday}
            useForm={methods}
            updateData={currentCalendar?.allday}
            readOnly={viewOnly}
          />
        </Col>
      </Row>
      <Row>
        <Col sm={4}>
          <FieldHandle
            module={moduleName}
            fieldData={metas.start}
            useForm={methods}
            updateData={currentCalendar?.start}
            disabledTime={watchAllDay && disabledDateTime}
            format={watchAllDay ? "DD/MM/YYYY" : "DD/MM/YYYY hh:mm"}
            readOnly={viewOnly}
          />
        </Col>

        <Col sm={4}>
          <FieldHandle
            module={moduleName}
            fieldData={metas.end}
            useForm={methods}
            updateData={currentCalendar?.end}
            disabledTime={watchAllDay && disabledDateTime}
            format={watchAllDay ? "DD/MM/YYYY" : "DD/MM/YYYY hh:mm"}
            readOnly={viewOnly}
          />
        </Col>

        <Col sm={4}>
          <FieldHandle
            module={moduleName}
            fieldData={metas.calendar_tag}
            useForm={methods}
            optionsModules={optionsModules}
            updateData={currentCalendar?.calendar_tag}
            readOnly={viewOnly}
          />
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <FieldHandle
            module={moduleName}
            fieldData={metas.description}
            useForm={methods}
            updateData={currentCalendar?.description}
            readOnly={viewOnly}
          />
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <FieldHandle
            module={moduleName}
            fieldData={metas.attachments}
            useForm={methods}
            updateData={currentCalendar?.attachments}
            onFileDelete={(file, fileIndex) =>
              handleRemoveFile(file, fileIndex)
            }
            readOnly={viewOnly}
          />
        </Col>
      </Row>
      <Fragment>{renderSelectViewPermission()}</Fragment>
    </Fragment>
  )
}

export default EventForm
