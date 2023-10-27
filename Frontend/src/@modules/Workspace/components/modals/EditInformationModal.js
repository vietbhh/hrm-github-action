import { ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import "react-perfect-scrollbar/dist/css/styles.css"
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  Spinner
} from "reactstrap"
import AvatarBox from "../../../../@apps/components/common/AvatarBox"
import { workspaceApi } from "../../common/api"
const EditInformationModal = (props) => {
  const { modal, handleModal, infoWorkspace, loadData } = props
  const [state, setState] = useMergedState({
    loading: false,
    avatar: ""
  })

  const onSubmit = (values) => {
    setState({ loading: true })
    workspaceApi.update(infoWorkspace._id, values).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.save.success")
      })
      infoWorkspace.name = values.name
      infoWorkspace.introduction = values.introduction
      loadData()
      handleModal()
      setState({ loading: false })
    })
    if (state.avatar) {
      saveAvatar()
    }
  }

  const saveAvatar = (value) => {
    setState({ loading: true })
    const dataSave = { _id: infoWorkspace._id, avatar: state.avatar }
    workspaceApi.saveAvatar(dataSave).then((res) => {
      setState({ avatar: "", loading: false })
    })
  }
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, errors, control, register, reset, setValue } = methods

  return (
    <Modal
      isOpen={modal}
      style={{ top: "100px" }}
      toggle={() => handleModal()}
      backdrop={"static"}
      size="md"
      className="edit-information-workspace"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <FormProvider {...methods}>
        <ModalBody>
          <div className="d-flex justify-content-center align-items-center">
            <div className="avatar">
              <AvatarBox
                currentAvatar={infoWorkspace?.avatar}
                handleSave={(img) => {
                  setState({ avatar: img })
                  //saveAvatar(img)
                }}
              />
              <div class="ant-image-mask">
                <div class="ant-image-mask-info">
                  <span role="img" aria-label="eye" class="anticon anticon-eye">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M1.66675 7.71412C1.66675 6.21515 2.8819 5 4.38086 5V5C5.28834 5 6.13577 4.54647 6.63914 3.7914L6.66675 3.75C7.18737 2.96907 8.06383 2.5 9.00239 2.5H10.9978C11.9363 2.5 12.8128 2.96907 13.3334 3.75L13.361 3.7914C13.8644 4.54647 14.7118 5 15.6193 5V5C17.1183 5 18.3334 6.21515 18.3334 7.71412V13.5C18.3334 15.7091 16.5426 17.5 14.3334 17.5H5.66675C3.45761 17.5 1.66675 15.7091 1.66675 13.5V7.71412Z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <ellipse
                        cx="10.0001"
                        cy="10.8333"
                        rx="3.33333"
                        ry="3.33333"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            <div className="w-100 ms-1">
              <ErpInput
                nolabel
                defaultValue={infoWorkspace?.name}
                name="name"
                useForm={methods}
              />

              <ErpInput
                type="textarea"
                nolabel
                defaultValue={infoWorkspace?.description}
                rows={4}
                name="description"
                useForm={methods}
              />
            </div>
          </div>
        </ModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalFooter>
            <Button
              className="ms-auto mr-2"
              color="flat-secondary"
              onClick={() => handleModal(false)}>
              {useFormatMessage("button.cancel")}
            </Button>
            <Button
              type="submit"
              color="success"
              disabled={state.loading}
              className="btn-blue ">
              {state.loading && <Spinner size="sm" className="mr-50 mr-1" />}
              {useFormatMessage("button.save")}
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  )
}
export default EditInformationModal
