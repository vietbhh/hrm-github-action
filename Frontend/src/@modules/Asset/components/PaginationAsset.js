// ** React Imports
import { Pagination } from "antd"
const PaginationAsset = (props) => {
    // ** Props
    const { currentPage, pagination, loadData, pageNeighbours } = props
    const numPages = Math.ceil(pagination.toltalRow / pagination.perPage)
    const handlePagination = (e) => {
        if (e === currentPage) return
        if (e <= 0) return
        if (e > numPages) return
        loadData({ page: e })
    }

    return (
        <Pagination
            current={currentPage}
            total={pagination.toltalRow}
            pageSize={pagination.perPage}
            showSizeChanger={false}
            showLessItems={true}
            onChange={(page, pageSize) => {
                handlePagination(page)
            }}
        />
    )
}

export default PaginationAsset