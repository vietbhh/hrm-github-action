import { ErpEditor, ErpInput } from "@apps/components/common/ErpField"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import "@styles/react/libs/editor/editor.scss"
import { convertFromRaw, convertToRaw, EditorState } from "draft-js"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import { NotepadApi } from "../../../common/api"

const AddModal = ({
  modal,
  toggleModal,
  idNotepad,
  loadData,
  handleLayouts
}) => {
  const [state, setState] = useMergedState({
    loadingModal: false,
    loading: false,
    notepadContent: EditorState.createEmpty(),
    checkEdit: false
  })

  const methods = useForm({
    mode: "onSubmit"
  })
  const { watch, setValue, getValues } = methods

  useEffect(() => {
    if (modal) {
      if (idNotepad !== 0) {
        setState({ loadingModal: true })
        NotepadApi.getNotepad(idNotepad)
          .then((res) => {
            setState({ loadingModal: false })
            try {
              const json = JSON.parse(res.data.content)
              setState({
                notepadContent: EditorState.createWithContent(
                  convertFromRaw(json)
                )
              })
            } catch (e) {
              setState({
                notepadContent: EditorState.createEmpty()
              })
            }
            setValue("title", res.data.title ? res.data.title : "")

            if (_.isFunction(handleLayouts)) {
              handleLayouts()
            }
          })
          .catch((err) => {
            setState({ loadingModal: false })
          })
      } else {
        setValue("title", "")
        setState({
          notepadContent: EditorState.createEmpty()
        })
      }
    }
  }, [idNotepad, modal])

  const isEmptyDraftJs = (rawState) => {
    if (!rawState || _.isEmpty(rawState)) {
      return true
    }
    const content = rawState.getCurrentContent()
    return !(
      content.hasText() &&
      content.getPlainText() !== "" &&
      content.getPlainText().replace(/^\s+|\s+$/g, "") !== ""
    )
  }

  useEffect(() => {
    setState({ checkEdit: false })
    if (!modal) {
      const title = getValues("title") ? getValues("title") : ""
      if (
        idNotepad !== 0 &&
        isEmptyDraftJs(state.notepadContent) &&
        title.replace(/^\s+|\s+$/g, "") === ""
      ) {
        NotepadApi.getNotepadDelete(idNotepad)
          .then((res) => {
            loadData(false)
          })
          .catch((err) => {
            notification.showError({
              text: useFormatMessage("notification.something_went_wrong")
            })
          })
      } else {
        if (
          title.replace(/^\s+|\s+$/g, "") !== "" ||
          isEmptyDraftJs(state.notepadContent) !== true
        ) {
          const param = {
            title: title,
            content: JSON.stringify(
              convertToRaw(state.notepadContent.getCurrentContent())
            ),
            id: idNotepad
          }
          NotepadApi.postSaveNotepad(param)
            .then((res) => {
              loadData(false)
            })
            .catch((err) => {
              notification.showError({
                text: useFormatMessage("notification.something_went_wrong")
              })
            })
        }
      }
    }
  }, [modal])

  useEffect(() => {
    if (modal && state.checkEdit) {
      window.addEventListener("beforeunload", alertUser)
      return () => {
        window.removeEventListener("beforeunload", alertUser)
      }
    }
  }, [modal, state.checkEdit])
  const alertUser = (e) => {
    e.preventDefault()
    e.returnValue = ""
  }

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change") {
        setState({
          checkEdit: true
        })
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  return (
    <Modal
      isOpen={modal}
      toggle={() => toggleModal(idNotepad)}
      className="modal-lg modal-notepad"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => toggleModal(idNotepad)}>
        <span className={`dashboard-title-icon notepad-bg-icon`}>
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none">
            <path
              d="M16.5 7.5V11.25C16.5 15 15 16.5 11.25 16.5H6.75C3 16.5 1.5 15 1.5 11.25V6.75C1.5 3 3 1.5 6.75 1.5H10.5"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.5 7.5H13.5C11.25 7.5 10.5 6.75 10.5 4.5V1.5L16.5 7.5Z"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.25 9.75H9.75"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.25 12.75H8.25"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="title">
          {useFormatMessage("modules.dashboard.notepad.title")}
        </span>
      </ModalHeader>
      <FormProvider {...methods}>
        <form>
          <ModalBody>
            {state.loadingModal && (
              <>
                <Row>
                  <Col xs="12">
                    <DefaultSpinner />
                  </Col>
                </Row>
              </>
            )}

            {!state.loadingModal && (
              <>
                <Row>
                  <Col xs="12">
                    <ErpInput
                      nolabel
                      placeholder={useFormatMessage(
                        "modules.dashboard.notepad.placeholder_input"
                      )}
                      name="title"
                      useForm={methods}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs="12">
                    <ErpEditor
                      nolabel
                      name="content"
                      wrapperClassName="notepad-editor"
                      editorState={state.notepadContent}
                      onEditorStateChange={(data) =>
                        setState({
                          notepadContent: data,
                          checkEdit: true
                        })
                      }
                      editorStyle={{
                        minHeight: "30rem",
                        maxHeight: "30rem"
                      }}
                      wrapperStyle={{
                        minHeight: "32rem",
                        maxHeight: "32rem"
                      }}
                      toolbar={{
                        options: ["inline", "list", "link", "emoji"],
                        inline: {
                          options: [
                            "bold",
                            "italic",
                            "underline",
                            "strikethrough"
                          ]
                        },
                        list: {
                          options: ["unordered", "ordered"]
                        },
                        link: {
                          inDropdown: false,
                          className: undefined,
                          component: undefined,
                          popupClassName: undefined,
                          dropdownClassName: undefined,
                          showOpenOptionOnHover: true,
                          defaultTargetOption: "_self",
                          options: ["link", "unlink"],
                          linkCallback: undefined
                        }
                      }}
                    />
                  </Col>
                </Row>
              </>
            )}
          </ModalBody>
        </form>
      </FormProvider>
    </Modal>
  )
}

export default AddModal
