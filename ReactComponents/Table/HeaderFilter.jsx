import React, { useState, useMemo, useCallback, useContext } from 'react'

import { ClickAwayListener, Paper, List, ListItem, ListItemText, makeStyles, Popover } from '@material-ui/core'
import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded';
import CheckIcon from '@material-ui/icons/Check';

import { Context } from './index'
import styled from 'styled-components'
import { useSwitch } from 'api/hooks'

const Button = styled.div`
    position: relative;
    display: inline-block;
    margin-left: 2px;
    cursor: pointer;
    vertical-align: middle;
    box-sizing: border-box;
    overflow: hidden;
    width: 16px;
    height: 16px;
    background-color: ${({hasSelect}) => hasSelect === null ? '' : '#fff'};
`

const useStyles = makeStyles(theme => ({
    button: {
        position: 'absolute',
        top: '40%',
        left: '50%',
        width: '150%',
        height: '150%',
        transform: 'translate(-50%, -50%)',
    },
    listItem:{
        cursor: 'pointer',
        padding: '0 10px',
        '&:hover': {
            backgroundColor: 'var(--logo-bgcolor)',
            color: '#fff',
            '& .MuiSvgIcon-root':{
                color: '#fff !important'
            }
        },
    },
    wrapper : {
        maxHeight: '500px',
        maxWidth: '150px',
        overflowY: 'auto',
    },
    pop: {
        zIndex: 10
    }
}));


function HeaderFilter(props) {
    const classes = useStyles()
    const { thRef, colKey, onSelect:cb, multiple, defaultValue=null } = props
    const { filterOptionsMap } = useContext(Context)
    const options = filterOptionsMap[colKey]
    const [value, setValue] = useState(defaultValue)
    const [multiValue, setMultiValue] = useState(new Set());

    const [isOpen, , close, toggle] = useSwitch(false)

    const handleSelect = useCallback((val) => e => {
        if (!multiple) {
            if (value === val) {
                close()
                return
            }
            setValue(val)
            close()
            cb && cb(val)
        } else {
            if (val === null) {
                setMultiValue(new Set())
                close()
                cb && cb(val)
                return
            }
            multiValue.has(val) ? multiValue.delete(val) : multiValue.add(val)
            cb && cb([...multiValue])
            setMultiValue(new Set(multiValue))
        }
        // eslint-disable-next-line
    }, [cb, multiple, value, multiValue])

    const renderButton = useMemo(() => 
        <Button onClick={toggle} hasSelect={multiple ? multiValue.size || null : value}>
            <KeyboardArrowDownRoundedIcon 
                style={{ color: (multiple ? multiValue.size : value)  ? '#000' : '#fff' }} 
                className={classes.button}
            />
        </Button>
        // eslint-disable-next-line
    , [value, multiValue, multiple])

    const renderDownPaper = useMemo(() => 
        <Paper className={classes.wrapper}>
            <List dense className={classes.list}>
                {options && options.map(item => (
                    <ListItem className={classes.listItem} key={item} onClick={handleSelect(item)}>
                        <ListItemText primary={ item === null ? '不筛选' : item} />
                        {(multiple && multiValue.has(item) ? ( <CheckIcon style={{ color: 'green' }} /> ) : null)}
                    </ListItem>
                ))}
            </List> 
        </Paper>
        // eslint-disable-next-line
    , [options, multiple, multiValue, handleSelect])

    return <div style={{display: 'inline-block'}}>
        {renderButton}
        <Popover
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            open={isOpen} 
            anchorEl={thRef.current} 
            className={classes.pop}>
                <ClickAwayListener onClickAway={close}>
                    {renderDownPaper}
                </ClickAwayListener>
        </Popover>
    </div>
}

export default React.memo(HeaderFilter)