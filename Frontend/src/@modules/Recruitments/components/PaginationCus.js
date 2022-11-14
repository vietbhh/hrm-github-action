// ** React Imports
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

const PaginationCus = (props) => {
    // ** Props
    const { currentPage, pagination, loadData } = props;
    const numPages = Math.ceil(pagination.toltalRow / pagination.perPage);
    const handlePagination = (e) => {
        if (e === currentPage) return;
        if (e <= 0) return;
        if (e > numPages) return;
        loadData({ page: e });
    };

    const renderQuests = () => {
        const numb = [];
        for (let i = 1; i <= numPages; i++) {
            numb.push(
                <PaginationItem
                    key={i}
                    active={currentPage === i}
                    readOnly={currentPage === i}
                    onClick={() => handlePagination(i)}
                >
                    <PaginationLink>{i}</PaginationLink>
                </PaginationItem>
            );
        }
        return numb;
    };

    return (
        <Pagination aria-label="Page navigation example">
            <PaginationItem disabled={currentPage === 1}>
                <PaginationLink first />
            </PaginationItem>
            <PaginationItem
                disabled={currentPage === 1}
                onClick={() => handlePagination(currentPage - 1)}
            >
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
    );
};

export default PaginationCus;
