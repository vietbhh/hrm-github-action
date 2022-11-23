// ** React Imports
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment, useContext, useEffect, useRef } from "react"
import { AbilityContext } from "utility/context/Can"
import { DocumentApi } from "../common/api"
import notification from "@apps/utility/notification"
import { getDocumentShareContent } from "../common/common"
import { useParams, useNavigate } from "react-router-dom"
import { debounce } from "lodash-es"
// ** redux
import { useSelector } from "react-redux"
// ** Styles
import { Card, CardHeader, CardBody, Button } from "reactstrap"
import { Share2, Download } from "react-feather"
import { Space, Tooltip } from "antd"
// ** Components
import { EmptyContent } from "@apps/components/common/EmptyContent"
import UploadDocumentFile from "../components/detail/UploadDocumentFile"
import AddFolderModal from "../components/modals/AddFolderModal"
import ShareModal from "../components/modals/ShareModal"
import ModifyDocumentAction from "../components/detail/ModifyDocumentAction"
import ViewFileModal from "../components/modals/ViewFileModal"
import { ErpInput } from "@apps/components/common/ErpField"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import ListDocumentDetail from "../components/detail/ListDocumentDetail"

const DocumentDetail = (props) => {
  const [state, setState] = useMergedState({
    data: [],
    listFileUpload: [],
    listChildDocument: [],
    listFileUploadOriginal: [],
    loading: true,
    addModal: false,
    shareModal: false,
    modalData: [],
    viewFileModal: false,
    viewFileModalData: {},
    isEditModal: true,
    parentFolder: 0,
    parentDocument: [],
    isEditableDocument: false
  })

  const [filters, setFilters] = useMergedState({
    file_name: ""
  })

  const { id } = useParams()
  const moduleData = useSelector((state) => state.app.modules.documents)
  const module = moduleData.config
  const moduleName = module.name
  const ability = useContext(AbilityContext)
  const metas = moduleData.metas
  const options = moduleData.options
  const optionsModules = useSelector((state) => state.app.optionsModules)

  const authState = useSelector((state) => state.auth)
  const authUser = authState.userData

  const history = useNavigate()

  const loadData = () => {
    setState({ loading: true })
    const params = {
      filters: filters
    }
    DocumentApi.getDocumentDetail(id, params)
      .then((res) => {
        setState({
          data: res.data.data,
          listFileUpload: res.data.list_file_and_folder,
          listFileUploadOriginal: res.data.list_file_and_folder,
          parentDocument: res.data.parent_document,
          isEditableDocument: res.data.data?.owner?.value === authUser.id,
          loading: false
        })
      })
      .catch((err) => {
        history("/not-found")
      })
  }

  const toggleAddModal = () => {
    setState({
      addModal: !state.addModal
    })
  }

  const toggleViewFileModal = () => {
    setState({
      viewFileModal: !state.viewFileModal
    })
  }

  const toggleShareModal = () => {
    setState({
      shareModal: !state.shareModal
    })
  }

  const setModalData = (data) => {
    setState({
      isEditModal: true,
      modalData: data
    })
  }

  const setLoading = (loading) => {
    setState({
      loading: loading
    })
  }

  const setViewFileModal = (status) => {
    setState({
      viewFileModal: status
    })
  }

  const setViewFileModalData = (data) => {
    setState({
      viewFileModalData: data
    })
  }

  const setParentFolder = (id) => {
    setState({
      isEditModal: false,
      parentFolder: id
    })
  }

  const handleDownloadFolder = () => {
    setState({ loading: true })
    DocumentApi.postDownloadDocument(state.data.id)
      .then((response) => {
        const FileSaver = require("file-saver")
        const blob = new Blob([response.data], { type: "application/zip" })
        FileSaver.saveAs(blob, state.data.name + ".zip")
        setState({ loading: false })
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.something_went_wrong")
        })
        setState({ loading: false })
      })
  }

  const debounceSearch = useRef(
    debounce((nextValue) => {
      setFilters({ file_name: nextValue })
    }, process.env.REACT_APP_DEBOUNCE_INPUT_DELAY)
  ).current

  const setSearchText = (text) => {
    debounceSearch(text)
  }

  const handleFilterData = () => {
    const searchText = filters.file_name
    if (searchText.length !== 0 && state.listFileUpload.length > 0) {
      const newData = state.listFileUpload.filter((item) => {
        return item.fileName.toLowerCase().includes(searchText)
      })
      setState({
        listFileUpload: newData
      })
    } else {
      setState({
        listFileUpload: state.listFileUploadOriginal
      })
    }
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [id])

  useEffect(() => {
    handleFilterData()
  }, [filters])

  useEffect(() => {
    if (state.loading === false && state.data.length === 0) {
      console.log("z")
    }
  }, [state.loading, state.data])

  // ** render
  const renderBreadcrumb = () => {
    const listBreadCrumb = [
      {
        title: useFormatMessage("modules.documents.title.index"),
        link: "/documents"
      }
    ]

    state.parentDocument.map((item, index, arr) => {
      listBreadCrumb.push({
        title: item.name,
        link: index + 1 === arr.length ? "" : `/documents/${item.id}`
      })
    })

    return <Breadcrumbs list={listBreadCrumb} />
  }

  const renderListDocumentDetail = () => {
    if (state.listFileUpload.length === 0) {
      return <EmptyContent />
    }

    return (
      <ListDocumentDetail
        loading={state.loading}
        data={state.data}
        listFileUpload={state.listFileUpload}
        listChildDocument={state.listChildDocument}
        options={options}
        moduleName={moduleName}
        setViewFileModal={setViewFileModal}
        setViewFileModalData={setViewFileModalData}
        toggleAddModal={toggleAddModal}
        toggleShareModal={toggleShareModal}
        setModalData={setModalData}
        setParentFolder={setParentFolder}
        setLoading={setLoading}
        loadData={loadData}
      />
    )
  }

  const renderUploadAction = () => {
    return <UploadDocumentFile documentData={state.data} loadData={loadData} />
  }

  const renderButtonAction = () => {
    return (
      <Space>
        <Button.Ripple
          color="primary"
          onClick={() => {
            handleDownloadFolder()
          }}>
          <Download size={16} />{" "}
          {useFormatMessage("modules.documents.buttons.download")}
        </Button.Ripple>

        {renderUploadAction()}
      </Space>
    )
  }

  const renderModifyDocumentAction = () => {
    return (
      <ModifyDocumentAction
        isEditable={state.isEditableDocument}
        redirectBack={true}
        folderData={state.data}
        setModalData={setModalData}
        setLoading={setLoading}
        handleModal={toggleAddModal}
        setParentFolder={setParentFolder}
        loadData={loadData}
      />
    )
  }

  const renderDocumentInfo = () => {
    return (
      <Card>
        <CardHeader className="mb-0">
          <div className="document-detail-header">
            <div>
              <div className="d-flex align-item-center">
                <h3 className="mb-25 me-50">{state.data.name}</h3>
                <Tooltip
                  placement="bottom"
                  title={useFormatMessage("modules.documents.text.share_with", {
                    share_with_content: getDocumentShareContent(
                      state.data,
                      options
                    )
                  })}>
                  {" "}
                  <Share2 size={17} />
                </Tooltip>
              </div>
              <p>{state.data.description}</p>
            </div>
            <div>
              <Fragment>{renderModifyDocumentAction()}</Fragment>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="document-header mb-1">
            <div>
              <ErpInput
                placeholder="search..."
                formGroupClass="search-filter"
                prepend={<i className="iconly-Search icli" />}
                nolabel
                onKeyUp={(e) => setSearchText(e.target.value.toLowerCase())}
              />
            </div>
            <div>{renderButtonAction()}</div>
          </div>
          <div className="mb-0">{renderListDocumentDetail()}</div>
        </CardBody>
      </Card>
    )
  }

  const renderViewFileModal = () => {
    return (
      <ViewFileModal
        modal={state.viewFileModal}
        fileData={state.viewFileModalData}
        handleModal={toggleViewFileModal}
      />
    )
  }

  const renderAddFolderModal = () => {
    return (
      <AddFolderModal
        modal={state.addModal}
        parentFolder={state.parentFolder}
        metas={metas}
        options={options}
        optionsModules={optionsModules}
        module={module}
        moduleName={moduleName}
        modalTitle={useFormatMessage(
          "modules.documents.modal.title.edit_folder"
        )}
        fillData={state.modalData}
        isEditModal={state.isEditModal}
        handleModal={toggleAddModal}
        loadData={loadData}
      />
    )
  }

  const renderShareModal = () => {
    return (
      <ShareModal
        modal={state.shareModal}
        handleModal={toggleShareModal}
        loadData={loadData}
        metas={metas}
        options={options}
        optionsModules={optionsModules}
        module={module}
        moduleName={moduleName}
        fillData={state.modalData}
      />
    )
  }

  return (
    <div className="document-page">
      {renderBreadcrumb()}
      {!state.loading ? renderDocumentInfo() : <AppSpinner />}
      <Fragment>{renderAddFolderModal()}</Fragment>
      <Fragment>{renderShareModal()}</Fragment>
      <Fragment>{state.viewFileModal && renderViewFileModal()}</Fragment>
    </div>
  )
}

export default DocumentDetail
