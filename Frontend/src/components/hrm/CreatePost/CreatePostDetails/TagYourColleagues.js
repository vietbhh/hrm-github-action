import { EmptyContent } from "@apps/components/common/EmptyContent"
import { ErpCheckbox, ErpInput } from "@apps/components/common/ErpField"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Tooltip } from "antd"
import React, { Fragment, useEffect } from "react"
import PerfectScrollbar from "react-perfect-scrollbar"
import { Modal, ModalBody } from "reactstrap"

const TagYourColleagues = (props) => {
  const { dataMention, tag_your_colleagues, setTagYourColleagues } = props
  const [state, setState] = useMergedState({
    modal: false,
    text_search: "",
    data_tag: []
  })

  // ** function
  const toggleModal = () => setState({ modal: !state.modal })

  const handleCheckedUser = (user_id) => {
    const index_user = state.data_tag.indexOf(user_id)
    const _tag_your_colleagues = [...state.data_tag]
    if (index_user === -1) {
      _tag_your_colleagues.push(user_id)
    } else {
      _tag_your_colleagues.splice(index_user, 1)
    }

    setState({ data_tag: _tag_your_colleagues })
  }

  // ** useEffect
  useEffect(() => {
    if (state.modal) {
      setState({ data_tag: tag_your_colleagues })
    }
  }, [state.modal, tag_your_colleagues])

  return (
    <Fragment>
      <Tooltip
        title={useFormatMessage(
          "modules.feed.create_post.text.tag_your_colleagues"
        )}>
        <li
          className="create_post_footer-li cursor-pointer"
          onClick={() => toggleModal()}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.97532 12.0251L11.9753 2.02513C12.6317 1.36875 13.5219 1 14.4502 1H20.5004C21.8812 1 23.0004 2.11929 23.0004 3.5V9.55025C23.0004 10.4785 22.6317 11.3687 21.9753 12.0251L11.9753 22.0251C10.6085 23.392 8.39241 23.392 7.02558 22.0251L1.97532 16.9749C0.608485 15.608 0.608488 13.392 1.97532 12.0251ZM17.5004 8C18.3289 8 19.0004 7.32843 19.0004 6.5C19.0004 5.67157 18.3289 5 17.5004 5C16.672 5 16.0004 5.67157 16.0004 6.5C16.0004 7.32843 16.672 8 17.5004 8Z"
              fill="#2F54EB"></path>
          </svg>
        </li>
      </Tooltip>

      <Modal
        isOpen={state.modal}
        toggle={() => toggleModal()}
        className="modal-dialog-centered feed modal-lg modal-reaction-detail modal-poll-vote modal-tag-your-colleagues"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}
        /* backdrop={"static"} */
      >
        <ModalBody>
          <div className="body-header">
            <button className="btn-icon" onClick={() => toggleModal()}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <span className="text-title">
              {useFormatMessage(
                "modules.feed.create_post.text.tag_your_colleagues"
              )}
            </span>
          </div>
          <div className="body-content">
            <div className="div-list-member">
              <div className="list-member__header">
                <div className="text-title">
                  {useFormatMessage(
                    "modules.feed.create_post.text.list_member"
                  )}
                </div>
                <div className="list-member__input-search">
                  <ErpInput
                    nolabel
                    placeholder={useFormatMessage("app.search")}
                    prepend={<i className="fa-regular fa-magnifying-glass"></i>}
                    value={state.text_search}
                    onChange={(e) => setState({ text_search: e.target.value })}
                  />
                </div>
              </div>
              <div className="list-member__list">
                <PerfectScrollbar options={{ wheelPropagation: false }}>
                  {_.map(
                    _.filter(dataMention, (value) => {
                      if (state.text_search !== "") {
                        const _full_name = value.full_name.toLowerCase()
                        const _text_search = state.text_search.toLowerCase()
                        return (
                          _full_name.indexOf(_text_search) !== -1 ||
                          value.name.indexOf(_text_search) !== -1
                        )
                      }
                      return true
                    }),
                    (item, index) => {
                      return (
                        <Fragment key={index}>
                          <div
                            className="d-flex align-items-center list-user-react"
                            onClick={() => handleCheckedUser(item.id)}>
                            <Avatar className="img me-1" src={item?.avatar} />
                            <span className="name">{item?.full_name}</span>
                            <div className="ms-auto">
                              <ErpCheckbox
                                checked={state.data_tag.indexOf(item.id) !== -1}
                                onChange={(e) => {}}
                              />
                            </div>
                          </div>

                          <hr />
                        </Fragment>
                      )
                    }
                  )}
                </PerfectScrollbar>
              </div>
            </div>
            <div className="div-list-selected">
              {_.isEmpty(state.data_tag) && (
                <div className="d-flex align-items-center justify-content-center h-100">
                  <EmptyContent
                    title={useFormatMessage(
                      "modules.feed.create_post.text.no_member_selected_yet"
                    )}
                    text=""
                  />
                </div>
              )}

              {!_.isEmpty(state.data_tag) &&
                _.map(state.data_tag, (value, index) => {
                  const index_user = dataMention.findIndex(
                    (item) => item.id === value
                  )
                  let data_user = {}
                  if (index_user !== -1) {
                    data_user = dataMention[index_user]
                  }
                  return (
                    <Fragment key={index}>
                      <div className="d-flex align-items-center list-user-react">
                        <Avatar className="img me-1" src={data_user?.avatar} />
                        <span className="name">{data_user?.full_name}</span>
                        <div className="ms-auto">
                          <i className="fa-solid fa-xmark"></i>
                        </div>
                      </div>

                      <hr />
                    </Fragment>
                  )
                })}
            </div>
          </div>
          <div className="body-footer">
            <button
              type="button"
              className="button-cancel me-1"
              onClick={() => toggleModal()}>
              {useFormatMessage("app.cancel")}
            </button>
            <button
              type="button"
              className="button-save"
              onClick={() => {
                setTagYourColleagues(state.data_tag)
                toggleModal()
              }}>
              {useFormatMessage("modules.feed.create_post.text.done")}
            </button>
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default TagYourColleagues
