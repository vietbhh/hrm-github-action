// ** React Imports
import { ErpUserSelect } from "@apps/components/common/ErpField"
import { useFormatMessage } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
// ** Assignee Avatars
import img1 from "@src/assets/images/portrait/small/avatar-s-3.jpg"
// ** Styles Imports
import "@styles/react/libs/editor/editor.scss"
import "@styles/react/libs/flatpickr/flatpickr.scss"
import "@styles/react/libs/react-select/_react-select.scss"
// ** Utils
import { isObjEmpty } from "@utils"
// ** Third Party Components
import classnames from "classnames"
import { ContentState, EditorState } from "draft-js"
import { Fragment, useState } from "react"
import { Star, Trash, X } from "react-feather"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { Button, Modal, ModalBody } from "reactstrap"

// ** Function to capitalize the first letter of string
const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1)

// ** Modal Header
const ModalHeader = (props) => {
  // ** Props
  const {
    children,
    selectedTask,
    handleTaskSidebar,
    setDeleted,
    deleted,
    important,
    setImportant,
    deleteTask,
    getTasks,
    setTasks,
    params,
    dispatch
  } = props
  // ** Function to delete task
  const handleDeleteTask = () => {
    setDeleted(!deleted)
    dispatch(deleteTask(selectedTask.id))
    getTasks(params).then((res) => {
      setTasks(res.data)
    })
    handleTaskSidebar({})
  }
  return (
    <div className="modal-header d-flex align-items-center justify-content-between mb-1">
      <h5 className="modal-title">{children}</h5>
      <div className="todo-item-action d-flex align-items-center">
        {!isObjEmpty(selectedTask) ? (
          <Trash
            className="cursor-pointer mt-25"
            size={16}
            onClick={() => handleDeleteTask()}
          />
        ) : null}
        <span className="todo-item-favorite cursor-pointer mx-75">
          <Star
            size={16}
            onClick={() => setImportant(!important)}
            className={classnames({
              "text-warning": important === true
            })}
          />
        </span>
        <X
          className="fw-normal mt-25"
          size={16}
          onClick={handleTaskSidebar}
        />
      </div>
    </div>
  )
}

const TaskSidebar = (props) => {
  // ** Props
  const {
    open,
    handleTaskSidebar,
    selectedTask,
    dispatch,
    params,
    getTasks,
    setTasks,
    selectTask,
    addTask,
    deleteTask
  } = props
  // ** Users
  const [title, setTitle] = useState(""),
    [assignee, setAssignee] = useState({
      value: "pheobe",
      label: "Pheobe Buffay",
      img: img1
    }),
    [tags, setTags] = useState([]),
    [desc, setDesc] = useState(EditorState.createEmpty()),
    [completed, setCompleted] = useState(false),
    [important, setImportant] = useState(false),
    [deleted, setDeleted] = useState(false),
    [dueDate, setDueDate] = useState(new Date())

  // ** Assignee Select Options
  const arrFields = useSelector((state) => state.app.modules["tasks"].metas)

  const [assigneeOptions, setAssigneeOptions] = useState([])

  const methods = useForm({
    mode: "onSubmit"
  })

  const { handleSubmit } = methods

  // ** Custom Assignee Component

  // ** Returns sidebar title
  const handleSidebarTitle = () => {
    if (!isObjEmpty(selectedTask)) {
      return (
        <Button.Ripple
          outline
          size="sm"
          onClick={() => setCompleted(!completed)}
          color={completed ? "success" : "secondary"}>
          {completed ? "Completed" : "Mark Complete"}
        </Button.Ripple>
      )
    } else {
      return useFormatMessage("modules.tasks.buttons.addtask")
    }
  }
  // ** Function to run when sidebar opens
  const handleSidebarOpened = () => {
    if (!isObjEmpty(selectedTask)) {
      setTitle(selectedTask.title)
      setCompleted(selectedTask.status === "completed" ? true : "")
      setImportant(selectedTask.important === "1" ? true : "")
      setAssignee([
        {
          value: selectedTask.assignee.fullName,
          label: selectedTask.assignee.fullName,
          img: selectedTask.assignee.avatar
        }
      ])
      setDueDate(selectedTask.dueDate)
      if (typeof selectedTask.description === "string") {
        setDesc(
          EditorState.createWithContent(
            ContentState.createFromText(selectedTask.description)
          )
        )
      } else {
        const obj = selectedTask.description._immutable.currentContent.blockMap
        const property = Object.keys(obj).map((val) => val)

        setDesc(
          EditorState.createWithContent(
            ContentState.createFromText(obj[property].text)
          )
        )
      }

      if (selectedTask.tags.length) {
        const tags = []
        selectedTask.tags.map((tag) => {
          tags.push({ value: tag.value, label: capitalize(tag.label) })
        })
        setTags(tags)
      }
    }
  }

  // ** Function to run when sidebar closes
  const handleSidebarClosed = () => {
    setTags([])
    setDesc("")
    setTitle("")
    setAssignee({ value: "pheobe", label: "Pheobe Buffay", img: img1 })
    setCompleted(false)
    setImportant(false)
    setDueDate(new Date())
    dispatch(selectTask({}))
  }

  // ** Function to reset fileds

  // ** Renders Footer Buttons
  const renderFooterButtons = () => {
    const newTaskTag = []
    //  && assignee.label === selectedTask.assignee.label

    if (tags.length) {
      tags.map((tag) => newTaskTag.push(tag.value))
    }

    if (!isObjEmpty(selectedTask)) {
      return (
        <Fragment>
          <Button
            color="primary"
            type="submit"
            className="update-btn update-todo-item me-1">
            {useFormatMessage("modules.tasks.buttons.update")}
          </Button>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <Button
            type="submit"
            color="primary"
            //disabled={!title.length}
            className="add-todo-item me-1">
            {useFormatMessage("modules.tasks.buttons.add")}
          </Button>
          <Button color="secondary" onClick={handleTaskSidebar} outline>
            {useFormatMessage("modules.tasks.buttons.cancel")}
          </Button>
        </Fragment>
      )
    }
  }
  const onSubmit = (e) => {
    const data = {
      ...e,
      important: important,
      isCompleted: completed,
      id: selectedTask.id
    }
    addTask(data).then(() => {
      getTasks(params).then((res) => {
        setTasks(res.data)
      })
    })
    handleTaskSidebar({})
  }

  return (
    <Modal
      isOpen={open}
      toggle={handleTaskSidebar}
      className="sidebar-lg"
      contentClassName=""
      onOpened={handleSidebarOpened}
      onClosed={handleSidebarClosed}
      modalClassName="modal-slide-in sidebar-todo-modal">
      <ModalHeader
        selectedTask={selectedTask}
        deleted={deleted}
        getTasks={getTasks}
        params={params}
        setTasks={setTasks}
        dispatch={dispatch}
        important={important}
        deleteTask={deleteTask}
        setDeleted={setDeleted}
        setImportant={setImportant}
        handleTaskSidebar={handleTaskSidebar}>
        {handleSidebarTitle()}
      </ModalHeader>
      <ModalBody className="flex-grow-1 pb-sm-0 pb-3">
        <form className="todo-modal" onSubmit={handleSubmit(onSubmit)}>
          {Object.keys(arrFields).map((field, key) => {
            const option = []
            const fieldProps = {
              module: "tasks",
              fieldData: arrFields[field],
              option,
              useForm: methods
            }
            if (field === "assignee") {
              return (
                <Fragment key={key}>
                  <ErpUserSelect
                    label="Assignee"
                    id="assignee"
                    name="assignee"
                    defaultValue={selectedTask[field]}
                    {...fieldProps}
                  />
                </Fragment>
              )
            } else {
              return (
                <Fragment key={key}>
                  <FieldHandle
                    label={useFormatMessage("modules.tasks.fields." + field)}
                    updateData={selectedTask[field]}
                    {...fieldProps}
                  />
                </Fragment>
              )
            }
          })}
          <div className="my-1">{renderFooterButtons()}</div>
        </form>
      </ModalBody>
    </Modal>
  )
}

export default TaskSidebar
