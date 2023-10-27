// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { feedApi } from "@modules/Feed/common/api"
// ** Styles
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
// ** Components
import notification from "@apps/utility/notification"
import { useEffect } from "react"
import MemberSelect from "../../../../components/hrm/MemberSelect/MemberSelect"
import Avatar from "@apps/modules/download/pages/Avatar"
const PostApprovalSettingModal = (props) => {
  const { modal, handleModal, statusButtonSettingModal } = props

  const [state, setState] = useMergedState({
    loading: false,
    dataUser: [],
    valueAttendees: [],
    dataAttendees: []
  })
  const loadData = () => {
    feedApi
      .loadUserApprovePost()
      .then((res) => {
        setState({
          dataUser: res.data.userData,
          dataAttendees: res.data.userSelected,
          loading: false
        })
        statusButtonSettingModal()
      })
      .catch((err) => {
        setState({
          dataUser: [],
          loading: false
        })
      })
  }
  const uniqueElements = state.dataUser.filter((item2) => {
    return !state.dataAttendees.some((item1) => item1.id === item2.id && item1.users_id === item2.users_id);
  });

  const handleSave = () => {
    const dataAttendees = [...state.dataAttendees]
    const arrID = dataAttendees.map((e) => e.id)
    feedApi
      .saveSettingPostApprove({ users: arrID })
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        handleModal()
      })
      .catch((err) => {
        console.log("error", err)
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  const handleAddAttendees = () => {
    const dataAttendees = [...state.dataAttendees]
    _.forEach(state.valueAttendees, (item) => {
      const checkExist = dataAttendees.find((e) => e.id === item.id)
      if (!checkExist) {
        dataAttendees.push(item)
      }
    })
    setState({ dataAttendees: dataAttendees, valueAttendees: [] })
  }
  const handleRemoveAttendees = (index) => {
    const dataAttendees = [...state.dataAttendees]
    dataAttendees.splice(index, 1)
    setState({ dataAttendees: dataAttendees })
  }
  // ** render
  useEffect(() => {
    loadData()
  }, [])
  return (
    <Modal
      isOpen={modal}
      style={{ top: "100px" }}
      toggle={() => handleModal()}
      className="feed modal-create-post modal-create-event modal-announcement post-approve-setting-modal"
      size="lg"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader>
        <span className="text-title">
          {useFormatMessage("modules.feed.post.text.approve_setting")}
        </span>
        <div className="div-btn-close" onClick={() => handleModal()}>
          <i className="fa-regular fa-xmark"></i>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="div-attendees">
          <div className="div-attendees-input div-input-btn">
            <label title="Attendees" className="form-label"></label>
            <div className="div-input-btn-select">  
            <MemberSelect
                noLabel={true}
                placeholder={useFormatMessage(
                  "modules.feed.create_event.text.attendees_placeholder"
                )}
                classNameProps="select-attendees"
                isMulti={true}
                options={uniqueElements}
                value={state.valueAttendees}
                selectDepartment={false}
                selectAll={false}
                handleOnchange={(e) => {
                  setState({ valueAttendees: e })
                }}
              />
              <button
                type="button"
                className="btn-input"
                style={{ top: "30px" }}
                onClick={() => handleAddAttendees()}>
                {useFormatMessage("button.add")}
              </button>
            </div>
          </div>
          <div className="div-attendees-show">
            {_.map(state.dataAttendees, (item, index) => {
              return (
                <div key={index} className="div-attendees-show__item">
                  <Avatar src={item.avatar} />
                  <span className="item__text">{item.label}</span>
                  <div
                    className="item__div-remove"
                    onClick={() => handleRemoveAttendees(index)}>
                    <i className="fa-solid fa-xmark"></i>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="d-flex justify-content-center">
        <Button.Ripple color="primary" onClick={() => handleSave()}>
          {useFormatMessage("button.save")}
        </Button.Ripple>
      </ModalFooter>
    </Modal>
  )
}

export default PostApprovalSettingModal
