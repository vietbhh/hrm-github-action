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
import { Badge, Button, Spinner } from "reactstrap"
import { Link2 } from "react-feather"
import { formatTime } from "@apps/modules/chat/common/common"
import { Image } from "antd"
import Photo from "./Photo"
import PerfectScrollbar from "react-perfect-scrollbar"
import { useDispatch, useSelector } from "react-redux"

const index = (props) => {
  const { handleShowFileView, handleShowTab, selectedGroup, tabView, active } =
    props

  const [state, setState] = useMergedState({
    loadingFile: false,
    dataFile: [],
    firstTimestampFile: 0,
    lastTimestampFile: 0,
    loadMoreFile: false,

    loadingImage: false,
    dataImage: [],
    firstTimestampImage: 0,
    lastTimestampImage: 0,
    loadMoreImage: false,

    loadingLink: false,
    dataLink: [],
    firstTimestampLink: 0,
    lastTimestampLink: 0,
    loadMoreLink: false
  })

  const firestoreDb = process.env.REACT_APP_FIRESTORE_DB
  const queryLimit = 20

  // ** redux
  const dispatch = useDispatch()
  const chat = useSelector((state) => state.chat)
  const chats = chat.chats

  useEffect(() => {
    setState({
      loadingFile: false,
      dataFile: [],
      dataListenFile: [],
      firstTimestampFile: 0,
      lastTimestampFile: 0,
      loadMoreFile: false,

      loadingImage: false,
      dataImage: [],
      dataListenImage: [],
      firstTimestampImage: 0,
      lastTimestampImage: 0,
      loadMoreImage: false,

      loadingLink: false,
      dataLink: [],
      dataListenLink: [],
      firstTimestampLink: 0,
      lastTimestampLink: 0,
      loadMoreLink: false
    })
  }, [active])

  const handleQueryInFile = (tabView) => {
    let queryIn = ["file", "video", "audio"]
    if (tabView === "image") {
      queryIn = ["image", "image_gif"]
    }
    if (tabView === "link") {
      queryIn = ["link"]
    }

    return queryIn
  }

  const getDataFile = async (tabView) => {
    const queryIn = handleQueryInFile(tabView)
    const q = query(
      collection(db, `${firestoreDb}/chat_messages/${selectedGroup.id}`),
      orderBy("timestamp", "desc"),
      where("type", "in", queryIn),
      where("status", "==", "success"),
      limit(queryLimit)
    )

    return await getDocs(q)
  }

  const getDataFileMore = async (tabView, timestamp) => {
    const queryIn = handleQueryInFile(tabView)
    const q = query(
      collection(db, `${firestoreDb}/chat_messages/${selectedGroup.id}`),
      orderBy("timestamp", "desc"),
      where("type", "in", queryIn),
      where("status", "==", "success"),
      limit(queryLimit + 1),
      startAt(timestamp)
    )

    return await getDocs(q)
  }

  const handleLoadMore = (tabView) => {
    if (tabView === "file") {
      setState({ loadingFile: true, loadMoreFile: false })
      getDataFileMore("file", state.lastTimestampFile).then((res) => {
        let _data = []
        let dem = 0
        res.forEach((docData) => {
          dem++
          if (dem > 1) {
            const data = docData.data()
            _data = [..._data, data]
          }
        })
        if (_data.length === queryLimit) {
          setState({ loadMoreFile: true })
        } else {
          setState({ loadMoreFile: false })
        }
        setState({
          dataFile: [...state.dataFile, ..._data],
          loadingFile: false
        })
        if (!_.isEmpty(_data)) {
          setState({ lastTimestampFile: _data[_data.length - 1].timestamp })
        } else {
          setState({ lastTimestampFile: 0 })
        }
      })
    }

    if (tabView === "image") {
      setState({ loadingImage: true, loadMoreImage: false })
      getDataFileMore("image", state.lastTimestampImage).then((res) => {
        let _data = []
        let dem = 0
        res.forEach((docData) => {
          dem++
          if (dem > 1) {
            const data = docData.data()
            _data = [..._data, data]
          }
        })
        if (_data.length === queryLimit) {
          setState({ loadMoreImage: true })
        } else {
          setState({ loadMoreImage: false })
        }
        setState({
          dataImage: [...state.dataImage, ..._data],
          loadingImage: false
        })
        if (!_.isEmpty(_data)) {
          setState({ lastTimestampImage: _data[_data.length - 1].timestamp })
        } else {
          setState({ lastTimestampImage: 0 })
        }
      })
    }

    if (tabView === "link") {
      setState({ loadingLink: true, loadMoreLink: false })
      getDataFileMore("link", state.lastTimestampLink).then((res) => {
        let _data = []
        let dem = 0
        res.forEach((docData) => {
          dem++
          if (dem > 1) {
            const data = docData.data()
            _data = [..._data, data]
          }
        })
        if (_data.length === queryLimit) {
          setState({ loadMoreLink: true })
        } else {
          setState({ loadMoreLink: false })
        }
        setState({
          dataLink: [...state.dataLink, ..._data],
          loadingLink: false
        })
        if (!_.isEmpty(_data)) {
          setState({ lastTimestampLink: _data[_data.length - 1].timestamp })
        } else {
          setState({ lastTimestampLink: 0 })
        }
      })
    }
  }

  useEffect(() => {
    if (tabView === "file" && _.isEmpty(state.dataFile)) {
      setState({ loadingFile: true })
      getDataFile("file")
        .then((res) => {
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
          setState({ dataFile: _data, loadingFile: false })
          if (!_.isEmpty(_data)) {
            setState({
              lastTimestampFile: _data[_data.length - 1].timestamp,
              firstTimestampFile: _data[0].timestamp
            })
          } else {
            setState({ lastTimestampFile: 0, firstTimestampFile: 0 })
          }
        })
        .catch((err) => {
          console.log(err)
          setState({ loadMoreFile: false })
        })
    }

    if (tabView === "image" && _.isEmpty(state.dataImage)) {
      setState({ loadingImage: true })
      getDataFile("image")
        .then((res) => {
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
          setState({ dataImage: _data, loadingImage: false })
          if (!_.isEmpty(_data)) {
            setState({
              lastTimestampImage: _data[_data.length - 1].timestamp,
              firstTimestampImage: _data[0].timestamp
            })
          } else {
            setState({ lastTimestampImage: 0, firstTimestampImage: 0 })
          }
        })
        .catch((err) => {
          console.log(err)
          setState({ loadMoreImage: false })
        })
    }

    if (tabView === "link" && _.isEmpty(state.dataLink)) {
      setState({ loadingLink: true })
      getDataFile("link")
        .then((res) => {
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
          setState({ dataLink: _data, loadingLink: false })
          if (!_.isEmpty(_data)) {
            setState({
              lastTimestampLink: _data[_data.length - 1].timestamp,
              firstTimestampLink: _data[0].timestamp
            })
          } else {
            setState({ lastTimestampLink: 0, firstTimestampLink: 0 })
          }
        })
        .catch((err) => {
          console.log(err)
          setState({ loadMoreLink: false })
        })
    }
  }, [tabView])

  useEffect(() => {
    let _dataListenFile = []
    let _dataListenImage = []
    let _dataListenLink = []
    _.forEach(chats, (value) => {
      if (
        (value.type === "file" ||
          value.type === "video" ||
          value.type === "audio") &&
        value.time > state.firstTimestampFile &&
        state.firstTimestampFile !== 0
      ) {
        _dataListenFile = [
          { ...value, timestamp: value.time },
          ..._dataListenFile
        ]
      }

      if (
        (value.type === "image" || value.type === "image_gif") &&
        value.time > state.firstTimestampImage &&
        state.firstTimestampImage !== 0
      ) {
        _dataListenImage = [
          { ...value, timestamp: value.time },
          ..._dataListenImage
        ]
      }

      if (
        value.type === "link" &&
        value.time > state.firstTimestampLink &&
        state.firstTimestampLink !== 0
      ) {
        _dataListenLink = [
          { ...value, timestamp: value.time },
          ..._dataListenLink
        ]
      }
    })

    setState({
      dataListenFile: _dataListenFile,
      dataListenImage: _dataListenImage,
      dataListenLink: _dataListenLink
    })
  }, [chats])

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
              {_.map(state.dataListenFile, (value, index) => {
                return _.map(value.file, (item, key) => {
                  return (
                    <div key={`${index}${key}`} className="div-content-file">
                      <DownloadFile
                        className="align-items-center"
                        src={`/modules/chat/${
                          value?.forward?.forward_id_from
                            ? value?.forward?.forward_id_from
                            : selectedGroup.id
                        }/other/${item.file}`}
                        fileName={item.file}>
                        <Badge color="light-secondary" pill>
                          <Link2 size={12} />
                          <span
                            className="align-middle ms-50"
                            title={item.file}>
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
                        src={`/modules/chat/${
                          value?.forward?.forward_id_from
                            ? value?.forward?.forward_id_from
                            : selectedGroup.id
                        }/other/${item.file}`}
                        fileName={item.file}>
                        <Badge color="light-secondary" pill>
                          <Link2 size={12} />
                          <span
                            className="align-middle ms-50"
                            title={item.file}>
                            {item.file}
                          </span>
                        </Badge>
                      </DownloadFile>
                      <p className="time">{formatTime(value.timestamp)}</p>
                    </div>
                  )
                })
              })}

              {state.loadingFile && (
                <div className="text-center mt-50">
                  <Spinner size={"sm"} />
                </div>
              )}

              {state.loadMoreFile && (
                <div className="text-center mt-50">
                  <Button
                    type="button"
                    color="primary"
                    size="sm"
                    className="btn-load-more"
                    onClick={() => handleLoadMore("file")}>
                    {useFormatMessage("modules.chat.text.load_more")}
                  </Button>
                </div>
              )}
            </PerfectScrollbar>
          </div>
          <div
            className={`div-content ${tabView === "image" ? "show" : "hide"}`}>
            <PerfectScrollbar
              className={`div-content-perfect-scrollbar`}
              options={{ wheelPropagation: false }}>
              <div className="div-content-image">
                <Image.PreviewGroup>
                  {_.map(state.dataListenImage, (value, index) => {
                    return _.map(value.file, (item, key) => {
                      return (
                        <Photo
                          key={`${index}${key}`}
                          src={`/modules/chat/${
                            value?.forward?.forward_id_from
                              ? value?.forward?.forward_id_from
                              : selectedGroup.id
                          }/other/${item.file}`}
                        />
                      )
                    })
                  })}

                  {_.map(state.dataImage, (value, index) => {
                    return _.map(value.file, (item, key) => {
                      return (
                        <Photo
                          key={`${index}${key}`}
                          src={`/modules/chat/${
                            value?.forward?.forward_id_from
                              ? value?.forward?.forward_id_from
                              : selectedGroup.id
                          }/other/${item.file}`}
                        />
                      )
                    })
                  })}
                </Image.PreviewGroup>
              </div>

              {state.loadingImage && (
                <div className="text-center mt-50">
                  <Spinner size={"sm"} />
                </div>
              )}

              {state.loadMoreImage && (
                <div className="text-center mt-50">
                  <Button
                    type="button"
                    color="primary"
                    size="sm"
                    className="btn-load-more"
                    onClick={() => handleLoadMore("image")}>
                    {useFormatMessage("modules.chat.text.load_more")}
                  </Button>
                </div>
              )}
            </PerfectScrollbar>
          </div>
          <div
            className={`div-content ${tabView === "link" ? "show" : "hide"}`}>
            <PerfectScrollbar
              className={`div-content-perfect-scrollbar`}
              options={{ wheelPropagation: false }}>
              {_.map(state.dataListenLink, (value, index) => {
                return _.map(value.file, (item, key) => {
                  return (
                    <div key={`${index}${key}`} className="div-content-link">
                      <a href={item.file} target={"_blank"} title={item.file}>
                        {item.file}
                      </a>
                      <p className="time">{formatTime(value.timestamp)}</p>
                    </div>
                  )
                })
              })}

              {_.map(state.dataLink, (value, index) => {
                return _.map(value.file, (item, key) => {
                  return (
                    <div key={`${index}${key}`} className="div-content-link">
                      <a href={item.file} target={"_blank"} title={item.file}>
                        {item.file}
                      </a>
                      <p className="time">{formatTime(value.timestamp)}</p>
                    </div>
                  )
                })
              })}

              {state.loadingLink && (
                <div className="text-center mt-50">
                  <Spinner size={"sm"} />
                </div>
              )}

              {state.loadMoreLink && (
                <div className="text-center mt-50">
                  <Button
                    type="button"
                    color="primary"
                    size="sm"
                    className="btn-load-more"
                    onClick={() => handleLoadMore("link")}>
                    {useFormatMessage("modules.chat.text.load_more")}
                  </Button>
                </div>
              )}
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default index
