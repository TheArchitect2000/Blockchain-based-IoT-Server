// src/Table.tsx
import React, { useState } from 'react';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';

interface TableProps {
  data: Array<{ [key: string]: any }>;
  rowsPerPage?: number;
}

const Table2D: React.FC<TableProps> = ({ data, rowsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderPagination = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handleClick(i)}
            disabled={i === currentPage}
            className={`px-2 py-1 mx-1 border rounded ${
              i === currentPage ? 'bg-gray-300 text-black' : 'text-white'
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= Math.min(3, totalPages); i++) {
          pages.push(
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={i === currentPage}
              className={`px-2 py-1 mx-1 border rounded ${
                i === currentPage ? 'bg-gray-300 text-black' : 'text-white'
              }`}
            >
              {i}
            </button>
          );
        }
        if (totalPages > 4) {
          pages.push(<span key="ellipsis1" className="px-2 py-1 mx-1">...</span>);
          pages.push(
            <button
              key={totalPages - 1}
              onClick={() => handleClick(totalPages - 1)}
              className="px-2 py-1 mx-1 text-white border rounded"
            >
              {totalPages - 1}
            </button>
          );
          pages.push(
            <button
              key={totalPages}
              onClick={() => handleClick(totalPages)}
              className="px-2 py-1 mx-1 text-white border rounded"
            >
              {totalPages}
            </button>
          );
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
        );
        pages.push(
          <button
            key={2}
            onClick={() => handleClick(2)}
            className="px-2 py-1 mx-1 text-white border rounded"
          >
            2
          </button>
        );
        pages.push(<span key="ellipsis2" className="px-2 py-1 mx-1">...</span>);
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={i === currentPage}
              className={`px-2 py-1 mx-1 text-white border rounded ${
                i === currentPage ? 'bg-gray-300 text-black' : ''
              }`}
            >
              {i}
            </button>
          );
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
        );
        pages.push(<span key="ellipsis1" className="px-2 py-1 mx-1">...</span>);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={i === currentPage}
              className={`px-2 py-1 mx-1 text-white border rounded ${
                i === currentPage ? 'bg-gray-300 text-black' : ''
              }`}
            >
              {i}
            </button>
          );
        }
        pages.push(<span key="ellipsis2" className="px-2 py-1 mx-1">...</span>);
        pages.push(
          <button
            key={totalPages - 1}
            onClick={() => handleClick(totalPages - 1)}
            className="px-2 py-1 mx-1 text-white border rounded"
          >
            {totalPages - 1}
          </button>
        );
        pages.push(
          <button
            key={totalPages}
            onClick={() => handleClick(totalPages)}
            className="px-2 py-1 mx-1 text-white border rounded"
          >
            {totalPages}
          </button>
        );
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
    );
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = data.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            {Object.keys(data[0]).map((key, index) => (
              <th key={index} className="px-4 py-2 border">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((value, colIndex) => (
                <td key={colIndex} className="px-4 py-2 border">{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {renderPagination()}
    </div>
  );
};

export default Table2D;
