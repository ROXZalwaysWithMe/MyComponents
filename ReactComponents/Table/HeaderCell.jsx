import React, { useRef, useMemo } from 'react'
import styled from 'styled-components'

import { Tooltip } from '@material-ui/core'
import HeaderFilter from './HeaderFilter'
import {noWrap} from 'static/GlobalStyle'

const Th = styled.div`
    display: table-cell;
    vertical-align: middle;
    color: #fff;
    font-weight: 600;
    box-sizing: border-box;
    padding: 5px 0px;
    position: relative;
    font-size: 15px;
    text-align: ${({align, headAlign}) => headAlign || align};
    span{ 
        ${noWrap}
    }
`

function HeaderCell(props) { 
    const { tips, align, useFilter, multiple, onSelect, colKey, title, headAlign, defaultSelectValue } = props
    const HeaderRef = useRef(null)
    return useMemo(() => (
        <Th align={align} headAlign={headAlign}>
            <Tooltip title={tips || ''} arrow>
                <span ref={HeaderRef}>
                    {title} 
                </span>            
            </Tooltip>
            { useFilter ? ( <HeaderFilter defaultValue={defaultSelectValue} multiple={multiple} thRef={HeaderRef} onSelect={onSelect} colKey={colKey}/> ) : null }
        </Th>
    ), [tips, align, multiple, useFilter, onSelect, title, HeaderRef, colKey])
}

export default React.memo(HeaderCell)