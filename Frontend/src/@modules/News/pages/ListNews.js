import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import { EmptyContent } from "@apps/components/common/EmptyContent"
import { ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { debounce, isEmpty, map } from "lodash"
import { Fragment, useContext, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Spinner
} from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import { newsApi } from "../common/api"
import ListData from "../components/data/ListData"
import AddNewsModal from "../components/modals/AddNewsModal"

const ListNews = (props) => {
  const [state, setState] = useMergedState({
    data: [],
    loading: true,
    hasMore: false,
    perPage: 10,
    recordsTotal: 0,
    page: 1,
    searchVal: "",
    addModal: false,
    modalTitle: "",
    newsId: 0
  })

  const [filters, setFilters] = useMergedState({
    filter_status_id: 1,
    filter_date_from: "",
    filter_date_to: ""
  })

  const moduleData = useSelector((state) => state.app.modules.news)
  const optionsModules = useSelector((state) => state.app.optionsModules)
  const module = moduleData.config
  const moduleName = module.name
  const metas = moduleData.metas
  const options = moduleData.options
  const ability = useContext(AbilityContext)

  const dateTimeToYMD = (date) => {
    if (date) return new Date(date).toLocaleDateString("en-CA")
    return ""
  }

  const setModalTitle = (props) => {
    setState({
      modalTitle: props
    })
  }

  const debounceSearch = useRef(
    debounce(
      (nextValue) =>
        setState({
          searchVal: nextValue,
          data: [],
          hasMore: false,
          loading: true,
          page: 1
        }),
      import.meta.env.VITE_APP_DEBOUNCE_INPUT_DELAY
    )
  ).current

  const handleSearchVal = (e) => {
    const value = e.target.value
    debounceSearch(value.toLowerCase())
  }

  useEffect(() => {
    loadData()
  }, [filters, state.searchVal])

  const loadData = (props, stateParams = {}) => {
    setState({
      loading: true,
      hasMore: false
    })
    const params = {
      perPage: state.perPage,
      page: state.page,
      filters: {
        status: filters.filter_status_id,
        created_at_from: filters.filter_date_from,
        created_at_to: filters.filter_date_to
      },
      search: state.searchVal,
      checkAnnouncements: false,
      ...props
    }
    newsApi.getList(params).then((res) => {
      setState({
        data:
          params.check === true
            ? res.data.results
            : [...state.data, ...res.data.results],
        loading: false,
        recordsTotal: res.data.recordsTotal,
        page: params.check === true ? 2 : state.page + 1,
        hasMore: res.data.hasMore,
        orderType: params.orderType,
        ...stateParams
      })
    })
  }

  const toggleAddModal = (props) => {
    setState({
      addModal: !state.addModal,
      newsId: props
    })
  }

  const addBtn = ability.can("add", moduleName) ? (
    <Button.Ripple
      color="primary"
      onClick={() => {
        setModalTitle(useFormatMessage("modules.news.buttons.add"))
        toggleAddModal(0)
      }}>
      <i className="icpega Actions-Plus"></i> &nbsp;
      <span className="align-self-center">
        {useFormatMessage("modules.news.buttons.add")}
      </span>
    </Button.Ripple>
  ) : (
    ""
  )

  return (
    <Fragment>
      <Breadcrumbs
        list={[
          {
            title: useFormatMessage("modules.news.title")
          }
        ]}
        custom={addBtn}
      />

      <Card className="news">
        <CardHeader>
          <div className="d-flex flex-wrap w-100">
            {ability.can("manage", moduleName) ? (
              <div className="filter-dropdown department-filter">
                <FieldHandle
                  onChange={(e) => {
                    setState({
                      data: [],
                      hasMore: false,
                      loading: true,
                      page: 1
                    })
                    setFilters({
                      filter_status_id: e?.value || ""
                    })
                  }}
                  module={moduleName}
                  fieldData={{
                    ...metas.status,
                    field_form_require: false
                  }}
                  options={options}
                  defaultValue={options.status[1]}
                  nolabel
                  id="filter_status_id"
                  name="filter_status_id"
                  formGroupClass="mb-0"
                  isClearable={true}
                />
              </div>
            ) : (
              ""
            )}
            <div className="fliter-input department-filter">
              <FieldHandle
                onChange={(e) => {
                  setState({
                    data: [],
                    hasMore: false,
                    loading: true,
                    page: 1
                  })
                  setFilters({
                    filter_date_from: dateTimeToYMD(e)
                  })
                }}
                module={moduleName}
                fieldData={{
                  field_type: "date",
                  field_form_require: false
                }}
                nolabel
                id="filter_date_from"
                name="filter_date_from"
                formGroupClass="mb-0"
                placeholder="From"
              />
            </div>
            <div className="fliter-input department-filter">
              <FieldHandle
                onChange={(e) => {
                  setState({
                    data: [],
                    hasMore: false,
                    loading: true,
                    page: 1
                  })
                  setFilters({
                    filter_date_to: dateTimeToYMD(e)
                  })
                }}
                module={moduleName}
                fieldData={{
                  field_type: "date",
                  field_form_require: false
                }}
                nolabel
                id="filter_date_to"
                name="filter_date_to"
                formGroupClass="mb-0"
                placeholder="To"
              />
            </div>
            <div className="d-flex ms-auto">
              <ErpInput
                onChange={(e) => {
                  handleSearchVal(e)
                }}
                formGroupClass="search-filter"
                placeholder="Search"
                prepend={<i className="iconly-Search icli"></i>}
                nolabel
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {isEmpty(state.data) && !state.loading ? (
        <EmptyContent></EmptyContent>
      ) : (
        map(state.data, (item, index) => {
          return (
            <ListData
              key={index}
              data={item}
              ability={ability}
              loadData={loadData}
              toggleAddModal={toggleAddModal}
              setModalTitle={setModalTitle}
              checkAnnouncements={false}
            />
          )
        })
      )}

      {state.loading && (
        <Row className="news">
          <Col size="12" className="text-center mt-1 mb-3">
            <Spinner size="sm" className="me-50" />
          </Col>
        </Row>
      )}

      {state.hasMore && (
        <Row className="news">
          <Col size="12" className="text-center mt-1 mb-2">
            <Button className="btn" color="primary" onClick={() => loadData()}>
              {useFormatMessage("modules.news.load_more")}
            </Button>
          </Col>
        </Row>
      )}

      <AddNewsModal
        modal={state.addModal}
        toggleAddModal={toggleAddModal}
        loadData={loadData}
        metas={metas}
        options={options}
        module={module}
        optionsModules={optionsModules}
        modalTitle={state.modalTitle}
        newsId={state.newsId}
      />
    </Fragment>
  )
}

export default ListNews
