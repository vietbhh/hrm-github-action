// ** React Imports
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import { FormLoader } from "@apps/components/spinner/FormLoader"
import {
  getOptionValue,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { Pagination, Table, Tag } from "antd"
import { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { Col, Row } from "reactstrap"
import { testApi } from "../common/api"
import TestBoardLayout from "./TestBoardLayout"
const TestHistory = (props) => {
  // ** Props
  const candidate_test = useSelector(
    (state) => state.app.modules.candidate_test
  )
  const module = candidate_test.config
  const moduleName = module.name
  const metas = candidate_test.metas
  const options = candidate_test.options

  const moduleTest = useSelector((state) => state.app.modules.test)
  const metasTest = moduleTest.metas
  const optionsTest = moduleTest.options
  const [state, setState] = useMergedState({
    loading: false,
    dataList: [],
    dataFM: [],
    filters: {},
    currentPage: 1,
    perPage: 10,
    recordsTotal: 0
  })

  const loadData = (data = {}) => {
    setState({ loading: true })
    testApi.getTestHistory(data).then((res) => {
      setState({
        loading: false,
        dataList: res.data.data,
        recordsTotal: res.data.recordsTotal
      })
    })
  }

  const columns = [
    {
      title: "Name Test",
      dataIndex: "title_test",
      key: "title_test",
      render: (text) => <a>{text}</a>
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date"
    },
    {
      title: "Performer",
      dataIndex: "performer",
      key: "performer"
    },
    {
      title: "Performer type",
      dataIndex: "performer_type",
      key: "performer_type",
      render: (text) => useFormatMessage(text)
    },
    {
      title: "Result",
      dataIndex: "result",
      key: "result",
      render: (_, obj) => {
        const result = JSON.parse(obj.result)
        return (
          <div className="d-flex">
            {Object.keys(result).map((key, item) => {
              let color = "green"
              if (key === "D") color = "red"
              if (key === "I") color = "yellow"
              if (key === "S") color = "green"
              if (key === "C") color = "blue"
              return (
                <Fragment key={`test_` + key}>
                  <Tag color={color} key={123123123}>
                    {key} - {result[key]}
                  </Tag>
                </Fragment>
              )
            })}
          </div>
        )
      }
    }
  ]

  const fmData = (arr) => {
    const arrResult = []
    arr.map((item) => {
      const performer_type = item?.performer_type?.value
      let performer = item?.candidate?.label
      if (
        performer_type * 1 ===
        getOptionValue(options, "performer_type", "employees")
      ) {
        performer = item?.employees?.label
      }
      const obj = {
        title_test: item?.question?.label,
        date: item?.time,
        performer: performer,
        result: item?.point,
        performer_type: item?.performer_type?.label
      }
      arrResult.push(obj)
    })
    setState({ dataFM: arrResult })
  }

  useEffect(() => {
    fmData(state.dataList)
  }, [state.dataList])

  useEffect(() => {
    loadData({
      filters: state.filters,
      page: state.currentPage,
      perPage: state.perPage
    })
  }, [state.filters, state.currentPage])

  const fieldType = { ...metasTest.type }
  fieldType.field_type = "select_option"
  fieldType.field_options_values = {
    ...fieldType.field_options_values,
    default: ""
  }

  const fieldPerformer_type = { ...metas.performer_type }
  fieldPerformer_type.field_options_values = {
    ...fieldPerformer_type.field_options_values,
    default: ""
  }
  const pageChange = (e) => {
    setState({ currentPage: e })
  }
  return (
    <>
      <TestBoardLayout
        breadcrumbs={
          <Breadcrumbs
            list={[
              {
                title: useFormatMessage("modules.test.title.test_board")
              },
              {
                title: useFormatMessage("modules.test.text.history")
              }
            ]}
          />
        }>
        <Row>
          <Col sm={3}>
            <FieldHandle
              module={moduleName}
              nolabel
              fieldData={fieldPerformer_type}
              options={options}
              onChange={(e) =>
                setState({
                  filters: {
                    ...state.filters,
                    performer_type: e ? e.value : 0
                  },
                  currentPage: 1
                })
              }
            />
          </Col>

          <Col sm={3}>
            <FieldHandle
              module={"test"}
              nolabel
              inline
              fieldData={fieldType}
              options={optionsTest}
              onChange={(e) => {
                setState({
                  filters: { ...state.filters, typeTest: e ? e.value : 0 },
                  currentPage: 1
                })
              }}
            />
          </Col>
          <Col sm={12} className="mt-1">
            {!state.loading && (
              <>
                {" "}
                <Table
                  columns={columns}
                  dataSource={state.dataFM}
                  pagination={false}
                />
                <div className="mt-2 ant-pagination ant-table-pagination ant-table-pagination-right">
                  <Pagination
                    onChange={pageChange}
                    defaultCurrent={state.currentPage}
                    total={state.recordsTotal}
                    className="ms-auto"
                  />
                </div>
              </>
            )}
          </Col>
          {state.loading && <FormLoader className="mt-3" />}
        </Row>
      </TestBoardLayout>
    </>
  )
}

export default TestHistory
