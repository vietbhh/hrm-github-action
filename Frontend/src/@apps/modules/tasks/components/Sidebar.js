// ** React Imports

// ** Third Party Components
import { useFormatMessage } from "@apps/utility/common"
import classnames from 'classnames'
import { Check, Edit, List, Mail, Plus, Star, Trash } from 'react-feather'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Button, ListGroup, ListGroupItem } from 'reactstrap'
const TodoSidebar = props => {
  // ** Props
  const { setTab, setSelectedTag, setTabDelete, tags, handleTaskSidebar, handleAddTag, setMainSidebar, mainSidebar, dispatch, getTasks, setParamT, params } = props

  // ** Functions To Handle List Item Filter
  const handleFilter = filter => {
    const ts = { ...params, filter, page: 1 }
    setParamT(ts)
    setTab(filter)
    if (filter === 'deleted') {
      setTabDelete(true)
    } else {
      setTabDelete(false)
    }

  }
  const handleTag = tag => {
    if (tag.target !== tag.currentTarget) return;
    const ts = { ...params, tag }
    setParamT(ts)
    // getTasks({ ...params, tag })
  }

  // ** Functions To Active List Item
  const handleActiveItem = value => {
    if ((params.filter && params.filter === value) || (params.tag && params.tag === value)) {
      return true
    } else {
      return false
    }
  }

  // ** Functions To Handle Add Task Click
  const handleAddClick = () => {
    handleTaskSidebar({})
    setMainSidebar()
  }
  const handleAddT = () => {
    setSelectedTag({})
    handleAddTag()
  }
  const handleEditTag = (tag, e) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedTag(tag)
    handleAddTag()

  }
  return (

    <div
      className={classnames('sidebar-left', {
        show: mainSidebar === true
      })}
    >
      <div className='sidebar-todo'>
        <div className='sidebar-content todo-sidebar'>
          <div className='todo-app-menu'>
            <div className='add-task'>
              <Button.Ripple color='primary' onClick={handleAddClick} block>
                {useFormatMessage("modules.tasks.buttons.addtask")}
              </Button.Ripple>
            </div>
            <PerfectScrollbar className='sidebar-menu-list' options={{ wheelPropagation: false }}>
              <ListGroup tag='div' className='list-group-filters'>
                <ListGroupItem
                  action
                  className='d-flex align-items-center '
                  active={params.filter === ''}
                  onClick={() => handleFilter('')}
                >
                  <Mail className='me-75' size={18} />
                  <span className='align-middle'>{useFormatMessage("modules.tasks.tabs.mytasks")}</span>
                </ListGroupItem>
                <ListGroupItem
                  className='d-flex align-items-center '
                  active={handleActiveItem('important')}
                  onClick={() => handleFilter('important')}
                  action
                >
                  <Star className='me-75' size={18} />
                  <span className='align-middle'>{useFormatMessage("modules.tasks.tabs.important")}</span>
                </ListGroupItem>
                <ListGroupItem
                  className='d-flex align-items-center '
                  active={handleActiveItem('completed')}
                  onClick={() => handleFilter('completed')}
                  action
                >
                  <Check className='me-75' size={18} />
                  <span className='align-middle'>{useFormatMessage("modules.tasks.tabs.completed")}</span>
                </ListGroupItem>

                <ListGroupItem
                  className='d-flex align-items-center '
                  active={handleActiveItem('added')}
                  onClick={() => handleFilter('added')}
                  action
                >
                  <List className='me-75' size={18} />
                  <span className='align-middle'>{useFormatMessage("modules.tasks.tabs.added")}</span>
                </ListGroupItem>

                <ListGroupItem
                  className='d-flex align-items-center '
                  active={handleActiveItem('deleted')}
                  onClick={() => handleFilter('deleted')}
                  action
                >
                  <Trash className='me-75' size={18} />
                  <span className='align-middle'>{useFormatMessage("modules.tasks.tabs.deleted")}</span>
                </ListGroupItem>
              </ListGroup>
              <div className='mt-3 px-2 d-flex justify-content-between'>
                <h6 className='section-label mb-1'>Tags</h6>
                <Plus className='cursor-pointer' onClick={handleAddT} size={14} />
              </div>
              <ListGroup className='list-group-labels'>

                {tags.map((field, key) => {
                  const id = field.id;
                  return (
                    <ListGroupItem
                      active={handleActiveItem(field.id)}
                      className='d-flex align-items-center item-tag'
                      onClick={() => handleTag(field.id)}
                      action
                    >
                      <span className='bullet bullet-sm bullet-primary me-1' style={{ backgroundColor: field.color }}></span>
                      <span className='align-middle'>{field.value}</span>
                      <Edit className='edit-tag' onClick={(e) => handleEditTag(field, e)} size={14} />
                    </ListGroupItem>
                  );
                })
                }

              </ListGroup>
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    </div >

  )
}

export default TodoSidebar
