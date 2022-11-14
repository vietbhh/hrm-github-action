import RecruitmentSettingLayout from "./RecruitmentSettingLayout"
// ** React Imports
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import Editor from "@apps/components/common/Editor"
import { ErpInput, ErpSelect } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"
import "@styles/react/libs/editor/editor.scss"
import { Dropdown, Menu } from "antd"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Button, CardTitle, Col, Row, Spinner } from "reactstrap"
import { recruitmentsApi } from "../../common/api"
const EmailTemplate = (props) => {
  const [state, setState] = useMergedState({
    valueEditor: "",
    listStage: [],
    listEmailTemplate: [],
    loading: false,
    newTemplate: false,
    dataEdit: ""
  })
  const menu = (item) => {
    return (
      <Menu
        items={[
          {
            label: <div>{useFormatMessage("button.edit")}</div>,
            key: "btn_edit",
            onClick: () => setState({ dataEdit: item, newTemplate: true })
          },
          {
            label: <div>{useFormatMessage("button.delete")}</div>,
            key: "btn_delete",
            onClick: () => handleDelete(item.id),
            disabled: item.isLock === "1"
          }
        ]}
      />
    )
  }
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, errors, control, register, reset, setValue } = methods

  const onSubmit = (values) => {
    setState({ loading: true })
    if (state.dataEdit) values.id = state.dataEdit.id
    values.content = state.valueEditor
    recruitmentsApi
      .saveEmailTemplate(values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        loadEmailTemplate()
        handleNew()
        setState({ loading: false, dataEdit: "" })
      })
      .catch((err) => {
        setState({ loading: false })
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  const loadStage = () => {
    defaultModuleApi.getList("hiring_workflow").then((res) => {
      const arrStage = []
      res.data.results.map((item) => {
        const format = { label: item.stage, value: item.stage }
        arrStage.push(format)
      })
      setState({ listStage: arrStage })
    })
  }
  const loadEmailTemplate = () => {
    recruitmentsApi.loadEmailTemplate().then((res) => {
      setState({ listEmailTemplate: res.data })
    })
  }

  const renderCard = (list) => {
    return list.map((item) => {
      return (
        <Col sm={3} key={item.id}>
          <div className="box-email-template">
            <div className="template-name d-flex">
              <div className="title">{item.name}</div>{" "}
              {item.isLock === "1" && (
                <i className="fa-light fa-lock-keyhole ms-50"></i>
              )}
              <Dropdown
                overlay={menu(item)}
                placement="bottomRight"
                overlayClassName="drop_workschedule"
                className="ms-auto">
                <Button className="p-50" color="flat-primary">
                  <i className="fa-light fa-ellipsis"></i>
                </Button>
              </Dropdown>
            </div>
          </div>
        </Col>
      )
    })
  }

  useEffect(() => {
    loadStage()
    loadEmailTemplate()
  }, [])

  const handleNew = () => {
    setState({ newTemplate: !state.newTemplate, dataEdit: "" })
  }
  const handleDelete = (idDel) => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.delete")
    }).then((res) => {
      if (res.value) {
        recruitmentsApi
          .deleteEmailTemplate(idDel)
          .then((result) => {
            notification.showSuccess({
              text: useFormatMessage("notification.delete.success")
            })
            loadEmailTemplate()
          })
          .catch((err) => {
            notification.showError({
              text: err.message
            })
          })
      }
    })
  }
  const addBtn = (
    <Button.Ripple color="primary" onClick={() => handleNew()}>
      <i className="icpega Actions-Plus"></i> &nbsp;
      <span className="align-self-center">
        {useFormatMessage("modules.recruitments.text.new_template")}
      </span>
    </Button.Ripple>
  )
  return (
    <RecruitmentSettingLayout
      breadcrumbs={
        <Breadcrumbs
          list={[
            { title: useFormatMessage("menu.recruitments") },
            {
              title: useFormatMessage("menu.settings")
            },
            {
              title: useFormatMessage(
                "modules.recruitments.text.email_template"
              )
            }
          ]}
          custom={addBtn}
        />
      }>
      <CardTitle tag="h4">
        <Button.Ripple
          tag="span"
          className="btn-icon rounded-circle me-50"
          color="primary"
          style={{
            padding: "0.5rem"
          }}>
          <i className="fa-light fa-database"></i>
        </Button.Ripple>{" "}
        <span
          style={{
            fontSize: "1.2rem",
            color: "black"
          }}>
          {useFormatMessage("modules.recruitments.text.email_templates")}
        </span>
      </CardTitle>
      {state.newTemplate && (
        <FormProvider {...methods}>
          <Row>
            <Col sm={12}>
              <ErpSelect
                label={useFormatMessage("modules.recruitments.text.stage")}
                name="category"
                useForm={methods}
                placeholder={useFormatMessage(
                  "modules.recruitments.text.select_stage"
                )}
                options={state.listStage}
                required
                isClearable={false}
                defaultValue={
                  state.dataEdit?.category && {
                    value: state.dataEdit?.category,
                    label: state.dataEdit?.category
                  }
                }
                readOnly={state.dataEdit?.isLock === "1" ?? true}
              />
            </Col>

            <Col sm={12}>
              <ErpInput
                label={useFormatMessage(
                  "modules.recruitments.text.email_template"
                )}
                name="name"
                placeholder="Name"
                useForm={methods}
                required
                readOnly={state.dataEdit?.isLock === "1" ?? true}
                defaultValue={state.dataEdit?.name}
              />
            </Col>
            <Col sm={12}>
              <ErpInput
                label={useFormatMessage("modules.recruitments.text.subject")}
                name="subject"
                placeholder={useFormatMessage(
                  "modules.recruitments.text.subject"
                )}
                useForm={methods}
                required
                defaultValue={state.dataEdit?.subject}
              />
            </Col>
            <Col sm={12}>
              <Editor
                defaultValue={state.dataEdit?.content}
                onDataChange={(data) => {
                  setState({
                    valueEditor: data
                  })
                }}
                toolbar={{
                  options: [
                    "inline",
                    "list",
                    "textAlign",
                    "colorPicker",
                    "link"
                  ],
                  inline: {
                    inDropdown: false,
                    options: ["bold", "italic", "underline"]
                  }
                }}
              />
            </Col>

            <Col sm={12} className="mt-1">
              <div className="div-placeholder">
                <i className="fal fa-exclamation-circle me-50"></i>{" "}
                <b>
                  {useFormatMessage("modules.recruitments.text.placeholders")}:
                </b>{" "}
                {
                  "{{candidate_fullname}} {{company_name}} {{job_title}} {{job_department}} {{job_position}}"
                }
              </div>
            </Col>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Col sm={12} className="mt-1">
                <Button
                  type="submit"
                  color="primary"
                  disabled={state.loading}
                  className="me-1">
                  {state.loading && <Spinner size="sm" className="me-50" />}
                  {useFormatMessage("button.save")}
                </Button>
                <Button
                  className="btn-cancel"
                  color="flat-danger"
                  onClick={() => handleNew()}>
                  {useFormatMessage("button.cancel")}
                </Button>
              </Col>
            </form>
          </Row>
        </FormProvider>
      )}
      {!state.newTemplate && <Row>{renderCard(state.listEmailTemplate)}</Row>}
    </RecruitmentSettingLayout>
  )
}

export default EmailTemplate
