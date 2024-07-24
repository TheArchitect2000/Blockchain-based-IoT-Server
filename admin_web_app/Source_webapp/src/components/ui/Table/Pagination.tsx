import React from 'react'
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi'
import classNames from 'classnames'

interface PaginationProps {
    totalItems: number
    itemsPerPage: number
    currentPage: number
    onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page)
        }
    }

    const renderPageNumbers = () => {
        const pages = []

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(
                    <button
                        key={i}
                        className={classNames('px-2 py-1 mx-1 border text-white rounded', {
                            'bg-gray-300 text-black': i === currentPage,
                        })}
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </button>
                )
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 3; i++) {
                    pages.push(
                        <button
                            key={i}
                            className={classNames('px-2 py-1 mx-1 border text-white rounded', {
                                'bg-gray-300 text-black': i === currentPage,
                            })}
                            onClick={() => handlePageChange(i)}
                        >
                            {i}
                        </button>
                    )
                }
                pages.push(<span key="ellipsis1" className="px-2 py-1 mx-1">...</span>)
                pages.push(
                    <button
                        key={totalPages - 1}
                        className="px-2 py-1 mx-1 border text-white rounded"
                        onClick={() => handlePageChange(totalPages - 1)}
                    >
                        {totalPages - 1}
                    </button>
                )
                pages.push(
                    <button
                        key={totalPages}
                        className="px-2 py-1 mx-1 border text-white rounded"
                        onClick={() => handlePageChange(totalPages)}
                    >
                        {totalPages}
                    </button>
                )
            } else if (currentPage >= totalPages - 2) {
                pages.push(
                    <button
                        key={1}
                        className="px-2 py-1 mx-1 border text-white rounded"
                        onClick={() => handlePageChange(1)}
                    >
                        1
                    </button>
                )
                pages.push(
                    <button
                        key={2}
                        className="px-2 py-1 mx-1 border text-white rounded"
                        onClick={() => handlePageChange(2)}
                    >
                        2
                    </button>
                )
                pages.push(<span key="ellipsis2" className="px-2 py-1 mx-1">...</span>)
                for (let i = totalPages - 2; i <= totalPages; i++) {
                    pages.push(
                        <button
                            key={i}
                            className={classNames('px-2 py-1 mx-1 border text-white rounded', {
                                'bg-gray-300 text-black': i === currentPage,
                            })}
                            onClick={() => handlePageChange(i)}
                        >
                            {i}
                        </button>
                    )
                }
            } else {
                pages.push(
                    <button
                        key={1}
                        className="px-2 py-1 mx-1 border text-white rounded"
                        onClick={() => handlePageChange(1)}
                    >
                        1
                    </button>
                )
                pages.push(<span key="ellipsis1" className="px-2 py-1 mx-1">...</span>)

                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(
                        <button
                            key={i}
                            className={classNames('px-2 py-1 mx-1 border text-white rounded', {
                                'bg-gray-300 text-black': i === currentPage,
                            })}
                            onClick={() => handlePageChange(i)}
                        >
                            {i}
                        </button>
                    )
                }

                pages.push(<span key="ellipsis2" className="px-2 py-1 mx-1">...</span>)
                pages.push(
                    <button
                        key={totalPages - 1}
                        className="px-2 py-1 mx-1 border text-white rounded"
                        onClick={() => handlePageChange(totalPages - 1)}
                    >
                        {totalPages - 1}
                    </button>
                )
                pages.push(
                    <button
                        key={totalPages}
                        className="px-2 py-1 mx-1 border text-white rounded"
                        onClick={() => handlePageChange(totalPages)}
                    >
                        {totalPages}
                    </button>
                )
            }
        }

        return (
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 mx-1 border rounded"
                >
                    <HiArrowLeft />
                </button>
                {pages}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 mx-1 border rounded"
                >
                    <HiArrowRight />
                </button>
            </div>
        )
    }

    return renderPageNumbers()
}

export default Pagination
