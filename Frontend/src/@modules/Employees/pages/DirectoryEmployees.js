import Breadcrumbs from "@apps/components/common/Breadcrumbs";
import { ErpInput } from "@apps/components/common/ErpField";
import { useFormatMessage, useMergedState } from "@apps/utility/common";
import { FieldHandle } from "@apps/utility/FieldHandler";
import { defaultModuleApi } from "@apps/utility/moduleApi";
import { debounce, isEmpty, map } from "lodash-es";
import { Fragment, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Button, Card, CardBody, Col, Row } from "reactstrap";
import CardUser from "../components/CardUser";
const DirectoryEmployees = (props) => {
  const [state, setState] = useMergedState({
    data: [],
    hasMore: false,
    loading: true,
    page: 1,
    office: "",
    job_title_id: "",
    department_id: "",
    group_id: "",
    searchVal: ""
  });
  const moduleData = useSelector((state) => state.app.modules.employees);
  const { metas } = moduleData;
  const name = moduleData.config.name;
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
  ).current;

  const handleSearchVal = (e) => {
    const value = e.target.value;
    debounceSearch(value.toLowerCase());
  };

  useEffect(() => {
    loadData();
  }, [
    state.job_title_id,
    state.office,
    state.department_id,
    state.group_id,
    state.searchVal
  ]);
  const loadData = () => {
    defaultModuleApi
      .getUsers({
        perPage: 12,
        page: state.page,
        search: state.searchVal,
        filters: {
          job_title_id: state.job_title_id,
          department_id: state.department_id,
          office: state.office,
          group_id: state.group_id
        }
      })
      .then((res) => {
        setState({
          data: [...state.data, ...res.data.results],
          hasMore: res.data.hasMore,
          loading: false,
          page: state.page + 1
        });
      });
  };
  return (
    <Fragment>
      <Breadcrumbs
        list={[
          {
            title: useFormatMessage("menu.directory")
          }
        ]}
        style={{
          marginBottom: "2px",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0
        }}
      />
      <Card
        className="employees_list_tbl no-box-shadow"
        style={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0
        }}
      >
        <CardBody className="d-flex flex-wrap w-100">
          <div className="filter-dropdown title-filter">
            <FieldHandle
              module={name}
              fieldData={{
                ...metas.office,
                field_form_require: false
              }}
              nolabel
              id="filter_office"
              name="filter_office"
              formGroupClass="mb-0"
              placeholder="All Offices"
              isClearable={true}
              onChange={(e) => {
                setState({
                  office: e?.value || "",
                  data: [],
                  hasMore: false,
                  loading: true,
                  page: 1
                });
              }}
            />
          </div>
          <div className="filter-dropdown department-filter">
            <FieldHandle
              module={name}
              fieldData={{
                ...metas.department_id,
                field_form_require: false
              }}
              nolabel
              id="filter_department_id"
              name="filter_department_id"
              formGroupClass="mb-0"
              placeholder="All Departments"
              isClearable={true}
              onChange={(e) => {
                setState({
                  department_id: e?.value || "",
                  data: [],
                  hasMore: false,
                  loading: true,
                  page: 1
                });
              }}
            />
          </div>
          <div className="filter-dropdown group-filter">
            <FieldHandle
              module={name}
              fieldData={{
                ...metas.group_id,
                field_form_require: false
              }}
              nolabel
              id="filter_group_id"
              name="filter_group_id"
              formGroupClass="mb-0 w-100"
              placeholder="All Groups"
              isClearable={true}
              onChange={(e) => {
                setState({
                  group_id: e?.value || "",
                  data: [],
                  hasMore: false,
                  loading: true,
                  page: 1
                });
              }}
            />
          </div>
          <div className="filter-dropdown title-filter">
            <FieldHandle
              module={name}
              fieldData={{
                ...metas.job_title_id
              }}
              nolabel
              id="filter_job_title_id"
              name="filter_job_title_id"
              formGroupClass="mb-0"
              placeholder="All Job Titles"
              isClearable={true}
              onChange={(e) => {
                setState({
                  job_title_id: e?.value || "",
                  data: [],
                  hasMore: false,
                  loading: true,
                  page: 1
                });
              }}
            />
          </div>
          <div
            className="filter-dropdown"
            style={{
              flex: 1
            }}
          >
            <ErpInput
              onChange={(e) => {
                handleSearchVal(e);
              }}
              formGroupClass="search-filter"
              placeholder="Search"
              prepend={<i className="iconly-Search icli"></i>}
              nolabel
            />
          </div>
        </CardBody>
      </Card>
      <div className="mb-5">
        {!isEmpty(state.data) && (
          <Fragment>
            <div className="row">
              {map(state.data, (item, index) => {
                return (
                  <Col md={3} key={index}>
                    <CardUser data={item} />
                  </Col>
                );
              })}
            </div>
          </Fragment>
        )}
        {state.hasMore && (
          <Row>
            <Col size="12" className="text-center mt-1">
              <Button className="btn" color="primary" onClick={loadData}>
                Load More
              </Button>
            </Col>
          </Row>
        )}
      </div>
    </Fragment>
  );
};

export default DirectoryEmployees;
