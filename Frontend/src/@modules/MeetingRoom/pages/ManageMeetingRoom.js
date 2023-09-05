// ** React Imports
import { useMergedState, useFormatMessage } from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { Fragment, useEffect } from "react"
// ** Styles
import { Button } from "reactstrap"
// ** Components
import TableMeetingRoom from "../components/ManageMeetingRoom/TableMeetingRoom"
import CreateMeetingRoomModal from "../components/modals/CreateMeetingRoomModal"

const ManageMeetingRoom = () => {
  const [state, setState] = useMergedState({
    loading: true,
    totalData: 0,
    filter: {
      isPaginate: true,
      page: 1,
      perPage: 10
    },
    listMeetingRoom: [],
    modal: false,
    idEdit: 0
  })

  const setFilter = (obj) => {
    setState({
      filter: {
        ...state.filter,
        ...obj
      }
    })
  }

  const setListMeetingRoom = (data, type = "reset") => {
    if (type === "reset") {
      setState({
        listMeetingRoom: data
      })
    } else if (type === "remove") {
      const newList = [...state.listMeetingRoom].filter((item) => {
        return parseInt(item.id) !== parseInt(data.id)
      })

      setState({
        listMeetingRoom: newList
      })
    } else if (type === "update") {
      const newList = [...state.listMeetingRoom].map((item) => {
        if (parseInt(item.id) === parseInt(data.id)) {
          return {
            ...item,
            ...data
          }
        }

        return item
      })

      setState({
        listMeetingRoom: newList
      })
    }
  }

  const setIdEdit = (id) => {
    setState({
      idEdit: id
    })
  }

  const toggleModal = (status = "") => {
    setState({
      modal: status === "" ? !state.modal : status
    })
  }

  const loadData = () => {
    setState({
      loading: true
    })

    defaultModuleApi
      .getList("meeting_room", {
        ...state.filter
      })
      .then((res) => {
        setState({
          listMeetingRoom: res.data.results,
          totalData: res.data.recordsTotal,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          listMeetingRoom: [],
          loading: false
        })
      })
  }

  const handleClickAdd = (id = 0) => {
    setIdEdit(id)
    toggleModal(true)
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [state.filter])

  // ** render
  const renderModal = () => {
    if (state.modal === false) {
      return ""
    }

    return (
      <CreateMeetingRoomModal
        modal={state.modal}
        idEdit={state.idEdit}
        filter={state.filter}
        setFilter={setFilter}
        handleModal={toggleModal}
        loadData={loadData}
      />
    )
  }

  return (
    <Fragment>
      <div className="manage-meeting-room-page">
        <div className="div-container">
          <div className="mb-1 header-section">
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="mb-0 title">
                {useFormatMessage("modules.meeting_room.title.manage")}
              </h2>
              <Button.Ripple color="primary" onClick={() => handleClickAdd()}>
                {useFormatMessage("modules.meeting_room.buttons.create")}
              </Button.Ripple>
            </div>
          </div>
          <div className="body-section">
            <TableMeetingRoom
              loading={state.loading}
              listMeetingRoom={state.listMeetingRoom}
              totalData={state.totalData}
              filter={state.filter}
              setListMeetingRoom={setListMeetingRoom}
              setFilter={setFilter}
              handleClickAdd={handleClickAdd}
              loadData={loadData}
            />
          </div>
        </div>
      </div>
      <Fragment>{renderModal()}</Fragment>
    </Fragment>
  )
}

export default ManageMeetingRoom
