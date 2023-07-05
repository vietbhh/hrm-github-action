import { EmptyContent } from "@apps/components/common/EmptyContent"
import { ErpCheckbox, ErpInput } from "@apps/components/common/ErpField"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import React, { useEffect, useRef } from "react"
import PerfectScrollbar from "react-perfect-scrollbar"
import "react-perfect-scrollbar/dist/css/styles.css"
import { Col, Row } from "reactstrap"
const EmployeesSelect = (props) => {
  const { handleSelect, dataDetail, member_selected, multipleSelect } = props
  const [state, setState] = useMergedState({
    loading: false,
    page: 1,
    search: "",
    members: [],
    departments: [],
    jobtitles: [],
    recordsTotal: [],
    perPage: 10,
    dataSelected: [],
    department_selected: [],
    typeAdd: "members"
  })
  const handleSelected = (key) => {
    let data = state.members

    if (state.typeAdd === "departments") {
      data = state.departments
    } else if (state.typeAdd === "jobtitles") {
      data = state.jobtitles
    }
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

  const renderMemberSelected = (data = []) => {
    return data.map((item, key) => {
      return (
        <Col sm={12} key={item.id}>
          <div
            className="box-member d-flex"
            onClick={() => handleSelected(key)}>
            <Avatar src={item.avatar} className="me-50" />
            <div className="title">{item.full_name}</div>
            <div className="ms-auto me-1">
              <i class="fa-regular fa-xmark"></i>
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
            className="box-member d-flex"
            onClick={() => handleSelected(key)}>
            <Avatar src={item.avatar} className="me-50" />
            <div className="title">{item.full_name}</div>
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

  const renderDepartment = (data = []) => {
    return data.map((item, key) => {
      const checked = state.department_selected.includes(item.id)
      return (
        <Col sm={12} key={key}>
          <div
            className="box-member d-flex"
            onClick={() => loadUserByDepartment(item.id, key)}>
            <i className="fa-regular fa-building me-1 ms-50"></i>
            <div className="title">{item.name}</div>
            <div className="ms-auto">
              <ErpCheckbox
                checked={checked}
                onChange={() => loadUserByDepartment(item.id, key)}
              />
            </div>
          </div>
        </Col>
      )
    })
  }
  const renderDepartmentSelected = (data = []) => {
    return data.map((item, key) => {
      return (
        <Col sm={12} key={item.id}>
          <div
            className="box-member d-flex"
            onClick={() => handleSelected(key)}>
            <i className="fa-regular fa-building me-1 ms-50"></i>
            <div className="title">{item.name}</div>
          </div>
        </Col>
      )
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
  const removeSelected = (key) => {}

  const loadData = (props) => {
    props.excepts = member_selected
    defaultModuleApi.getUsers(props).then((res) => {
      const members = state.members
      const concat = !props.search
        ? members.concat(res.data.results)
        : res.data.results
      setState({
        members: concat,
        page: res.data.page,
        recordsTotal: res.data.recordsTotal,
        perPage: res.data.recordsFiltered,
        ...props
      })
    })
  }

  const loadJobtitle = (props) => {
    defaultModuleApi.getList("job_titles", props).then((res) => {
      const job_titles = state.jobtitles
      const concat = !props.search
        ? job_titles.concat(res.data.results)
        : res.data.results
      setState({
        jobtitles: concat,
        page: res.data.page,
        recordsTotal: res.data.recordsTotal,
        perPage: res.data.recordsFiltered,
        ...props
      })
    })
  }

  const loadDepartment = (props) => {
    setState({ loading: true })
    defaultModuleApi.getList("departments", props).then((res) => {
      const departments = state.departments
      const concat = !props.search
        ? departments.concat(res.data.results)
        : res.data.results
      setState({
        departments: concat,
        page: res.data.page,
        recordsTotal: res.data.recordsTotal,
        perPage: res.data.recordsFiltered,
        loading: false,
        ...props
      })
    })
  }

  const loadUserByDepartment = (idDepartment) => {
    const department_selected = [...state.department_selected]
    if (department_selected.includes(idDepartment)) {
      const index = department_selected.findIndex((p) => p.id === idDepartment)
      department_selected.splice(index, 1)
      setState({
        department_selected: department_selected
      })
    } else {
      defaultModuleApi
        .getUsers({ perPage: 1000, filters: { department_id: idDepartment } })
        .then((res) => {
          const dataSelected = [...state.dataSelected]
          const concat = dataSelected.concat(res.data.results)
          setState({
            dataSelected: concat,
            department_selected: [...department_selected, idDepartment]
          })
        })
    }
  }
  console.log("ggggggggggg,", state.department_selected)
  const endScrollLoad = () => {
    const page = state.page + 1
    if (state.typeAdd === "members") {
      if (state.recordsTotal > state.members.length) {
        loadData({ page: page, search: state.search })
      }
    }
  }
  const endScrollDepartment = () => {
    const page = state.page + 1
    if (state.typeAdd === "departments") {
      if (state.recordsTotal > state.departments.length) {
        loadDepartment({ page: page, search: state.search })
      }
    }
  }

  const handleAdd = () => {
    const dataSelected = state.dataSelected
    handleSelect(state.dataSelected)
  }
  const typingTimeoutRef = useRef(null)

  const handleFilterText = (e) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      loadData({ search: e, page: 1 })
    }, 500)
  }

  useEffect(() => {
    if (state.typeAdd === "members") {
      loadData({ page: 1, search: state.search })
    }

    if (state.typeAdd === "jobtitles") {
      loadJobtitle({ page: 1 })
    }
    if (state.typeAdd === "departments") {
      loadDepartment({ page: 1 })
    }
  }, [state.typeAdd])
  useEffect(() => {
    handleSelect(state.dataSelected, state.typeAdd)
  }, [state.dataSelected])
  return (
    <>
      <Row>
        <Col sm={12} className="mb-2 filter">
          <span
            onClick={() => setState({ typeAdd: "members", recordsTotal: 0 })}
            className={`border rounded w-100 me-1 px-1 py-50  ${
              state.typeAdd === "members" ? "border-primary bg-primary " : ""
            }`}>
            Users
          </span>
          <span
            onClick={() =>
              setState({
                typeAdd: "departments",
                recordsTotal: 0,
                departments: []
              })
            }
            className={`border rounded w-100 me-1 px-1 py-50  ${
              state.typeAdd === "departments"
                ? "border-primary bg-primary "
                : ""
            }`}>
            Derpartment
          </span>
        </Col>
      </Row>
      <div className="d-flex ">
        <div className="content-select">
          <Row>
            <Col>
              <ErpInput
                nolabel
                placeholder="Search"
                className="search_invite"
                prepend={<i className="fa-regular fa-magnifying-glass"></i>}
                onChange={(e) => handleFilterText(e.target.value)}
              />
            </Col>
          </Row>
          {state.typeAdd === "members" && (
            <PerfectScrollbar
              onYReachEnd={endScrollLoad}
              style={{
                maxHeight: "400px",
                minHeight: "400px"
              }}>
              <Row className="w-100">{renderMember(state.members)}</Row>
            </PerfectScrollbar>
          )}
          {state.typeAdd === "departments" && (
            <PerfectScrollbar
              onYReachEnd={() => endScrollDepartment()}
              style={{
                height: "400px",
                minHeight: "400px"
              }}>
              <Row className="w-100">{renderDepartment(state.departments)}</Row>
            </PerfectScrollbar>
          )}
        </div>

        <div
          className={`content-selected ${
            !state.dataSelected.length && `d-flex align-items-center`
          }`}>
          {state.dataSelected.length === 0 && <EmptyContent />}
          {state.dataSelected.length > 0 && (
            <>
              <div className="mt-1 mb-2">
                {state.dataSelected.length}{" "}
                {useFormatMessage("modules.workspace.text.member")} selected
              </div>
              <PerfectScrollbar
                style={{
                  maxHeight: "400px",
                  minHeight: "400px"
                }}>
                <Row>{renderMemberSelected(state.dataSelected)}</Row>
              </PerfectScrollbar>
            </>
          )}
        </div>
      </div>
      <hr />
    </>
  )
}
export default EmployeesSelect
