
/* 
         组件设计
         初始化
         |-------- 已知数据
         list 数据长度
         组件当前高度

         |-------- 基本构造
         1. 外部list容器 position relative 高度按所有项撑高
         2. 内部项容器 每一项 position absolute top值为上一项的top + 上一项的高度
         3. 第一项

         |-------- 需要准备的方法
         1. dom 元素处理方法
            |---- 1. 标记 startIndex  endIndex
            |---- 2. 滚动条位置 触发更新视口dom
         2. 高宽需要动态变化或者静态设置？
            |---- 1. 列宽 变化

            |---- 2. 行高 变化

         3. 缓存方法
         4. 滚动条滚动事件
         
         |-------- 特定功能实现思路
         1. 计算高度 让隐藏的撑高容器，撑满高度
            |---- 已渲染的元素高度 ()
            |---- 未渲染的元素预估高度(40px)
            |---- 判断 元素是否在渲染区间内， 或者是否存储于缓存中
         2. 滑出视区 销毁dom？替换？
         3. 同步高度 采用去抖策略， 当停止滚动时再调用同步行高列宽方法 横向-同步行高 纵向-同步列宽
         误区： 内容其实只是要根据数据渲染，滚动条的处理只是视图处理，不要混淆

        TODO
*/
$.fn.virtualizeTable = function() {
    if (window.ActiveXObject || "ActiveXObject" in window){
        console.warn('当前组件不支持 IE 浏览器， 请更换为 chrome 或者其他浏览器')
        return 
     }
    options = arguments[0] || {}
    if (typeof options == 'string'){
        let method = $.fn.virtualizeTable.methods[options];
        Array.prototype.splice.call(arguments, 0, 1) // 去掉方法名
        if (method && this.length !== 0) {
            return method(this, ...arguments);
        }
        return 
    }
    this.propsFilter = (props, tObj) => {
        // 属性默认值 过滤器 
        // props 组件传入值  tObj 检测的类型和默认值
        // 方法
        function getType (value) {
            // 获取类型
            return Object.prototype.toString.call(value).slice(8, -1)
        }
        function evalDefaultValue (value) {
            return typeof value === 'function' ? value() : value
        }
        function checkType (value, type, defaultValue, key) {
            if (type === 'any') return value
            if (type === 'String' && value === '') return defaultValue || ''
            else if (getType(value) !== type) {
                console.warn(`[Type Error] The value ${value} with key ${key} is not correct type in props`)
                return defaultValue
            } else return value
        }
        function checkArrayType (value, typeArr=[], defaultValue, key) {
            let state = typeArr.some(type => type === 'any' ? true : getType(value) === type)
            if (!state) console.warn(`[Type Error] The value ${value} with key ${key} is not correct type in setting `)
            return state ? value : defaultValue
        }
        function checkUndefined (proper, setting ,result) {
            // 传入 proper 要检测的属性值 setting 类型检查对象 result 合并的对象
            let defValue = evalDefaultValue(setting[proper].default)
            result[proper] = defValue
        }
        // 组合
        function checkData (vObj, tObj, proper, result) {
            let defValue = evalDefaultValue(tObj[proper].default);
            if(getType(tObj[proper]) === 'String'){
                // 没有传对象而是字符串
                result[proper] = checkType(vObj[proper], tObj[proper], void 0, proper)
            } else if(getType(tObj[proper].type) === 'Array'){
                // 传入数组 对比每个数组项的类型 做检测
                result[proper] = checkArrayType(vObj[proper], tObj[proper].type, defValue, proper)
            }else{
                // 传入对象
                result[proper] = checkType(vObj[proper], tObj[proper].type, defValue, proper)
            }
        }
        function checkUnit (props, tObj, proper, result) {
            // 如果未定义 直接赋值为默认值  
            props == void 0 || props[proper] == void 0 ? checkUndefined(proper, tObj, result) : checkData(props, tObj, proper, result)
        }
        function checkMap (props ,tObj) {
            // 递归 检测数组中的数组
            let result = {}
            // 结果
            Object.keys(tObj).forEach(proper => {
                //检测内联值
                if (proper.includes('__')) {
                    let properArr = proper.split('__')
                    let root = properArr[0]
                    // 对应要过滤的数组
                    if (tObj[root] === void 0 && props[root] === void 0) return
                    if (tObj[root].type === 'Array' && props[root] !== void 0) {
                        // 数组需要循环对每项检测 
                        // result[root] 在这里是 props 传入数组的转换
                        // 递归检查
                        result[root] = props[root].map(initem => checkMap(initem, tObj[proper]))
                    } else if (tObj[root].type === 'Object') result[root] = checkMap(props[root], tObj[proper])
                }else checkUnit(props, tObj, proper, result)
            })
            return result
        }
        return checkMap(props, tObj)
    }
    this.$findChildren = ($node, expression) => {
        if(typeof expression !== 'string') return
        if(!$node instanceof $) throw `${$node} is not a jQuery dom Object`
        let findArr = expression.split(' ')
        let children = findArr.splice(0, 1)[0]
        if (findArr.length === 0) {
            return $node.children(children)
        } else {
            return this.$findChildren($node.children(children), findArr.join(' '))
        }
    }
    let oSelfObj = this;
    
    return this.each(function(){
        let xTmpValue = $.data(this, 'virtualizeTable_opt');
        if (xTmpValue != void 0) return
        // 属性默认值传值合并
        let optionsCheckResult = oSelfObj.propsFilter(options, $.fn.virtualizeTable.defaults)
        let oCurOpt = $.data(this, 'virtualizeTable_opt', {
            options: $.extend({}, optionsCheckResult),
            dataN7y: {
                // 滚动的时候 把 pointer-events 置为 false
                dataLoading: false,
                isScrolling: false, 
                // 以预计每行最低高宽度为佳
                estimateHeight: 20,
                estimateWidth: 100,
                // 表格 高宽
                tableWidth: 0,
                tableHeight: 0,
                // 原数据
                loadedDatas: [], 
                // 开始结束
                colStartIndex: 0,
                colEndIndex: 0,
                rowStartIndex: 0,
                rowEndIndex: 0,
                // 这些 cache 缓存 在元素动态变化时（滚动结束时）也应该要对应改变
                fixedRightCache: {},
                rowSizeAndOffsetCache: {},  // 缓存 行高
                // colFixedLeftCache: {}, // 左固定列缓存
                // colFixedRightCache: {}, // 右固定列缓存
                colSizeAndOffsetCache: {},  // 主缓存列宽
                CellMapCache: {}, // 缓存 cell 内容高宽（有待优化）
            },
            methods: {}
        })
        const def = (obj, key, handler) => {
            let freeProp = obj[key]
            Object.defineProperty(obj, key, {
                get: () => freeProp ,
                set(newVal) {
                    if (freeProp === newVal) return
                    let oldVal = freeProp
                    handler(newVal, oldVal)
                    freeProp = newVal
                }
            })
        }
        /**
         * 数据处理
         * 表头数据
         * 主数据
         */
        let opt = oCurOpt['options'], data = oCurOpt['dataN7y'], methods = oCurOpt['methods'], hasFixedLeft = 0, hasFixedRight = 0, noFixedNum = 0
        // fixed left 的数据置前， right 的数据 置后
        opt.columns = opt.columns.filter(item => item.field !== void 0).reduce((acc, cur) => {
            switch (cur.fixed) {
                case 'left':
                    hasFixedLeft ++ 
                    acc.splice(hasFixedLeft - 1, 0, cur)
                break;
                case 'right':
                    hasFixedRight ++
                    acc.push(cur)
                default:
                    noFixedNum ++
                    acc.splice(hasFixedLeft + noFixedNum - 1, 0, cur)
                break;
            }
            return acc
        },[])

        let domRealContainer = $(`<div class="_virtualizeTable_container"></div>`).appendTo(this),
            domLoadingCover = $(`<div class="_virtualizeTable_dataLoadingCover" style="display:none"></div>`).appendTo(domRealContainer),
            domMainTable = $(`<div class="_virtualize_main_table"></div>`).appendTo(domRealContainer),
            domFixedLeftTable = $(`<div class="_virtualizeTable_fixed_left"></div>`).appendTo(domRealContainer),
            domFixedRightTable = $(`<div class="_virtualizeTable_fixed_right"></div>`).appendTo(domRealContainer),
            sizeGetter = $(`<div class="sizeGetter"></div>`).appendTo(domRealContainer),
            mainTableBody = void 0, leftTableBody = void 0, rightTableBody = void 0, mainTableHeader = void 0, leftTableHeader = void 0, rightTableHeader = void 0

        // 容器高宽
        let containerWidth = () => domRealContainer.width(),
            containerHeight = () => domMainTable.children('._virtualizeTable_Grid_Body').height()

        def(data, 'isScrolling', val => {
            val ? domRealContainer.find('.main_table').css('pointer-events', 'none') : domRealContainer.find('.main_table').css('pointer-events', '')
        })
        
        // 初始化创建
        const initCreate = () => {
            createGridTable(domMainTable)
            let leftTable, rightTable
            let cache = mainTableBody.data('scrollInfo')
            // 同步 scroll 事件
            if (hasFixedLeft) {
                leftTable = createFixTable(domFixedLeftTable, hasFixedLeft)
                leftTableBody = leftTable.tableBody.find('.main_table').eq(0)
                leftTableHeader = leftTable.tableHeader.find('.main_header').eq(0)
                setTableWidth('left', leftTable.totalWidth)
                addScrollEvent(leftTable.tableBody, function() {
                    if (this._scrollReady) {
                        let scrollTop = this.prop('scrollTop')
                        mainTableBody.prop('scrollTop', scrollTop)
                        if (hasFixedRight) rightTable.tableBody.prop('scrollTop', scrollTop)
                    }
                    if (cache.scrollTop !== scrollTop) {
                        // 上下滚动 true => 向下 | false => 向上
                        let direction = cache.scrollTop - scrollTop > 0 ? false : true
                        cache.scrollTop = scrollTop
                        let datas = data.loadedDatas                    
                        window.requestAnimationFrame(updateGridRow.bind(this, datas, scrollTop, direction))
                    }
                })
            }
            if (hasFixedRight) {
                rightTable = createFixTable(domFixedRightTable, -1 * hasFixedRight)
                rightTableBody = rightTable.tableBody.find('.main_table').eq(0)
                rightTableHeader = rightTable.tableHeader.find('.main_header').eq(0)
                setTableWidth('left', rightTable.totalWidth)
                addScrollEvent(rightTable.tableBody, function () {
                    if (this._scrollReady) {
                        let scrollTop = this.prop('scrollTop')
                        mainTableBody.prop('scrollTop', scrollTop)
                        if (hasFixedLeft) leftTable.tableBody.prop('scrollTop', scrollTop)
                    }
                    if (cache.scrollTop !== scrollTop) {
                        // 上下滚动 true => 向下 | false => 向上
                        let direction = cache.scrollTop - scrollTop > 0 ? false : true
                        cache.scrollTop = scrollTop
                        let datas = data.loadedDatas                    
                        window.requestAnimationFrame(updateGridRow.bind(this, datas, scrollTop, direction))
                    }
                })
            }
        }
        // 获取主滚动节点
        const getScrollBody = () => domMainTable.children('._virtualizeTable_Grid_Body')
        // 设置同步宽度
        const setTableWidth = (tab, set) => {
            let state = typeof set === 'function' ? true : false
            let result
            switch (tab) {
                case 'right':
                    if (!hasFixedRight) return
                    result = state ? set(rightTableHeader.width()) : set
                    rightTableBody.width(result)
                    rightTableHeader.width(result)
                break;
                case 'left':
                    if (!hasFixedLeft) return
                    result = state ? set(leftTableHeader.width()) : set
                    leftTableBody.width(result)
                    leftTableHeader.width(result)
                break;
                default:
                    result = state ? set(mainTableBody.width()) : set
                    mainTableBody.width(result)
                    mainTableHeader.width(result)
                break;
            }
        }
        // 设置同步高度
        const setTableHeight = (set) => {
            // 所有高度统一
            let tableObj = domRealContainer.find('.main_table')
            if (typeof set === 'function') {
                let result = set(tableObj.eq(0).height())
                tableObj.css({
                    'height': result,
                    'max-height': result
                })
            } else tableObj.css({
                'height': set,
                'max-height': set
            })
            
        }
        // 主表格的构建
            // TODO 表格的高度限制和 top 流
        const createGridTable = ($node) => {
            let columns = opt.columns
            let tableHeader = $(`<div class="_virtualizeTable_Grid_Header"><div class="main_header"></div></div>`).appendTo($node)
            let tableBody = $(`<div class="_virtualizeTable_Grid_Body"><div class="main_table"></div></div>`).appendTo($node)
            mainTableBody = tableBody.find('.main_table').eq(0).data('scrollInfo', {scrollTop: 0, scrollLeft: 0})
            mainTableHeader = tableHeader.find('.main_header').eq(0)
            createGridHeader(tableHeader, columns)
            let scrollWatcher = null
            let scrollfoo = () => {
                data.isScrolling = false
                scrollWatcher = null
            }
            let throVer = false, throHor = false
            addScrollEvent(tableBody, function() {
                // 赋值为 pointer-event: none 提高帧率
                data.isScrolling = true
                if (scrollWatcher) window.clearTimeout(scrollWatcher)
                scrollWatcher = setTimeout(scrollfoo, 500);
                let offsetLeft = this.prop('scrollLeft')
                let offsetTop = this.prop('scrollTop')
                if (this._scrollReady) {
                    if (hasFixedLeft) domFixedLeftTable.find('._virtualizeTable_Fixed_Body').prop('scrollTop', offsetTop)
                    if (hasFixedRight) domFixedRightTable.find('._virtualizeTable_Fixed_Body').prop('scrollTop', offsetTop)
                }
                // 同步表头横向滚动
                let cache = mainTableBody.data('scrollInfo')
                tableHeader.prop('scrollLeft', offsetLeft);
                
                if (cache.scrollLeft !== offsetLeft) {
                    // 左右滚动 true => 向右 | false => 向左
                    let direction = cache.scrollLeft - offsetLeft > 0 ? false : true
                    cache.scrollLeft = offsetLeft
                    if (!throHor) {
                        throHor = true
                        window.requestAnimationFrame(() => {
                            updateGridCol.call(this, columns, offsetLeft, direction)
                            throHor = false
                        })
                    }
                }
                if (cache.scrollTop !== offsetTop) {
                    // 上下滚动 true => 向下 | false => 向上
                    let direction = cache.scrollTop - offsetTop > 0 ? false : true
                    cache.scrollTop = offsetTop
                    let datas = data.loadedDatas                    
                    if (!throVer) {
                       throVer = true 
                       window.requestAnimationFrame(() => {
                           updateGridRow.call(this, datas, offsetTop, direction)
                           throVer = false
                       })
                    }
                }

            })
            return {tableHeader, tableBody}
        }
        // 创建主表头
        const createGridHeader = ($node, columns) => {
            // 初始化
            let end = 0
            let endFlag = false
            let colCache = data.colSizeAndOffsetCache
            let estimateWidth = data.estimateWidth
            let cWidth = containerWidth()
            let totalWidth = 0
            columns.forEach((item, colIndex) => {
                // 表头的 content 没有那么多花里胡哨的东西
                item._gridColIndex = colIndex
                if (endFlag) return
                let content = typeof item.title === 'function' ? item.title() : item.title 
                let {left: thLeft, width: thWidth} = getColSizeAndOffset(columns, colIndex)
                let thConf = {...item, left: thLeft}
                totalWidth += thWidth - estimateWidth
                cth(content, thConf).appendTo($node.children('.main_header'))
                colCache[colIndex] = {width: thWidth, left: thLeft}
                end = colIndex
                if (thLeft > cWidth) endFlag = true
            })
            setTableWidth('main', columns.length * estimateWidth + totalWidth)
            data.colEndIndex = end
        }
        
        // 固定列的表头不需要虚拟化，直接显示
        // 固定列不需要横向虚拟化
        const createFixTable = ($node, columnNum, isFixedRight) => {
            // 获取固定列的配置
            let columns = columnNum > 0 ? opt.columns.slice(0, columnNum) : opt.columns.slice(columnNum)
            let tableHeader = $(`<div class="_virtualizeTable_Fixed_Header"></div>`).appendTo($node)
            let tableBody = $(`<div class="_virtualizeTable_Fixed_Body"><div class="main_table"></div></div>`).appendTo($node)
            let totalWidth = 0
            columns.forEach((item, idx) => {
                let content = typeof item.title === 'function' ? item.title() : item.title
                let contentWidth = getTitleSize(content, item).titleWidth
                let th = thFixTemplate.clone().html(content).attr({
                    'data-field': item.field,
                    'col_index': item._gridColIndex
                }).css({
                    'max-width': item.maxWidth,
                    'min-width': item.minWidth,
                    'width': item.width ? item.width : contentWidth
                }).appendTo(tableHeader)
                totalWidth += th.outerWidth()
            })
            return {tableHeader, tableBody, totalWidth}
        }
        
        // 用克隆的方式减少创建节点花费
        const fixedRowTemp = $(`<div class="_virtualizeTable_Fixed_Body_row"></div>`).attr('row_index', 0).css('top', 0)
        const thFixTemplate = $(`<div class="_virtualizeTable_Fixed_Header_th grid_cell"></div>`
            ).attr({'col_index': 0, 'data-field': 'null'}
            ).css({'max-width': 0, 'min-width': 0, 'width': 0
        })
        const tdFixTemplate = $(`<div class="_virtualizeTable_Fixed_body_td grid_cell"></div>`
            ).attr({'col_index': 0, 'data-field': 'null'}
            ).css({'max-width': 0, 'min-width': 0, 'width': 0
        })
        const thTemplate = $(`<div class="_virtualizeTable_Grid_Header_th grid_cell"></div>`
            ).attr({'col_index': 0,'data-field': 'null'}
            ).css({'left': 0,'width': 0,'max-width': 0,'min-width': 0
        })
        const tdTemplate = $(`<div class="_virtualizeTable_Grid_Body_td grid_cell"></div>`
            ).attr({'col_index': 0,'row_index': 0,'data-field': 'null'}
            ).css({'max-width': 0,'min-width': 0,'width': 0,'height': 0,'left': 0,'top': 0
        })
        const cth = (title, conf) => {
            let {left, width, maxWidth, minWidth, field, _gridColIndex} = conf
            let th = thTemplate.clone().html(title).attr({
                'col_index': _gridColIndex,
                'data-field': field
            }).css({
                'left': left,
                'width': width,
                'max-width': maxWidth,
                'min-width': minWidth
            })
            return th
        }
        const ctd = (title, conf, renderType) => {
            let {width, height, left, top, maxWidth, minWidth, field, _gridColIndex, _gridRowIndex, textWrap, extClass, tipsContent} = conf
            let td = tdTemplate.clone().attr({
                'col_index': _gridColIndex,
                'row_index': _gridRowIndex,
                'data-field': field
            }).css({
                'max-width': maxWidth,
                'min-width': minWidth,
                'width': width,
                'height': height,
                'left': left,
                'top': top
            })
            return renderContent(td, title, renderType, textWrap, tipsContent, extClass)
        }
        const renderContent = (node, content, renderType, textWrap, tipsContent, extClass) => {
            switch (renderType) {
                case 'object':
                    node.html(content)
                    node.addClass(extClass)
                    node.tooltip({
                        content: tipsContent,
                        position: 'horizontal-right',
                        showDelay:0, hideDelay:0
                    })
                return node
                case 'string':
                    node.text(content)
                    if (textWrap) node.addClass('wrap')
                    else node.addClass('nowrap_e')
                return node
                default:
                    node.html(content)
                return node;
            }
        }
        /**
         * 更新行列数据
         * 加载列时，每加载一行的数据 同步 top 和 高度，加载完列后 同步 left 和 宽度
         * 加载行时，每加载一列的数据 同步 left 和 宽度，加载完行后 同步 top 和 高度 
         */
        const firstLoad = () => { // 初始渲染
            findDisplayRowSection(0)
            // 可能是异步原因 firstload 里的节点变量会被下一个初始化的同组件覆盖 所以这里还是使用 this 再获取准确节点
            // 其他变量居然不会被覆盖
            let columns = opt.columns,
                tableData = data.loadedDatas,
                rowCache = data.rowSizeAndOffsetCache,
                colCache = data.colSizeAndOffsetCache,
                tempColCache = [],
                lastTop = 0,
                realLeft = 0,
                totalDiffWidth = 0,
                totalLeftTableWidth = 0,
                totalRightTableWidth = 0,
                count = 0
            // 行
            for (let i = 0; i <= data.rowEndIndex; i++) {
                if (lastTop > containerHeight()) {
                    data.rowEndIndex = i - 1
                    break;
                }
                // 列
                let mainColDatasHasLoaded = false,
                    isCreateFixedLeftRow = false,
                    isCreateFixedRightRow = false,
                    lastLeft = 0,
                    currentHeight = 0
                for (let j = 0; j < columns.length; j ++) {
                    let nowBodyWidth = containerWidth()
                    let curLoadTable = j < hasFixedLeft ? 'left' : j >= columns.length - hasFixedRight ? 'right' : 'main'
                    if (lastLeft > nowBodyWidth && !mainColDatasHasLoaded) {
                        data.colEndIndex = j - 1
                        mainColDatasHasLoaded = true
                    }
                    if (mainColDatasHasLoaded && curLoadTable !== 'left' && curLoadTable !== 'right') continue
                    let content = tableData[i][j],
                        cacheWidth = colCache[j] ? colCache[j].width : 0,
                        tempWidth = tempColCache[j] ? tempColCache[j].wid : 0,
                        renderType = typeof content == 'object' ? 'object' : columns[j].richRender || columns[j].render ? 'rich' : 'string',
                        titleObj = {}
                    if (renderType == 'object') {
                        titleObj = {extClass: content.extClass, tipsContent: content.tipsContent}
                        content = content.title
                    }
                    let contentSize = getTitleSize(content, columns[j])
                    let tdConf = {
                        ...titleObj,
                        height: Math.max(contentSize.titleHeight, currentHeight),
                        width: Math.max(contentSize.titleWidth, cacheWidth, tempWidth),
                        left: lastLeft,
                        top: lastTop,
                        field: columns[j].field,
                        maxWidth: columns[j].maxWidth,
                        minWidth: columns[j].minWidth,
                        textWrap: columns[j].textWrap,
                        _gridRowIndex: i,
                        _gridColIndex: j,
                    }
                    switch (curLoadTable) {
                        case 'left':
                            if (!isCreateFixedLeftRow) {
                                fixedRowTemp.clone().addClass('fixedLeftRow').attr('row_index', i).css('top', lastTop).appendTo(leftTableBody)
                                isCreateFixedLeftRow = true
                            }
                            let ltd = tdFixTemplate.clone().attr({
                                'data-field':tdConf.field,
                                col_index: j,
                            }).css({
                                width: tdConf.width,
                                maxWidth: tdConf.maxWidth,
                                minWidth: tdConf.minWidth,
                                textWrap: tdConf.textWrap,
                            })
                            renderContent(ltd, content, renderType, tdConf.textWrap, titleObj.tipsContent, titleObj.extClass).appendTo(leftTableBody.find(`.fixedLeftRow[row_index=${i}]`))
                        break;
                        case 'right':
                            if (!isCreateFixedRightRow) {
                                fixedRowTemp.clone().addClass('fixedRightRow').attr('row_index', i).css('top', lastTop).appendTo(rightTableBody)
                                isCreateFixedRightRow = true
                            }
                            let rtd = tdFixTemplate.clone().attr({
                                'data-field': tdConf.field,
                                col_index: j
                            }).css({
                                width: tdConf.width,
                                maxWidth: tdConf.maxWidth,
                                minWidth: tdConf.minWidth,
                                textWrap: tdConf.textWrap,
                            })
                            renderContent(rtd, content, renderType, tdConf.textWrap, titleObj.tipsContent, titleObj.extClass).appendTo(rightTableBody.find(`.fixedRightRow[row_index=${i}]`))
                        break;
                        default:
                            ctd(content, tdConf, renderType).appendTo(mainTableBody)
                        break;
                    }
                    if (contentSize.titleWidth > tempWidth || cacheWidth > tempWidth) {
                        tempColCache[j] = {wid: Math.max(contentSize.titleWidth, cacheWidth), tab: curLoadTable}
                    }
                    if (contentSize.titleHeight > currentHeight) {
                        currentHeight = contentSize.titleHeight
                        rowHeightHasChange = true
                    }
                    lastLeft += tdConf.width
                }
                domRealContainer.find(`.grid_cell[row_index=${i}]`).css('height', currentHeight)
                if (hasFixedLeft || hasFixedRight) domRealContainer.find(`._virtualizeTable_Fixed_Body_row[row_index=${i}]`).css('height', currentHeight)
                setTableHeight( _ => _ + currentHeight - data.estimateHeight )
                rowCache[i] = {top: lastTop, height: currentHeight}
                lastTop += currentHeight
            }
            tempColCache.forEach((item, idx) => {
                if (item.tab === 'main' || item.tab === 'left') {
                    totalDiffWidth += item.wid - colCache[idx].width
                    colCache[idx].width = item.wid
                    colCache[idx].left = realLeft
                    count = idx
                }
                if (item.tab === 'left') {
                    totalLeftTableWidth += item.wid
                } else if (item.tab === 'right') {
                    totalRightTableWidth += item.wid
                }
                domRealContainer.find(`.grid_cell[col_index=${idx}]`).css({'width': item.wid, 'left': realLeft})
                realLeft += item.wid
            })
            setTableWidth('main', _ => _ + totalDiffWidth)
            if (hasFixedLeft) setTableWidth('left', totalLeftTableWidth)
            if (hasFixedRight) setTableWidth('right', totalRightTableWidth)
            domMainTable.find(`.grid_cell`).filter(function () {
                return $(this).attr('col_index') > data.colEndIndex || $(this).attr('row_index') > data.rowEndIndex
            }).remove()
            for (const key in colCache) if (key > count) colCache[key].left += totalDiffWidth
        }
        // 更新行 datas => data.loadedDatas
        // 更新行 固定列随之滚动更新
        const updateGridRow = (datas, offsetTop, direction) => {
            // 方向用于调整插入位置
            let section = findDisplayRowSection(offsetTop)
            if (!section) return

            let columns = opt.columns
            let start = data.rowStartIndex, end = data.rowEndIndex
            let rowSizeAndOffsetCache = data.rowSizeAndOffsetCache,
                colSizeAndOffsetCache = data.colSizeAndOffsetCache
            // 删除不存在视区的元素
            domMainTable.find(`._virtualizeTable_Grid_Body_td.grid_cell`).each(function () {
                let rdx = $(this).attr('row_index')
                if (rdx < start || rdx > end ) $(this).remove()
            })
            domRealContainer.find(`._virtualizeTable_Fixed_Body_row`).each(function () {
                let rdx = $(this).attr('row_index')
                if (rdx < start || rdx > end ) $(this).remove()
            })
            // timeSlice(function *() {
                // console.time('extra')
                for (let i = start; i <= end; i++) {
                    // 渲染行
                    if (!domMainTable.find(`._virtualizeTable_Grid_Body_td.grid_cell[row_index=${i}]`).length && datas[i]) {
                        let heightHasExist = rowSizeAndOffsetCache[i] !== void 0 ? true : false
                        let {top:cacheTop, height:cacheHeight} = heightHasExist ? rowSizeAndOffsetCache[i] : getRowSizeAndOffset(datas, i)
                        if (cacheTop > offsetTop + containerHeight() && i > end) {
                            data.rowEndIndex = i - 1
                            break;
                        }
                        let tempCache = {top: cacheTop, height: cacheHeight}
                        let totalLeftDiffAccumulate = 0
                        let rowHeightHasChange = false
                        //一列一列渲染
                        // 渲染 左固定列
                        if (hasFixedLeft) {
                            let isCreateFixedLeftRow = false
                            for (let left = 0; left < hasFixedLeft; left ++) { // 左固定列和主表一样正常进行更新
                                let content = datas[i][left]  // data.loadedDatas[row][col] 
                                let renderType = typeof content == 'object' ? 'object' : columns[left].richRender || columns[left].render ? 'rich' : 'string'
                                let contentConf = null
                                if (renderType == 'object') {
                                    contentConf = {extClass: content.extClass, tipsContent: content.tipsContent}
                                    content = content.title
                                }
                                // 取缓存中的 left 和 width 即当前 列的左定位以及列宽
                                let {left: cacheLeft, width: cacheWidth} = colSizeAndOffsetCache[left]

                                // 取表头信息相关配置
                                let {minWidth, maxWidth, field, width, richRender, textWrap} = columns[left]
        
                                // 取真实宽高
                                let sizeConf = {minWidth, maxWidth, width, richRender, textWrap}
                                let {titleHeight:realHeight, titleWidth:realWidth} = getTitleSize(content, sizeConf)
        
                                // 单元格 配置属性
                                let tdConf = {
                                    ...contentConf,
                                    minWidth, maxWidth, field, textWrap,
                                    top: cacheTop, 
                                    _gridColIndex: left, _gridRowIndex: i,
                                    height:realHeight, // 高度在渲染完一整行后调整
                                    width: Math.max(cacheWidth, realWidth) // 取最大值
                                }

                                if (!isCreateFixedLeftRow) {
                                    fixedRowTemp.clone().addClass('fixedLeftRow').attr('row_index', i).css('top', cacheTop).appendTo(leftTableBody)
                                    isCreateFixedLeftRow = true
                                }
                                let ltd = tdFixTemplate.clone().attr({
                                    'data-field': conf.field,
                                    col_index: left,
                                }).css({
                                    width: conf.width,
                                    maxWidth: conf.maxWidth,
                                    minWidth: conf.minWidth,
                                    textWrap: conf.textWrap,
                                })
                                renderContent(ltd, content, renderType, tdConf.textWrap, titleObj.tipsContent, titleObj.extClass).appendTo(leftTableBody.find(`.fixedLeftRow[row_index=${i}]`))

                                // 横向宽高调整
                                if (totalLeftDiffAccumulate) {
                                    colSizeAndOffsetCache[left].left = cacheLeft + totalLeftDiffAccumulate
                                    let nowSLeft = mainTableBody.data('scrollInfo').scrollLeft
                                    // 向右扩大的时候，超出视界的元素移除
                                    if (colSizeAndOffsetCache[left].left > nowSLeft + containerWidth()) {
                                        $(this).find(`.grid_cell[col_index=${left}]`).remove()
                                    } else $(this).find(`.grid_cell[col_index=${left}]`).css('left', cacheLeft + totalLeftDiffAccumulate)
                                }
                                if (realWidth > cacheWidth) { // 若 单元格宽度 大于 列宽，整列宽度调整
                                    colSizeAndOffsetCache[left].width = realWidth
                                    totalLeftDiffAccumulate += realWidth - cacheWidth
                                    $(this).find(`.grid_cell[col_index=${left}]`).css('width', realWidth)
                                }
                                if (realHeight > tempCache.height) { // 记录 统一最大高度， 循环结束后 统一调整
                                    tempCache.height = realHeight
                                    rowHeightHasChange = true
                                }
                                
                            }
                        }
                        if (hasFixedRight) {
                            let isCreateFixedRightRow = false
                            for (let right = columns.length - hasFixedRight; right < columns.length; right++) {
                                if (!isCreateFixedRightRow) {
                                    fixedRowTemp.clone().addClass('fixedRightRow').attr('row_index', i).css('top', lastTop).appendTo(rightTableBody)
                                    isCreateFixedRightRow = true
                                }
                                let rtd = tdFixTemplate.clone().attr({
                                    'data-field': tdConf.field,
                                    col_index: right
                                }).css({
                                    width: tdConf.width,
                                    maxWidth: tdConf.maxWidth,
                                    minWidth: tdConf.minWidth,
                                    textWrap: tdConf.textWrap,
                                })
                                renderContent(rtd, content, renderType, tdConf.textWrap, titleObj.tipsContent, titleObj.extClass).appendTo(rightTableBody.find(`.fixedRightRow[row_index=${i}]`))
                            }
                        }
                        for (let j = data.colStartIndex; j <= data.colEndIndex; j++) {
                            if ( (j < hasFixedLeft ) || (j >= columns.length - hasFixedRight)) continue // 左列右列 不管

                            let content = datas[i][j]  // data.loadedDatas[row][col] 
                            let renderType = typeof content == 'object' ? 'object' : columns[j].richRender || columns[j].render ? 'rich' : 'string'
                            let contentConf = null
                            if (renderType == 'object') {
                                contentConf = {extClass: content.extClass, tipsContent: content.tipsContent}
                                content = content.title
                            }
                            // 取缓存中的 left 和 width 即当前 列的左定位以及列宽
                            let {left: cacheLeft, width: cacheWidth} = colSizeAndOffsetCache[j]

                            // 取表头信息相关配置
                            let {minWidth, maxWidth, field, width, richRender, textWrap} = columns[j]
    
                            // 取真实宽高
                            let sizeConf = {minWidth, maxWidth, width, richRender, textWrap}
                            let {titleHeight:realHeight, titleWidth:realWidth} = getTitleSize(content, sizeConf)
    
                            // 单元格 配置属性
                            let tdConf = {
                                ...contentConf,
                                minWidth, maxWidth, field, textWrap,
                                top: cacheTop, 
                                _gridColIndex: j, _gridRowIndex: i,
                                left: cacheLeft + totalLeftDiffAccumulate,  // left 加上累积的变化差值
                                height:realHeight, // 高度在渲染完一整行后调整
                                width: Math.max(cacheWidth, realWidth) // 取最大值
                            }
                            ctd(content, tdConf, renderType).appendTo(mainTableBody)

                            // 横向宽高调整
                            if (totalLeftDiffAccumulate) {
                                colSizeAndOffsetCache[j].left = cacheLeft + totalLeftDiffAccumulate
                                let nowSLeft = mainTableBody.data('scrollInfo').scrollLeft
                                // 向右扩大的时候，超出视界的元素移除
                                if (colSizeAndOffsetCache[j].left > nowSLeft + containerWidth()) {
                                    $(this).find(`.grid_cell[col_index=${j}]`).remove()
                                } else $(this).find(`.grid_cell[col_index=${j}]`).css('left', cacheLeft + totalLeftDiffAccumulate)
                            }
                            if (realWidth > cacheWidth) { // 若 单元格宽度 大于 列宽，整列宽度调整
                                colSizeAndOffsetCache[j].width = realWidth
                                totalLeftDiffAccumulate += realWidth - cacheWidth
                                $(this).find(`.grid_cell[col_index=${j}]`).css('width', realWidth)
                            }
                            if (realHeight > tempCache.height) { // 记录 统一最大高度， 循环结束后 统一调整
                                tempCache.height = realHeight
                                rowHeightHasChange = true
                            }
                        }
                        if (totalLeftDiffAccumulate) { // 更新缓存 Left 值
                            // TODO left无限增大导致渲染 bug
                            for (const key in colSizeAndOffsetCache) {
                                if (key <= data.colEndIndex) continue
                                else colSizeAndOffsetCache[key].left += totalLeftDiffAccumulate
                            }
                        }
                        // 一行渲染完毕后 纵向宽高调整
                        mainTableBody.find(`._virtualizeTable_Grid_Body_td.grid_cell[row_index=${i}]`).css('height', tempCache.height)
                        if (hasFixedRight || hasFixedLeft) domRealContainer.find(`._virtualizeTable_Fixed_Body_row[row_index=${i}]`).css('height', tempCache.height)
                        if (rowHeightHasChange || !heightHasExist) {
                            let diffValue = heightHasExist ? tempCache.height - cacheHeight : tempCache.height - data.estimateHeight
                            setTableHeight( _ => _ + diffValue)
                            rowSizeAndOffsetCache[i] = tempCache
							// 取出
                            for (const key in rowSizeAndOffsetCache) {
                                if (key <= i) continue
                                else {
                                    rowSizeAndOffsetCache[key].top += diffValue
                                    let key_dom = mainTableBody.find(`._virtualizeTable_Grid_Body_td.grid_cell[row_index=${key}]`)
                                    if (key > data.rowEndIndex) continue
                                    else if (key_dom.length) {
                                        key_dom.css('top', data.rowSizeAndOffsetCache[key].top)
                                        domRealContainer.find(`._virtualizeTable_Fixed_Body_row[row_index=${key}]`).css('top', data.rowSizeAndOffsetCache[key].top)
                                    }
                                }
                            }
                        }
                    }
                    // console.timeEnd('interior')

                    // yield
                }
                // console.timeEnd('extra')
            // })()
        }

        // 更新列 datas => opt.columns
        // 更新列 固定列不更新内容，但是高度会随之变化
        const updateGridCol = (datas, offsetLeft, direction) => {  
            // TODO 方向用于调整插入位置
            // 循环挺多，好在执行完一遍只要不发生变化就不会再执行
            let section = findDisplayColSection(offsetLeft)
            if (!section) return false
            let {rowStartIndex, rowEndIndex} = data

            let start = data.colStartIndex, end = data.colEndIndex
            // 删除不存在视区的元素 
            // TODO 优化 dom池 || 复用 dom
            domMainTable.find(`.grid_cell`).each(function () {
                let cdx = $(this).attr('col_index') - 0
                if (cdx < start || cdx > end) $(this).remove()
            })
            // timeSlice(function *() {
                for (let i = start; i <= end; i++) {
                    // 列开始 - 列结束
                    // 表头
                    if (!$(this).find(`.grid_cell[col_index=${i}]`).length && datas[i]) { // 当前列没显示 且该列数据才存在 才生成
                        let widthHasExists = data.colSizeAndOffsetCache[i] !== void 0 ? true : false
                        let {width:cacheWidth, left:cacheLeft} = widthHasExists ? data.colSizeAndOffsetCache[i] : getColSizeAndOffset(datas, i)
                        if (cacheLeft > offsetLeft + containerWidth()) { // 超出视区终止
                            data.colEndIndex = i - 1
                            break;
                        }
                        let tdDatas = data.loadedDatas
                        let head = datas[i] // columns[i]
                        let tempCache = {}
                        let thTitle = typeof head.title === 'function' ? head.title() : head.title
                        let totalTopDiffAccumulate = 0
                        let colWidthHasChange = false
                        tempCache.left = cacheLeft
                        tempCache.width = cacheWidth
                        let thConf = {
                            left: cacheLeft, 
                            width: cacheWidth, // width 会在更新单元格时调整
                            maxWidth: head.maxWidth,
                            minWidth: head.minWidth,
                            field: head.field,
                            _gridColIndex: i
                        }
                        if (i > hasFixedLeft - 1 && i < datas.length - hasFixedRight) cth(thTitle, thConf).appendTo(mainTableHeader)
                        if (tdDatas.length) {
                            for (let j = rowStartIndex; j <= rowEndIndex; j++) {
                                // 一行一行 渲染
                                // 行开始 - 行结束
                                let {top:tdTop, height:tdHeight} = data.rowSizeAndOffsetCache[j]
                                let content = tdDatas[j][i] // data.loadedDatas[row][col]
                                let renderType = typeof content == 'object' ? 'object' : head.richRender || head.render ? 'rich' : 'string'
                                if (renderType == 'object') content = content.title
                                let {titleWidth:currentWidth, titleHeight:realHeight} = getTitleSize(content, head, i)
                                let tdConf = {
                                    width: currentWidth, 
                                    height: Math.max(tdHeight, realHeight), 
                                    top: tdTop + totalTopDiffAccumulate, 
                                    _gridColIndex : i, 
                                    _gridRowIndex : j, 
                                    left: cacheLeft,
                                    maxWidth: head.maxWidth,
                                    minWidth: head.minWidth,
                                    field: head.field,
                                    textWrap: head.textWrap,
                                }
                                if (i > hasFixedLeft - 1 && i < datas.length - hasFixedRight) ctd(content, tdConf, renderType).appendTo(mainTableBody)
                                // 纵向调整 高度 top
                                if (totalTopDiffAccumulate) {
                                    // 当前行 同步 top
                                    $(this).find(`._virtualizeTable_Grid_Body_td.grid_cell[row_index=${j}]`).css('top', tdTop + totalTopDiffAccumulate)
                                    if (hasFixedRight || hasFixedLeft) $(this).find(`._virtualizeTable_Fixed_Body_row[row_index=${j}]`).css('top', tdTop + totalTopDiffAccumulate)
                                    data.rowSizeAndOffsetCache[j].top = tdTop + totalTopDiffAccumulate
                                }
                                if (realHeight > tdHeight) {
                                    data.rowSizeAndOffsetCache[j].height = realHeight
                                    $(this).find(`._virtualizeTable_Grid_Body_td.grid_cell[row_index=${j}]`).css('height', realHeight)
                                    if (hasFixedRight || hasFixedLeft) $(this).find(`._virtualizeTable_Fixed_Body_row[row_index=${j}]`).css('height', realHeight)
                                    setTableHeight(_ => _ + realHeight - tdHeight)
                                    totalTopDiffAccumulate += realHeight - tdHeight
                                }
                                if (currentWidth > tempCache.width) {
                                    tempCache.width = currentWidth
                                    colWidthHasChange = true
                                }
                            }
                        }
                        if (totalTopDiffAccumulate) {
                            // console.log(data.rowSizeAndOffsetCache)
                            for (const key in data.rowSizeAndOffsetCache) {
                                if (key <= data.rowEndIndex) continue
                                else data.rowSizeAndOffsetCache[key].top += totalTopDiffAccumulate
                            }
                        }
                        // 横向调整 宽度 Left
                        $(this).find(`.grid_cell[col_index=${i}]`).css('width', tempCache.width)
                        if (colWidthHasChange || !widthHasExists) {
                            let diffValue = widthHasExists ? tempCache.width - data.colSizeAndOffsetCache[i].width : tempCache.width - data.estimateWidth
                            setTableWidth('main', _ => _ + diffValue)
                            data.colSizeAndOffsetCache[i] = tempCache
                            // 取出
                            for (const key in data.colSizeAndOffsetCache) {
                                if (key <= i) continue
                                else {
                                    data.colSizeAndOffsetCache[key].left += diffValue
                                    if (key > data.colEndIndex) continue
                                    else if ($(this).find(`.grid_cell[col_index=${key}]`).length) {
                                        $(this).find(`.grid_cell[col_index=${key}]`).css('left', data.colSizeAndOffsetCache[key].left)
                                    }
                                }
                            }
                        }
                    }
                    // yield
                }
            
            // })()  
        }
        // 简单时间切片 TODO 渲染时使用切片异步渲染
        const timeSlice = (gen) => {
            // 传入 generator 函数， yield 断点
            if (typeof gen === 'function') gen = gen()
            if (!gen || typeof gen.next !== 'function') return
            return function next() {
              const start = performance.now()
              let res = null
              do {
                res = gen.next()
              } while(!res.done && performance.now() - start < 25);
              if (res.done) return
              setTimeout(next)
            }
        }
        // 添加滚动事件
        const addScrollEvent = ($node, eventFn) => {
            if (!eventFn) return
            $node._scrollReady = false
            $node.on('mouseenter', function (e) {
                $node._scrollReady = true
                let clear = () => {
                    $node._scrollReady = false
                    $node.off('mouseleave', clear)
                }
                $node.on('mouseleave', clear)
            })
            let event = eventFn.bind($node)
            $node.on('scroll',event)
        }
        // 获取数据
        const getData = async (start=0) => {
            let time = (new Date().getTime() + '').slice(8)
            console.time(time + 'load data' )
            let datas = await opt.onLoadData(start)
            console.timeEnd(time + 'load data' )
            console.time(time + 'filter obj' )
            let columns = opt.columns
            // m * n
            data.loadedDatas = datas.reduce((acc, cur, idx) => {
                acc[start+idx] = []
                for (let i = 0; i < columns.length; i++) {
                    let data = datasFilter(columns[i], cur, idx)
                    acc[start + idx].push(data)
                }
                return acc
            },[])
            setTableHeight(data.loadedDatas.length * data.estimateHeight)
            console.timeEnd(time + 'filter obj' )
            return true
        }
        const datasFilter = (col, item, idx) => {
            let ret = null
            if (col.render === void 0) ret = item[col.field]
            else {
                let title = col.render(col.field, item)
                if (typeof title === 'object') {
                    ret = {tipsContent: title.tipsContent, extClass: title.extClass, title: title.content || ''}
                } else {
                    ret = title
                }
            }
            return ret
        }
        // 二分法查找
        const binarySearchIndex = (datas, isVertical, offset=0) => {
            let start = 0, low = 0, high = datas.length - 1
            endOffset = isVertical 
                    ? offset + containerHeight()
                    : offset + containerWidth();
            while (low <= high) {
                // 移位 = Math.floor((low+high)/2)
                let middle = (low + high) >> 1;
                let middleOffset = isVertical ? getVirtualRowOffset(middle) : getVirtualColOffset(middle)
                // console.log(middleOffset)
                let section = isVertical ? [middleOffset.top, middleOffset.top + middleOffset.height] : [middleOffset.left, middleOffset.left + middleOffset.width]
                if (offset >= section[0] && offset <= section[1] || low === high) {
                    start = middle - 1;
                    break;
                } else if (offset > section[1]) {
                    low = middle + 1;
                } else if (offset < section[0]){
                    high = middle - 1;
                }
            }
            // start
            for (let i = start + 1; i < datas.length; i++) {
                let lastOffset = isVertical ? getVirtualRowOffset(i).top : getVirtualColOffset(i).left
                if (lastOffset > endOffset) {
                    if (isVertical && start === data.rowStartIndex && (i + 1) === data.rowEndIndex) return false
                    if (!isVertical && start === data.colStartIndex && (i + 1) === data.colEndIndex) return false
                    return {start, end:i + 1};
                }
            }
            return {start, end: datas.length}
        }
        // 寻找现在显示的列数据索引区间
        const findDisplayColSection = (left) => {
            let columns = opt.columns
            let ret = binarySearchIndex(columns, false, left)
            if (!ret) return false
            data.colStartIndex = ret.start < 0 ? 0 : ret.start
            data.colEndIndex = ret.end >= columns.length ? columns.length - 1 : ret.end
            return true
        }
        // 寻找现在显示的行数据索引区间 向下会执行会快一些，所以 end 可以不多，但是向上执行过程会慢一点
        const findDisplayRowSection = (top) => {
            let datas = data.loadedDatas
            let ret = binarySearchIndex(datas, true, top)
            if (!ret) return false
            data.rowStartIndex = ret.start < 0 ? 0 : ret.start
            data.rowEndIndex = ret.end >= datas.length ? datas.length - 1 : ret.end
            return true
        }
        // 二分法 ……
        const binarySearchNearestIndex = (sortArr, aim) => {
            var low = 0, high = sortArr.length - 1
            while (low <= high) {
                var middle = (low + high) >> 1
                var midValue = sortArr[middle]
                if (aim == midValue) return middle
                else if (aim > midValue) low = middle + 1
                else high = middle - 1
            }
            // 对比前后 谁的距离近
            if (aim - sortArr[low] >= sortArr[low+1] - aim) {
                //  目标值距离 low 下标距离远的情况
                return low
            } else return low - 1
        }
        // 估算位置 从缓存最近的变量计算
        const getVirtualRowOffset = (index) => {
            // 查找最近的 缓存值，中间未加载的数值用估值替代
            let cache = data.rowSizeAndOffsetCache
            let estimateHeight = data.estimateHeight
            if (cache[index]) return cache[index]
            let cacheKeyArr = Object.keys(cache)
            let maxIndex = cacheKeyArr[cacheKeyArr.length - 1]
            if (!cacheKeyArr.length) return {top: index * estimateHeight, height: estimateHeight}
            if (index >= maxIndex) return  {top: cache[maxIndex].top + cache[maxIndex].height + (Math.abs(index - maxIndex) - 1) * estimateHeight, height: estimateHeight}
            let nearest = cacheKeyArr[binarySearchNearestIndex(cacheKeyArr, index)]
            return {top: cache[nearest].top + cache[nearest].height + (Math.abs(index - nearest) - 1) * estimateHeight, height: estimateHeight}
        }
        const getVirtualColOffset = (index) => {
            // 查找最近的 缓存值，中间未加载的数值用估值替代
            let cache = data.colSizeAndOffsetCache
            let estimateWidth = data.estimateWidth
            if (cache[index]) return cache[index]
            let cacheKeyArr = Object.keys(cache)
            let maxIndex = cacheKeyArr[cacheKeyArr.length - 1]
            if (!cacheKeyArr.length) return {left: index * estimateWidth, width: estimateWidth}
            if (index >= cacheKeyArr[cacheKeyArr.length-1]) return {left: cache[maxIndex].left + cache[maxIndex].width + (Math.abs(index - maxIndex) - 1) * estimateWidth, width: estimateWidth}
            let nearest = cacheKeyArr[binarySearchNearestIndex(cacheKeyArr, index)]
            return {left: cache[nearest].left + cache[nearest].width + (Math.abs(index - nearest) - 1) * estimateWidth, width: estimateWidth}
        }
        // 获取行位置大小信息 datas => data.loadedDatas
        // index => rowIndex
        const getRowSizeAndOffset = (datas, index) => {
            // true - 向下 | false - 向上
            let {rowSizeAndOffsetCache:rowCache, colStartIndex, colEndIndex} = data
            let columns = opt.columns
            let rowDatas = datas[index]
            let maxHeight = rowCache[index] ? rowCache[index].height : 0
            for (let i = colStartIndex; i <= colEndIndex; i++) {
                let content = rowDatas[i]
                let renderType = typeof content == 'object' ? 'object' : columns[i].richRender || columns[i].render ? 'rich' : 'string'
                if (renderType == 'object') content = content.title
                let {titleHeight} = getTitleSize(content, columns[i])
                if (titleHeight > maxHeight) maxHeight = titleHeight
            }
            let top = Object.keys(rowCache).length
                ? rowCache[index - 1] ? rowCache[index - 1].top + rowCache[index - 1].height : getVirtualRowOffset(index).top
                : 0
            return {top, height:maxHeight}
        } 
        // 获取列位置大小信息 datas 
        // datas => data.loadedDatas[row] or opt.columns when was execute with header
        // index => colIndex
        const getColSizeAndOffset = (datas, index) => {
            // true - 向右 | false - 向左
            // 尽量避免使用 CellGetter
            let colCache = data.colSizeAndOffsetCache
            let columns = opt.columns
            let content = datas[index] // 单元格显示文本
            if (datas == columns) content = datas[index].title

            let {width ,minWidth, maxWidth, richRender, textWrap} = columns[index]
            let conf = { width, minWidth, maxWidth, richRender, textWrap }

            let {title, titleWidth} = getTitleSize(content, conf)
            let left = Object.keys(colCache).length 
                       ? colCache[index-1] ? colCache[index-1].left + colCache[index-1].width : getVirtualColOffset(index).left
                       : 0
            return {left, width: titleWidth, title}
        }
        // conf => width, minWidth, maxWidth, richRender, textWrap
        // @return title, titleWidth, titleHeight
        const getTitleSize = (title, conf) => {
            let currentTitle = typeof title === 'function' ? title() : title
            let sizeHasComputed = data.CellMapCache[currentTitle] !== void 0 && data.CellMapCache[currentTitle].textWrap !== conf.textWrap
            let {width, height} = sizeHasComputed ? data.CellMapCache[currentTitle] : cellGetter(currentTitle, conf)
            !sizeHasComputed && (data.CellMapCache[currentTitle] = {width, height, textWrap:conf.textWrap})
            return {title:currentTitle, titleWidth: width, titleHeight: height}
        }
        // 根据内容取高度宽度
        const cellGetter = (title, conf) => {
            let renderType = typeof title == 'object' ? 'object' : conf.richRender || conf.render ? 'rich' : 'string'
            if (renderType !== 'string') state = 'normal'
            else if (conf.textWrap) state = 'wrap'
            else state = 'nowrap'
            sizeGetter.css({
                'width': conf.width,
                'min-width': conf.minWidth,
                'max-width': conf.maxWidth,
                // wrap
                'word-break': state === 'wrap' ? 'break-all' : '',
                'white-space': state === 'wrap' ? 'unset' : '',
                // nowrap
                'overflow': state === 'nowrap' ? 'hidden': '',
                'text-overflow': state === 'nowrap' ? 'ellipsis' : '',
            })
            if (renderType == 'object' || renderType == 'rich') sizeGetter.html(title)
            else sizeGetter.text(title)
            return {
                width: Math.ceil(sizeGetter.outerWidth()),
                height: Math.ceil(sizeGetter.outerHeight())
            }
        }

        
        // 载入行数据
        const startRender = async (start, end) => {
            data.dataLoading = true
            await getData(start, end)
            let time = (new Date().getTime() + '').slice(8)
            console.time(time + 'firstLoad' )
            firstLoad()
            console.timeEnd(time + 'firstLoad' )
            data.dataLoading = false
        }
        // 跳行
        const jumpRow = rowIdx => {
            let top = getVirtualRowOffset(rowIdx).top
            mainTableBody.scrollTop(top - 30)
            updateGridRow(data.loadedDatas, top - 30)
        }
        
        // 主进程
        methods.startRender = startRender
        methods.jumpRow = jumpRow
        methods.getScrollBody = getScrollBody

        initCreate()
        opt.created && opt.created()
        def(data, 'dataLoading', val => val ? domLoadingCover.show() : domLoadingCover.hide())
        console.log('start load')
        opt.readyAfterInit && startRender()
    })
}
$.fn.virtualizeTable.defaults = {
    columns: { type:'Array', default: () => [] },
    columns__item: {
        title: { type: ['String', 'Function'], default: ' '}, // 列表头标题
        hidden: {type:'Boolean', default: false}, // 是否隐藏该列
        minWidth: {type:['String', 'Number'], default: ''}, // 列最小宽
        maxWidth: {type:['String', 'Number'], default: ''}, // 列最大宽
        width: {type:['String', 'Number'], default: ''}, // 列宽度
        useFilter: {type: 'Boolean', default: false},
        // fixed: 'String', // 列是否固定于 左侧或者右侧
        field: 'String', // 列数据索引
        render: 'Function',
        textWrap: {type: 'Boolean', default: true},
        richRender: {type: 'Boolean', default: true},
    },
    readyAfterInit: {type: 'Boolean', default: false},
    useWindowScroller: {type: 'Boolean', default: false}, // 使用 window 滚动条的话 元素父级高度将不能设定
    useJumpRow: {type: 'Boolean', default: true},
    pageSize: 100, // 规定一次请求多少数据
    dataTotal: {type: 'Number', default: 1000},
    //event
    onLoadData: {type:['Function', 'AsyncFunction'], default: () => new Function('return []')},
    created: 'Function'
}
$.fn.virtualizeTable.methods = {
    options (jq) {
        let data = $.data(jq[0], 'virtualizeTable_opt')
        return data.options
    },
    ready (jq) {
        let render = $.data(jq[0], 'virtualizeTable_opt').methods.startRender
        render()
        return true
    },
    jumpRow (jq, row) {
        let jump = $.data(jq[0], 'virtualizeTable_opt').methods.jumpRow
        jump(row)
        return true
    },
    getScrollBody (jq) {
        let getScrollBody = $.data(jq[0], 'virtualizeTable_opt').methods.getScrollBody
        return getScrollBody()
    }
}