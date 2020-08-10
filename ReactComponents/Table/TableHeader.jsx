import React, {forwardRef, useContext, useMemo} from 'react'
import Colgroup from './Colgroup'

import { Context } from './index'
import { HeaderContainer, DTable } from './style'

import HeaderCell from './HeaderCell'

const TableHeader = forwardRef((props, ref) => {
    const {colsArray, baseColWidth, filterOptionsMap, hasGutter} = useContext(Context)
    const group = useMemo(() => colsArray.map(col => ({width: col.props.width || baseColWidth, key: col.key})), [colsArray, baseColWidth])
    const content = useMemo(() => colsArray.map(col => { // col
        const { title, tips, useFilter, defaultSelectValue, onSelect, align, multiple, headAlign } = col.props
        return (
            <HeaderCell 
                options={filterOptionsMap[col.key]} 
                defaultSelectValue={defaultSelectValue}
                useFilter={useFilter}
                key={col.key} 
                colKey={col.key}
                tips={tips}
                onSelect={onSelect}
                title={title}
                align={align}
                headAlign={headAlign}
                multiple={multiple}
            />
        )
    }), [colsArray, filterOptionsMap])

    return (
        <HeaderContainer hasGutter={hasGutter} ref={ref} tableWidth={props.tableWidth} >
            <DTable>
                <Colgroup group={group} />
                <div style={{display: 'table-row'}}>
                    {content}
                </div>
            </DTable>
        </HeaderContainer>
    )
})

export default React.memo(TableHeader)