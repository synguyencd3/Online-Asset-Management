import { useEffect } from "react";
import { Pagination } from "react-bootstrap";


type Props = {
    currentPage: number;
    totalPage: number;
    totalElements: number;
    setCurrentPage: any;
    initFunction: () => void
}
export const PaginationComponent = ({ currentPage, totalPage, totalElements, setCurrentPage, initFunction }: Props) => {
    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage === totalPage-1;
    useEffect(() => {
        initFunction()
    }, [currentPage])


    const handlePageChange = (p: number) => {
        setCurrentPage(p)
    };

    const renderPageItems = () => {
        const items = [];
        for (let i = 0; i < totalPage; i++) {
            items.push(
                <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}> {i + 1} </Pagination.Item>
            );
        }
        return items;
    };

    return (
        <Pagination className="justify-content-end me-3">
            <Pagination.Prev disabled={isFirstPage || totalPage === 0} onClick={() => handlePageChange(currentPage - 1)}> Previous</Pagination.Prev>

            {renderPageItems()}

            <Pagination.Next disabled={isLastPage || totalPage === 0} onClick={() => handlePageChange(currentPage + 1)}> Next</Pagination.Next >
        </Pagination>
    );
}
