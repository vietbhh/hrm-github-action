// ** React Imports
import { Fragment, useCallback, useEffect, useState } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components
import { Table, Pagination } from "rsuite"
import { ErpCheckbox } from "@apps/components/common/ErpField"
import Photo from "@apps/modules/download/pages/Photo"

const { Column, HeaderCell, Cell } = Table

const TableAssetList = (props) => {
  const {
    // ** props
    loadingTable,
    displayCheckbox,
    totalRecord,
    listData,
    chosenAssetList,
    loadDataFromApi,
    filter,
    // ** methods
    setChosenAssetList,
    setFilterByObj
  } = props

  const [isReady, setIsReady] = useState(false)
  const [limit, setLimit] = useState(30)
  const [page, setPage] = useState(1)
  const [sortColumn, setSortColumn] = useState()
  const [sortType, setSortType] = useState()
  const [loading, setLoading] = useState(false)
  const [listAssetPaginate, setListAssetPaginate] = useState({})
  const [checkAll, setCheckAll] = useState(false)

  const getData = () => {
    if (sortColumn && sortType) {
      return listData.sort((a, b) => {
        let x = a[sortColumn]
        let y = b[sortColumn]
        if (typeof x === "string") {
          x = x.charCodeAt()
        }
        if (typeof y === "string") {
          y = y.charCodeAt()
        }
        if (sortType === "asc") {
          return x - y
        } else {
          return y - x
        }
      })
    }

    return listData
  }

  const handleSortColumn = (sortColumn, sortType) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSortColumn(sortColumn)
      setSortType(sortType)
    }, 500)
  }

  const handleCheckAll = (checked) => {
    if (checked) {
      setCheckAll(true)
      const newListAssetPaginate = { ...listAssetPaginate }
      newListAssetPaginate[page] = {
        ...newListAssetPaginate[page],
        checked: true
      }
      setListAssetPaginate(newListAssetPaginate)
      const newChosen = [...chosenAssetList]
      listData.map((item) => {
        newChosen.push(item)
      })
      setChosenAssetList(newChosen)
    } else {
      setCheckAll(false)
      const newListAssetPaginate = { ...listAssetPaginate }
      newListAssetPaginate[page] = {
        ...newListAssetPaginate[page],
        checked: false
      }
      setListAssetPaginate(newListAssetPaginate)
      const newChosen = [...chosenAssetList].filter((itemAssetList) => {
        return !listData.some(
          (itemListData) => itemListData.id === itemAssetList.id
        )
      })
      setChosenAssetList(newChosen)
    }
  }

  const handleCheck = (value, checked) => {
    const newChosen = checked
      ? [...chosenAssetList, value]
      : chosenAssetList.filter((item) => {
          return item.id !== value.id
        })

    setChosenAssetList(newChosen)
  }

  const handleChangeLimit = (dataKey) => {
    if (loadDataFromApi === true) {
      setListAssetPaginate({})
      setFilterByObj({
        page: 1,
        limit: dataKey
      })
    } else {
      setPage(1)
      setLimit(dataKey)
    }
  }

  const handleChangePage = (page) => {
    if (loadDataFromApi === true) {
      setFilterByObj({
        page: page
      })
    } else {
      setPage(page)
    }
  }

  // ** effect
  useEffect(() => {
    if (loadDataFromApi === true) {
      setLimit(filter.limit === undefined ? 30 : filter.limit)
      setPage(filter.page === undefined ? 1 : filter.page)
      setIsReady(true)
    } else {
      setLimit(30)
      setPage(1)
      setIsReady(true)
    }
  }, [loadDataFromApi, filter])

  useEffect(() => {
    if (loadDataFromApi === true) {
      setListAssetPaginate({
        ...listAssetPaginate,
        [page]: {
          checked: checkAll,
          data: listData
        }
      })
    }
  }, [listData])

  useEffect(() => {
    if (
      loadDataFromApi === true &&
      Object.keys(listAssetPaginate).length > 0 &&
      page !== undefined
    ) {
      const currentListAssetPaginate = listAssetPaginate[page]
      setCheckAll(
        currentListAssetPaginate?.checked === undefined
          ? checkAll
          : currentListAssetPaginate.checked
      )
    }
  }, [page])

  // ** render
  const AssetNameCell = useCallback(
    (props) => {
      const { field, rowData, cellProps } = props
      return (
        <Cell {...props}>
          <div className="d-flex justify-content-left align-items-center text-dark">
            <Photo
              src={
                !_.isEmpty(rowData.recent_image) && rowData.recent_image?.url
              }
              width="60px"
              className="rounded"
            />

            <div className="d-flex flex-column cursor ms-1">
              <p className="text-truncate mb-0">
                <span className="font-weight-bold name-asset-table">
                  {rowData?.asset_type?.label}
                </span>
                <br />
                <span className="font-weight-bold name-asset-table">
                  {rowData?.asset_code}
                </span>
                <br />
                <span className="font-weight-bold name-asset-table">
                  {rowData?.asset_group_code}
                </span>
              </p>
            </div>
          </div>
        </Cell>
      )
    },
    [listData]
  )

  const CheckCell = ({
    rowData,
    dataKey,
    onChange,
    chosenAssetList,
    ...props
  }) => {
    return (
      <Cell {...props}>
        <ErpCheckbox
          inline
          onChange={(e) => {
            handleCheck(rowData, e.target.checked)
          }}
          checked={chosenAssetList.some(
            (item) =>
              parseInt(item.id) === parseInt(rowData[dataKey]) ||
              item.id === rowData[dataKey]
          )}
          id={`select_row_${rowData[dataKey]}`}
          name={`select_row_${rowData[dataKey]}`}
        />
      </Cell>
    )
  }

  return (
    <Fragment>
      <Table
        data={getData()}
        autoHeight={true}
        rowHeight={90}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
        loading={isReady && (loadDataFromApi === true ? loadingTable : loading)}
        affixHorizontalScrollbar>
        {displayCheckbox && (
          <Column width={50} align="center" fixed verticalAlign="middle">
            <HeaderCell>
              <div style={{ lineHeight: "40px" }}>
                <ErpCheckbox
                  id="select_all_row"
                  name="select_all_row"
                  inline
                  checked={checkAll}
                  onChange={(e) => {
                    handleCheckAll(e.target.checked)
                  }}
                />
              </div>
            </HeaderCell>
            <CheckCell
              dataKey="id"
              chosenAssetList={chosenAssetList}
              onChange={handleCheck}
            />
          </Column>
        )}
        <Column width={300} align="left" fixed verticalAlign="middle" sortable>
          <HeaderCell>
            {useFormatMessage("modules.asset_lists.fields.asset_name")}
          </HeaderCell>
          <AssetNameCell dataKey="asset_code" />
        </Column>
        <Column flexGrow={1} align="left" fixed verticalAlign="middle" fullText>
          <HeaderCell>
            {useFormatMessage("modules.asset_lists.fields.asset_descriptions")}
          </HeaderCell>
          <Cell dataKey="asset_descriptions" />
        </Column>
        <Column width={130} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.asset_brands.fields.brand_name")}
          </HeaderCell>
          <Cell dataKey="brand_name" />
        </Column>

        <Column width={100} align="left" fixed verticalAlign="middle">
          <HeaderCell>
            {useFormatMessage("modules.asset_lists.fields.asset_status")}
          </HeaderCell>
          <Cell dataKey="status_name" />
        </Column>
      </Table>
      <div className="mt-1">
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          maxButtons={5}
          size="xs"
          layout={["total", "-", "limit", "|", "pager", "skip"]}
          total={loadDataFromApi === true ? totalRecord : listData.length}
          limitOptions={[10, 30, 50]}
          limit={limit}
          activePage={page}
          onChangePage={handleChangePage}
          onChangeLimit={handleChangeLimit}
        />
      </div>
    </Fragment>
  )
}

export default TableAssetList
