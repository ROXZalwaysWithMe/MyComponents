import React, { Children, forwardRef, useRef, useState, useMemo, useCallback, useEffect, useLayoutEffect, useImperativeHandle} from "react"

import Pagination from '@material-ui/lab/Pagination';
import { TablePagination } from './style'

import TableHeader from './TableHeader'
import TableBody from './TableBody'
import RowGroup, { InsertRow } from './RowGroup'
import TableLoading from './TableLoading'
import { Context } from './index'
import { Container } from './style'
import { syncScrollRef } from 'api/utils'

function renderStep (datas, firstSize) {
    let firstLoad = false
    let hasRenderSize = 0
    return function (size=0) {
        if (!firstLoad) {
            firstLoad = true
            if (firstSize < datas.length) {
                hasRenderSize += firstSize
                return datas.slice(0, hasRenderSize)
            } else {
                hasRenderSize = datas.lengrh
                return datas
            }
        } else {
            if (hasRenderSize + size < datas.length) {
                hasRenderSize += size
                return datas.slice(0, hasRenderSize)
            } else {
                hasRenderSize = datas.length
                return datas
            } 
        }
    }
}

const blankData = [] 

const Table = forwardRef((props, ref) => {
    const { 
        tableHeight, 
        tableWidth, 
        tableData = [], 
        dataFilter, 
        baseColWidth = 80, 
        dataKey,
        onFilter,
        dataSort,
        isLoading,
        usePagination,
        rowStyle,
        pageSize = Infinity,
        lazySize = 10,
        expandLevel = 0,
    } = props

    const headerRef = useRef(null)
    const bodyRef = useRef(null)
    const renderTimer = useRef(null)
    const [filterOptionsMap, setFilterOptionsMap] = useState({})
    const [insertionMap, setInsertionMap] = useState({});
    const [showMap, setShowMap] = useState({}) 
    const [pageNum, setPageNum] = useState(1);
    const [hasGutter, setHasGutter] = useState(false);
    const [initSize, setInitSize] = useState(40)
    const handlePage = useCallback((event, page) => setPageNum(page), [])
    const colsArray = useMemo(() => Children.toArray(props.children).filter(col => col.props.dataIndex || col.props.cellRender), [props.children])
    
    const insertRow = useCallback((id, content, cover) => {
        cover === void 0 
        ? setInsertionMap( _ => _[id] ? {..._, [id]: null} : {..._, [id]: content})
        : setInsertionMap(cover)
    }, [])

    const updateShowMap = useCallback(() => { // 倒序遍历，从子节点遍历上父节点
        const queue = []
        const leave = []
        const newMap = {}
        function recursion (row, parentId) {
            if (!row) return
            const pid = parentId || ''
            row._sign = pid + '-' + row[dataKey]
            queue.unshift(row)
            if (row.children && row.children.length) row.children.forEach(sub => recursion(sub, row._sign))
        }
        tableData.forEach(row => recursion(row))
        queue.forEach(row => {
            if (newMap[row[dataKey]]) return
            if (!dataFilter || dataFilter(row)) {
                leave.push(row)
                row._sign.split('-').forEach(id => {id.length && (newMap[id] = true)})
            }
        })
        onFilter && onFilter(leave)
        setShowMap(newMap)
        setPageNum(1)
    }, [tableData, onFilter, dataFilter, dataKey])

    const collect = useCallback((data, dataIndex, getOptions, hash={}) => {
        return data.reduce((acc, cur) => {
            let value = getOptions ? getOptions(cur[dataIndex], cur) : cur[dataIndex]
            if (value) {
                if (value.sort && value.length) {
                    value.forEach(val => {
                        if (val.length && !hash[val]) {
                            hash[val] = true
                            acc.push(val)
                        }
                    })
                } else if (!value.length || value === '' || hash[value]) return acc
                else {
                    hash[value] = true
                    acc.push(value)
                }
            }
            if (cur.children && cur.children.length) acc = acc.concat(collect(cur.children, dataIndex, getOptions, hash))
            return acc
        }, [])
    }, [])

    const collectOptions = useCallback(() => {
        const result = colsArray.reduce((acc, cur) => {
            const {useFilter, getOptions, frontOptions, dataIndex} = cur.props
            if (useFilter) {
                let options = collect(tableData, dataIndex, getOptions)
                if (frontOptions && frontOptions.length) {
                    const _set1 = new Set(frontOptions)
                    const _set2 = new Set()
                    options = options.filter(opt => {
                        if (_set1.has(opt)) {
                            _set2.add(opt)
                            return false
                        }
                        return true
                    })
                    options = [..._set2, ...options]
                }
                options.unshift(null)
                acc[cur.key] = options
            }
            return acc
        }, {})
        setFilterOptionsMap(result)
        // eslint-disable-next-line
    }, [colsArray, tableData])

    const datas = useMemo(() => {
        if (!tableData || !tableData.length) return blankData
        else {
            const result = tableData.filter(row => row !== null && showMap[row[dataKey]])
            if (dataSort) return [...result].sort(dataSort)
            return result
        }
    }, [tableData, showMap, dataKey, dataSort])

    const pageTotal = useMemo(() => {
        if (!datas.length || datas.length < pageSize) return 1
        else return Math.floor(datas.length / pageSize) + 1
    }, [datas, pageSize])

    const nowPageDatas = useMemo(() => datas.slice((pageNum - 1) * pageSize, pageNum*pageSize), [datas, pageNum, pageSize])
    
    const render = useMemo(() => {
        if (nowPageDatas.length) return renderStep(nowPageDatas, initSize)
        else return null
    }, [nowPageDatas, initSize]) // 函数

    // eslint-disable-next-line
    const renderDatas = useMemo(() => render ? render(lazySize) : blankData, [render, initSize, lazySize])

    const lazyLoad = useCallback(function () {
        if (renderTimer.current) clearTimeout(renderTimer.current)
        renderTimer.current = setTimeout(() => {
            const containerHeight = this.querySelector('.table-main-body').offsetHeight
            if (this.scrollTop + this.offsetHeight > containerHeight * 0.95) setInitSize( _ => _ + lazySize )
        }, 50);
    }, [lazySize])

    useImperativeHandle(ref, () => ({insert: insertRow}))

    useEffect(() => {
        let remove = null
        const dom = bodyRef
        if (dom.current) dom.current.addEventListener('scroll', lazyLoad, false)
        if (headerRef.current && dom.current) remove = syncScrollRef(headerRef, dom)
        return () => {
            dom.current.removeEventListener('scroll', lazyLoad, false)
            remove && remove()
        }
        // eslint-disable-next-line
    }, [headerRef, bodyRef]);

    useEffect(() => {
        if (tableData && tableData.length) {
            collectOptions()
            updateShowMap()
        }
        //eslint-disable-next-line
    }, [tableData, dataFilter, colsArray])

    useEffect(() => { // 翻页时 筛选时 数据长度变化时
        if (bodyRef.current) bodyRef.current.scrollTo(0, 0)
        setInitSize(40)
        // eslint-disable-next-line
    }, [pageNum, dataFilter, tableData.length]);

    useLayoutEffect(() => {
        if (bodyRef.current) {
            const {scrollHeight, clientHeight} = bodyRef.current
            setHasGutter(scrollHeight > clientHeight)
        }
    }, [datas, colsArray, dataFilter])

    return (
        <Context.Provider value={{
            insertionMap,
            insertRow,
            filterOptionsMap, 
            setFilterOptionsMap, 
            hasGutter, 
            setHasGutter,
            showMap, 
            dataKey, 
            colsArray, 
            baseColWidth, 
            rowStyle,
            expandLevel,
            dataSort,
        }}>
            <Container tableHeight={tableHeight}>
                <TableLoading show={isLoading}/>
                <TableHeader ref={headerRef} tableWidth={tableWidth} />
                <TableBody ref={bodyRef} tableWidth={tableWidth}>
                    <InsertRow show={!!insertionMap[0]} content={insertionMap[0]} colSpan={colsArray.length} />
                    {renderDatas.map(row => <RowGroup key={row[dataKey]} row={row} />)}
                </TableBody>
                <TablePagination hidden={!usePagination || pageTotal === 1}>
                    <Pagination color="primary" count={pageTotal} page={pageNum} onChange={handlePage}/>
                </TablePagination>
            </Container>
        </Context.Provider>
    )
})

export default React.memo(Table)