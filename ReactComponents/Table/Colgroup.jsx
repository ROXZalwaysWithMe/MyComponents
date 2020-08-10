import React from 'react'

import { Col, Colgroup } from './style'

function Unit(props) {
    return (<Col width={props.width !== void 0 ? props.width : 0}/>)
}

function Group(props) {
    return (
        <Colgroup>
            {props.group.map(col => (
                <Unit key={col.key} width={col.width}  />
            ))}
        </Colgroup>
    )
}

export default React.memo(Group)