import {
  ErpInput,
  ErpUserSelect,
  ErpCheckbox
} from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { useEffect, useRef } from "react"
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
import { defaultModuleApi } from "@apps/utility/moduleApi"
import Avatar from "@apps/modules/download/pages/Avatar"
import PerfectScrollbar from "react-perfect-scrollbar"
import { EmptyContent } from "@apps/components/common/EmptyContent"

const ModalNewGroup = (props) => {
  const {
    modal,
    toggleModal,
    handleAddNewGroup,
    setActive,
    setActiveFullName,
    userId,
    setDataUnseenDetail
  } = props
  const [state, setState] = useMergedState({
    loading: false,
    dataSelected : []
  })

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, setValue } = methods

  const onSubmit = async (values) => {
    if (state.dataSelected.length <= 1) {
      notification.showWarning({
        text: useFormatMessage("modules.chat.text.warning_add_group_member")
      })
      return
    }
    const member = [userId] 
    setState({ loading: true })
    const unseen = []
    _.forEach(state.dataSelected, (val) => {
      member.push(val.id)
      unseen.push(val.id)
    })
    const timestamp = Date.now()
    const docData = {
      last_message: useFormatMessage("modules.chat.text.create_new_group"),
      last_user: userId,
      name: values.group_name,
      timestamp: timestamp,
      type: "group",
      user: member,
      admin: [userId],
      creator: userId,
      new: 0,
      unseen: unseen,
      unseen_detail: setDataUnseenDetail("add", userId, timestamp, [], member),
      des: "Never settle!",
      is_system: false
    }
    await handleAddNewGroup(docData).then((res) => {
      setTimeout(() => {
        const newGroupId = res.id
        setActive(newGroupId)
        setActiveFullName("")
        window.history.replaceState(null, "", `/chat/${newGroupId}`)
        toggleModal()
        setState({ loading: false, dataSelected: [] })
      }, 500)
    })
  }

  const closeModal = () => {
    toggleModal()
    setState({  dataSelected: [] })
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
  },[])
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
              imgHeight="40"
              imgWidth="40"
            />
            <div className="d-flex flex-column justify-content-center">
              <p className="mb-0 title">{item.full_name}</p>
              <span className="sub-email">{item?.username}</span>
            </div>
            <div className="ms-auto">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="vuesax/linear/close-circle">
              <g id="close-circle">
              <path id="Vector" d="M6 18L18 6" stroke="#696760" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path id="Vector_2" d="M18 18L6 6" stroke="#696760" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              </g>
            </svg>
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
        <Col sm={12} key={key} style={{"paddingRight": "0"}}>
          <div
            className="box-member d-flex align-items-center"
            onClick={() => handleSelected(key)}>
            <Avatar
              src={item.avatar}
              className="me-75"
              imgHeight="40"
              imgWidth="40"
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
      <ModalHeader toggle={closeModal}>
        {useFormatMessage("modules.chat.text.create_new_group")}
      </ModalHeader>
      <hr/>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Row>
              <Col sm="12">
                <ErpInput
                  name="group_name"
                  label={useFormatMessage("modules.chat.text.group_name")}
                  required
                  useForm={methods}
                  placeholder = "Enter group name"
                />
              </Col>
            </Row>
            <Row>
              <span className="text-group-member">{useFormatMessage("modules.chat.text.group_member")}</span>
            </Row>
            <Row>
              <Col sm="6">
                <ErpInput
                  nolabel
                  placeholder="Find members"
                  className="search_invite"
                  prepend={<i className="fa-regular fa-magnifying-glass"></i>}
                  onChange={(e) => handleFilterText(e.target.value)}
                />
                <PerfectScrollbar
                  style={{
                    height: "400px",
                    minHeight: "400px"
                  }}>
                  <Row className="w-100">{renderMember(state.user)}</Row>
                </PerfectScrollbar>
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
                          <Col sm = {12} style={{"padding": "1rem 2rem",}} className="total_member_selected">
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

          <ModalFooter>
            <Button.Ripple
              color="primary"
              type="submit"
              disabled={state.loading}>
              {state.loading && <Spinner size="sm" className="me-50" />}
              {useFormatMessage("modules.chat.button.new_group")}
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

export default ModalNewGroup
