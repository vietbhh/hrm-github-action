// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
// ** Styles
import { Button } from "reactstrap"
// ** Components
import { ErpInput } from "@apps/components/common/ErpField"

const WorkspaceFilter = (props) => {
  const {
    // ** props
    filter,
    // ** methods
    setFilter
  } = props

  const [state, setState] = useMergedState({
    showInput: false
  })

  const navigate = useNavigate()

  const handleClickCreate = () => {
    navigate("/workspace/create")
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
          className="me-75 cursor-pointer animate__animated animate__fadeInUp"
          onClick={() => handleClickSearchButton()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            width="21px"
            height="22px"
            viewBox="0 0 21 22"
            enableBackground="new 0 0 21 22"
            xmlSpace="preserve">
            {" "}
            <image
              id="image0"
              width="21"
              height="22"
              x="0"
              y="0"
              href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAWCAMAAAAYXScKAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAflBMVEUAAAAwQFAwQk0yQk8y Q08wQFAwQk4xQ08xQk8yQk4yQlAzQ1AyQk0xQ04yQ08wRVAwSFAyQ08wQk0xQ08zQ0wwQFAyQk0w Q0wxQ04wRFAzRE8yQk4yQk40QEwwRFAyQk4wQlAwQEowQEwyQlAzQ04yRFAwQlAwQ1AyQ0/////J pM/cAAAAKHRSTlMAEHCfryB/79/AcFBgoN8wIO9gv1AwcFCwQM+QgEB/j3AwQGCwgGBQV9iPlwAA AAFiS0dEKcq3hSQAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnBhoLJCcvxnjtAAAAnklE QVQY05WQ2xKCIBRFQdAwFTla2d0uVvv/vzBHhGCmF/fLgcVi9sxhbHF4IqRI0phlK0wRAU8VkK+L stJQtacK2l6MBDm7gTZOkGi9uvk1EKy8hQ6KK+ym2WEf0BIimjE94BjQE85xwVx9cc+th1dfPcr9 fLwBhRNqgmrujD/acRWZ/2e0XQ6oCjF7DgTKX5y9I+zzIXR/cD0YtiRfWXgM4kQkNZcAAAAldEVY dGRhdGU6Y3JlYXRlADIwMjMtMDYtMjZUMDk6MzY6MzkrMDI6MDCN4q+XAAAAJXRFWHRkYXRlOm1v ZGlmeQAyMDIzLTA2LTI2VDA5OjM2OjM5KzAyOjAw/L8XKwAAAABJRU5ErkJggg=="
            />
          </svg>
        </span>
      )
    }

    return (
      <div className="animate__animated animate__fadeInUp">
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
    <div className="d-flex align-items-center">
      <Fragment>{renderSearch()}</Fragment>
      <Button.Ripple
        color="primary"
        className="ms-2 common-border"
        onClick={() => handleClickCreate()}>
        <i className="fas fa-plus me-50" />
        {useFormatMessage("modules.workspace.buttons.create_group")}
      </Button.Ripple>
    </div>
  )
}

export default WorkspaceFilter
