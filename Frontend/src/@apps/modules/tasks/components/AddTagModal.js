import { axiosApi } from "@apps/utility/api"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { serialize } from "@apps/utility/handleData"
import notification from "@apps/utility/notification"
import React, { Fragment, useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner
} from "reactstrap"

const AddTagModal = (props) => {
  const { selectedTag, getTag, setTags, handleAddTag, open } = props
  const [state, setState] = useMergedState({
    loading: false
  })
  const Field = useSelector((state) => state.app.modules["tasks_tags"].metas)

  const onSubmit = (values) => {
    setState({ loading: true })
    const data = serialize(_.cloneDeep(values))
    data.append("id", selectedTag.id)
    axiosApi
      .post("/task/addtag", data)
      .then(() => {
        notification.showSuccess(useFormatMessage("notification.save.success"))
        getTag().then((res) => {
          setTags(res.data)
        })
        handleAddTag()
        setState({ loading: false })
      })
      .catch(() => {
        //props.submitError();
        setState({ loading: false })
        notification.showError(useFormatMessage("notification.save.error"))
      })
  }

  const methods = useForm({
    mode: "onSubmit"
  })

  const { handleSubmit } = useForm()
  const tagFieldProps = {
    module: "tasks_tags",
    fieldData: Field["value"],
    placeholder: "New ...",
    useForm: methods
  }

  const colorFieldProps = {
    module: "tasks_tags",
    fieldData: Field["color"],
    useForm: methods
  }
  return (
    <Modal
      isOpen={open}
      toggle={handleAddTag}
      className="new-profile-modal"
      backdrop={"static"}
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}
    >
      <ModalHeader toggle={handleAddTag}>
        {useFormatMessage("modules.tags.fields.newtag")}
      </ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody>
          <Fragment>
            <FieldHandle
              nolabel
              defaultValue={selectedTag.value}
              {...tagFieldProps}
            />
          </Fragment>
          <Fragment>
            <FieldHandle
              id="color"
              name="color"
              type="color"
              nolabel
              defaultValue={selectedTag.color}
              {...colorFieldProps}
            />
          </Fragment>
        </ModalBody>
        <ModalFooter>
          <Fragment>
            <Button type="submit" color="primary" disabled={state.loading}>
              {state.loading && <Spinner size="sm" className="me-50" />}
              {useFormatMessage("button.add")}
            </Button>
            <Button color="secondary" onClick={handleAddTag} outline>
              {useFormatMessage("modules.tasks.buttons.cancel")}
            </Button>
          </Fragment>
        </ModalFooter>
      </form>
    </Modal>
  )
}
export default AddTagModal
