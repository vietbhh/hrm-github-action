import AvatarList from "@apps/components/common/AvatarList"
import {
  ErpCheckbox,
  ErpInput,
  ErpRadio
} from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { feedApi } from "@modules/Feed/common/api"
import classNames from "classnames"
import moment from "moment"
import React, { Fragment, useRef } from "react"
import ReactDOM from "react-dom"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { Spinner } from "reactstrap"

const RenderPollVote = (props) => {
  const {
    data,
    setData,
    comment_more_count_original,
    toggleModalWith,
    setDataUserOtherWith,
    isViewEditHistory = false // only view edit history
  } = props
  const [state, setState] = useMergedState({
    loadingAddMoreOption: false
  })

  const userData = useSelector((state) => state.auth.userData)
  const userId = userData.id
  const userList = useSelector((state) => state.users.list)

  const refContent = useRef(null)

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, setValue } = methods

  // function
  const handleChecked = (_id) => {
    if (data.poll_vote_detail.time_end !== null) {
      const now = moment()
      const date = moment(data.poll_vote_detail.time_end)
      if (date <= now) {
        notification.showWarning({
          text: useFormatMessage("modules.feed.create_post.text.poll_expired")
        })

        return false
      }
    }
    const _data = { ...data }
    let action = "add"
    const index_option = _data.poll_vote_detail.options.findIndex(
      (item) => item._id === _id
    )
    if (index_option !== -1) {
      const index_user =
        _data.poll_vote_detail.options[index_option].user_vote.indexOf(userId)
      if (index_user !== -1) {
        _data.poll_vote_detail.options[index_option].user_vote.splice(
          index_user,
          1
        )

        action = "remove"
      } else {
        _data.poll_vote_detail.options[index_option].user_vote.push(userId)
      }
    }
    if (!_data.poll_vote_detail.setting.multiple_selection) {
      _.forEach(_data.poll_vote_detail.options, (item, key) => {
        if (item._id !== _id) {
          const index_user = item.user_vote.indexOf(userId)
          if (index_user !== -1) {
            _data.poll_vote_detail.options[key].user_vote.splice(index_user, 1)
          }
        }
      })
    }

    setData(_data)

    const params = {
      _id_post: data._id,
      _id_option: _id,
      multiple_selection: _data.poll_vote_detail.setting.multiple_selection,
      time_end: _data.poll_vote_detail.time_end,
      action: action,
      comment_more_count_original: comment_more_count_original
    }
    feedApi
      .postUpdatePostPollVote(params)
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => {
        if (err.response.data.messages === "poll_expired") {
          notification.showWarning({
            text: useFormatMessage("modules.feed.create_post.text.poll_expired")
          })
        } else {
          notification.showError({
            text: useFormatMessage("notification.something_went_wrong")
          })
        }
      })
  }

  const scrollToBottom = () => {
    const contentContainer = ReactDOM.findDOMNode(refContent.current)
    contentContainer.scrollTop = Number.MAX_SAFE_INTEGER
  }

  const onSubmitAddMoreOptions = (value) => {
    if (data.poll_vote_detail.time_end !== null) {
      const now = moment()
      const date = moment(data.poll_vote_detail.time_end)
      if (date <= now) {
        notification.showWarning({
          text: useFormatMessage("modules.feed.create_post.text.poll_expired")
        })

        return false
      }
    }

    setState({ loadingAddMoreOption: true })
    const params = {
      _id_post: data._id,
      comment_more_count_original: comment_more_count_original,
      option_name: value.add_more_options,
      time_end: data.poll_vote_detail.time_end
    }
    feedApi
      .postUpdatePostPollVoteAddMoreOption(params)
      .then((res) => {
        setData(res.data)
        setValue("add_more_options", "")
        setState({ loadingAddMoreOption: false })
        setTimeout(() => {
          scrollToBottom()
        }, 200)
      })
      .catch((err) => {
        setState({ loadingAddMoreOption: false })
        if (err.response.data.messages === "poll_expired") {
          notification.showWarning({
            text: useFormatMessage("modules.feed.create_post.text.poll_expired")
          })
        } else {
          notification.showError({
            text: useFormatMessage("notification.something_went_wrong")
          })
        }
      })
  }

  return (
    <Fragment>
      <div className="post-body__poll-vote div-poll-vote-detail">
        <div className="poll-vote-detail-title">
          <span className="title">{data.poll_vote_detail?.question}</span>
          <div className="poll-vote-detail-title-description">
            {data.poll_vote_detail.setting.limit_time === true &&
              data.poll_vote_detail.time_end !== null && (
                <div
                  className={classNames("div-end-at", {
                    "is-background":
                      moment(data.poll_vote_detail.time_end) > moment()
                  })}>
                  <i className="fa-regular fa-clock"></i>
                  <span className="time-info">
                    {moment(data.poll_vote_detail.time_end) > moment() && (
                      <span className="me-50">
                        {useFormatMessage(
                          "modules.feed.create_post.text.end_at"
                        )}
                        :
                      </span>
                    )}

                    <span>
                      {moment(data.poll_vote_detail.time_end) <= moment()
                        ? useFormatMessage(
                            "modules.feed.create_post.text.poll_expired"
                          )
                        : moment(data.poll_vote_detail.time_end).format(
                            "HH:mm - DD/MM/YYYY"
                          )}
                    </span>
                  </span>
                </div>
              )}
            {data.poll_vote_detail.setting.incognito && (
              <div className="div-anonymous">
                <i className="fa-solid fa-eye-slash"></i>
                <span className="text">
                  {useFormatMessage("modules.feed.create_post.text.anonymous")}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="poll-vote-detail-content">
          {!_.isEmpty(data.poll_vote_detail.options) &&
            _.map(data.poll_vote_detail.options, (value, index) => {
              let checked = false
              const index_user = value.user_vote.indexOf(userId)
              if (index_user !== -1) {
                checked = true
              }

              const dataUserVote = []
              _.forEach(value.user_vote, (item) => {
                const dataUser = { id: item }
                dataUser["avatar"] = userList[item] ? userList[item].avatar : ""
                dataUser["full_name"] = userList[item]
                  ? userList[item].full_name
                  : ""
                dataUserVote.push(dataUser)
              })
              return (
                <div key={index} className="content-options">
                  <div
                    className="content-options__check"
                    onClick={() => {
                      if (!isViewEditHistory) {
                        handleChecked(value._id)
                      }
                    }}>
                    {data.poll_vote_detail.setting.multiple_selection ===
                    true ? (
                      <ErpCheckbox checked={checked} onChange={() => {}} />
                    ) : (
                      <ErpRadio
                        name={`vote_${data._id}`}
                        checked={checked}
                        onChange={() => {}}
                      />
                    )}
                  </div>
                  <div
                    className="content-options__option"
                    onClick={() => {
                      if (!isViewEditHistory) {
                        handleChecked(value._id)
                      }
                    }}>
                    <span className="title">{value.option_name}</span>
                  </div>
                  {data.poll_vote_detail.setting.incognito === false && (
                    <div
                      className="content-options__user-vote d-flex align-items-center"
                      onClick={() => {
                        if (!isViewEditHistory) {
                          setDataUserOtherWith(value.user_vote)
                          toggleModalWith()
                        }
                      }}>
                      <div className="vote me-50">
                        {value.user_vote.length} (
                        <>
                          {useFormatMessage(
                            `modules.feed.create_post.text.vote${
                              value.user_vote.length > 1 ? "s" : ""
                            }`
                          )}
                        </>
                        )
                      </div>
                      <div>
                        <AvatarList
                          data={dataUserVote}
                          avatarKey="avatar"
                          titleKey="full_name"
                        />
                      </div>
                    </div>
                  )}

                  <div className="div-background"></div>
                </div>
              )
            })}
        </div>
        xxxxedit
        {!isViewEditHistory && (
          <Fragment>
            {data.poll_vote_detail.setting.adding_more_options === true &&
              data.poll_vote_detail.options.length < 10 &&
              (data.poll_vote_detail.time_end === null ||
                (data.poll_vote_detail.time_end !== null &&
                  moment(data.poll_vote_detail.time_end) > moment())) && (
                <div className="poll-vote-add-more-option">
                  <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmitAddMoreOptions)}>
                      <ErpInput
                        nolabel
                        name={`add_more_options`}
                        useForm={methods}
                        defaultValue={``}
                        placeholder={useFormatMessage(
                          "modules.feed.create_post.text.enter_options"
                        )}
                        required
                        disabled={state.loadingAddMoreOption}
                        append={
                          state.loadingAddMoreOption ? (
                            <Spinner size={"sm"} />
                          ) : (
                            " "
                          )
                        }
                      />
                    </form>
                  </FormProvider>
                </div>
              )}
          </Fragment>
        )}
      </div>
    </Fragment>
  )
}

export default RenderPollVote
