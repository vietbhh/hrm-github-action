import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import { newsApi } from "@modules/News/common/api"
import "@styles/react/libs/editor/editor.scss"
import { Dropdown, Menu } from "antd"
import { convertFromRaw, convertToRaw, EditorState } from "draft-js"
import { isEmpty } from "lodash"
import { Fragment, useEffect } from "react"
import { Editor } from "react-draft-wysiwyg"
import { FormProvider, useForm } from "react-hook-form"
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap"
import ShareDepartmentModal from "./ShareDepartmentModal"

const AddNewsModal = (props) => {
  const {
    modal,
    toggleAddModal,
    loadData,
    metas,
    options,
    optionsModules,
    module,
    modalTitle,
    newsId
  } = props
  const moduleName = module.name
  const [state, setState] = useMergedState({
    loading: false,
    shareModal: false,
    departments: [],
    employees: [],
    status: 0,
    value: EditorState.createEmpty(),
    textButtonShare: useFormatMessage(
      "modules.news.share.button.share_to_everyone"
    ),
    checkShareEveryone: true,
    loadingModal: false,
    title: "",
    important: false,
    important_end_date: null,
    content: "",
    uploadedImages: []
  })

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, formState, setValue, getValues, watch } = methods

  useEffect(() => {
    setEmptyData()
    if (newsId > 0) {
      setState({ loadingModal: true })
      defaultModuleApi.getDetail(moduleName, newsId).then((res) => {
        const data = res.data.data
        let updateState = {
          loadingModal: false,
          title: data.title,
          important: data.important,
          important_end_date: data.important_end_date,
          content: data.content,
          id: data.id,
          employees: data.employee
        }

        if (isEmpty(data.employee)) {
          updateState = { ...updateState, checkShareEveryone: true }
        } else {
          updateState = { ...updateState, checkShareEveryone: false }
        }

        setState(updateState)
        setValue("title", data.title)
      })
    }
  }, [newsId])

  const onSubmit = (values) => {
    setState({ loading: true })
    values.status = state.status
    values.id = newsId
    values.content = JSON.stringify(
      convertToRaw(state.value.getCurrentContent())
    )
    values.department = state.departments
    values.employee = state.employees
    values.checkShareEveryone = state.checkShareEveryone

    newsApi
      .postSave(values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        toggleAddModal(0)
        loadData({ check: true, page: 1 })
        setState({
          loading: false
        })
        setEmptyData()
      })
      .catch((err) => {
        //props.submitError();
        setState({ loading: false })
        console.log(err)
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  useEffect(() => {
    try {
      const json = JSON.parse(state.content)
      setState({
        value: EditorState.createWithContent(convertFromRaw(json))
      })
    } catch (e) {
      setState({
        value: EditorState.createEmpty()
      })
    }
  }, [state.content])

  useEffect(() => {
    state.checkShareEveryone
      ? setState({
          textButtonShare: useFormatMessage(
            "modules.news.share.button.share_to_everyone"
          )
        })
      : setState({
          textButtonShare: useFormatMessage(
            "modules.news.share.button.share_to_employees"
          )
        })
  }, [state.checkShareEveryone])

  const toggleShareModal = () => {
    setState({
      shareModal: !state.shareModal
    })
  }

  const clickShareEveryone = () => {
    setState({
      departments: [],
      employees: [],
      checkShareEveryone: true
    })
  }

  const setStateParent = (departments, employees) => {
    setState({
      departments: departments,
      employees: employees
    })
  }

  const setCheckShareEveryone = (props) => {
    setState({
      checkShareEveryone: props
    })
  }

  const setEmptyData = () => {
    setState({
      departments: [],
      employees: [],
      content: "",
      value: EditorState.createEmpty(),
      checkShareEveryone: true,
      important: false,
      important_end_date: null,
      title: ""
    })
    setValue("title", "")
    setValue("important", false)
  }

  const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader()
      newsApi.uploadImg(file).then((res) => {
        reader.onloadend = async () => {
          resolve({ data: { link: res.data.link } })
        }
        reader.readAsDataURL(file)
      })
    })
  }
  const config = {
    image: {
      uploadCallback: uploadImage,
      uploadEnabled: true,
      previewImage: true
    }
  }

  const menu = (
    <Menu
      style={{ marginTop: "10px" }}
      items={[
        {
          type: "group",
          label: useFormatMessage("modules.news.share.item.title"),
          key: "0"
        },
        {
          label: (
            <label
              className="menu-share"
              onClick={() => {
                toggleShareModal()
              }}>
              <i className="fad fa-suitcase icon-share"></i>
              {useFormatMessage("modules.news.share.item.department")}
              {!state.checkShareEveryone && <i className="far fa-check"></i>}
            </label>
          ),
          key: "1"
        },
        {
          label: (
            <span
              className="menu-share"
              onClick={() => {
                clickShareEveryone()
              }}>
              <i className="far fa-globe icon-share"></i>
              {useFormatMessage("modules.news.share.item.everyone")}
              {state.checkShareEveryone && (
                <i className="far fa-check" style={{ float: "right" }}></i>
              )}
            </span>
          ),
          key: "2"
        }
      ]}
    />
  )

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "important") {
        setState({ important: value.important })
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  return (
    <Fragment>
      <Modal
        isOpen={modal}
        toggle={() => toggleAddModal()}
        className="modal-lg news"
        backdrop={"static"}
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader toggle={() => toggleAddModal()}>{modalTitle}</ModalHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              {!state.loadingModal && (
                <Row className="mt-2">
                  <Col sm={12} className="mb-25">
                    <FieldHandle
                      module={moduleName}
                      fieldData={{
                        ...metas.title
                      }}
                      nolabel
                      useForm={methods}
                      updateData={state.title}
                      optionsModules={optionsModules}
                      options={options}
                    />
                  </Col>
                  <Col sm={12} className="mb-25">
                    <Row>
                      <Col sm={6}>
                        <FieldHandle
                          module={moduleName}
                          fieldData={{
                            ...metas.important
                          }}
                          useForm={methods}
                          updateData={state.important}
                          optionsModules={optionsModules}
                          options={options}
                        />
                      </Col>
                      <Col sm={6}>
                        {state.important && (
                          <FieldHandle
                            module={moduleName}
                            fieldData={{
                              ...metas.important_end_date
                            }}
                            useForm={methods}
                            updateData={state.important_end_date}
                            optionsModules={optionsModules}
                            options={options}
                          />
                        )}
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={12} className="mb-25">
                    <Editor
                      editorState={state.value}
                      onEditorStateChange={(data) =>
                        setState({
                          value: data
                        })
                      }
                      toolbar={config}
                      editorStyle={{
                        minHeight: "22rem",
                        maxHeight: "22rem"
                      }}
                      wrapperStyle={{
                        minHeight: "28rem",
                        maxHeight: "28rem"
                      }}
                    />
                  </Col>
                  <Col sm={12} className="mb-25">
                    <Dropdown
                      overlay={menu}
                      trigger={["click"]}
                      overlayClassName="news">
                      <a onClick={(e) => e.preventDefault()}>
                        <Button.Ripple
                          size="sm"
                          color="flat-default"
                          className="btn-icon btn-share">
                          <i className="fal fa-share-alt icon-share"></i>
                          {state.textButtonShare}
                          <i className="fal fa-angle-down icon-share-down"></i>
                        </Button.Ripple>
                      </a>
                    </Dropdown>
                  </Col>
                </Row>
              )}
              {state.loadingModal && (
                <Row>
                  <Col size="12" className="text-center mt-1 mb-3">
                    <DefaultSpinner />
                  </Col>
                </Row>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={(e) => {
                  setState({
                    status: 1
                  })
                }}
                type="submit"
                color="primary"
                disabled={
                  state.loading ||
                  formState.isSubmitting ||
                  formState.isValidating
                }>
                {state.loading && state.status === 1 && (
                  <Spinner size="sm" className="me-50" />
                )}
                {useFormatMessage("modules.news.buttons.published")}
              </Button>
              <Button
                onClick={(e) => {
                  setState({
                    status: 0
                  })
                }}
                type="submit"
                color="secondary"
                disabled={
                  state.loading ||
                  formState.isSubmitting ||
                  formState.isValidating
                }>
                {state.loading && state.status === 0 && (
                  <Spinner size="sm" className="me-50" />
                )}
                {useFormatMessage("modules.news.buttons.draft")}
              </Button>
              <Button
                color="flat-danger"
                onClick={() => {
                  toggleAddModal(0)
                }}>
                {useFormatMessage("button.cancel")}
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </Modal>

      <ShareDepartmentModal
        modal={state.shareModal}
        toggleShareModal={toggleShareModal}
        optionsModules={optionsModules}
        modalTitle={useFormatMessage("modules.news.share.modal_title")}
        departments={state.departments}
        employees={state.employees}
        setStateParent={setStateParent}
        setCheckShareEveryone={setCheckShareEveryone}
        checkShareEveryone={state.checkShareEveryone}
      />
    </Fragment>
  )
}

export default AddNewsModal
AddNewsModal.defaultProps = {
  modalTitle: useFormatMessage("modules.news.buttons.add")
}
