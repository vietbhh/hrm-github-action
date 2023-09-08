import { EmptyContent } from "@apps/components/common/EmptyContent"
import { ErpCheckbox, ErpInput } from "@apps/components/common/ErpField"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import React, { useEffect, useRef } from "react"
import PerfectScrollbar from "react-perfect-scrollbar"
import "react-perfect-scrollbar/dist/css/styles.css"
import { Col, Row } from "reactstrap"

const findKeyByID = (arr = [], id) => {
  const index = arr.findIndex((p) => p.id === id)
  return index
}
const checkMediaWidth = (x) => {
  if (x.matches) {
    // If media query matches
    return true
  }

  return false
}
const EmployeesSelect = (props) => {
  const { handleSelect, dataDetail, member_selected, select_department } = props
  const [state, setState] = useMergedState({
    loading: true,
    page: 1,
    search: "",
    members: [],
    departments: [],
    jobtitles: [],
    recordsTotal: [],
    perPage: 10,
    dataSelected: [],
    department_selected: [],
    typeAdd: "members",
    viewSelected: false
  })
  const checkMobile = checkMediaWidth(
    window.matchMedia("(max-width: 767.98px)")
  )

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
  const handleUnSelected = (key) => {
    const dataSelected = [...state.dataSelected]
    dataSelected.splice(key, 1)
    setState({ dataSelected: dataSelected })
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

  const renderDepartment = (data = []) => {
    return data.map((item, key) => {
      const department_selected = [...state.department_selected]
      const checked = department_selected.some((x) => x["id"] === item.id)
      return (
        <Col sm={12} key={key}>
          <div
            className="box-member d-flex"
            onClick={() => loadUserByDepartment(item)}>
            <i className="fa-regular fa-building me-1 ms-50"></i>
            <div className="title">{item.name}</div>
            <div className="ms-auto">
              <ErpCheckbox
                checked={checked}
                onChange={() => loadUserByDepartment(item)}
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
            onClick={() => loadUserByDepartment(item)}>
            <i className="fa-regular fa-building me-1 ms-50"></i>
            <div className="title">{item.name}</div>
          </div>
        </Col>
      )
    })
  }

  const checkExistSelected = (id) => {
    const indexID = findKeyByID(state.dataSelected, id)
    return indexID
  }

  const loadData = (props) => {
    setState({
      loading: true
    })
    const members = state.members
    const selected = member_selected.map((e) => e["id_user"])
    defaultModuleApi.getUsers(props).then((res) => {
      const results = res.data.results
      const test =
        selected.length > 0
          ? results.filter((x) => !selected.includes(x.id))
          : results
      // concat = !props.search ? members.concat(test) : test
      let concat =
        props.search && res.data.page > 1 ? members.concat(test) : test
      if (!props.search) {
        concat = members.concat(test)
      }
      const recordsTotal =
        props.search && res.data.recordsTotal <= results.length
          ? test.length
          : res.data.recordsTotal
      setState({
        members: concat,
        page: res.data.page,
        recordsTotal: recordsTotal,
        perPage: state.perPage,
        loading: false,
        hasMore: res.data.hasMore,
        ...props
      })
      //.data.recordsFiltered
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
  const loadUserByDepartment = (item) => {
    const idDepartment = item?.id
    const department_selected = [...state.department_selected]
    const arrDeparment_selected = department_selected.map((e) => e["id"])

    if (select_department) {
      if (arrDeparment_selected.includes(idDepartment)) {
        const index = department_selected.findIndex(
          (p) => p.id === idDepartment
        )
        department_selected.splice(index, 1)
      } else {
        department_selected.push(item)
      }

      setState({
        department_selected: department_selected
      })
    } else {
      const checkExist = department_selected.some(
        (x) => x["id"] === idDepartment
      )
      if (checkExist) {
        const index = department_selected.findIndex(
          (p) => p.id === idDepartment
        )

        const arrUser = department_selected[index].users
        const dataSelected = [...state.dataSelected]
        arrUser.map((item, key) => {
          dataSelected.splice(findKeyByID(dataSelected, item.id), 1)
        })

        department_selected.splice(index, 1)
        setState({
          department_selected: department_selected,
          dataSelected: dataSelected
        })
      } else {
        defaultModuleApi
          .getUsers({ perPage: 1000, filters: { department_id: idDepartment } })
          .then((res) => {
            const dataSelected = [...state.dataSelected]
            const concat = dataSelected.concat(res.data.results)
            setState({
              dataSelected: concat,
              department_selected: [
                ...department_selected,
                { id: idDepartment, users: res.data.results }
              ]
            })
          })
      }
    }
  }
  const endScrollLoad = () => {
    const page = state.page + 1
    if (state.typeAdd === "members") {
      if (
        state.hasMore &&
        state.recordsTotal > state.members.length &&
        state.members.length <= state.page * state.perPage &&
        !state.loading
      ) {
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

    if (state.typeAdd === "departments") {
      loadDepartment({ page: 1 })
    }
  }, [state.typeAdd])

  useEffect(() => {
    if (select_department) {
      handleSelect({
        users: state.dataSelected,
        derpartment: state.department_selected
      })
    } else {
      handleSelect(state.dataSelected, state.typeAdd)
    }
  }, [state.dataSelected, state.department_selected])

  return (
    <>
      <Row>
        <Col sm={12} className="mb-2 filter">
          <div className="d-flex">
            <span
              style={{ cursor: "pointer" }}
              onClick={() =>
                setState({ typeAdd: "members", recordsTotal: 0, members: [] })
              }
              className={`border common-button d-block rounded w-100 me-50 px-1 py-50  ${
                state.typeAdd === "members" ? "border-primary bg-primary " : ""
              }`}>
              {useFormatMessage("modules.workspace.text.users")}
            </span>
            <span
              style={{ cursor: "pointer" }}
              onClick={() =>
                setState({
                  typeAdd: "departments",
                  recordsTotal: 0,
                  departments: []
                })
              }
              className={`border common-button d-block rounded w-100 me-1 px-1 py-50  ${
                state.typeAdd === "departments"
                  ? "border-primary bg-primary "
                  : ""
              }`}>
              {useFormatMessage("modules.workspace.text.derpartment")}
            </span>
          </div>
        </Col>
      </Row>
      <div className="d-flex ">
        {!state.viewSelected && (
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
              <>
                <Row className="w-100">
                  <Col sm={12} className="mb-50 d-flex align-items-center">
                    <span className="suggest-text">
                      {useFormatMessage("modules.workspace.text.suggested")}
                    </span>

                    <div
                      onClick={() => setState({ viewSelected: true })}
                      className="ms-auto"
                      style={{
                        fontSize: "12px",
                        color: "var(--secondary-500, #2F9BFA)"
                      }}>
                      See all selected ({state.dataSelected.length})
                    </div>
                  </Col>
                </Row>
                <PerfectScrollbar
                  onYReachEnd={endScrollLoad}
                  style={{
                    height: "400px",
                    minHeight: "400px"
                  }}>
                  <Row className="w-100">{renderMember(state.members)}</Row>
                </PerfectScrollbar>
              </>
            )}
            {state.typeAdd === "departments" && (
              <PerfectScrollbar
                onYReachEnd={() => endScrollDepartment()}
                style={{
                  height: "400px",
                  minHeight: "400px"
                }}>
                <Row className="w-100">
                  {renderDepartment(state.departments)}
                </Row>
              </PerfectScrollbar>
            )}
          </div>
        )}

        {(!checkMobile || state.viewSelected) && (
          <div
            className={`content-selected ${
              !state.dataSelected.length && `d-flex align-items-center`
            }`}>
            {state.dataSelected.length === 0 &&
              state.department_selected.length === 0 && (
                <div className="p-1">
                  <EmptyContent />
                </div>
              )}
            {(state.dataSelected.length > 0 ||
              state.department_selected.length > 0) && (
              <>
                <div className="d-flex p-1 pb-0 mb-50 member-selected-text">
                  {useFormatMessage(
                    "modules.workspace.display.member_selected",
                    {
                      number: state.dataSelected.length
                    }
                  )}

                  <div
                    onClick={() => setState({ viewSelected: false })}
                    className="ms-auto"
                    style={{
                      fontSize: "12px",
                      color: "var(--secondary-500, #2F9BFA)"
                    }}>
                    Back to select
                  </div>
                </div>

                <PerfectScrollbar
                  style={{
                    maxHeight: "440px",
                    minHeight: "440px"
                  }}>
                  <Row>
                    {renderMemberSelected(state.dataSelected)}
                    {select_department && (
                      <>
                        <div className="mt-1 mb-2">
                          {useFormatMessage(
                            "modules.workspace.display.derpartment_selected",
                            {
                              number: state.department_selected.length
                            }
                          )}
                        </div>
                        {renderDepartmentSelected(state.department_selected)}
                      </>
                    )}
                  </Row>
                </PerfectScrollbar>
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}
export default EmployeesSelect
