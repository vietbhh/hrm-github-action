// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Fragment, useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { object2QueryString } from "@apps/utility/handleData"
// ** Styles
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
// ** Components
import { ErpInput } from "@apps/components/common/ErpField"

const SearchPostModal = (props) => {
  const {
    // ** props
    modal,
    searchTextProp,
    // ** methods
    handleModal,
    setSearchTextFeed
  } = props

  const [state, setState] = useState({
    searchText: searchTextProp,
    isError: false
  })

  const debounceSearch = useRef(
    _.debounce((nextValue) => {
      setState({
        searchText: nextValue
      })
    }, import.meta.env.VITE_APP_DEBOUNCE_INPUT_DELAY)
  ).current

  const handleSearchVal = (e) => {
    const value = e.target.value
    debounceSearch(value.toLowerCase())
  }

  const handleSearchPost = (e) => {
    if (e.key === "Enter") {
      if (state.searchText.trim().length === 0) {
        setState({
          isError: true 
        })

        return false
      } 

      setState({
        isError: false 
      })

      const params = new URLSearchParams(window.location.search)

      const paramsObj = Array.from(params.keys()).reduce(
        (acc, val) => ({ ...acc, [val]: params.get(val) }),
        {}
      )

      paramsObj["search"] = state.searchText
      window.history.replaceState(
        null,
        "",
        object2QueryString(paramsObj).replace("&", "?")
      )
      setSearchTextFeed(state.searchText)

      handleModal()
    }
  }

  // ** render
  const renderError = (error = "empty") => {
    if (state.isError === false || state.isError === undefined) {
      return ""
    }

    return (
      <small className="m-1 ms-25 text-danger">
        {useFormatMessage(`modules.workspace.text.search_post_error.${error}`)}
      </small>
    )
  }

  return (
    <Modal
      isOpen={modal}
      style={{ top: "100px" }}
      toggle={() => handleModal()}
      backdrop={"static"}
      size="sm"
      className="create-workgroup-modal"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>
        {useFormatMessage("modules.workspace.display.search_post")}
      </ModalHeader>
      <ModalBody>
        <div className="w-100">
          <ErpInput
            name="search"
            nolabel={true}
            formGroupClass="mb-0"
            autoFocus
            placeholder={useFormatMessage("modules.workspace.text.search_post")}
            defaultValue={searchTextProp}
            onChange={(e) => handleSearchVal(e)}
            onKeyDown={(e) => handleSearchPost(e)}
            append={
              <i
                className="far fa-search text-success"
                style={{ cursor: "pointer" }}
              />
            }
          />
          <Fragment>{renderError()}</Fragment>
        </div>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  )
}

export default SearchPostModal
