import React, { useState } from 'react'
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi'

interface PaginatedListProps {
    children: React.ReactNode[]
    itemsPerPage?: number
    className?: string
}

const PaginatedList: React.FC<PaginatedListProps> = ({
    children,
    itemsPerPage = 10,
    className,
}) => {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(children.length / itemsPerPage)

    const handleClick = (pageNumber: number) => {
        setCurrentPage(pageNumber)
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const renderPagination = () => {
        const pages = []

        if (totalPages <= 5) {
            // Display all pages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(
                    <button
                        key={i}
                        onClick={() => handleClick(i)}
                        disabled={i === currentPage}
                        className={`px-2 py-1 mx-1 border text-white rounded ${
                            i === currentPage ? 'bg-gray-300 !text-black' : ''
                        }`}
                    >
                        {i}
                    </button>
                )
            }
        } else {
            // Display first pages, ellipsis, current page, next page, ellipsis, last pages
            if (currentPage <= 3) {
                for (let i = 1; i <= Math.min(3, totalPages); i++) {
                    pages.push(
                        <button
                            key={i}
                            onClick={() => handleClick(i)}
                            disabled={i === currentPage}
                            className={`px-2 py-1 mx-1 border text-white rounded ${
                                i === currentPage ? 'bg-gray-300 !text-black' : ''
                            }`}
                        >
                            {i}
                        </button>
                    )
                }
                if (totalPages > 4) {
                    pages.push(
                        <span key="ellipsis1" className="px-2 py-1 mx-1">
                            ...
                        </span>
                    )
                    pages.push(
                        <button
                            key={totalPages - 1}
                            onClick={() => handleClick(totalPages - 1)}
                            className="px-2 py-1 mx-1 text-white border rounded"
                        >
                            {totalPages - 1}
                        </button>
                    )
                    pages.push(
                        <button
                            key={totalPages}
                            onClick={() => handleClick(totalPages)}
                            className="px-2 py-1 mx-1 text-white border rounded"
                        >
                            {totalPages}
                        </button>
                    )
                }
            } else if (currentPage >= totalPages - 2) {
                pages.push(
                    <button
                        key={1}
                        onClick={() => handleClick(1)}
                        className="px-2 py-1 mx-1 text-white border rounded"
                    >
                        1
                    </button>
                )
                pages.push(
                    <button
                        key={2}
                        onClick={() => handleClick(2)}
                        className="px-2 py-1 mx-1 text-white border rounded"
                    >
                        2
                    </button>
                )
                pages.push(
                    <span key="ellipsis2" className="px-2 py-1 mx-1">
                        ...
                    </span>
                )
                for (let i = totalPages - 2; i <= totalPages; i++) {
                    pages.push(
                        <button
                            key={i}
                            onClick={() => handleClick(i)}
                            disabled={i === currentPage}
                            className={`px-2 py-1 mx-1 text-white border rounded ${
                                i === currentPage ? 'bg-gray-300 !text-black' : ''
                            }`}
                        >
                            {i}
                        </button>
                    )
                }
            } else {
                pages.push(
                    <button
                        key={1}
                        onClick={() => handleClick(1)}
                        className="px-2 py-1 mx-1 text-white border rounded"
                    >
                        1
                    </button>
                )
                pages.push(
                    <span key="ellipsis1" className="px-2 py-1 mx-1">
                        ...
                    </span>
                )

                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(
                        <button
                            key={i}
                            onClick={() => handleClick(i)}
                            disabled={i === currentPage}
                            className={`px-2 py-1 mx-1 text-white border rounded ${
                                i === currentPage ? 'bg-gray-300 !text-black' : ''
                            }`}
                        >
                            {i}
                        </button>
                    )
                }

                pages.push(
                    <span key="ellipsis2" className="px-2 py-1 mx-1">
                        ...
                    </span>
                )
                pages.push(
                    <button
                        key={totalPages - 1}
                        onClick={() => handleClick(totalPages - 1)}
                        className="px-2 py-1 mx-1 text-white border rounded"
                    >
                        {totalPages - 1}
                    </button>
                )
                pages.push(
                    <button
                        key={totalPages}
                        onClick={() => handleClick(totalPages)}
                        className="px-2 py-1 mx-1 text-white border rounded"
                    >
                        {totalPages}
                    </button>
                )
            }
        }

        return (
            <div className="flex justify-center mt-4">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="px-2 py-1 mx-1 border rounded"
                >
                    <HiArrowLeft />
                </button>
                {pages}
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 mx-1 border rounded"
                >
                    <HiArrowRight />
                </button>
            </div>
        )
    }

    const startIndex = (currentPage - 1) * itemsPerPage
    const currentItems = children.slice(startIndex, startIndex + itemsPerPage)

    return (
        <div className='w-full'>
            <div className={`${className}`}>{currentItems}</div>
            {renderPagination()}
        </div>
    )
}

export default PaginatedList
