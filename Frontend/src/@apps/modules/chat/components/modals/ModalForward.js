import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Search } from "react-feather"
import {
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Modal,
  ModalBody,
  ModalHeader,
  Row
} from "reactstrap"
import { renderAvatar } from "../../common/common"
import { useEffect } from "react"

const ModalForward = (props) => {
  const {
    modal,
    toggleModal,
    store,
    sendMessage,
    setDataForward,
    data_forward
  } = props
  const { groups, contacts, userProfile } = store
  const [state, setState] = useMergedState({
    loading: false,
    query: "",
    filteredChat: [],
    filteredContacts: [],
    loadingForward: {}
  })

  const handleForward = (dataChat) => {
    if (
      state.loadingForward[
        `${dataChat.type === "group" ? dataChat.id : dataChat.idEmployee}`
      ]
    ) {
      return
    }
    const _data_forward = { ...data_forward, contact_id: dataChat.idEmployee }
    const key = `${
      dataChat.type === "group" ? dataChat.id : dataChat.idEmployee
    }`
    setState({ loadingForward: { ...state.loadingForward, [key]: "success" } })
    sendMessage(dataChat.id, _data_forward.message, _data_forward)
  }

  const renderInfo = (item) => {
    return (
      <li key={`${item.type === "group" ? item.id : item.idEmployee}`}>
        {renderAvatar(item, "", "42", "42")}
        <div
          className="chat-info flex-grow-1"
          style={{ display: "flex", alignItems: "center" }}>
          <h5>{item.fullName}</h5>
        </div>
        <button className="btn-forward" onClick={() => handleForward(item)}>
          {state.loadingForward[
            `${item.type === "group" ? item.id : item.idEmployee}`
          ] ? (
            <i className="fa fa-check"></i>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none">
              <path
                d="M10.9463 10.6667L15.4243 6.00008L10.9463 1.33341"
                stroke="#14142B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.4243 6L10.7576 6C5.97118 6 2.09098 9.8802 2.09098 14.6667V14.6667"
                stroke="#14142B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </li>
    )
  }

  // ** Renders Chat
  const renderChats = (pin = false) => {
    if (groups && groups.length) {
      const index_search = state.filteredChat.findIndex(
        (item) =>
          (pin === true && item.pin === 1) || (pin === false && item.pin === 0)
      )
      if (state.query.length && index_search === -1) {
        return (
          <>
            <h4 className="chat-list-title">
              {useFormatMessage(
                `modules.chat.text.${pin ? "pinned" : "recent"}`
              )}
            </h4>
            <ul className="chat-users-list contact-list media-list">
              <li className="no-results show">
                <h6 className="mb-0">
                  {useFormatMessage("modules.chat.text.no_chats_found")}
                </h6>
              </li>
            </ul>
          </>
        )
      } else {
        const arrToMap =
          state.query.length && state.filteredChat.length
            ? state.filteredChat
            : groups
        const index = arrToMap.findIndex(
          (item) =>
            (pin === true && item.pin === 1) ||
            (pin === false && item.pin === 0)
        )

        return (
          index > -1 && (
            <>
              <h4 className="chat-list-title">
                {useFormatMessage(
                  `modules.chat.text.${pin ? "pinned" : "recent"}`
                )}
              </h4>
              <ul className="chat-users-list chat-list media-list">
                {_.map(
                  _.filter(arrToMap, (val) => {
                    return (
                      (pin === true && val.pin === 1) ||
                      (pin === false && val.pin === 0)
                    )
                  }),
                  (item) => {
                    return renderInfo(item)
                  }
                )}
              </ul>
            </>
          )
        )
      }
    } else {
      return null
    }
  }

  // ** Renders Contact
  const renderContacts = () => {
    if (contacts && contacts.length) {
      if (state.query.length && !state.filteredContacts.length) {
        return (
          <li className="no-results show">
            <h6 className="mb-0">
              {useFormatMessage("modules.chat.text.no_contacts_found")}
            </h6>
          </li>
        )
      } else {
        const arrToMap =
          state.query.length && state.filteredContacts.length
            ? state.filteredContacts
            : contacts
        return arrToMap.map((item) => {
          return renderInfo(item)
        })
      }
    } else {
      return null
    }
  }

  // ** Handles Filter
  const handleFilter = (e) => {
    setState({ query: e.target.value })
    const searchFilterFunction = (contact) =>
      contact.fullName.toLowerCase().includes(e.target.value.toLowerCase())
    const filteredChatsArr = groups.filter(searchFilterFunction)
    const filteredContactssArr = contacts.filter(searchFilterFunction)
    setState({ filteredChat: [...filteredChatsArr] })
    setState({ filteredContacts: [...filteredContactssArr] })
  }

  // ** effect
  useEffect(() => {
    if (modal === true) {
      setState({
        query: ""
      })
    }
  }, [modal])

  return (
    <Modal
      isOpen={modal}
      toggle={() => {
        toggleModal()
        setDataForward({})
        setState({
          loadingForward: {}
        })
      }}
      className="chat-modal-forward">
      <ModalHeader
        toggle={() => {
          toggleModal()
          setDataForward({})
          setState({
            loadingForward: {}
          })
        }}>
        {useFormatMessage("modules.chat.text.forward")}
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col sm="12">
            <div className="chat-fixed-search">
              <div className="d-flex align-items-center w-100">
                <InputGroup className="input-group-merge w-100 chat-input-search">
                  <InputGroupText className="round">
                    <Search className="text-muted" size={16} />
                  </InputGroupText>
                  <Input
                    value={state.query}
                    className="round"
                    placeholder="Search"
                    onChange={handleFilter}
                  />
                </InputGroup>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            {renderChats(true)}
            {renderChats()}

            {!_.isEmpty(state.query) && (
              <>
                <h4 className="chat-list-title">
                  {useFormatMessage("modules.chat.text.contacts")}
                </h4>

                <ul className="chat-users-list contact-list media-list">
                  {renderContacts()}
                </ul>
              </>
            )}
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  )
}

export default ModalForward
