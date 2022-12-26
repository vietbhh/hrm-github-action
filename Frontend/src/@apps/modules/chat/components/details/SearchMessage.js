import { Fragment, useEffect, useRef } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { X } from "react-feather"
import { ErpInput } from "@apps/components/common/ErpField"
import { FormProvider, useForm } from "react-hook-form"
import PerfectScrollbar from "react-perfect-scrollbar"
import { InputGroup, InputGroupText, Spinner } from "reactstrap"
import notification from "@apps/utility/notification"
import { formatTime, highlightText } from "../../common/common"
import ReactHtmlParser from "react-html-parser"

const SearchMessage = (props) => {
  const {
    handleSearchMessage,
    selectedUser,
    setSearchMessageHighlight,
    scrollToMessage
  } = props

  // ** State
  const [state, setState] = useMergedState({
    show_search_message: true,
    show_search_message_result: false,
    show_search_message_x: false,
    loading_search_message: false,
    arr_search_message_result: [],
    search_message_groupId: null
  })

  useEffect(() => {
    if (state.search_message_groupId !== selectedUser.chat.id) {
      setValue("_searchMessage", "")
      setState({
        show_search_message: false,
        show_search_message_result: false,
        arr_search_message_result: []
      })
      setSearchMessageHighlight(0, "")
    }
  }, [selectedUser])

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, setValue, getValues, watch } = methods

  // ** ref search message
  const refInputSearchMessage = useRef(null)
  const refInputSearchMessageGroupFirst = useRef(null)
  const refInputSearchMessageGroupLast = useRef(null)
  const refDivSearchMessageResult = useRef(null)
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        refInputSearchMessage.current &&
        !refInputSearchMessage.current.contains(event.target) &&
        refInputSearchMessageGroupFirst.current &&
        !refInputSearchMessageGroupFirst.current.contains(event.target) &&
        refDivSearchMessageResult.current &&
        !refDivSearchMessageResult.current.contains(event.target) &&
        (state.show_search_message_x === false ||
          (state.show_search_message_x === true &&
            refInputSearchMessageGroupLast.current &&
            !refInputSearchMessageGroupLast.current.contains(event.target))) &&
        getValues("_searchMessage") === ""
      ) {
        setState({ show_search_message: false })
      }

      if (
        refInputSearchMessage.current &&
        !refInputSearchMessage.current.contains(event.target) &&
        refInputSearchMessageGroupFirst.current &&
        !refInputSearchMessageGroupFirst.current.contains(event.target) &&
        refDivSearchMessageResult.current &&
        !refDivSearchMessageResult.current.contains(event.target) &&
        (state.show_search_message_x === false ||
          (state.show_search_message_x === true &&
            refInputSearchMessageGroupLast.current &&
            !refInputSearchMessageGroupLast.current.contains(event.target)))
      ) {
        setState({ show_search_message_result: false })
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.addEventListener("mousedown", handleClickOutside)
    }
  }, [
    refInputSearchMessage,
    refInputSearchMessageGroupFirst,
    refInputSearchMessageGroupLast,
    refDivSearchMessageResult
  ])

  // ** listen esc
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        setState({ show_search_message_result: false })
      }
    }
    window.addEventListener("keydown", handleEsc)

    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [])

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "_searchMessage") {
        if (value._searchMessage === "") {
          setState({ show_search_message_x: false })
        } else {
          setState({ show_search_message_x: true })
        }

        setState({
          show_search_message_result: false,
          arr_search_message_result: []
        })
        setSearchMessageHighlight(0, "")
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  const submitSearchMessage = (values) => {
    if (values._searchMessage.length === 0) {
      return
    }
    if (values._searchMessage.length < 3) {
      notification.showWarning({
        text: useFormatMessage("modules.chat.text.search_error_character")
      })
      return
    }
    setState({ loading_search_message: true })

    const dataSearch = []
    handleSearchMessage(selectedUser.chat.id, values._searchMessage).then(
      (res) => {
        res.forEach((doc_mess) => {
          const docData = doc_mess.data()
          dataSearch.push({
            message: docData.message,
            timestamp: docData.timestamp
          })
        })

        setState({
          show_search_message_result: true,
          arr_search_message_result: dataSearch,
          loading_search_message: false
        })
      }
    )
  }

  const renderTextSearchResult = (message, textSearch) => {
    const index = message.indexOf(textSearch)
    const l = 20
    const stringFirst = index - l > 0 ? "..." : ""
    const _message = stringFirst + message.substring(index - l)

    return _message
  }

  return (
    <Fragment>
      {!state.show_search_message && (
        <svg
          onClick={() => {
            setState({
              show_search_message: true,
              search_message_groupId: selectedUser.chat.id
            })
            setTimeout(() => {
              refInputSearchMessage.current.focus()
            }, 200)
          }}
          className="cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="19"
          viewBox="0 0 19 19"
          fill="none">
          <path
            d="M9.10421 16.625C13.2578 16.625 16.625 13.2578 16.625 9.10421C16.625 4.95057 13.2578 1.58337 9.10421 1.58337C4.95057 1.58337 1.58337 4.95057 1.58337 9.10421C1.58337 13.2578 4.95057 16.625 9.10421 16.625Z"
            stroke="#377DFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.4167 17.4167L15.8334 15.8334"
            stroke="#377DFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      <div className="div-message-search">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(submitSearchMessage)}>
            <InputGroup
              className={`input-group-merge me-2 input-group-message-search ${
                state.show_search_message ? "show" : ""
              } ${
                state.show_search_message_x || state.loading_search_message
                  ? "last-input-group"
                  : ""
              }`}>
              <InputGroupText>
                <div ref={refInputSearchMessageGroupFirst}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none">
                    <path
                      d="M9.10421 16.625C13.2578 16.625 16.625 13.2578 16.625 9.10421C16.625 4.95057 13.2578 1.58337 9.10421 1.58337C4.95057 1.58337 1.58337 4.95057 1.58337 9.10421C1.58337 13.2578 4.95057 16.625 9.10421 16.625Z"
                      stroke="#377DFF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17.4167 17.4167L15.8334 15.8334"
                      stroke="#377DFF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </InputGroupText>
              <ErpInput
                useForm={methods}
                innerRef={refInputSearchMessage}
                name="_searchMessage"
                defaultValue=""
                placeholder="Search"
                nolabel
                autoComplete="off"
                onClick={() => {
                  if (!_.isEmpty(state.arr_search_message_result)) {
                    setState({ show_search_message_result: true })
                  }
                }}
              />
              {(state.show_search_message_x ||
                state.loading_search_message) && (
                <InputGroupText>
                  <div
                    ref={refInputSearchMessageGroupLast}
                    onClick={() => {
                      setValue("_searchMessage", "")
                      setState({
                        show_search_message: false,
                        show_search_message_result: false,
                        arr_search_message_result: []
                      })
                      setSearchMessageHighlight(0, "")
                    }}>
                    {state.loading_search_message ? (
                      <Spinner size="sm" />
                    ) : (
                      <X size={14} />
                    )}
                  </div>
                </InputGroupText>
              )}
            </InputGroup>
          </form>
        </FormProvider>

        {state.show_search_message && (
          <div
            className={`div-message-search-result ${
              state.show_search_message_result ? "show" : ""
            }`}
            ref={refDivSearchMessageResult}>
            <div className="arrow"></div>
            <PerfectScrollbar options={{ wheelPropagation: false }}>
              <ul className="ul-message-search">
                {_.isEmpty(state.arr_search_message_result) && (
                  <li className="li-message-search justify-content-center">
                    {useFormatMessage("modules.chat.text.no_results_found")}
                  </li>
                )}

                {!_.isEmpty(state.arr_search_message_result) &&
                  _.map(state.arr_search_message_result, (value, index) => {
                    return (
                      <li
                        key={index}
                        className="li-message-search"
                        onClick={() => {
                          setSearchMessageHighlight(
                            value.timestamp,
                            getValues("_searchMessage")
                          )

                          scrollToMessage(value.timestamp, selectedUser.chat.id)
                        }}>
                        <span className="text">
                          {ReactHtmlParser(
                            highlightText(
                              renderTextSearchResult(
                                value.message,
                                getValues("_searchMessage")
                              ),
                              getValues("_searchMessage")
                            )
                          )}
                        </span>
                        <span className="time">
                          {formatTime(value.timestamp)}
                        </span>
                      </li>
                    )
                  })}
              </ul>
            </PerfectScrollbar>
          </div>
        )}
      </div>
    </Fragment>
  )
}

export default SearchMessage
