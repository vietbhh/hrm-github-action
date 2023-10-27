import {
  ErpInput,
  ErpUserSelect,
  ErpCheckbox
} from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FormProvider, useForm } from "react-hook-form"
import { useEffect, useRef } from "react"
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
import { defaultModuleApi } from "@apps/utility/moduleApi"
import Avatar from "@apps/modules/download/pages/Avatar"
import PerfectScrollbar from "react-perfect-scrollbar"
import { EmptyContent } from "@apps/components/common/EmptyContent"

const ModalAddMember = (props) => {
  const {
    modal,
    toggleModal,
    handleUpdateGroup,
    userId,
    settingUser,
    setDataUnseenDetail,
    selectedGroup,
    sendMessage
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    dataSelected: []
  })

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit } = methods
  const closeModalAddMember = () => {
    setState({loading:false, dataSelected:[]})
    toggleModal()
  }

  const onSubmit = async (values) => {
    console.log(values)
    setState({ loading: true })
    const member = selectedGroup.user
    const unseen = selectedGroup.chat.unseen
    const member_add = []
    const memberName = []
    _.forEach(state.dataSelected, (val) => {
      member.push(val.id)
      unseen.push(val.id)
      member_add.push(val.id)
      memberName.push(val.full_name)
    })
    const timestamp = Date.now()
    const messageAddMember = `${settingUser.full_name} ${useFormatMessage(
      "modules.chat.text.add_member_to_group_chat",
      {
        name: memberName.join(", ")
      }
    )}`
    
    const docData = {
      last_message: messageAddMember,
      last_user: userId,
      timestamp: timestamp,
      user: member,
      unseen: unseen,
      unseen_detail: setDataUnseenDetail(
        "add_member",
        userId,
        timestamp,
        selectedGroup.chat.unseen_detail,
        member,
        member_add
      )
    }
    await handleUpdateGroup(selectedGroup.id, docData).then((res) => {
      sendMessage(selectedGroup.id, messageAddMember, {
        type: "notification"
      })
      setTimeout(() => {
        toggleModal()
        setState({ loading: false, dataSelected: [] })
      }, 500)
    })
  }

  const findKeyByID = (arr = [], id) => {
    const index = arr.findIndex((p) => p.id === id)
    return index
  }
  const checkExistSelected = (id) => {
    const indexID = findKeyByID(state.dataSelected, id)
    return indexID
  }
  const handleSelected = (key) => {
    let data = state.user

    const dataSelected = [...state.dataSelected]

    const checkExist = checkExistSelected(data[key].id)
    if (checkExist >= 0) {
      dataSelected.splice(checkExist, 1)
      setState({ dataSelected: dataSelected })
    } else {
      const concat = dataSelected.concat(data[key])
      setState({ dataSelected: concat })
    }
  }

  const handleUnSelected = (key) => {
    const dataSelected = [...state.dataSelected]
    dataSelected.splice(key, 1)
    setState({ dataSelected: dataSelected })
  }

  const loadUser = async(props) => {
    const props_send = { ...props }
    props_send.filters = { account_status: "activated" }
    props_send.excepts = 
      selectedGroup.user
        ? [userId, ...selectedGroup.user]
        : [userId]
    setState({
      loading: true
    })
    await defaultModuleApi.getUsers(props_send).then((res) => {
      setState({
        user : res.data.results,
        totalUser: res.data.recordsTotal,
        loading: false
      })
    })
  }

  useEffect(()=>{
    loadUser()
  },[selectedGroup])
  const typingTimeoutRef = useRef(null)
  const handleFilterText = (value) =>{
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      loadUser({ search: value, page: 1 })
    }, 500)
  } 

  const renderMemberSelected = (data = []) => {
    return data.map((item, key) => {
      return (
        <Col sm={12} key={item.id}>
          <div
            className="box-member d-flex align-items-center ps-1 pe-1"
            onClick={() => handleUnSelected(key)}>
            <Avatar
              src={item.avatar}
              className="me-75"
              imgHeight="36"
              imgWidth="36"
            />
            <div className="d-flex flex-column justify-content-center">
              <p className="mb-0 title">{item.full_name}</p>
              <span className="sub-email">{item?.username}</span>
            </div>
            <div className="ms-auto">
              <i className="fa-regular fa-xmark"></i>
            </div>
          </div>
        </Col>
      )
    })
  }

  const renderMember = (data = []) => {
    return data.map((item, key) => {
      const checked = checkExistSelected(item.id) >= 0 ?? true
      return (
        <Col sm={12} key={key}>
          <div
            className="box-member d-flex align-items-center"
            onClick={() => handleSelected(key)}>
            <Avatar
              src={item.avatar}
              className="me-75"
              imgHeight="36"
              imgWidth="36"
            />
            <div className="d-flex flex-column justify-content-center">
              <p className="mb-0 title">{item.full_name}</p>
              <span className="sub-email">{item?.username}</span>
            </div>
            <div className="ms-auto">
              <ErpCheckbox
                checked={checked}
                onChange={() => handleSelected(key)}
              />
            </div>
          </div>
        </Col>
      )
    })
  }

  return (
    <Modal
      isOpen={modal}
      toggle={toggleModal}
      className="modal-dialog-centered chat-application">
      <ModalHeader toggle={closeModalAddMember}>
        {useFormatMessage("modules.chat.text.add_member")}
      </ModalHeader>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-add-member">
          <ModalBody>
          <Row>
              <Col sm="6">
                <ErpInput
                  nolabel
                  placeholder="Find members"
                  className="search_invite"
                  prepend={<i className="fa-regular fa-magnifying-glass" imgHeight = "24" imgWidth = "24"></i>}
                  onChange={(e) => handleFilterText(e.target.value)}
                />
                <div className="select_member">
                  <PerfectScrollbar
                    style={{
                      height: "400px",
                      minHeight: "400px"
                    }}>
                    <Row className="w-100">{renderMember(state.user)}</Row>
                  </PerfectScrollbar>
                </div>
              </Col>
              <Col sm = "6" >
                <div className="member_selected">
                  <PerfectScrollbar
                    style={{
                      height: "450px",
                      minHeight: "450px"
                    }}>
                    {state.dataSelected.length == 0 &&
                      <div className="p-1">
                        <EmptyContent />
                      </div>
                    }
                        
                    <Row className="w-100">
                        {state.dataSelected.length > 0 &&
                          <Col sm = {12} style={{"padding": "1rem 2rem"}}>
                              {useFormatMessage(
                                "modules.chat.text.user_selected",
                                {
                                  number: state.dataSelected.length
                                }
                              )}
                          </Col>
                        }
                        {renderMemberSelected(state.dataSelected)}
                    </Row>
                  </PerfectScrollbar>
                </div>
              </Col>
            </Row>
          </ModalBody>
          </div>

          <ModalFooter>
            <Button.Ripple
              color="primary"
              type="submit"
              disabled={state.loading}>
              {state.loading && <Spinner size="sm" className="me-50" />}
              {useFormatMessage("button.add")}
            </Button.Ripple>
            {/* <Button.Ripple
              color="flat-danger"
              onClick={() => {
                toggleModal()
              }}>
              {useFormatMessage("button.cancel")}
            </Button.Ripple> */}
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  )
}

export default ModalAddMember
