import { ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { newsApi } from "@modules/News/common/api"
import { Fragment } from "react"
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

const EditNewCommentModal = (props) => {
  const {
    editModal,
    toggleEditModal,
    editCommentId,
    editCommentText,
    dataNewComments,
    setDataNewComments
  } = props
  const [state, setState] = useMergedState({
    loading: false
  })

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit } = methods

  const onSubmit = (values) => {
    values.id = editCommentId
    setState({ loading: true })
    newsApi
      .editNewComment(values)
      .then((res) => {
        setState({
          loading: false
        })
        const newData = [...dataNewComments]
        const index = newData.findIndex(
          (item) => item.id.toString() === editCommentId.toString()
        )
        if (index > -1) {
          newData[index]["comment"] = values.comment
          setDataNewComments(newData)
        }
        toggleEditModal()
      })
      .catch((err) => {
        setState({ loading: false })
      })
  }

  return (
    <Fragment>
      <Modal
        isOpen={editModal}
        toggle={() => toggleEditModal()}
        className="modal-md"
        backdrop={"static"}
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader toggle={() => toggleEditModal()}>
          {useFormatMessage("modules.news.edit_comment")}
        </ModalHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <Row className="mt-2">
                <Col sm={12} className="mb-25">
                  <ErpInput
                    type="textarea"
                    useForm={methods}
                    name="comment"
                    defaultValue={editCommentText}
                    nolabel
                    placeholder={useFormatMessage("modules.news.edit_comment")}
                    rows={3}
                    required={true}
                  />
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" color="primary" disabled={state.loading}>
                {state.loading && <Spinner size="sm" className="me-50" />}
                {useFormatMessage("button.save")}
              </Button>
              <Button
                color="flat-danger"
                onClick={() => {
                  toggleEditModal()
                }}>
                {useFormatMessage("button.cancel")}
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </Modal>
    </Fragment>
  )
}

export default EditNewCommentModal
