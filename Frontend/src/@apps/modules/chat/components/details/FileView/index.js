import { useFormatMessage, useMergedState } from "@apps/utility/common"
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAt,
  where
} from "firebase/firestore"
import React, { Fragment, useEffect } from "react"
import { db } from "firebase"
import DownloadFile from "@apps/modules/download/pages/DownloadFile"
import { Badge, Spinner } from "reactstrap"
import { Link2 } from "react-feather"
import { formatTime } from "@apps/modules/chat/common/common"
import { Image } from "antd"
import Photo from "../Photo"
import PerfectScrollbar from "react-perfect-scrollbar"

const index = (props) => {
  const { handleShowFileView, handleShowTab, selectedGroup, tabView, active } =
    props

  const [state, setState] = useMergedState({
    loadingFile: false,
    dataFile: [],
    lastTimestampFile: 0,
    loadMoreFile: false,

    loadingImage: false,
    dataImage: [],
    lastTimestampImage: 0,
    loadMoreImage: false,

    loadingLink: false,
    dataLink: [],
    lastTimestampLink: 0,
    loadMoreLink: false
  })

  const firestoreDb = process.env.REACT_APP_FIRESTORE_DB
  const queryLimit = 12

  useEffect(() => {
    setState({
      loadingFile: false,
      dataFile: [],
      lastTimestampFile: 0,
      loadMoreFile: false,

      loadingImage: false,
      dataImage: [],
      lastTimestampImage: 0,
      loadMoreImage: false,

      loadingLink: false,
      dataLink: [],
      lastTimestampLink: 0,
      loadMoreLink: false
    })
  }, [active])

  const getDataFile = async (tabView) => {
    let queryIn = ["file", "video", "audio"]
    if (tabView === "image") {
      queryIn = ["image", "image_gif"]
    }
    if (tabView === "link") {
      queryIn = ["link"]
    }
    const q = query(
      collection(db, `${firestoreDb}/chat_messages/${selectedGroup.id}`),
      orderBy("timestamp", "desc"),
      where("type", "in", queryIn),
      limit(queryLimit)
    )

    return await getDocs(q)
  }

  const getDataFileMore = async (tabView, timestamp) => {
    let queryIn = ["file"]
    if (tabView === "image") {
      queryIn = ["image", "image_gif"]
    }
    if (tabView === "link") {
      queryIn = ["link"]
    }
    const q = query(
      collection(db, `${firestoreDb}/chat_messages/${selectedGroup.id}`),
      orderBy("timestamp", "desc"),
      where("type", "in", queryIn),
      where("status", "==", "success"),
      limit(queryLimit),
      startAt(timestamp)
    )

    return await getDocs(q)
  }

  useEffect(() => {
    if (tabView === "file" && _.isEmpty(state.dataFile)) {
      setState({ loadingFile: true })
      getDataFile("file").then((res) => {
        let _data = []
        res.forEach((docData) => {
          const data = docData.data()
          _data = [..._data, data]
        })
        if (_data.length === queryLimit) {
          setState({ loadMoreFile: true })
        } else {
          setState({ loadMoreFile: false })
        }
        setState({ dataFile: _data, loadMoreFile: false })
      })
    }

    if (tabView === "image" && _.isEmpty(state.dataImage)) {
      setState({ loadingImage: true })
      getDataFile("image").then((res) => {
        let _data = []
        res.forEach((docData) => {
          const data = docData.data()
          _data = [..._data, data]
        })
        if (_data.length === queryLimit) {
          setState({ loadMoreImage: true })
        } else {
          setState({ loadMoreImage: false })
        }
        setState({ dataImage: _data, loadMoreImage: false })
      })
    }

    if (tabView === "link" && _.isEmpty(state.dataLink)) {
      setState({ loadingLink: true })
      getDataFile("link").then((res) => {
        let _data = []
        res.forEach((docData) => {
          const data = docData.data()
          _data = [..._data, data]
        })
        if (_data.length === queryLimit) {
          setState({ loadMoreLink: true })
        } else {
          setState({ loadMoreLink: false })
        }
        setState({ dataLink: _data, loadMoreLink: false })
      })
    }
  }, [tabView])

  return (
    <Fragment>
      <div className="file-view-header">
        <div className="header-icon" onClick={() => handleShowFileView(false)}>
          <i className="fa-regular fa-arrow-left"></i>
        </div>
        <div className="header-text">
          {useFormatMessage("modules.chat.text.file_image_link")}
        </div>
      </div>
      <div className="file-view-body">
        <div className="body-header">
          <div
            className={`div-tab ${tabView === "file" ? "active" : ""}`}
            onClick={() => handleShowTab("file")}>
            {useFormatMessage("modules.chat.text.file")}
          </div>
          <div
            className={`div-tab ${tabView === "image" ? "active" : ""}`}
            onClick={() => handleShowTab("image")}>
            {useFormatMessage("modules.chat.text.image")}
          </div>
          <div
            className={`div-tab ${tabView === "link" ? "active" : ""}`}
            onClick={() => handleShowTab("link")}>
            {useFormatMessage("modules.chat.text.link")}
          </div>
        </div>
        <div className="body-content">
          <div
            className={`div-content  ${tabView === "file" ? "show" : "hide"}`}>
            <PerfectScrollbar
              className={`div-content-perfect-scrollbar`}
              options={{ wheelPropagation: false }}>
              {_.map(state.dataFile, (value, index) => {
                return _.map(value.file, (item, key) => {
                  return (
                    <div key={`${index}${key}`} className="div-content-file">
                      <DownloadFile
                        className="align-items-center"
                        src={`/modules/chat/${selectedGroup.id}/other/${item.file}`}
                        fileName={item.file}>
                        <Badge color="light-secondary" pill>
                          <Link2 size={12} />
                          <span className="align-middle ms-50">
                            {item.file}
                          </span>
                        </Badge>
                      </DownloadFile>
                      <p className="time">{formatTime(value.timestamp)}</p>
                    </div>
                  )
                })
              })}

              {_.map(state.dataFile, (value, index) => {
                return _.map(value.file, (item, key) => {
                  return (
                    <div key={`${index}${key}`} className="div-content-file">
                      <DownloadFile
                        className="align-items-center"
                        src={`/modules/chat/${selectedGroup.id}/other/${item.file}`}
                        fileName={item.file}>
                        <Badge color="light-secondary" pill>
                          <Link2 size={12} />
                          <span className="align-middle ms-50">
                            {item.file}
                          </span>
                        </Badge>
                      </DownloadFile>
                      <p className="time">{formatTime(value.timestamp)}</p>
                    </div>
                  )
                })
              })}

              {_.map(state.dataFile, (value, index) => {
                return _.map(value.file, (item, key) => {
                  return (
                    <div key={`${index}${key}`} className="div-content-file">
                      <DownloadFile
                        className="align-items-center"
                        src={`/modules/chat/${selectedGroup.id}/other/${item.file}`}
                        fileName={item.file}>
                        <Badge color="light-secondary" pill>
                          <Link2 size={12} />
                          <span className="align-middle ms-50">
                            {item.file}
                          </span>
                        </Badge>
                      </DownloadFile>
                      <p className="time">{formatTime(value.timestamp)}</p>
                    </div>
                  )
                })
              })}

              {_.map(state.dataFile, (value, index) => {
                return _.map(value.file, (item, key) => {
                  return (
                    <div key={`${index}${key}`} className="div-content-file">
                      <DownloadFile
                        className="align-items-center"
                        src={`/modules/chat/${selectedGroup.id}/other/${item.file}`}
                        fileName={item.file}>
                        <Badge color="light-secondary" pill>
                          <Link2 size={12} />
                          <span className="align-middle ms-50">
                            {item.file}
                          </span>
                        </Badge>
                      </DownloadFile>
                      <p className="time">{formatTime(value.timestamp)}</p>
                    </div>
                  )
                })
              })}

              {state.loadMoreFile && (
                <div className="text-center mt-50">
                  <Spinner size={"sm"} />
                </div>
              )}
            </PerfectScrollbar>
          </div>
          <div
            className={`div-content ${tabView === "image" ? "show" : "hide"}`}>
            <div className="div-content-image">
              <Image.PreviewGroup>
                {_.map(state.dataImage, (value, index) => {
                  return _.map(value.file, (item, key) => {
                    return (
                      <Photo
                        key={`${index}${key}`}
                        src={`/modules/chat/${selectedGroup.id}/other/${item.file}`}
                      />
                    )
                  })
                })}
              </Image.PreviewGroup>
            </div>
          </div>
          <div
            className={`div-content ${tabView === "link" ? "show" : "hide"}`}>
            {_.map(state.dataLink, (value, index) => {
              return _.map(value.file, (item, key) => {
                return (
                  <div key={`${index}${key}`} className="div-content-link">
                    <a href={item.file} target={"_blank"}>
                      {item.file}
                    </a>
                    <p className="time">{formatTime(value.timestamp)}</p>
                  </div>
                )
              })
            })}

            {state.loadMoreLink && (
              <div className="text-center mt-50">
                <Spinner size={"sm"} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default index
