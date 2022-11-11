// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// ** Third Party Components
import classnames from 'classnames'

// ** Todo App Components
import Sidebar from './components/Sidebar'
import Tasks from './components/Tasks'
import TaskSidebar from './components/TaskSidebar'
// ** Api

// ** Store & Actions
import { useDispatch } from 'react-redux'
import { addTask, deleteTask, getTag, getTasks, reOrderTasks, selectTask, updateTask } from './common/api'
// ** Styles
import '@styles/react/apps/app-todo.scss'
import AddTagModal from './components/AddTagModal'
const TODO = () => {


  // ** States
  const [sort, setSort] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('')
  const [mainSidebar, setMainSidebar] = useState(false)
  const [openTaskSidebar, setOpenTaskSidebar] = useState(false)
  const [tabDelete, setTabDelete] = useState(false)
  const [openAddTag, setOpenAddTag] = useState(false)
  const [tab, setTab] = useState('')
  const [tasks, setTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState({});
  const [selectedTag, setSelectedTag] = useState({});
  // ** Store Vars
  const dispatch = useDispatch()

  // ** URL Params
  const paramsURL = useParams()

  const [params, setParamT] = useState({
    filter: filter || '',
    q: query || '',
    sortBy: sort || '',
    tag: paramsURL.tag || '',
    page: page || 1
  })

  // ** Function to handle Left sidebar & Task sidebar
  const handleMainSidebar = () => setMainSidebar(!mainSidebar)
  const handleTaskSidebar = e => {
    setSelectedTask(e)
    setOpenTaskSidebar(!openTaskSidebar)

  }
  const handleAddTag = e => {
    setOpenAddTag(!openAddTag)
  }
  const getParam = params => {
    setParamT(params);
  }


  const [tags, setTags] = useState([])

  useEffect(() => {
    getTag().then((res) => {
      setTags(res.data)
    });
  }, []);

  // ** Get Tasks on mount & based on dependency change
  useEffect(() => {
    getTasks(params).then((res) => {
      setTasks(res.data);
    });
  }, [params.filter, params.q, params.page, params.tag, params.sortBy])

  return (
    <Fragment>
      <Sidebar
        tags={tags}
        setParamT={setParamT}
        setTabDelete={setTabDelete}
        setTab={setTab}
        setSelectedTag={setSelectedTag}
        params={params}
        getTasks={getTasks}
        dispatch={dispatch}
        handleAddTag={handleAddTag}
        mainSidebar={mainSidebar}
        urlFilter={paramsURL.filter}
        setMainSidebar={setMainSidebar}
        handleTaskSidebar={handleTaskSidebar}
      />
      <div className='content-right'>
        <div className='content-wrapper'>
          <div className='content-body'>
            <div
              className={classnames('body-content-overlay', {
                show: mainSidebar === true
              })}
              onClick={handleMainSidebar}
            ></div>

            <Tasks
              tasks={tasks}
              sort={sort}
              query={query}
              tabDelete={tabDelete}
              tab={tab}
              setPage={setPage}
              page={page}
              params={params}
              tags={tags}
              setSort={setSort}
              setParamT={setParamT}
              setQuery={setQuery}
              dispatch={dispatch}
              getTasks={getTasks}
              setTasks={setTasks}
              paramsURL={paramsURL}
              updateTask={updateTask}
              selectTask={selectTask}
              reOrderTasks={reOrderTasks}
              handleMainSidebar={handleMainSidebar}
              handleTaskSidebar={handleTaskSidebar}
            />

            <TaskSidebar
              selectedTask={selectedTask}
              setTasks={setTasks}
              params={params}
              addTask={addTask}
              dispatch={dispatch}
              open={openTaskSidebar}
              updateTask={updateTask}
              selectTask={selectTask}
              getTasks={getTasks}
              deleteTask={deleteTask}
              handleTaskSidebar={handleTaskSidebar}
            />

            <AddTagModal
              open={openAddTag}
              getTag={getTag}
              setTags={setTags}
              selectedTag={selectedTag}
              handleAddTag={handleAddTag}
            />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default TODO
