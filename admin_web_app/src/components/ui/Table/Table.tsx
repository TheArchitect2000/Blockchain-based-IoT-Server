import React, { useState } from 'react'
import { forwardRef } from 'react'
import classNames from 'classnames'
import Pagination from './Pagination'
import type { ComponentPropsWithRef, ElementType } from 'react'

export interface TableProps extends ComponentPropsWithRef<'table'> {
    asElement?: ElementType
    borderlessRow?: boolean
    compact?: boolean
    hoverable?: boolean
    overflow?: boolean
    rowsPerPage?: number
}

const Table = forwardRef<HTMLElement, TableProps>((props, ref) => {
    const {
        asElement: Component = 'table',
        borderlessRow,
        children,
        className,
        compact = false,
        hoverable = true,
        overflow = true,
        rowsPerPage,
        ...rest
    } = props

    const [currentPage, setCurrentPage] = useState(1)

    const childrenArray = React.Children.toArray(children) as any
    const rows = React.Children.toArray(childrenArray[1]?.props.children) || []

    const totalItems = rows.length
    const startIndex = (rowsPerPage && (currentPage - 1) * rowsPerPage) || 0
    const endIndex = rowsPerPage && startIndex + rowsPerPage
    const currentItems =
        (rowsPerPage && rows.slice(startIndex, endIndex)) || rows

    const updatedChildrenArray = [
        childrenArray[0],
        React.cloneElement(childrenArray[1], {}, currentItems),
    ]

    const tableClass = classNames(
        Component === 'table' ? 'table-default' : 'table-flex',
        hoverable && 'table-hover',
        compact && 'table-compact',
        borderlessRow && 'borderless-row',
        className
    )

    return (
        <div className={classNames(overflow && 'overflow-x-auto')}>
            <Component className={tableClass} {...rest} ref={ref}>
                {updatedChildrenArray}
            </Component>
            {rowsPerPage && (
                <Pagination
                    totalItems={totalItems}
                    itemsPerPage={rowsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    )
})

Table.displayName = 'Table'

export default Table
