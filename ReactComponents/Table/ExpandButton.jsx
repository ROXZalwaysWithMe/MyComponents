import React, {useMemo, useCallback} from 'react'

import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded';
import KeyboardArrowRightRoundedIcon from '@material-ui/icons/KeyboardArrowRightRounded';

import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
    button: {
        cursor: 'pointer',
        padding: '0 5px'
    }
})

function ExpandButton(props) {
    const { onBtnClick, isExpand } = props
    const defaultProps = {
        style: props.style,
        className: props.className
    }
    const classes = useStyles()

    const handleClick = useCallback((e) => {
        onBtnClick && onBtnClick(!isExpand)
    }, [isExpand, onBtnClick])

    return useMemo(() => isExpand ? 
        <KeyboardArrowDownRoundedIcon color="primary" className={classes.button} onClick={handleClick} {...defaultProps} /> : 
        <KeyboardArrowRightRoundedIcon color="primary" className={classes.button} onClick={handleClick} {...defaultProps} />
        // eslint-disable-next-line
    , [isExpand, defaultProps, handleClick])
}

export default React.memo(ExpandButton)