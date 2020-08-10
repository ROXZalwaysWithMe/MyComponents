import React from 'react'

import PropTypes from 'prop-types'

function Column(props) {
    return null
}

Column.propTypes = {
    useFilter: PropTypes.bool,
    tips: PropTypes.oneOfType([
        PropTypes.string, PropTypes.number, PropTypes.element
    ]),
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dataIndex: PropTypes.string,
    width: PropTypes.number,
    minWidth: PropTypes.number,
    maxWidth: PropTypes.number,
    cellRender: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    align: PropTypes.bool,
    headAlign: PropTypes.bool,
    wrap: PropTypes.bool,
    useExpand: PropTypes.bool
}

Column.defaultProps = {
    useFilter: false,
    tips: '',
    title: '',
    dataIndex: '',
    width: 0,
    minWidth: 0,
    maxWidth: 0,
    cellRender: null,
    wrap: true,
    useExpand: false,
    align: true,
    headAlign: true,
}

export default React.memo(Column)