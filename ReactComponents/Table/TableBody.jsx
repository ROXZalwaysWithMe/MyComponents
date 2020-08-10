import React, {forwardRef, useContext, useMemo} from 'react'

import { Context } from './index'

import { BodyContainer, DTable } from './style'

import Colgroup from './Colgroup'

const TableBody = forwardRef((props, ref) => {
    const { tableWidth } = props
    const { colsArray, baseColWidth } = useContext(Context)
    const group = useMemo(() => colsArray.map(col => ({width: col.props.width || baseColWidth, key: col.key})), [colsArray, baseColWidth])

    return (
        <BodyContainer tableWidth={tableWidth} ref={ref}>
            <DTable cellSpacing={0} className="table-main-body">
                <Colgroup group={group}/>
                {props.children}
            </DTable>
        </BodyContainer>        
    )
})

export default React.memo(TableBody)