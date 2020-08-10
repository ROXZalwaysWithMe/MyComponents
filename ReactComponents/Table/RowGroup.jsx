import React, { memo, useRef, useEffect, useContext, useState, useMemo, useCallback } from 'react'
import styled from 'styled-components'

import { Context } from './index'
import Cell from './Cell'


const Row = styled.div`
    display: table-row;
    border-bottom: 1px solid #e6e6e6;
    height: 30px;
    &:hover{
        background-color: rgba(53, 124, 165, .2) !important;
    };
    >div{
        display:table-cell;
    }
`

const InsertRowStyle = styled.td`
    background-color: #eee;
    padding: 5px 10px;
`

export const InsertRow = memo((props) => {
    const {show, colSpan, content } = props
    return !!show && ( <Row>
        <InsertRowStyle colSpan={colSpan}>{content}</InsertRowStyle>
    </Row> ) 
})

const ChildRow = memo((props) => {
    const {row, isLeaf, handleExpand, level, expand, colsArray, dataKey, rowStyle, insertRow, insertMethod} = props
    const style = useMemo(() => typeof rowStyle === 'function' ? rowStyle(row) : rowStyle, [row, rowStyle])
    return (
        <>
            <Row style={style}>
                {
                    colsArray.map(col => {
                        const { cellRender, dataIndex, useExpand, wrap, align, cellStyle } = col.props
                        return (
                            <Cell 
                                key={col.key + '-' + row[dataKey]}
                                row={row}
                                dataIndex={dataIndex} 
                                renderer={cellRender} 
                                align={align} 
                                wrap={wrap} 
                                level={level} 
                                isLeaf={isLeaf}
                                useExpand={useExpand}
                                onExpand={handleExpand}
                                expand={expand}
                                style={cellStyle}
                                insertMethod={insertMethod}
                            />
                        )
                    })
                }
            </Row>
            <InsertRow show={!!insertRow} content={insertRow} colSpan={colsArray.length} />
        </>
    )
})

function RowGroup(props) {
    const { row } = props
    const { showMap, colsArray, dataKey, rowStyle, expandLevel, insertionMap, insertRow, dataSort } = useContext(Context)
    const show = props.show === void 0 ? true : props.show
    const level = props.level || 0
    const loaded = useRef({yeah: false})
    const [isExpand, setIsExpand] = useState(level < expandLevel)
    const curExpand = show ? isExpand : false
    const handleExpand = useCallback(() => setIsExpand(val => !val), [])

    useEffect(() => {
        if (loaded.current.yeah && show !== isExpand) setIsExpand(show)
        else loaded.current.yeah = true
        // eslint-disable-next-line
    }, [show]);

    useEffect(() => {
        if ((level < expandLevel) !== isExpand) setIsExpand(level < expandLevel)
    }, [expandLevel])

    const renderGroup = useCallback(() => {
        let arr = []
        if (row.children && row.children.length) arr = dataSort ? [...row.children].sort(dataSort) : row.children
        return arr.map(child => (
            <RowGroup 
                key={'parent-' + child[dataKey]}
                show={curExpand} 
                row={child} 
                level={level+1} 
            />
        ))
    }, [dataSort, row.children, curExpand, level])

    const renderRow = show && showMap[row[dataKey]] ? (
        <ChildRow 
            level={level} 
            handleExpand={handleExpand} 
            row={row} 
            isLeaf={row.children && row.children.length ? false : true}
            expand={curExpand} 
            rowStyle={rowStyle}
            colsArray={colsArray}
            dataKey={dataKey}
            insertRow={insertionMap[row[dataKey]]}
            insertMethod={insertRow}
        /> 
    ) : null
    
    return (
        <>
            {renderRow}
            {renderGroup()}
        </>
    )
}

export default React.memo(RowGroup)