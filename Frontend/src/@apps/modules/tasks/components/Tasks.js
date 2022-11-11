// ** React Imports
// ** Custom Components
//import Avatar from '@components/avatar'
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage } from "@apps/utility/common"
// ** Third Party Components
import classnames from "classnames"
import { debounce } from "lodash"
import { useRef } from "react"
import { ArrowLeft, Menu, MoreVertical, Search } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
import { Link } from "react-router-dom"
import { ReactSortable } from "react-sortablejs"
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  InputGroup, InputGroupText,
  UncontrolledDropdown
} from "reactstrap"

const Tasks = (props) => {
  // ** Props
  const {
    page,
    setPage,
    tab,
    tabDelete,
    query,
    tasks,
    tags,
    params,
    setSort,
    dispatch,
    getTasks,
    setTasks,
    setQuery,
    setParamT,
    updateTask,
    selectTask,
    reOrderTasks,
    handleTaskSidebar,
    handleMainSidebar
  } = props

  // ** Function to selectTask on click
  const handleTaskClick = (obj) => {
    dispatch(selectTask(obj))
    handleTaskSidebar(obj)
  }

  // ** Returns avatar color based on task tag
  const resolveAvatarVariant = (tags) => {
    if (tags.includes("high")) return "light-primary"
    if (tags.includes("medium")) return "light-warning"
    if (tags.includes("low")) return "light-success"
    if (tags.includes("update")) return "light-danger"
    if (tags.includes("team")) return "light-info"
    return "light-primary"
  }

  // ** Renders task tags
  const renderTags = (arr) => {
    const badgeColor = {
      Team: "light-primary",
      Low: "light-success",
      Medium: "light-warning",
      High: "light-danger",
      Update: "light-info"
    }

    return arr.map((item) => {
      const color = { value: "" }
      tags.map((tag) => {
        if (tag.id === item.value) {
          color.value = tag.color
        }
      })
      return (
        <Badge
          className="text-capitalize bg-tag"
          key={item.label}
          style={{ color: color.value }}
          pill
        >
          {item.label}
        </Badge>
      )
    })
  }
  const fileToDataUri = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        resolve(event.target.result)
      }
      reader.readAsDataURL(file)
    })
  // ** Renders Avatar
  const renderAvatar = (obj) => {
    const item = obj.ownerurl
    if (tab === "added") {
      return <Avatar src={obj.assigneeurl} imgHeight="32" imgWidth="32" />
    } else if (item.avatar !== "") {
      return <Avatar src={obj.ownerurl} imgHeight="32" imgWidth="32" />
    } else {
      return (
        <Avatar
          color={resolveAvatarVariant(obj.tags)}
          content={item.fullName}
          initials
        />
      )
    }
  }
  const testup = (e) => {
    updateTask(e).then(() => {
      getTasks(params).then((res) => {
        setTasks(res.data)
      })
    })
  }

  const handlePagination = (e) => {
    e.scrollTop = e.scrollTop - 50
    if (tasks.length >= 15) {
      setParamT({ ...params, page: params.page + 1 })
    }
  }

  const handleUndelete = (data, e) => {
    e.stopPropagation()
    e.preventDefault()
    data.trash = "0"
    data.isCompleted = "false"
    if (data.status === "completed") data.isCompleted = "true"
    updateTask(data).then(() => {
      getTasks(params).then((res) => {
        setTasks(res.data)
      })
    })
  }
  const renderTasks = () => {
    return (
      <PerfectScrollbar
        className="list-group todo-task-list-wrapper"
        onYReachEnd={debounce(handlePagination, 200)}
      >
        {tasks.length ? (
          <ReactSortable
            tag="ul"
            list={tasks}
            handle=".drag-icon"
            className="todo-task-list media-list"
            setList={(newState) => dispatch(reOrderTasks(newState))}
          >
            {tasks.map((item) => {
              return (
                <li
                  key={item.id}
                  onClick={() => handleTaskClick(item)}
                  className={classnames("todo-item", {
                    completed: item.isCompleted
                  })}
                >
                  <div className="todo-title-wrapper">
                    <div className="todo-title-area">
                      {tabDelete ? (
                        <ArrowLeft
                          className="back-delete"
                          onClick={(e) => handleUndelete(item, e)}
                          size={16}
                          style={{ marginRight: "10px", cursor: "pointer" }}
                        />
                      ) : null}
                      <Input
                        type="checkbox"
                        className="custom-control-Primary"
                        id={item.title}
                        label=""
                        onChange={(e) =>
                          testup({ ...item, isCompleted: e.target.checked })
                        }
                        checked={item.status === "completed"}
                      />
                      <span className="todo-title">{item.title}</span>
                    </div>
                    <div className="todo-item-action mt-lg-0 mt-50">
                      {item.tags.length ? (
                        <div className="badge-wrapper me-1">
                          {renderTags(item.tags)}
                        </div>
                      ) : null}
                      {item.date ? (
                        <small className="text-nowrap text-muted me-1">
                          {new Date(item.date).toLocaleString("default", {
                            month: "short"
                          })}{" "}
                          {new Date(item.date)
                            .getDate()
                            .toString()
                            .padStart(2, "0")}
                        </small>
                      ) : null}
                      {item.assignee ? renderAvatar(item) : null}
                    </div>
                  </div>
                </li>
              )
            })}
          </ReactSortable>
        ) : (
          <div className="no-results show">
            <h5>{useFormatMessage("modules.tasks.fields.no_item")}</h5>
          </div>
        )}
      </PerfectScrollbar>
    )
  }

  // ** Function to getTasks based on search query

  const typingTimeoutRef = useRef(null)
  const handleFilter = (e) => {
    const value = e.target.value
    setQuery(value)

    if (!setParamT) return

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setParamT({ ...params, q: value })
    }, 500)
  }

  // ** Function to getTasks based on sort
  const handleSort = (e, val) => {
    e.preventDefault()
    setParamT({ ...params, sortBy: val })
    setSort(val)
  }

  const onScroll = () => {}
  return (
    <div className="todo-app-list">
      <div className="app-fixed-search d-flex align-items-center">
        <div
          className="sidebar-toggle cursor-pointer d-block d-lg-none ms-1"
          onClick={handleMainSidebar}
        >
          <Menu size={21} />
        </div>
        <div className="d-flex align-content-center justify-content-between w-100">
          <InputGroup className="input-group-merge">
            <InputGroupText>
              <Search className="text-muted" size={14} />
            </InputGroupText>
            <Input
              placeholder={useFormatMessage("modules.tasks.fields.search")}
              value={query}
              onChange={handleFilter}
            />
          </InputGroup>
        </div>
        <UncontrolledDropdown>
          <DropdownToggle
            className="hide-arrow me-1"
            tag="a"
            href="/"
            onClick={(e) => e.preventDefault()}
          >
            <MoreVertical className="text-body" size={16} />
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem
              tag={Link}
              to="/"
              onClick={(e) => handleSort(e, "asc")}
            >
              Sort A-Z
            </DropdownItem>
            <DropdownItem
              tag={Link}
              to="/"
              onClick={(e) => handleSort(e, "desc")}
            >
              Sort Z-A
            </DropdownItem>
            <DropdownItem
              tag={Link}
              to="/"
              onClick={(e) => handleSort(e, "date")}
            >
              Sort Due Date
            </DropdownItem>
            <DropdownItem tag={Link} to="/" onClick={(e) => handleSort(e, "")}>
              Reset Sort
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
      {renderTasks()}
    </div>
  )
}

export default Tasks
