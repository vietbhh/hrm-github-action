// ** React Imports
import { Fragment } from "react"
// ** Styles
import { Pagination, PaginationItem, PaginationLink } from "reactstrap"
// ** Components

const PaginationOvertime = (props) => {
  const {
    // ** props
    filter,
    listOvertime,
    // ** methods
    setFilter
  } = props

  const currentPage = filter.page
  const perPage = filter.limit
  const numPages = Math.ceil(listOvertime.length / perPage)

  const handlePagination = (page) => {
    if (page === currentPage) return
    if (page <= 0) return
    if (page > numPages) return
    setFilter({ ...filter, page: page })
  }

  const renderQuests = () => {
    const numb = []
    for (let i = 1; i <= numPages; i++) {
      numb.push(
        <PaginationItem
          key={i}
          active={currentPage === i}
          readOnly={currentPage === i}
          onClick={() => handlePagination(i)}>
          <PaginationLink>{i}</PaginationLink>
        </PaginationItem>
      )
    }
    return numb
  }

  // ** render
  const renderComponent = () => {
    if (numPages > 1) {
      return (
        <Fragment>
          <Pagination
            aria-label="Page navigation example"
            className="w-100 d-flex justify-content-start mt-2">
            <PaginationItem disabled={currentPage === 1}>
              <PaginationLink first />
            </PaginationItem>
            <PaginationItem
              disabled={currentPage === 1}
              onClick={() => handlePagination(currentPage - 1)}>
              <PaginationLink previous />
            </PaginationItem>
            {renderQuests()}
            <PaginationItem disabled={currentPage === numPages}>
              <PaginationLink
                next
                onClick={() => handlePagination(currentPage + 1)}
              />
            </PaginationItem>
            <PaginationItem disabled={currentPage === numPages}>
              <PaginationLink last />
            </PaginationItem>
          </Pagination>
        </Fragment>
      )
    }

    return ""
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default PaginationOvertime
