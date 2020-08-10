import React, { useMemo, useRef } from 'react'
import styled from 'styled-components'

import ExpandButton from './ExpandButton'

const getLevelLeft = (useExpand, level) => {
    let res = level * 2 * 14 || 2
    if (useExpand) res += 22
    return res + 'px'
}

const Td = styled.div`
    box-sizing: border-box;
    position: relative;
    padding: 2px 3px;
    padding-left: ${({useExpand, level}) => getLevelLeft(useExpand, level)};
    color: #444;
    font-size: 14px;
    white-space: ${({wrap}) => wrap ? 'pre-wrap' : 'nowrap'};
    text-overflow: ${({wrap}) => wrap ? '' : 'ellipsis'};
    text-align: ${({align}) => align};
    vertical-align: middle;
    overflow: hidden;
    .table-expand-button{
        position: absolute;
        top: 50%;
        z-index: 1;
        cursor: pointer;
        transform: translateY(-50%);
        left: ${({level}) => (level * 2 * 14 || 2) + 'px' }
    }
`

function isBlank (content) {
    return content === '' || content === void 0 || content === null
}
function Cell(props) {
    const tdRef = useRef(null)
    
    const {style, expand, onExpand, useExpand, align, wrap, level, renderer, row={}, dataIndex, isLeaf, insertMethod, fullRow} = props
    const value = row[dataIndex]
    const content = renderer ? typeof renderer === 'function' ? renderer(row[dataIndex], row, insertMethod, tdRef) : renderer : row[dataIndex]

    return useMemo(() =>
        isBlank(content) ? (<div style={{...style}}></div>) : (
            <Td aria-colspan={fullRow ? 999 : null} noShow={isBlank(content)} useExpand={useExpand} style={style} ref={tdRef} wrap={wrap ? 1 : 0} align={align} level={useExpand ? level : 0} title={renderer ? '' : value} >
                {useExpand && !isLeaf ? <ExpandButton className="table-expand-button" isExpand={expand} onBtnClick={onExpand} /> : null}
                {content}
            </Td>
        )
        // eslint-disable-next-line
    , [style, level, content, renderer, useExpand, isLeaf, wrap, align, value])
}

export default React.memo(Cell)