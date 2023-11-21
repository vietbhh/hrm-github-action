// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment, useContext, useEffect, useRef } from "react"
// ** Styles
import { Button } from "reactstrap"
// ** Components
import { ErpInput } from "@apps/components/common/ErpField"
import { AbilityContext } from "utility/context/Can"

const WorkspaceFilter = (props) => {
  const {
    // ** props
    filter,
    // ** methods
    setFilter,
    toggleModal
  } = props
  const ability = useContext(AbilityContext)
  const createWorkgroup = ability.can("create_workgroup", "workspace")
  const [state, setState] = useMergedState({
    showInput: false
  })

  const handleClickCreate = () => {
    toggleModal()
  }

  const handleClickSearchButton = () => {
    setState({
      showInput: !state.showInput
    })
  }

  const handleClickCancelSearch = () => {
    setFilter({
      text: ""
    })
    handleClickSearchButton()
  }

  const debounceSearch = useRef(
    _.debounce((nextValue) => {
      setFilter({
        text: nextValue
      })
    }, import.meta.env.VITE_APP_DEBOUNCE_INPUT_DELAY)
  ).current

  const handleSearchVal = (e) => {
    const value = e.target.value
    debounceSearch(value.toLowerCase())
  }

  // ** render
  const renderSearch = () => {
    if (state.showInput === false) {
      return (
        <span
          className="search cursor-pointer animate__animated animate__fadeInUp"
          onClick={() => handleClickSearchButton()}>
          <svg
            width={40}
            height={40}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19.5 29C24.7467 29 29 24.7467 29 19.5C29 14.2533 24.7467 10 19.5 10C14.2533 10 10 14.2533 10 19.5C10 24.7467 14.2533 29 19.5 29Z"
              stroke="#696760"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M30 30L28 28"
              stroke="#696760"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )
    }

    return (
      <div className="animate__animated animate__fadeInUp me-1">
        <ErpInput
          name="search"
          nolabel={true}
          formGroupClass="mb-0"
          append={
            <i
              className="fas fa-times-circle cursor-pointer"
              onClick={() => handleClickCancelSearch()}
            />
          }
          autoFocus
          placeholder="Search..."
          onChange={(e) => handleSearchVal(e)}
        />
      </div>
    )
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between header">
        <div>
          <p className="title text-color-title">
            {useFormatMessage("modules.workspace.title.workgroup")}
            <span>.</span>
          </p>
        </div>
        <div>
          <div className="d-flex align-items-center">
            <div className="workspace-search-desktop">
              <Fragment>{renderSearch()}</Fragment>
            </div>
            {createWorkgroup && (
              <Button.Ripple
                className="common-border btn-create-workgroup"
                onClick={() => handleClickCreate()}>
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 12H18"
                    stroke="#696760"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 18V6"
                    stroke="#292D32"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span>
                  {useFormatMessage("modules.workspace.buttons.create_group")}
                </span>
              </Button.Ripple>
            )}
          </div>
        </div>
      </div>
      <div className="workspace-search-mobile">
        <ErpInput
          name="search"
          nolabel={true}
          formGroupClass="mb-0"
          append={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none">
              <path
                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                stroke="#696760"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 22L20 20"
                stroke="#696760"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          autoFocus
          placeholder="Search Group"
          onChange={(e) => handleSearchVal(e)}
        />
      </div>
    </>
  )
}

export default WorkspaceFilter
