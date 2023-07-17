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

const EmployeesSelect = (props) => {
  const { handleSelect, dataDetail, member_selected, select_department } = props
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
  console.log("state", state)
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
            className="box-member d-flex"
            onClick={() => handleUnSelected(key)}>
            <Avatar src={item.avatar} className="me-50" />
            <div>
              <div className="title">{item.full_name}</div>
              <span className="sub-email">{item?.email}</span>
            </div>
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
            <div>
              <div className="title">{item.full_name}</div>
              <span className="sub-email">{item?.email}</span>
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
            onClick={() => loadUserByDepartment(item, key)}>
            <i className="fa-regular fa-building me-1 ms-50"></i>
            <div className="title">{item.name}</div>
            <div className="ms-auto">
              <ErpCheckbox
                checked={checked}
                onChange={() => loadUserByDepartment(item, key)}
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

  const checkExistSelected = (id) => {
    const indexID = findKeyByID(state.dataSelected, id)
    return indexID
  }

  console.log("member_selected", member_selected)

  const loadData = (props) => {
    //  props.excepts = member_selected
    defaultModuleApi.getUsers(props).then((res) => {
      const members = state.members

      const selected = member_selected.map((e) => e["id_user"])
      const results = res.data.results
      const test = results.filter((x) => selected.includes(x.id))

      console.log("test", test)
      const concat = !props.search ? members.concat(test) : test

      setState({
        members: concat,
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

  const loadUserByDepartment = (item) => {
    const idDepartment = item?.id
    const department_selected = [...state.department_selected]
    if (!select_department) {
      if (department_selected.includes(idDepartment)) {
        const index = department_selected.findIndex(
          (p) => p.id === idDepartment
        )
        department_selected.splice(index, 1)
      } else {
        department_selected.push(item)
      }
      console.log("department_selected 1", department_selected)
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
      if (state.recordsTotal > state.members.length && !state.loading) {
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
    handleSelect(state.dataSelected, state.typeAdd)
  }, [state.dataSelected])

  return (
    <>
      <Row>
        <Col sm={12} className="mb-2 filter">
          <span
            style={{ cursor: "pointer" }}
            onClick={() => setState({ typeAdd: "members", recordsTotal: 0 })}
            className={`border rounded w-100 me-1 px-1 py-50  ${
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
            className={`border rounded w-100 me-1 px-1 py-50  ${
              state.typeAdd === "departments"
                ? "border-primary bg-primary "
                : ""
            }`}>
            {useFormatMessage("modules.workspace.text.derpartment")}
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
            <>
              <Row className="w-100">
                <Col sm={12} className="mb-50">
                  {useFormatMessage("modules.workspace.text.suggested")}
                </Col>
              </Row>
              <PerfectScrollbar
                onYReachEnd={endScrollLoad}
                style={{
                  maxHeight: "400px",
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
                {useFormatMessage("modules.workspace.display.member_selected", {
                  number: state.dataSelected.length
                })}
              </div>
              <PerfectScrollbar
                style={{
                  maxHeight: "400px",
                  minHeight: "400px"
                }}>
                <Row>
                  {renderMemberSelected(state.dataSelected)}
                  <div className="mt-1 mb-2">
                    {useFormatMessage(
                      "modules.workspace.display.derpartment_selected",
                      {
                        number: state.department_selected.length
                      }
                    )}
                  </div>
                  {renderDepartmentSelected(state.department_selected)}
                </Row>
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
