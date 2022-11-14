import { timeDifference, useFormatMessage } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { canDeleteData, canUpdateData } from "@apps/utility/permissions"
import SwAlert from "@apps/utility/SwAlert"
import { newsApi } from "@modules/News/common/api"
import classnames from "classnames"
import { isEmpty } from "lodash"
import { Fragment } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { CardBody, Col, Row } from "reactstrap"

const ListData = (props) => {
  const {
    data,
    ability,
    loadData,
    toggleAddModal,
    setModalTitle,
    checkAnnouncements
  } = props

  const userId = useSelector((state) => state.auth.userData.id) || 0
  const canDelete = canDeleteData(ability, "news", userId, data)
  const canUpdate = canUpdateData(ability, "news", userId, data)

  const handleDeleteClick = () => {
    if (!isEmpty(data.id)) {
      SwAlert.showWarning({
        confirmButtonText: useFormatMessage("button.delete"),
        html: ""
      }).then((res) => {
        if (res.value) {
          _handleDeleteClick(data.id)
        }
      })
    }
  }

  const _handleDeleteClick = (id) => {
    newsApi
      .deleteNews(id)
      .then((result) => {
        notification.showSuccess({
          text: useFormatMessage("notification.delete.success")
        })

        loadData({ check: true, page: 1 })
      })
      .catch((err) => {
        notification.showError({ text: err.message })
      })
  }

  return (
    <Fragment>
      <div className="fri-card card-mb-10 news">
        <CardBody>
          <Row>
            <Col sm={12}>
              <Row>
                <Col sm={12}>
                  <div className="d-flex">
                    <Row>
                      <Col xs="12" style={{ marginBot: "10px !important" }}>
                        {data.important ? (
                          <span className="news-flag">
                            <i className="fal fa-flag"></i>
                          </span>
                        ) : (
                          ""
                        )}
                        <Link to={`/news/detail/${data.id}`}>
                          <p className="inline-block me-1 text-black fw-bolder">
                            {data.title}
                          </p>
                        </Link>
                        {!checkAnnouncements && (
                          <div
                            className={classnames("bg-status", {
                              [` bg-status-${data.status.name_option}`]: true
                            })}>
                            {useFormatMessage(data.status.label)}
                          </div>
                        )}
                      </Col>
                      <Col xs="12">
                        <small className="span-date">
                          ({timeDifference(data.created_at)}{" "}
                          {useFormatMessage("modules.news.by")}{" "}
                          {data.created_by.label})
                        </small>
                      </Col>
                    </Row>
                    <div
                      className="ms-auto d-flex"
                      style={{
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "flex-end"
                      }}>
                      <div>
                        {!checkAnnouncements && canUpdate ? (
                          <button
                            className="btn button-action button-action-edit"
                            onClick={() => {
                              setModalTitle(
                                useFormatMessage("modules.news.buttons.edit")
                              )
                              toggleAddModal(data.id)
                            }}>
                            <i className="far fa-edit"></i>
                          </button>
                        ) : (
                          ""
                        )}

                        {!checkAnnouncements && canDelete ? (
                          <button
                            className="btn button-action button-action-delete"
                            onClick={() => {
                              handleDeleteClick()
                            }}>
                            <i className="far fa-trash"></i>
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                      <div>
                        <span to="" className="text-nowrap color-primary">
                          <i className="fa-solid fa-comment"></i>
                          <span className="text-muted ms-50">
                            {data.total_comment}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </CardBody>
      </div>
    </Fragment>
  )
}

export default ListData
ListData.defaultProps = {
  checkAnnouncements: false
}
