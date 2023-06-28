import {
  ErpImageUpload,
  ErpInput,
  ErpSelect
} from "@apps/components/common/ErpField"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import Photo from "@apps/modules/download/pages/Photo"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { DatePicker, Popconfirm, Table } from "antd"
import moment from "moment"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import {
  Button,
  Col,
  FormFeedback,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap"
import { HeaderAssistantApi } from "../../common/api"
const { RangePicker } = DatePicker

const HeaderAssistantModal = ({ modal, toggleModal, getBirthdayAndCustom }) => {
  const [state, setState] = useMergedState({
    loadingModal: false,
    data: [],
    loading_delete: false,
    deleteKey: "",
    loadingSubmit: false,
    date_from: "",
    date_to: "",
    image: false,
    idEdit: 0,
    isInvalidMultipleDate: false,
    loadingEdit: false
  })

  const loadData = () => {
    setState({ loadingModal: true })
    HeaderAssistantApi.getAllHeaderAssistant()
      .then((res) => {
        setState({ loadingModal: false, data: res.data })
      })
      .catch((err) => {
        setState({ loadingModal: false })
      })
  }

  const emptyData = (checkLoading = false) => {
    if (!checkLoading) {
      loadData()
    }
    reset()
    setValue("image_position", { value: "right", label: "Right" })
    setState({ date_from: "", date_to: "", image: false, idEdit: 0 })
  }

  useEffect(() => {
    if (modal) {
      emptyData()
      loadData()
    }
  }, [modal])

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, formState, setValue, getValues, reset } = methods
  const onSubmit = (values) => {
    values.id = state.idEdit

    if (_.isEmpty(values.date_from) || _.isEmpty(values.date_to)) {
      setState({ isInvalidMultipleDate: true })
      return
    } else {
      setState({ isInvalidMultipleDate: false })
    }
    setState({ loadingSubmit: true, image: true })

    HeaderAssistantApi.postSaveHeaderAssistant(values)
      .then((res) => {
        setState({ loadingSubmit: false })
        emptyData()
        getBirthdayAndCustom()
      })
      .catch((err) => {
        setState({ loadingSubmit: false })
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  const setDataSource = (props) => {
    setState({ data: props })
  }

  const handleTrash = (id) => {
    setState({ loading_delete: true, deleteKey: id })
    const newData = state.data.filter((item) => item.id !== id)
    setDataSource(newData)
    HeaderAssistantApi.getDeleteHeaderAssistant(id)
      .then((res) => {
        setState({ loading_delete: false, deleteKey: "" })
        getBirthdayAndCustom()
      })
      .catch((err) => {
        setState({ loading_delete: false, deleteKey: "" })
      })
  }

  const getDataId = (id) => {
    setState({ idEdit: id, loadingEdit: true })
    HeaderAssistantApi.getDataHeaderAssistant(id)
      .then((res) => {
        if (res.data.image_position === "left") {
          setValue("image_position", { value: "left", label: "Left" })
        } else {
          setValue("image_position", { value: "right", label: "Right" })
        }
        setValue("title", res.data.title)
        setValue("content", res.data.content)
        setValue("date_from", res.data.date_from)
        setValue("date_to", res.data.date_to)
        setState({
          date_from: res.data.date_from,
          date_to: res.data.date_to,
          image: res.data.image,
          loadingEdit: false
        })
      })
      .catch((err) => {
        setState({
          loadingEdit: false
        })
      })
  }

  const drawTable = () => {
    const columns = [
      {
        title: useFormatMessage("layout.header.header_assistant.fields.title"),
        dataIndex: "title",
        key: "title",
        editable: true,
        width: 200,
        render: (text, record) => {
          return <>{text}</>
        }
      },
      {
        title: useFormatMessage(
          "layout.header.header_assistant.fields.content"
        ),
        dataIndex: "content",
        key: "content",
        editable: true,
        width: 200,
        render: (text, record) => {
          return <>{text}</>
        }
      },
      {
        title: useFormatMessage("layout.header.header_assistant.fields.image"),
        dataIndex: "image",
        key: "image",
        editable: true,
        width: 200,
        render: (text, record) => {
          return (
            <>
              <Photo
                src={text}
                className="photo img-fluid"
                alt={text}
                width="100px"
              />
            </>
          )
        }
      },
      {
        title: useFormatMessage(
          "layout.header.header_assistant.fields.image_position"
        ),
        dataIndex: "image_position",
        key: "image_position",
        editable: true,
        width: 200,
        render: (text, record) => {
          return (
            <>
              <span style={{ textTransform: "capitalize" }}>{text}</span>
            </>
          )
        }
      },
      {
        title: useFormatMessage("layout.header.header_assistant.fields.date"),
        dataIndex: "date",
        key: "date",
        editable: true,
        width: 200,
        render: (text, record) => {
          return (
            <>
              {moment(text[0]).format("DD/MM/YYYY")} -{" "}
              {moment(text[1]).format("DD/MM/YYYY")}
            </>
          )
        }
      },
      {
        title: "",
        dataIndex: "6",
        key: "6",
        align: "center",
        width: 70,
        render: (id, record) => {
          return (
            <div className="d-flex justify-content-around align-items-center">
              <Button.Ripple
                onClick={() => getDataId(id)}
                type="button"
                outline
                color="primary"
                className="button-delete button-edit">
                <i className="far fa-edit"></i>
              </Button.Ripple>
              <Popconfirm
                title={useFormatMessage(
                  "layout.header.header_assistant.sure_to_delete"
                )}
                onConfirm={() => handleTrash(id)}>
                <Button.Ripple
                  color="danger"
                  outline
                  className="button-delete"
                  onClick={() => {}}
                  disabled={state.loading_delete}>
                  {state.loading_delete && state.deleteKey === id ? (
                    <Spinner size="sm" className="mr-50" />
                  ) : (
                    <i className="far fa-trash"></i>
                  )}
                </Button.Ripple>
              </Popconfirm>
            </div>
          )
        }
      }
    ]
    const data_table = [
      ..._.map(state.data, (value, index) => {
        return {
          key: index,
          title: value.title,
          content: value.content,
          image: value.image,
          image_position: value.image_position,
          date: [value.date_from, value.date_to],
          6: value.id
        }
      })
    ]

    return (
      <Table
        className=""
        loading={false}
        columns={columns}
        dataSource={data_table}
        pagination={true}
      />
    )
  }

  const changeDate = (val_moment, val_date) => {
    setValue("date_from", val_date[0])
    setValue("date_to", val_date[1])
    setState({
      date_from: val_date[0],
      date_to: val_date[1],
      isInvalidMultipleDate: false
    })
  }

  return (
    <Modal
      isOpen={modal}
      toggle={() => toggleModal()}
      className="modal-xl modal-notepad modal-header-assistant"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}
      /* backdrop={"static"} */
    >
      <ModalHeader toggle={() => toggleModal()}>
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
          {useFormatMessage("layout.header.header_assistant.title")}
        </span>
      </ModalHeader>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Row>
              <Col xs="6">
                <ErpInput
                  label={useFormatMessage(
                    "layout.header.header_assistant.fields.title"
                  )}
                  placeholder={useFormatMessage(
                    "layout.header.header_assistant.fields.title"
                  )}
                  name="title"
                  useForm={methods}
                  required={true}
                />
              </Col>
              <Col xs="6">
                <ErpInput
                  label={useFormatMessage(
                    "layout.header.header_assistant.fields.content"
                  )}
                  placeholder={useFormatMessage(
                    "layout.header.header_assistant.fields.content"
                  )}
                  name="content"
                  useForm={methods}
                  required={true}
                />
              </Col>
              <Col xs="6">
                <div className="form-group">
                  <label className="form-label">
                    {useFormatMessage(
                      "layout.header.header_assistant.fields.date"
                    )}
                  </label>
                  <RangePicker
                    className="form-control range-picker-edit"
                    placeholder={[
                      useFormatMessage(
                        "layout.header.header_assistant.fields.date_from"
                      ),
                      useFormatMessage(
                        "layout.header.header_assistant.fields.date_to"
                      )
                    ]}
                    separator={useFormatMessage(
                      "layout.header.header_assistant.fields.to"
                    )}
                    format="DD-MM-YYYY"
                    onChange={changeDate}
                    value={[
                      state.date_from !== ""
                        ? moment(state.date_from, "DD-MM-YYYY")
                        : "",
                      state.date_from !== ""
                        ? moment(state.date_to, "DD-MM-YYYY")
                        : ""
                    ]}
                  />
                  {state.isInvalidMultipleDate && (
                    <FormFeedback style={{ display: "block" }}>
                      {useFormatMessage("validate.required")}
                    </FormFeedback>
                  )}
                </div>
                <ErpSelect
                  label={useFormatMessage(
                    "layout.header.header_assistant.fields.image_position"
                  )}
                  placeholder={useFormatMessage(
                    "layout.header.header_assistant.fields.image_position"
                  )}
                  name="image_position"
                  useForm={methods}
                  options={[
                    { value: "right", label: "Right" },
                    { value: "left", label: "Left" }
                  ]}
                  defaultValue={{ value: "right", label: "Right" }}
                  isClearable={false}
                />
              </Col>
              <Col xs="6">
                <ErpImageUpload
                  name="image"
                  useForm={methods}
                  label={useFormatMessage(
                    "layout.header.header_assistant.fields.image"
                  )}
                  default={state.image}
                  loading={state.loadingEdit || state.loadingSubmit}
                />
              </Col>
              <Col xs="12">
                <Button
                  type="submit"
                  color="primary"
                  disabled={state.loadingSubmit}>
                  {state.loadingSubmit && (
                    <Spinner size="sm" className="mr-50" />
                  )}
                  {useFormatMessage("button.save")}
                </Button>
                {state.idEdit !== 0 && (
                  <Button
                    type="button"
                    color="flat-danger"
                    className="ms-1"
                    onClick={() => {
                      emptyData(true)
                    }}>
                    {useFormatMessage("button.cancel")}
                  </Button>
                )}
              </Col>
            </Row>
            <hr />

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
                  <Col xs="12">{drawTable()}</Col>
                </Row>
              </>
            )}
          </ModalBody>
        </form>
      </FormProvider>
    </Modal>
  )
}

export default HeaderAssistantModal
