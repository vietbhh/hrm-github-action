// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment, useContext, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { AbilityContext } from "utility/context/Can"
import { DocumentApi } from "../common/api"
import { debounce } from "lodash-es"
// ** Styles
import { Card, CardHeader, CardBody, Button } from "reactstrap"
import { Plus } from "react-feather"
// ** Components
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import { EmptyContent } from "@apps/components/common/EmptyContent"
import AddFolderModal from "../components/modals/AddFolderModal"
import ShareModal from "../components/modals/ShareModal"
import { ErpInput } from "@apps/components/common/ErpField"
import ListDocument from "../components/detail/ListDocument"

const Document = (props) => {
  const [state, setState] = useMergedState({
    data: [],
    originalData: [],
    loading: true,
    addModal: false,
    shareModal: false,
    modalData: {},
    isEditModal: false,
    parentFolder: 0
  })

  const [filters, setFilters] = useMergedState({
    folder_name: ""
  })

  const moduleData = useSelector((state) => state.app.modules.documents)
  const module = moduleData.config
  const moduleName = module.name
  const ability = useContext(AbilityContext)
  const metas = moduleData.metas
  const options = moduleData.options
  const optionsModules = useSelector((state) => state.app.optionsModules)

  const authState = useSelector((state) => state.auth)
  const authUser = authState.userData

  const toggleAddModal = () => {
    setState({
      addModal: !state.addModal
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

  const setParentFolder = (id) => {
    setState({
      isEditModal: false,
      parentFolder: id
    })
  }

  const loadData = () => {
    setState({ loading: true })
    const params = {
      filters: filters
    }
    DocumentApi.getDocument(params).then((res) => {
      setState({
        data: res.data.results,
        originalData: res.data.results,
        loading: false
      })
    })
  }

  const handleAddModal = () => {
    setState({
      isEditModal: false
    })
    toggleAddModal()
  }

  const debounceSearch = useRef(
    debounce((nextValue) => {
      setFilters({ folder_name: nextValue })
    }, import.meta.env.VITE_APP_DEBOUNCE_INPUT_DELAY)
  ).current

  const setSearchText = (text) => {
    debounceSearch(text)
  }

  const setLoading = (status) => {
    setState({
      loading: status
    })
  }

  const handleFilterData = () => {
    const searchText = filters.folder_name
    if (searchText.length !== 0 && state.data.length > 0) {
      const newData = state.data.filter((item) => {
        return item.name.toLowerCase().includes(searchText)
      })
      setState({
        data: newData
      })
    } else {
      setState({
        data: state.originalData
      })
    }
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    handleFilterData()
  }, [filters])

  // ** render
  const renderBreadcrumb = () => {
    return (
      <Breadcrumbs
        list={[{ title: useFormatMessage("modules.documents.title.index") }]}
      />
    )
  }

  const renderListDocument = () => {
    if (state.data.length === 0) {
      return <EmptyContent />
    }

    return (
      <ListDocument
        loading={state.loading}
        data={state.data}
        moduleName={moduleName}
        options={options}
        modal={state.modal}
        setLoading={setLoading}
        toggleAddModal={toggleAddModal}
        toggleShareModal={toggleShareModal}
        setModalData={setModalData}
        setParentFolder={setParentFolder}
        loadData={loadData}
      />
    )
  }

  const renderAddFolderModal = () => {
    return (
      <AddFolderModal
        modal={state.addModal}
        parentFolder={state.parentFolder}
        handleModal={toggleAddModal}
        loadData={loadData}
        metas={metas}
        options={options}
        optionsModules={optionsModules}
        module={module}
        moduleName={moduleName}
        modalTitle={useFormatMessage(
          "modules.documents.modal.title.new_folder"
        )}
        fillData={state.modalData}
        isEditModal={state.isEditModal}
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
    <Fragment>
      <div className="document-page">
        {renderBreadcrumb()}
        <Card>
          <CardHeader>
            <div className="document-header">
              <div>
                <ErpInput
                  placeholder="search..."
                  formGroupClass="search-filter"
                  prepend={<i className="iconly-Search icli" />}
                  nolabel
                  onKeyUp={(e) => setSearchText(e.target.value.toLowerCase())}
                />
              </div>
              <div>
                <Button.Ripple color="primary" onClick={() => handleAddModal()}>
                  <Plus size={14} />
                  <span className="align-middle ms-25">
                    {useFormatMessage("modules.documents.buttons.new_folder")}
                  </span>
                </Button.Ripple>
              </div>
            </div>
          </CardHeader>
          <CardBody className="mb-25 document-table">
            <Fragment>{renderListDocument()}</Fragment>
          </CardBody>
        </Card>

        <Fragment>{renderAddFolderModal()}</Fragment>
        <Fragment>{renderShareModal()}</Fragment>
      </div>
    </Fragment>
  )
}

export default Document
