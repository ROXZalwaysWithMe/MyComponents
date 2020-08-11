/***** largetable 组件使用说明 ********

 使用懒加载的表格组件
 注：组件基于容器类节点初始化，如div，span，并直接填充该容器内部

 -------属性------
 width : 【default:''】【R/W】string/number 组件宽度
 height : 【default:''】【R/W】string/number 组件高度
 lineHeight : 【default:''】【R】string/number 设置数据行各行的高度（直接传入数值视为px值，也可以直接字符串形式设置px，rem等值，但不能使用百分比，设置后渲染效率会有显著提升），不设置的情况下将按照各行内容高度决定行高
 head : 
 {
	height : 【default:''】【R/W】string/number 表头高度
	minHeight : 【default:''】【R/W】string/number 表头最小高度
	maxHeight : 【default:''】【R/W】string/number 表头最小高度
 }
 columns : 【default:[]】【R】array(obj) 表头定义，obj定义如下：
		{
			field : 【default:''】【R】string/number 显示内容关联的数据字段名（如果定义了render，则不要求要与数据字段相关），同时也是列标识
			title : 【default:''】【R/W】string/number/function/htmlDom 显示的表头列名称，string/number-直接基于html渲染 function-定义:string/number/htmlDom function(field:string/number) 返回内容视为html内容渲染到表头列
			headSwap : 【default:true】【R/W】bool 表头渲染内容是否支持\n换行或超出限制宽度时自动换行,默认[是]
			headHtmlRender: 【default:false】【R/W】bool 是否以html形式渲染单元格内容，默认[否]
			fixed : 【default:false】【R/W】bool 是否为固定显示列（不能被横向滚动的列） true-是 false-否
			width : 【default:''】【R/W】string/number 列宽度（修改时会触发全视区reRender）
			minWidth : 【default:''】【R/W】string/number 列最小宽度（修改时会触发全视区reRender）
			maxWidth : 【default:''】【R/W】string/number 列最大宽度（修改时会触发全视区reRender）
			hidden : 【default:false】【R/W】bool 是否隐藏该列 如在单元格选择模式下因改变此属性使得某列被隐藏，在隐藏前该列中所有选中的单元格都会被取消选中，且不会触发onSelect事件
			allowFixCellSelect : 【default:false】【R】bool 【仅在当前列为固定列时，且selectMode="single-cell"/"multi-cell"时有效】是否允许当前列的单元格被选中
			cellRender : 【单元格显示的控制参数】【R】
			{
				extClass : 【default:''】【R/W】string/function 额外挂载入单元格的样式类
					string-样式名，多个类名以空格划开
					function-定义:string function(field:string/number, value:obj)
						@param string field,事件对应列的field属性值
						@param obj value,当前渲染行数据对象
						@return string 返回样式名，多个类名以空格划开
				extStyle : 【default:{}】【R/W】obj/function 额外挂载入单元格的样式
					obj-{样式名:样式值}
					function-定义:obj function(field:string/number, value:obj)
						@param string field,事件对应列的field属性值
						@param obj value,当前渲染行数据对象
						@return obj 返回样式组合 {样式名:样式值}
				htmlRender : 【default:false】【R/W】bool 是否以html形式渲染单元格内容，默认[否]
				swap : 【default:true】【R/W】bool 渲染内容是否支持\n换行或超出限制宽度时自动换行,默认[是]
				cellTip : 【default:''】【R/W】string/number/function/htmlDom, 需要在该单元格上显示的tooltip内容
					string/number-html形式渲染
					function-定义:string/number function(field:string/number, value:obj, index:number) 每次要显示tip时触发
						@param string field,事件对应列的field属性值
						@param obj value,当前渲染行数据对象
						@param number index,行索引
						@return string/number 当返回内容非空时以html渲染tip内容
				render : 【default:undefined】【R/W】function/htmlDom 单元格内容渲染函数，定义any function(field:string/number, value:obj, index:number)
					@param string field,事件对应列的field属性值
					@param obj value,当前渲染行数据对象
					@param number index,行索引
					@return any,如果richRender=true，返回内容以html形式渲染，如果为false，以纯文本渲染，且是否响应\n换行以textSwap设置值为准
				widthCal : 【default:undefined】【R/W】function 辅助计算单元格内容宽度，定义 number function(field:string/number, value:obj, index:number)
					@param string field,事件对应列的field属性值
					@param obj value,当前渲染行数据对象
					@param number index,行索引
					@return number,返回宽度值，该值视为单元格的内容宽度（不包含组件样式本身的外宽）
			}
			headTip : 【default:''】【R/W】string/number/function/htmlDom 鼠标移上去时表头要显示的tooltip信息 string/number-html形式渲染 function-定义:string function(field:string/number) 每次要显示tip时触发，当返回内容非空时显示tip，内容使用html渲染
			headClick : 【default:undefined】【R/W】function 表头项点击时的处理事件 定义void function(field:string/number)
		}
 readyAfterInit : 【default:false】【R】bool 组件初始化完成后是否立即加载数据，false的情况下需要外部调用组件ready方法触发加载
 initStartIndex : 【default:0】【R/W】int 初始数据渲染在视区的开始索引，虽然此属性允许修改，但如果是已完成初始数据渲染（加载数据），则修改也不会产生任何效果
 lazyLoad : 【default:true】【R】bool 数据是否使用懒加载，true-懒加载，数据分多次加载 false-数据一次性加载完成
 realtimeRender : 【default:true】【R/W】bool 是否使用实时渲染（滚动条滚动的同时渲染，开启实时渲染后如果渲染内容较复杂，可能会造成滚动卡顿，此时关闭能让顿宫流畅，但滚动过快可能会出现短暂白屏） 默认[是]
 selectMode : 【default:'single-line'】【R/W】'single-line'/'multi-line'/'single-cell'/'multi-cell' 选择模式 
		'single-line'-单行选择，在已选状态下选择其他行会切换，选择已选择行不会变化
		'multi-line'-多行选择，选中行再点一次时取消选择
		'single-cell'-单个单元格选择，在已选状态下选择其他单元格会切换，选择已选择单元格不会变化
		'multi-cell'-多单元格选择，选中单元格再点一次时取消选择

 -------事件------
 onLoadData : 【default:直接视为返回空数组】表格需要加载数据时触发，lazyLoad=false时，此事件只触发一次，该次获取到的数据视为全部数据
			定义：array(obj) function(startIndex:number, endIndex:number)
				@param number startIndex,要获取数据的开始索引（包含），lazyLoad=false时不存在此参数
 				@param number endIndex,要获取数据的结束索引（包含），lazyLoad=false时不存在此参数
 				@return array(obj),返回指定段的数据数组，数组中每一项代表一行数据，
					当lazyLoad=true，如果返回数量比传入的区间小，则组件认为已无更多数据
					当lazyLoad=false，返回的数据视为全部数据
 onScroll : 滚动条滚动事件(与浏览器scroll事件触发方式一致)，定义: void function(top:number, left:number)
				@param number top,当前的 scrollTop 值
				@param number left,当前的 scrollLeft 值
 onSelect : (行/单元格，视乎selectMode的配置)选中状态改变时触发的事件（包括界面操作变更和通过setSelectLine/setSelectCell变更） reLoad方法或selectMode属性的变更会清理所有选中，且不触发本事件 定义：void function(selected:bool,index:number,value:obj,field:string/number)
				@param bool selected,当前变更后的状态 true-被选中 false-取消选中
				@param number index,被选中/取消选中行的行索引
				@param obj value,被选中/取消选中行的数据对象，如果该对象尚未被组件加载，将填入undefined
				@param string/number field,如果选择模式是单元格相关，这里会传入单元格所属的field
 onFinRender : 完成一次完整数据区（表头不属于数据区）渲染后触发的事件（使用jumpToIndex完成显示指定行后，即使此过程没产生新渲染也依然会触发此事件），定义: void function()
 -------方法------
 object options() : //获取组件配置属性
 void pauseRender();//暂停渲染，暂停后所有涉及数据部分的渲染都不会执行(包括滚动视区到指定行)，但表头的渲染仍然有效（比如修改表头的固定属性，在不暂停的情况下会刷新数据部分，暂停后则只更新表头）
 void resumeRender();//重启渲染，重启被parseRender暂停的渲染，另外reRender和reLoad也有等同的效果
 void/object/array(object) colOptions( field:string, index:number = 0 ) : //获取指定field的列配置信息 index指定所获取字段在相同field中的索引，特殊值-1表示获取全部，此时返回的将为数组 如果特定索引下获取失败，返回undefined
 void ready( initStart:number = undefined ) : //开启数据加载 组件的readyAfterInit=true等同于直接调用了本方法，initStart用于指定初始渲染在视区的数据的开始索引，不传入时按属性initStartIndex的值执行
 void showColumn( field:string/array(string) ) : //显示列
 void hideColumn( field:string/array(string) ) : //隐藏列
 void updateHead( field:string,title:string/htmlDom = undefined ) : //更新指定列表头内容，如果title不给出，则按原title设置重新构造表头（此用法应该是在title设置为function的情况）
 void reLoad() : //重新加载所有内容(清空数据重置，表头保留)
 void reRender( index:number = undefined, field:string/number = undefined ) : //重新渲染特定内容
	@param number index = undefined,行索引，不传此参数表示重新渲染不指定行
	@param string/number field = undefined,列标识，不传此参数表示重新渲染不指定列
	@return void
	要重新渲染内容的范围由index和field两个参数整合指定，如果两个参数都没有传，表示重新渲染所有内容，重新渲染不触发数据加载
 void setScroll( top:number = NaN, left:number = NaN ) : //设置滚动条位置，top和left参数如果维持NaN或undefined，则表示不修改对应方位的滚动条位置
 void jumpToIndex( index:number, topShow:bool = false ) : //跳到特定索引行
	@param number index,行索引（0开始）
	@param bool topShow = false,是否尽量让该行显示在视区最上方（false的情况下只要该行满足在视区内即可）
 array getCurShowRange() : //获取当前视区正在显示行的行索引(一行上/下有10px可见即视为在视区内)，返回值为[当前视区显示开始行的行索引,当前视区显示结束行的行索引]，如果没有数据，将返回[-1,-1]
 void setSelectLine( index:number/array(number),select:bool = true,triggerEvent:bool = true ) : //【仅selectMode为"single-line"/"multi-line"时有效】设置行的选中状态，单选模式下传入多个行索引，将只有第一个有效
	@param number/array(number) index,设置单个或多个行选择状态的行索引，如果在selectMode=“single-line”下此参数传入多个行索引，则只有最后一个会被处理
	@param bool select = true,选择状态 true-选中 false-取消选中
	@param bool triggerEvent = true,是否设置过程中触发onSelect事件 默认[是]
 void setSelectCell( lineIndex:number,field:string/number,select:bool = true,triggerEvent:bool = true,showInView:bool = false ) : //【仅selectMode为"single-cell"/"multi-cell"时有效】设置单元格的选中状态
	@info 虽然极不建议在selectMode为"single-line"/"multi-line"时使用本方法，但如果使用，此时方法在单元格选择上将变为按lineIndex行选择处理（即field参数无效），但showInView=true时，滚入视区的处理里field参数依然有效
	@param number lineIndex,行索引号，只能传入单个
	@param string/number field,列标识，如果标识对应多列时，在selectMode=“multi-cell”下，这些列对应行的单元格都会被处理，而在selectMode=“single-cell”下，则只有一个单元格会被处理
	@param bool select = true,选择状态 true-选中 false-取消选中
	@param bool triggerEvent = true,是否设置过程中触发onSelect事件 默认[是]
	@param bool showInView = false,是否把该单元格显示在视区里，默认[否] 如果此时列标识对应的列不唯一，将选择其中某一列对应的该行单元格滚入视区
 array getSelect() : //获取当前选中内容
	【selectMode为"single-line"/"multi-line"时】返回当前所有选择行的行索引及对象 返回值 array-[{index:行索引 value:行对象（如果行对象尚未加载，将传入undefined）},......]
	【selectMode为"single-cell"/"multi-cell"时】返回当前所有选择单元格的行索引，列field及行对象 返回值 array-[{index:行索引 value:行对象（如果行对象尚未加载，将传入undefined）,fields:[所有涉及列的field集合]},......]

 **************************************/
$.fn.largetable = function (xOptions, ...axParam)
{
	if (typeof xOptions == 'string')
	{
		let xMethod = $.fn.largetable.methods[xOptions];
		if (xMethod)
			return xMethod(this, ...axParam);
		return;
	}
	xOptions = xOptions || {};
	return this.each(function()
	{
		//验证组件是否已创建
		let xTmpValue = $.data(this, 'largetable_opt');
		if (xTmpValue != undefined)
		{
			for (let strKey in xOptions)
			{
				if (strKey == 'columns')
					continue;
				if (strKey == 'head')
				{
					for (let strSubKey in xOptions[strKey])
						xTmpValue[strKey][strSubKey] = xOptions[strKey][strSubKey]
				}
				else
					xTmpValue[strKey] = xOptions[strKey];
			}
			return;
		}
		//定义数值转换函数（用于处理e+的字符串情况）
		let funcParseInt = function(xNum)
		{
			let nNum1 = parseInt(xNum);
			if (isNaN(nNum1))
				return NaN;
			if (typeof(xNum) == 'string')
			{
				let nNum2 = Number(xNum.substr(0,xNum.length - 2));
				if (isNaN(nNum2))
					return nNum1;
				if (nNum2 != nNum1)
					return nNum2;
			}
			return nNum1;
		}
		//属性定义初始化
		let oIdleId;
		let nUniqueAllow = 0;//内部分配唯一值的变量
		let nCellOuterWidth = NaN;//单元格内容外的占宽（padding部分+border部分） 当某些单元格使用widthCal时会用到并在那时初始化
		let nFixLineHeight = NaN;//固定行高，当设置了lineHeight时会用到并在那时初始化
		let domThis = this;
		let oCurOpt = $.data(this, 'largetable_opt',
		{
			options: CCommon.CreateObservableObj({head:{height:''},columns:[]},false,true),
			isInit: true, //组件是否初始化中
			isDestroy: false,//是否已销毁
			readyLoadData: false, //组件是否准备好加载数据
			renderBody: undefined,//渲染数据区的函数，延后定义
			allowRender: true,//是否允许执行数据渲染
			waitUpHeadHeigh: false,//等待更新表头高度（在allowRender=false时如果有表头调整，此变量会设置为true，然后表头高度的重置会延后到allowRender变回true的时候）
			filterByField:function(strField) //按照field过滤出所有满足的列属性对象
			{
				let paoReturn = [];
				for (let poY of aoRenderInfo)
				{
					if (poY['h']['r']['field'] == strField)
						paoReturn.push(poY['h']['r']);
				}
				return paoReturn;
			},
			///// 对外方法 //////
			reLoad:function()
			{
				oCurOpt['allowRender'] = true;
				oLineData['data'] = [];
				oLineData['fin'] = false;
				++nRenderSerial;//无效当前所有渲染
				for (let poQuery of oLineData['quering'])
					poQuery['p']([]);//让当前等待数据的渲染退出
				oLineData['quering'] = [];
				$domFillDataEnd.hide();
				$domFixDataEndFill.hide();
				$($domFixDataBody[0].getElementsByClassName('largetable_line')).remove();
				$($domFillDataBody[0].getElementsByClassName('largetable_line')).remove();
				$domFixHeightSpace.css('height','');
				$domFillHeightSpace.css('height','');
				aoRenderInfo['mH'] = [];
				let pmapCid = oRenderState['nodes']['head']['map'];
				let nFillAdjustLeft = 0;
				let nFixAdjustLeft = 0;
				for (let nScan = 0;nScan < aoRenderInfo.length;++nScan)
				{
					let poObj = aoRenderInfo[nScan];
					poObj['mW'] = poObj['h']['w'];
					poObj['sW'] = [{v:poObj['mW'],c:1}];
					let strCid = poObj['h']['r']['cid'];
					let poNode = pmapCid[strCid];
					if (poNode != undefined)
					{
						poNode['left'] += (poNode['isFixed'] == true ? nFixAdjustLeft : nFillAdjustLeft);
						if (poObj['mW'] != poNode['width'])
						{
							poNode['node'].style.width = poObj['mW'];
							if (poNode['isFixed'] == true)
								nFixAdjustLeft += poObj['mW'] - poNode['width'];
							else
								nFillAdjustLeft += poObj['mW'] - poNode['width'];
							poNode['width'] = poObj['mW'];
						}
					}
					poObj.splice(0,poObj.length);
				}
				oSelected = {len:0};
				funcBodyRender();
			},
			reRender:function(bResumeRender,nLineIndex,strField) //nLineIndex传undefined时表示所有行，strField传undefined时表示所有列
			{
				if (oCurOpt['allowRender'] == false && bResumeRender == true)
					oCurOpt['allowRender'] = true;
				if (oCurOpt['allowRender'] == false)
					return;
				if (nLineIndex == undefined && strField == undefined)
				{
					$domFixDataBody.children('[lindex]').children('[cid]').children().detach().end().end().remove();
					$domFillDataBody.children('[lindex]').children('[cid]').children().detach().end().end().remove();
					let pmapCid = oRenderState['nodes']['head']['map'];
					let nFillAdjustLeft = 0;
					let nFixAdjustLeft = 0;
					for (let nScan = 0;nScan < aoRenderInfo.length;++nScan)
					{
						let poObj = aoRenderInfo[nScan];
						poObj['mW'] = poObj['h']['w'];
						poObj['sW'] = [{v:poObj['mW'],c:1}];
						let strCid = poObj['h']['r']['cid'];
						let poNode = pmapCid[strCid];
						if (poNode != undefined)
						{
							poNode['left'] += (poNode['isFixed'] == true ? nFixAdjustLeft : nFillAdjustLeft);
							if (poObj['mW'] != poNode['width'])
							{
								poNode['node'].style.width = poObj['mW'];
								if (poNode['isFixed'] == true)
									nFixAdjustLeft += poObj['mW'] - poNode['width'];
								else
									nFillAdjustLeft += poObj['mW'] - poNode['width'];
								poNode['width'] = poObj['mW'];
							}
						}
						poObj.splice(0,poObj.length);
					}
				}
				else if (nLineIndex == undefined && strField != undefined)
				{
					for (let poCol of oCurOpt.filterByField(strField))
					{
						let strCid = poCol['cid'];
						$domFixDataBody.find(`[cid="${strCid}"]`).children().detach().end().remove();
						$domFillDataBody.find(`[cid="${strCid}"]`).children().detach().end().remove();
						let poObj = aoRenderInfo[aoRenderInfo[strCid]['i']];
						poObj['mW'] = poObj['h']['w'];
						poObj['sW'] = [{v:poObj['mW'],c:1}];
						poObj.splice(0,poObj.length);
					}
				}
				else
				{
					let astrCids = [];
					if (strField == undefined)
						astrCids = Object.keys(oRenderState['nodes']['head']['map']);
					else
					{
						for (let poCol of oCurOpt.filterByField(strField))
							astrCids.push(poCol['cid']);
					}
					if (strField == undefined)
					{
						$domFixDataBody.children(`[lindex="${nLineIndex}"]`).children('[cid]').children().detach().end().end().remove();
						$domFillDataBody.children(`[lindex="${nLineIndex}"]`).children('[cid]').children().detach().end().end().remove();
					}
					for (let strCid of astrCids)
					{
						if (strField != undefined)
						{
							$domFixDataBody.children(`[lindex="${nLineIndex}"]`).children(`[cid="${strCid}"]`).children().detach().end().remove();
							$domFillDataBody.children(`[lindex="${nLineIndex}"]`).children(`[cid="${strCid}"]`).children().detach().end().remove();
						}
						let nIndex = aoRenderInfo[strCid]['i'];
						if (aoRenderInfo[nIndex][nLineIndex] == undefined)
							continue;
						let nCurCellWidth = aoRenderInfo[nIndex][nLineIndex]['width'];
						for (let nScan = 0;nScan < aoRenderInfo[nIndex]['sW'].length;++nScan)
						{
							if (aoRenderInfo[nIndex]['sW'][nScan]['v'] == nCurCellWidth)
							{
								--aoRenderInfo[nIndex]['sW'][nScan]['c'];
								if (aoRenderInfo[nIndex]['sW'][nScan]['c'] == 0)
								{
									aoRenderInfo[nIndex]['sW'].splice(nScan,1);
									--nScan;
								}
								break;
							}
						}
						aoRenderInfo[nIndex]['mW'] = aoRenderInfo[nIndex]['sW'][0]['v'];
						aoRenderInfo[nIndex]['sW'][0]['c']++;
						aoRenderInfo[nIndex][nLineIndex] = {width:aoRenderInfo[nIndex]['mW']};
					}
					if (astrCids.length == 0)
						return;
				}
				funcBodyRender(true);
			},
			setScroll:function(nTop = undefined,nLeft = undefined)
			{
				if (nTop != undefined)
				{
					nTop = funcParseInt(nTop);
					if (isNaN(nTop) == false)
						$domFillDataBody.scrollTop(nTop);//通过滚动数据区的设置带动另一边
				}
				if (nLeft != undefined)
				{
					nLeft = funcParseInt(nLeft);
					if (isNaN(nLeft) == false)
						$domFillDataBody.scrollLeft(nLeft);//通过滚动数据区的设置带动另一边
				}
			},
			jumpToIndex:function(nIndex,bTopShow)
			{
				nIndex = funcParseInt(nIndex);
				if (isNaN(nIndex) == true)
					return;
				funcBodyRender(false,nIndex,bTopShow);
			},
			getCurShowRange:function()
			{
				let $domFirstLine = $domFillDataBody.children('[lindex]:first');
				if ($domFirstLine.length == 0)
					return [-1,-1];
				let nOffsetTop = $domFirstLine.position().top;
				let nScanIndex = parseInt($domFirstLine.attr('lindex'));
				let oReturn = [nScanIndex,nScanIndex];
				while (nOffsetTop < 0)
				{
					nOffsetTop += aoRenderInfo['mH'][oReturn[0]];
					if (aoRenderInfo['mH'][oReturn[0] + 1] == undefined)
						break;
					if (nOffsetTop < 10)
						oReturn[0]++;
				}
				oReturn[1] = oReturn[0];
				let nViewHeight = $domFillDataBody.height();
				while (1)
				{
					nOffsetTop += aoRenderInfo['mH'][oReturn[1]];
					if (nViewHeight - nOffsetTop < 10 || aoRenderInfo['mH'][oReturn[1] + 1] == undefined)
						break;
					++oReturn[1];
				}
				return oReturn;
			},
			setSelect(xIndex,bSelect = true,bTriggerEvent = true,xField = undefined)
			{
				if (oCurOpt['options']['selectMode'].indexOf('cell') > 0)
				{
					if (xField == undefined)
						return;
					xField = oCurOpt['filterByField'](xField);
				}
				else
					xField = [null];
				if (Object.prototype.toString.call(xIndex) != '[object Array]')
					xIndex = [xIndex];
				else if (xIndex.length == 0)
					return;
				else if (xIndex.length > 1 && oCurOpt['options']['selectMode'].indexOf('single') == 0)
					xIndex = [xIndex[xIndex.length - 1]];
				for (let nIndex of xIndex)
				{
					nIndex = parseInt(nIndex);
					if (isNaN(nIndex) || oLineData['fin'] == true && nIndex >= oLineData['data'].length)
						continue;
					let $domFillTarget = $domFillDataBody.children(`[lindex="${nIndex}"]`);
					let $domFixTarget = $domFixDataBody.children(`[lindex="${nIndex}"]`);
					if (bSelect == false)
					{
						if (oSelected[nIndex] == undefined)
							continue;
						for (let poCol of xField)
						{
							if (poCol == null)//行操作
							{
								$domFillTarget.attr('isSelected','');
								delete oSelected[nIndex];
								oSelected.len--;
								if (bTriggerEvent == true)
									funcCallOnSelectEvent(nIndex,false);
							}
							else if (oSelected[nIndex].has(poCol['cid']) == false || poCol['hidden'] == true || (poCol['fixed'] == true && poCol['allowFixCellSelect'] == false))
								continue;
							else
							{
								oSelected[nIndex].delete(poCol['cid']);
								if (oSelected[nIndex].size == 0)
								{
									delete oSelected[nIndex];
									oSelected.len--;
								}
								$domFillTarget.children(`[cid="${poCol['cid']}"]`).attr('isSelected','');
								$domFixTarget.children(`[cid="${poCol['cid']}"]`).attr('isSelected','');
								if (bTriggerEvent == true)
									funcCallOnSelectEvent(nIndex,false,poCol['field']);
							}
						}
					}
					else
					{
						for (let poCol of xField)
						{
							if (poCol == null)//行操作
							{
								if (oSelected[nIndex] != undefined)
									continue;
								if (oCurOpt['options']['selectMode'].indexOf('single') == 0)
								{
									for (let nExistIndex in oSelected)
									{
										if (nExistIndex == 'len')
											continue;
										$domFillDataBody.children(`[lindex="${nExistIndex}"]`).attr('isSelected','');
										if (bTriggerEvent == true)
											funcCallOnSelectEvent(nExistIndex,false);
									}
									oSelected = {len:0};
								}
								oSelected[nIndex] = 0;
								$domFillTarget.attr('isSelected','1');
								if (bTriggerEvent == true)
									funcCallOnSelectEvent(nIndex,true);
							}
							else if (oSelected[nIndex] != undefined && oSelected[nIndex].has(poCol['cid']) == true || poCol['hidden'] == true || (poCol['fixed'] == true && poCol['allowFixCellSelect'] == false))
								continue;
							else
							{
								if (oCurOpt['options']['selectMode'].indexOf('single') == 0)
								{
									for (let nExistIndex in oSelected)
									{
										if (nExistIndex == 'len')
											continue;
										let $domDelFillTarget = $domFillDataBody.children(`[lindex="${nExistIndex}"]`);
										let $domDelFixTarget = $domFixDataBody.children(`[lindex="${nExistIndex}"]`);
										for (let strCid of oSelected[nExistIndex].values())
										{
											if (aoRenderInfo[strCid]['r']['fixed'] == false)
												$domDelFillTarget.children(`[cid="${strCid}"]`).attr('isSelected','');
											else
												$domDelFixTarget.children(`[cid="${strCid}"]`).attr('isSelected','');
											if (bTriggerEvent == true)
												funcCallOnSelectEvent(nExistIndex,false,aoRenderInfo[strCid]['r']['field']);
										}
									}
									oSelected = {len:0};
								}
								if (oSelected[nIndex] == undefined)
									oSelected[nIndex] = new Set();
								oSelected[nIndex].add(poCol['cid']);
								$domFillTarget.children(`[cid="${poCol['cid']}"]`).attr('isSelected','1');
								$domFixTarget.children(`[cid="${poCol['cid']}"]`).attr('isSelected','1');
								if (bTriggerEvent == true)
									funcCallOnSelectEvent(nIndex,true,poCol['field']);
							}
						}
					}
				}
			},
			getSelect()
			{
				let aoReturn = [];
				for (let nIndex in oSelected)
				{
					if (nIndex == 'len')
						continue;
					let poLineObj = oLineData['data'][nIndex];
					if (poLineObj == null)
						poLineObj = undefined;
					if (typeof(oSelected[nIndex]) == 'number')
						aoReturn.push({index:nIndex,value:poLineObj});
					else
					{
						let aoFields = [];
						for (let strCid of oSelected[nIndex])
							aoFields.push(aoRenderInfo[strCid]['r']['field']);
						aoReturn.push({index:nIndex,value:poLineObj,fields:aoFields});
					}
				}
				return aoReturn;
			}
		});
		//行数据管理
		let oLineData = {fin:false,data:[],quering:[],pageSize:100};//行数据管理 quering-正在向外请求，数组中对象为{s:当前请求开始索引 e:当前请求结束索引 p:请求回调}
		let funcGetData = (nStart,nEnd) => new Promise(async function(funcResolve) //获取区间数据，区间两边都是包含关系
		{
			let nQueryS = nStart;
			let nQueryE;
			if (nEnd >= oLineData['data'].length && oLineData['fin'] == true)
				nQueryE = oLineData['data'].length - 1;
			else
				nQueryE = nEnd;
			let nScanE = Math.min(nQueryE,oLineData['data'].length - 1);
			let nMaxNullIndex = -1;
			let bQueryStartIsFix = false;
			for (let nScan = nQueryS;nScan <= nScanE;++nScan)
			{
				if (oLineData['data'][nScan] != null)
				{
					if (bQueryStartIsFix == false)
						++nQueryS;
				}
				else
				{
					bQueryStartIsFix = true;
					nMaxNullIndex = nScan;
				}
			}
			if (nQueryE < oLineData['data'].length)
				nQueryE = (nMaxNullIndex == -1 ? nQueryS -1 : nMaxNullIndex);
			oLineData['quering'].push({s:nStart,e:nEnd,p:funcResolve});
			if (nQueryS <= nQueryE)
			{
				let aoNewData = [];
				if (typeof(oCurOpt['options']['onLoadData']) == 'function')
				{
					if (oCurOpt['options']['lazyLoad'] == true)
					{
						//按整页获取
						nQueryS = Math.floor(nQueryS / oLineData['pageSize']) * oLineData['pageSize'];
						nQueryE = Math.ceil(nQueryE / 100) * oLineData['pageSize'];
						aoNewData = await oCurOpt['options']['onLoadData'].call(domThis,nQueryS,nQueryE);
					}
					else
						aoNewData = await oCurOpt['options']['onLoadData'].call(domThis);
					if (Object.prototype.toString.call(aoNewData) != '[object Array]')
					{
						console.warn('onLoadData:wrong return data format');
						aoNewData = [];
					}
				}
				if (oCurOpt['options']['lazyLoad'] == false || (aoNewData.length < nQueryE - nQueryS + 1 && (aoNewData.length > 0 || nQueryS == oLineData['data'].length)))
					oLineData['fin'] = true;
				else if (aoNewData.length > nQueryE - nQueryS + 1)
				{
					console.warn('onLoadData:return data more than query');
					aoNewData.splice(nQueryE - nQueryS + 1,aoNewData.length - (nQueryE - nQueryS + 1));
				}
				for (let nScan = 0;nScan < aoNewData.length;++nScan)
				{
					let nRealIndex = (oCurOpt['options']['lazyLoad'] == true ? nScan + nQueryS : nScan);
					while (oLineData['data'].length <= nRealIndex)
						oLineData['data'].push(null);
					if (Object.prototype.toString.call(aoNewData[nScan]) == '[object Object]')
						oLineData['data'][nRealIndex] = aoNewData[nScan];
					else
					{
						console.warn('onLoadData:data in line is not an object');
						oLineData['data'][nRealIndex] = {};
					}
				}
			}
			//构建返回数据
			for (let nScan = 0;nScan < oLineData['quering'].length;++nScan)
			{
				let poCurQuery = oLineData['quering'][nScan];
				let aoReturn = [];
				let bDataReady = true;
				for (let nGetS = poCurQuery['s'];nGetS <= poCurQuery['e'];++nGetS)
				{
					if (oLineData['data'][nGetS] === null)
					{
						bDataReady = false;
						break;
					}
					if (oLineData['data'][nGetS] === undefined)
					{
						bDataReady = oLineData['fin'];
						break;
					}
					aoReturn.push(oLineData['data'][nGetS]);
				}
				if (bDataReady == true)
				{
					oLineData['quering'].splice(nScan--,1);
					poCurQuery['p'](aoReturn);
				}
			}
		});
		//渲染数据管理
		let aoRenderInfo = [];//二维数组描述各单元格的渲染信息 aoRenderInfo[x][y]  x,y都是从0开始 信息结构:{width:宽度 render:渲染信息，如果从未渲染过，此字段为undefined}
								//另外还有特殊项：
								//['mH'][y]-特定行的行高度值
								//[x]['mW']-特定列最大单元格宽度
								//[x]['sW']-特定列的单元格出现宽度值从大到小排好序的大小记录，格式为 [{v:宽度值 c:出现单元格数},...]
								//[x]['h']-特定列表头定义，格式为 {w:表头宽度 r:配置columns中对应表头项的引用 i-对应的x索引值 isFake:是否为临时节点 minWidth:如果有设置minWidth，这里记录px单位下的minWidth值 maxWidth:如果有设置maxWidth，这里记录px单位下的maxWidth值}
								//['c'+列内部分配唯一标识]-关联对应的属性结构（[x]['h']）
		Object.defineProperty(aoRenderInfo,'mH',
		{
			value:[],
			writable:true,
			enumerable:false
		});
		let oRenderState = { //记录渲染状态信息及一些渲染设定量
			head:{fix:[],fill:[]},//已渲染数据中所涉及的表头 fix和fill数组中填入对象为 {cid,width,index}
			defaultLineHeight:20, //对未渲染行设置的默认行高(px)
			minReserve:{v:100,h:100},//最小保留间隙（已渲染与视区边界的最小保留空间）
			maxRender:{v:100,h:100}, //重新渲染时最大间隙（已渲染与视区边界的最小渲染空间，到尽头的除外）
			inViewMin:15, //判断行是否在视区内显示的边界要求px值(建议比默认行高小)
			nodes: //已渲染节点的管理（便于属性处理）
			{
				head:
				{
					/**
					 * 单个表头信息节点
					 * {
					 * 	node:dom节点本身,
					 * 	index:数组索引号,
					 * 	isFixed:true/false,
					 * 	isFake:true/false,
					 * 	cid,
					 * 	left:左偏移
					 * 	width:自身外宽度
					 * }
					 */
					map:{},//key-cid value-fixArray或fillArray的节点
					fixArray:[],//固定区列的表头节点管理
					fillArray:[]//滚动区列的表头节点管理
				},
			}
		};//已渲染状态管理
		//组件界面初始化
		let oSelected = {len:0};//记录已选择行的行索引
		$(this).css({display:'inline-flex',overflow:'hidden'});
		let $domFixPart = $('<div style="height:100%;flex-shrink:0;display:flex;flex-direction:column;"></div>').appendTo(this);
		let $domFixHead = $('<div style="flex-shrink:0;overflow:auto;display:flex;" class="largetable_header"></div>').appendTo($domFixPart);
		let $domFixDataBody = $('<div style="height:100%;overflow:auto;display:flex;flex-direction:column;position:relative;" class="largetable_fix_data_body"></div>').appendTo($domFixPart);
		let $domFixHeightSpace = $('<div style="flex-shrink:0;"></div>').appendTo($domFixDataBody);
		let $domFixDataEndFill = $('<div style="display:none;background-color:transparent;" class="largetable_data_fix_free_fill largetable_data_end_show"></div>').appendTo($domFixDataBody);//固定数据区数据结束提示占位
		let $domFixScrollBarHeight = $('<div style="flex-shrink:0;" class="largetable_data_fix_free_fill"></div>').appendTo($domFixDataBody);//填充因隐藏横向滚动条而产生的高度差
		$('<div style="height:100%;" class="largetable_data_fix_free_fill"></div>').appendTo($domFixDataBody);//固定数据区剩余空间填充
		let $domFillPart = $('<div style="height:100%;width:100%;display:flex;flex-direction:column;overflow:hidden;"></div>').appendTo(this);
		let $domFillHead = $('<div style="flex-shrink:0;overflow:auto;display:flex;position:relative;" class="largetable_header"></div>').appendTo($domFillPart);
		let $domFillScrollBarWidth = $('<div style="flex-shrink:0;height:100%;border:unset;"></div>').appendTo($domFillHead);
		let $domFillDataBody = $('<div style="height:100%;overflow:auto;display:flex;flex-direction:column;position:relative;" class="largetable_fill_data_body"></div>').appendTo($domFillPart);
		let $domFillHeightSpace = $('<div style="flex-shrink:0;"></div>').appendTo($domFillDataBody);
		$('<div style="flex-shrink:0;height:1px;" class="largetable_data_bottom"></div>').appendTo($domFillDataBody);//横向滚动数据区撑开滚动条的占位
		let $domFillDataEnd = $('<div style="display:none;" class="largetable_data_end_show">已到数据末端</div>').appendTo($domFillDataBody);//滚动数据区数据结束提示
		//为仅初始化时能设置的属性设置验证
		oCurOpt['options'].addValueValid(() => false,['columns',null,'cellRender'],['columns',null,'field'],['columns',null,'cid'],['columns',null,'allowFixCellSelect']);
		oCurOpt['options'].addValueValid(() => oCurOpt['isInit'],'lineHeight','head','columns','readyAfterInit','lazyLoad');
		//为仅支持number类型的属性设置验证
		oCurOpt['options'].addValueValid((oEventInfo) => (typeof(oEventInfo['value']) == 'number'),'initStartIndex');
		//为支持string和number类型的属性设置验证
		oCurOpt['options'].addValueValid((oEventInfo) => (typeof(oEventInfo['value']) == 'string' || typeof(oEventInfo['value']) == 'number'),'lineHeight','width','height',['head','height'],['head','minHeight'],['head','maxHeight'],['columns',null,'field'],['columns',null,'width'],['columns',null,'minWidth'],['columns',null,'maxWidth']);
		//为realtimeRender属性设置验证
		oCurOpt['options'].addValueValid((oEventInfo) => (typeof(oEventInfo['value']) == 'boolean'),'realtimeRender');
		//为selectMode属性设置验证和修改监听
		oCurOpt['options'].addValueValid((oEventInfo) => (['single-line','multi-line','single-cell','multi-cell'].indexOf(oEventInfo['value']) >= 0),'selectMode');
		oCurOpt['options'].addEventListener(function()
		{
			oSelected = {len:0};
			$domFillDataBody.children('[lindex]').attr('isSelected','').children().attr('isSelected','');
		},'allchange',false,'selectMode');
		//禁止非组件内的columns修改
		let bAllowAddColumn = false;
		oCurOpt['options'].addValueValid(() => bAllowAddColumn,['columns',null]);
		//监听组件整体宽高调整
		oCurOpt['options'].addEventListener((aoEventInfos) => $(domThis).css(aoEventInfos[0]['key'],aoEventInfos[0]['value'] + (funcParseInt(aoEventInfos[0]['value']) == aoEventInfos[0]['value'] ? 'px' : '')),'allchange',false,'width','height');
		//列变动相关
		let funcAdjustColHeight = function() //重新调整列高度
		{
			oCurOpt.waitUpHeadHeigh = false;
			if (oCurOpt['options']['head']['height'] == '')
			{
				$domFixHead[0].style.height = 'max-content';//不使用清空的方式是为了兼容部分chrome版本的实现
				$domFillHead[0].style.height = 'max-content';//不使用清空的方式是为了兼容部分chrome版本的实现
				let nCurMaxHeight = Math.max($domFixHead.outerHeight(),$domFillHead.outerHeight());
				$domFixHead[0].style.height = nCurMaxHeight;
				$domFillHead[0].style.height = nCurMaxHeight;
			}
		};
		let funcRerenderCol = function(strCId,bSetFake = undefined) //重新渲染特定表头项 strUId-表头唯一标识 bSetFake-指定创建的是否为假节点 默认值undefined表示由函数判断
		{
			if (aoRenderInfo[strCId] == undefined)
				return;
			let poCol = aoRenderInfo[strCId]['r'];
			//1、隐藏列的处理
			let poNode = oRenderState['nodes']['head']['map'][strCId];
			if (poCol['hidden'] == true)
			{
				if (poNode != undefined)
				{
					$(poNode['node']).children().detach().end().remove();
					let paoTarget = (poNode['isFixed'] == true ? oRenderState['nodes']['head']['fixArray'] : oRenderState['nodes']['head']['fillArray']);
					paoTarget.splice(poNode['index'],1);
					for (let nScan = poNode['index'];nScan < paoTarget.length;++nScan)
					{
						paoTarget[nScan]['index']--;
						paoTarget[nScan]['left'] -= poNode['width'];
					}
					delete oRenderState['nodes']['head']['map'][strCId];
				}
				bSetFake = false;
			}
			else
			{
				let oCss = {};
				//2、建立节点基本信息
				let $domTarget = poCol['fixed'] == true ? $domFixHead : $domFillHead;
				let paoTarget = (poCol['fixed'] == true ? oRenderState['nodes']['head']['fixArray'] : oRenderState['nodes']['head']['fillArray']);
				let nCurIndex = aoRenderInfo[poCol['cid']]['i'];//记录其在当前管理数据中的索引
				let bIsNewCreate = false;
				if (poNode == undefined || poNode['isFixed'] != poCol['fixed'] || poNode['isFake'] == true)
				{
					if (poNode != undefined)
					{
						$(poNode['node']).children().detach().end().remove();
						let paoScan = (poNode['isFixed'] == true ? oRenderState['nodes']['head']['fixArray'] : oRenderState['nodes']['head']['fillArray']);
						for (let nScan = poNode['index'] + 1;nScan < paoScan.length;++nScan)
						{
							paoScan[nScan]['index']--;
							paoScan[nScan]['left'] -= poNode['width'];
						}
						paoScan.splice(poNode['index'],1);
						poNode['isFixed'] = poCol['fixed'];
					}
					else
					{
						poNode = {isFixed:poCol['fixed'],cid:strCId};
						oRenderState['nodes']['head']['map'][strCId] = poNode;
					}
					let nSerial = 0;
					for (let nScan = aoRenderInfo[strCId]['i'] - 1;nScan >= 0;--nScan) //此逻辑建立在[界面表头列的创建按照从左到右的方式处理]这个逻辑，在初始创建完成后，后继操作都是单列，此循环依然有效
					{
						let poScanCol = aoRenderInfo[nScan]['h']['r'];
						if (poScanCol['hidden'] == false && poScanCol['fixed'] == poCol['fixed'])
						{
							nSerial = oRenderState['nodes']['head']['map'][poScanCol['cid']]['index'] + 1;
							break;
						}
					}
					poNode['index'] = nSerial;
					poNode['left'] = (nSerial == 0 ? 0 : paoTarget[nSerial - 1]['left'] + paoTarget[nSerial - 1]['width']);
					if (bSetFake == undefined && nSerial > 0 && paoTarget[nSerial - 1]['left'] - $domTarget.outerWidth() > oRenderState['maxRender']['h'])
						bSetFake = true;
					else if (bSetFake == undefined)
						bSetFake = false;
					if (bSetFake == true)
					{
						oCss['width'] = '25px';
						if (oIdleId != undefined && astrLeftFakeCid.indexOf(strCId) < 0)
							astrLeftFakeCid.push(strCId);
					}
					bIsNewCreate = true;
				}
				else
					bSetFake = false;
				poNode['isFake'] = bSetFake;
				aoRenderInfo[nCurIndex]['h']['isFake'] = bSetFake;
				//3、节点显示内容处理
				let xTitle = '';
				if (poNode['isFake'] == false)
				{
					let strTitleType = Object.prototype.toString.call(poCol['title']);
					if (strTitleType == '[object Function]')
						xTitle = poCol['title'].call(domThis,poCol['field']);
					else
						xTitle = poCol['title'];
					strTitleType = Object.prototype.toString.call(xTitle);
					if (strTitleType.indexOf('[object HTML') < 0)
						xTitle = '' + xTitle;
					else if (xTitle == undefined)
						xTitle = '';
					if (poCol['headHtmlRender'] == false)
						xTitle = CCommon.HtmlEncode('' + xTitle,poCol['headSwap']);
					//4、样式处理
					if (poCol['width'] != '')
						oCss['width'] = poCol['width'] + (funcParseInt(poCol['width']) == poCol['width'] ? 'px' : '');
					if (poCol['minWidth'] != '')
						oCss['min-width'] = poCol['minWidth'] + (funcParseInt(poCol['minWidth']) == poCol['minWidth'] ? 'px' : '');
					if (poCol['maxWidth'] != '')
						oCss['max-width'] = poCol['maxWidth'] + (funcParseInt(poCol['maxWidth']) == poCol['maxWidth'] ? 'px' : '');
					if (typeof(poCol['headClick']) == 'function')
						oCss['cursor'] = 'pointer';
				}
				//5、创建/替换节点
				let $domCol;
				let strHtml = `<div cid="${strCId}" swap="${poCol['headSwap'] == true ? 1 : 0}" style="`;
				for (let strKey in oCss)
					strHtml += `${strKey}:${oCss[strKey]};`;
				strHtml += '">' + (typeof(xTitle) == 'string' ? xTitle : '') + '</div>';
				if (bIsNewCreate == false)
				{
					$domCol = $(strHtml);
					poNode['node'].parentNode.replaceChild($domCol[0],poNode['node']);
				}
				else if (poNode['index'] == 0)
					$domCol = $(strHtml).prependTo($domTarget);
				else
					$domCol = $(strHtml).insertAfter(paoTarget[poNode['index'] - 1]['node']);
				if (typeof(xTitle) != 'string')
					$domCol.html(xTitle);
				poNode['node'] = $domCol[0];
				//6、宽度处理
				let nCurWidth;
				if (oCss.width != undefined && oCss.width.indexOf('px') > 0)
				 	nCurWidth = parseFloat(oCss.width);
				else
					nCurWidth = $domCol.outerWidth();
				if (bIsNewCreate == true)
				{
					paoTarget.splice(poNode['index'],0,poNode);
					poNode['width'] = nCurWidth;
					for (let nScan = poNode['index'] + 1;nScan < paoTarget.length;++nScan)
					{
						paoTarget[nScan]['index']++;
						paoTarget[nScan]['left'] += poNode['width'];
					}
				}
				if (bSetFake == true) //假节点只需要完成节点管理的宽度填充即可
				{
					aoRenderInfo[nCurIndex]['sW'] = [{v:nCurWidth,c:1}];
					aoRenderInfo[nCurIndex]['mW'] = nCurWidth;
				}
				else
				{
					if (nCurWidth != aoRenderInfo[nCurIndex]['h']['w'])
					{
						let nAddIndex = 0;
						let nDelIndex = -1;
						let nOldWidth = aoRenderInfo[nCurIndex]['h']['w'];
						aoRenderInfo[nCurIndex]['h']['w'] = nCurWidth;
						let bOldIsDue = false;
						for (let nSortScan = 0;nSortScan < aoRenderInfo[nCurIndex]['sW'].length;++nSortScan)
						{
							let poW = aoRenderInfo[nCurIndex]['sW'][nSortScan];
							if (poW['v'] == nOldWidth)
							{
								if (--poW['c'] == 0)
									nDelIndex = nSortScan;
								bOldIsDue = true;
							}
							if (poW['v'] > nCurWidth && poW['c'] > 0)
								++nAddIndex;
							else if (poW['v'] == nCurWidth)
							{
								nAddIndex = -1;
								poW['c']++;
							}
							else if (bOldIsDue == true)
								break;
						}
						if (nAddIndex >= 0 && nAddIndex == nDelIndex)
						{
							aoRenderInfo[nCurIndex]['sW'][nAddIndex] = {v:nCurWidth,c:1};
							nAddIndex = -1;
							nDelIndex = -1;
						}
						if (nDelIndex >= 0 && aoRenderInfo[nCurIndex]['sW'][nDelIndex]['c'] == 0)
							aoRenderInfo[nCurIndex]['sW'].splice(nDelIndex,1);
						if (nAddIndex >= 0)
						{
							if (nAddIndex >= aoRenderInfo[nCurIndex]['sW'].length)
								aoRenderInfo[nCurIndex]['sW'].push({v:nCurWidth,c:1});
							else
								aoRenderInfo[nCurIndex]['sW'].splice(nAddIndex,0,{v:nCurWidth,c:1});
						}
						aoRenderInfo[nCurIndex]['mW'] = aoRenderInfo[nCurIndex]['sW'][0]['v'];
						if (aoRenderInfo[nCurIndex]['mW'] != poNode['width'])
						{
							let nGap = poNode['width'] - aoRenderInfo[nCurIndex]['mW'];
							for (let nScan = poNode['index'] + 1;nScan < paoTarget.length;++nScan)
								paoTarget[nScan]['left'] = paoTarget[nScan]['left'] - nGap;
						}
					}
					if (poNode['width'] != aoRenderInfo[nCurIndex]['mW'])
					{
						$domCol.outerWidth(aoRenderInfo[nCurIndex]['mW']);
						poNode['width'] = aoRenderInfo[nCurIndex]['mW'];
					}
					//7、挂载事件
					if (bSetFake == false)
					{
						$domCol.tooltip(
						{
							position:'vertical-top',
							content:function()
							{
								if (typeof(poCol['headTip']) == 'function')
									return poCol['headTip'].call(domThis,poCol['field']);
								return poCol['headTip'];
							}
						});
						$domCol.click(function()
						{
							if (typeof(poCol['headClick']) == 'function')
								poCol['headClick'].call(domThis,poCol['field']);
						});
					}
				}
			}
			return bSetFake;
		};
		let funcAddCol = function(oToAddCol,nIndex = -1,bSetFake = undefined) //新增列 nIndex表示新增位置，-1表示在最末添加
		{
			//检查列配置并构造列对象
			if (Object.prototype.toString.call(oToAddCol) != '[object Object]')
			{
				console.warn('wrong column type');
				return false;
			}
			let oNewCol = Object.assign(
			{
				field:'',
				title:'',
				headSwap:true,
				headHtmlRender:false,
				allowFixCellSelect:false,
				fixed:false,
				width:'',
				minWidth:'',
				maxWidth:'',
				hidden:false,
				cellRender:
				{
					extClass:'',
					extStyle:{},
					richRender:false,
					swap:true,
					cellTip:'',
					render:undefined,
					widthCal:undefined
				},
				headTip:'',
				headClick:undefined
			},oToAddCol);
			if (oToAddCol['cellRender'] != undefined)
			{
				if (Object.prototype.toString.call(oToAddCol['cellRender']) != '[object Object]')
				{
					console.warn('wrong cellRender type');
					return;
				}
				oNewCol['cellRender'] = Object.assign(
				{
					extClass:'',
					extStyle:{},
					richRender:false,
					swap:true,
					cellTip:'',
					render:undefined,
					widthCal:undefined
				},oToAddCol['cellRender']);
			}
			oNewCol['cid'] = 'c' + nUniqueAllow++;
			bAllowAddColumn = true;
			if (nIndex >= oCurOpt['options']['columns'].length)
				nIndex = -1;
			if (nIndex < 0)
			{
				oCurOpt['options']['columns'].push(oNewCol);
				nIndex = oCurOpt['options']['columns'].length - 1;
			}
			else
				oCurOpt['options']['columns'].splice(nIndex,0,oNewCol);
			oNewCol = oCurOpt['options']['columns'][nIndex];
			bAllowAddColumn = false;
			//初始化列的渲染数据
			let aoRenderCol = [];
			Object.defineProperty(aoRenderCol,'mW',
			{
				value:0,
				writable:true,
				enumerable:false
			});
			Object.defineProperty(aoRenderCol,'sW',
			{
				value:[{v:0,c:1}],
				writable:true,
				enumerable:false
			});
			Object.defineProperty(aoRenderCol,'h',
			{
				value:{w:0,r:oNewCol,i:nIndex},
				writable:true,
				enumerable:false
			});
			if (nIndex >= aoRenderInfo.length)
				aoRenderInfo.push(aoRenderCol);
			else
			{
				aoRenderInfo.splice(nIndex,0,aoRenderCol);
				for (let nScan = nIndex + 1;nScan < aoRenderInfo.length;++nScan)
					aoRenderInfo[nScan][h][i] = nScan;
			}
			Object.defineProperty(aoRenderInfo,oNewCol['cid'],
			{
				value:aoRenderCol['h'],
				writable:true,
				enumerable:false
			});
			//初始化列显示
			return funcRerenderCol(oNewCol['cid'],bSetFake);
		};
		//监听表头调整高度
		oCurOpt['options'].addEventListener(function(aoEventInfos)
		{
			let xValue = aoEventInfos[0]['value'] + (funcParseInt(aoEventInfos[0]['value']) == aoEventInfos[0]['value'] ? 'px' : '');
			let nOldHeight = $domFillHead.outerHeight();
			$domFixHead.css(aoEventInfos[0]['key'],xValue);
			$domFillHead.css(aoEventInfos[0]['key'],xValue);
			if (oCurOpt['options']['head']['height'] == '' && aoEventInfos[0]['key'] != 'height')
			{
				$domFixHead[0].style.height = 'max-content';//不使用清空的方式是为了兼容部分chrome版本的实现
				$domFillHead[0].style.height = 'max-content';//不使用清空的方式是为了兼容部分chrome版本的实现
				let strNewHeight = Math.max($domFixHead.outerHeight(),$domFillHead.outerHeight()) + 'px';
				$domFixHead[0].style.height = strNewHeight;
				$domFillHead[0].style.height = strNewHeight;
			}
			if (nOldHeight > $domFillHead.outerHeight())
				funcBodyRender();
		},'allchange',false,['head','minHeight'],['head','maxHeight'],['head','height']);
		//监听处理列属性变化
		oCurOpt['options'].addValueValid((oEventInfo) => (typeof(oEventInfo['value']) == 'boolean'),['columns',null,'fixed'],['columns',null,'hidden']);
		oCurOpt['options'].addEventListener(function(aoEventInfos)
		{
			let strCid = aoRenderInfo[aoEventInfos[0]['fullPath'][1]]['h']['r']['cid'];
			funcRerenderCol(strCid);
			if (oCurOpt.allowRender == true)
				funcAdjustColHeight();
			else
				oCurOpt.waitUpHeadHeigh = true;
			oCurOpt['reRender'](false);
			if (aoEventInfos[0]['key'] == 'hidden' && aoEventInfos[0]['value'] == true && oCurOpt['options']['selectMode'].indexOf('cell') > 0)
			{
				//去除因隐藏而无效的选中，此处理不会触发事件
				for (let nIndex in oSelected)
				{
					if (nIndex == 'len')
						continue;
					oSelected[nIndex].delete(strCid);
					if (oSelected[nIndex].size == 0)
						delete oSelected[nIndex];
				}
			}
			else if (aoEventInfos[0]['key'] == 'minWidth' || aoEventInfos[0]['key'] == 'maxWidth')
				delete aoRenderInfo[aoEventInfos[0]['fullPath'][1]]['h'][aoEventInfos[0]['key']];
		},'allchange',false,
			['columns',null,'headSwap'],
			['columns',null,'headHtmlRender'],
			['columns',null,'fixed'],
			['columns',null,'width'],
			['columns',null,'minWidth'],
			['columns',null,'maxWidth'],
			['columns',null,'hidden']
		);
		oCurOpt['options'].addEventListener(function(aoEventInfos)
		{
			funcRerenderCol(aoRenderInfo[aoEventInfos[0]['fullPath'][1]]['h']['r']['cid']);
			oCurOpt['reRender'](false);
		},'set',false,['columns',null,'title']);
		oCurOpt['options'].addEventListener(function(aoEventInfos)
		{
			let poCol = aoRenderInfo[aoEventInfos[0]['fullPath'][1]]['h']['r'];
			let $domTarget = (poCol['fixed'] == true ? $domFixHead : $domFillHead);
			if (typeof(poCol['headClick']) == 'function')
				$domTarget.find(`[cid="${poCol['cid']}"]`).css('cursor','pointer');
			else
				$domTarget.find(`[cid="${poCol['cid']}"]`).css('cursor','default');
		},'allchange',false,['columns',null,'headClick']);
		//视区渲染定义(下面的逻辑尽量减少对position()的调用，以减少触发重绘)
		let nRenderSerial = 0;
		let nLastStartRender = 0;//记录最后一次发起渲染的时间（用于计时器中判断是否要重新发起渲染）
		let nRenderingCount = 0;//记录正在执行的渲染数
		let funcParseStyleObj = function(oStyle) //转义style里的内容
		{
			let oNewStyle = {};
			for (let strOldKey in oStyle)
			{
				let strNewKey = strOldKey.toLowerCase();
				if (strNewKey != strOldKey)
				{
					let nScanNew = 0;
					for (let nScanOld = 0;nScanOld < strOldKey.length;++nScanOld,++nScanNew)
					{
						if (strNewKey[nScanNew] == strOldKey[nScanOld])
							continue;
						strNewKey = strNewKey.substr(0,nScanNew) + '-' + strNewKey[nScanNew] + strNewKey.substr(nScanNew + 1);
						++nScanNew;
					}
				}
				oNewStyle[strNewKey] = ('' + oStyle[strOldKey]).replace(/"/g,"&quot;");
			}
			return oNewStyle;
		};
		let funcCellRender = function(poLineObj,nLineIndex,nColIndex,oCellInfo,nFillBodyWidth,nFillBodyScrollLeft) //渲染单元格（不包含对行高的处理） oCellInfo中的特殊字段：style-{样式名（允许用大写字母表示其前面的下划线）:样式值} parent-父节点的jq对象 pre-当前节点的前置jq对象，undefined或长度为0时，将把单元格节点建在父节点开始处
		{
			let poH = aoRenderInfo[nColIndex]['h'];
			let poCol = poH['r'];
			let poCell = poCol['cellRender'];
			//确认对应表头已渲染
			let bHasRenderCol = false;
			if (aoRenderInfo[nColIndex]['h']['isFake'] == true)
			{
				funcRerenderCol(poCol['cid'],false);
				bHasRenderCol = true;
			}
			//整理单元格管理信息
			let poWidthSortInfo;
			if (aoRenderInfo[nColIndex].length <= nLineIndex)
			{
				for (poWidthSortInfo of aoRenderInfo[nColIndex]['sW'])
				{
					if (poWidthSortInfo['v'] == aoRenderInfo[nColIndex]['h']['w'])
						break;
				}
			}
			while (aoRenderInfo[nColIndex].length <= nLineIndex)
			{
				aoRenderInfo[nColIndex].push({width:poWidthSortInfo['v'],render:undefined});
				poWidthSortInfo['c']++;
			}
			let poCurRenderInfo = aoRenderInfo[nColIndex][nLineIndex]['render'];
			let bIsNew = false;
			if (poCurRenderInfo == undefined)
			{
				bIsNew = true;
				poCurRenderInfo = {};
				aoRenderInfo[nColIndex][nLineIndex]['render'] = poCurRenderInfo;
				//计算节点内容
				let strRenderType = Object.prototype.toString.call(poCell['render']);
				if (strRenderType == '[object Function]')
					poCurRenderInfo['content'] = poCell['render'].call(domThis,poCol['field'],poLineObj,nLineIndex);
				else if (strRenderType.indexOf('[object HTML') == 0)
					poCurRenderInfo['content'] = poCell['render'];
				else
					poCurRenderInfo['content'] = poLineObj[poCol['field']];
				if (poCurRenderInfo['content'] == undefined)
					poCurRenderInfo['content'] = '';
				if (Object.prototype.toString.call(poCurRenderInfo['content']).indexOf('[object HTML') < 0)
					poCurRenderInfo['content'] = '' + poCurRenderInfo['content'];
				if (poCell['htmlRender'] == false)
					poCurRenderInfo['content'] = CCommon.HtmlEncode('' + poCurRenderInfo['content'],poCell['swap']);
				//额外样式处理
				if (typeof(poCell['extClass']) == 'function')
					poCurRenderInfo['class'] = poCell['extClass'].call(domThis,poCol['field'],poLineObj,nLineIndex);
				else
					poCurRenderInfo['class'] = poCell['extClass'];
				if (poCurRenderInfo['class'] != undefined)
					poCurRenderInfo['class'] = '' + poCurRenderInfo['class'];
				else
					poCurRenderInfo['class'] = '';
				if (typeof(poCell['extStyle']) == 'function')
					poCurRenderInfo['style'] = poCell['extStyle'].call(domThis,poCol['field'],poLineObj,nLineIndex);
				else
					poCurRenderInfo['style'] = poCell['extStyle'];
				if (Object.prototype.toString.call(poCurRenderInfo['style']) != '[object Object]')
					poCurRenderInfo['style'] = {};
				poCurRenderInfo['style'] = funcParseStyleObj(poCurRenderInfo['style']);
				//宽度属性处理
				if (poCol['width'] != '')
					poCurRenderInfo['style']['width'] = poCol['width'] + (funcParseInt(poCol['width']) == poCol['width'] ? 'px' : '');
				if (poCol['minWidth'] != '')
				{
					poCurRenderInfo['style']['min-width'] = poCol['minWidth'] + (funcParseInt(poCol['minWidth']) == poCol['minWidth'] ? 'px' : '');
					if (poH['minWidth'] == undefined)
					{
						let strTmp = '<div style="flex-shrink:0;min-width:' + poCurRenderInfo['style']['min-width'] + '"></div>';
						let $domTmp;
						if (oCellInfo['pre'] != undefined && oCellInfo['pre'].length == 1)
							$domTmp = $(strTmp).insertAfter(oCellInfo['pre']);
						else
							$domTmp = $(strTmp).prependTo(oCellInfo['parent']);
							poH['minWidth'] = parseFloat(window.getComputedStyle($domTmp[0]).minWidth);
						$domTmp.remove();
					}
				}
				if (poCol['maxWidth'] != '')
				{
					poCurRenderInfo['style']['max-width'] = poCol['maxWidth'] + (funcParseInt(poCol['maxWidth']) == poCol['maxWidth'] ? 'px' : '');
					if (poH['maxWidth'] == undefined)
					{
						let strTmp = '<div style="flex-shrink:0;max-width:' + poCurRenderInfo['style']['max-width'] + '"></div>';
						let $domTmp;
						if (oCellInfo['pre'] != undefined && oCellInfo['pre'].length == 1)
							$domTmp = $(strTmp).insertAfter(oCellInfo['pre']);
						else
							$domTmp = $(strTmp).prependTo(oCellInfo['parent']);
							poH['maxWidth'] = parseFloat(window.getComputedStyle($domTmp[0]).maxWidth);
						$domTmp.remove();
					}
				}
			}
			//生成节点
			let $domCell;
			let strDiv = `<div swap="${(poCell['swap'] == true ? 1 : 0)}" style="`;
			let oStyle = Object.assign({},poCurRenderInfo['style'],funcParseStyleObj(oCellInfo['style']));
			if (bIsNew == false)
				oStyle['width'] = aoRenderInfo[nColIndex]['mW'] + 'px';
			for (let strKey in oStyle)
				strDiv += `${strKey}:${oStyle[strKey]};`;
			strDiv += '" ';
			if (poCurRenderInfo['class'] != '')
				oCellInfo['class'] += ' ' + poCurRenderInfo['class'];
			for (let strKey in oCellInfo)
			{
				if (strKey == 'parent' || strKey == 'pre' || strKey == 'style')
					continue;
				strDiv += `${strKey}="${oCellInfo[strKey]}" `;//这里不对内容做转换，因为像class里面使用原始空格是可以的
			}
			strDiv += '>' + (typeof(poCurRenderInfo['content']) == 'string' ? poCurRenderInfo['content'] : '') + '</div>';
			if (oCellInfo['pre'] != undefined && oCellInfo['pre'].length == 1)
				$domCell = $(strDiv).insertAfter(oCellInfo['pre']);
			else
				$domCell = $(strDiv).prependTo(oCellInfo['parent']);
			if (typeof(poCurRenderInfo['content']) != 'string')
				$domCell.html(poCurRenderInfo['content']);
			//初始化节点事件
			$domCell.tooltip(
			{
				position:'auto',
				showDelay:0,
				hideDelay:0,
				content:function()
				{
					if (typeof(poCell['cellTip']) == 'function')
						return poCell['cellTip'].call(domThis,poCol['field'],poLineObj,nLineIndex);
					return poCell['cellTip'];
				}
			});
			if (bIsNew == false)
				return {dom:$domCell,isNew:false,renderCol:bHasRenderCol};
			//宽度调整
			let nCurWidth = NaN;
			if (oStyle.width != undefined && oStyle.width.indexOf('px') > 0)
				nCurWidth = funcParseInt(oStyle.width);
			else if (typeof(poCell['widthCal']) == 'function')
			{
				if (isNaN(nCellOuterWidth))
				{
					let oCalStyle = window.getComputedStyle($domCell[0]);
					nCellOuterWidth = parseFloat(oCalStyle.paddingLeft) + parseFloat(oCalStyle.paddingRight) + parseFloat(oCalStyle.borderLeftWidth) + parseFloat(oCalStyle.borderRightWidth);
				}
				let nTmpWidth = poCell['widthCal'].call(domThis,poCol['field'],poLineObj,nLineIndex);
				if (isNaN(nTmpWidth) == false)
					nCurWidth = nCellOuterWidth + nTmpWidth;
				//上下限修正
				if (typeof(poH['maxWidth']) == 'number' && isNaN(poH['maxWidth']) == false)
					nCurWidth = Math.min(poH['maxWidth'],nCurWidth);
				if (typeof(poH['minWidth']) == 'number' && isNaN(poH['minWidth']) == false)
					nCurWidth = Math.max(poH['minWidth'],nCurWidth);
			}
			if (isNaN(nCurWidth))
				nCurWidth = $domCell.outerWidth() + 0.01;//额外加的0.01是浏览器和实现//因为存在padding，margin的影响，这里只能获取外宽度 备用实现(初步看效率与用jq的outerWidth差不多)：parseFloat(window.getComputedStyle($domCell[0]).width);
			if (nCurWidth != aoRenderInfo[nColIndex][nLineIndex]['width'])
			{
				let nAddIndex = 0;
				let nDelIndex = -1;
				let nOldWidth = aoRenderInfo[nColIndex][nLineIndex]['width'];
				aoRenderInfo[nColIndex][nLineIndex]['width'] = nCurWidth;
				let bOldIsDue = false;
				for (let nSortScan = 0;nSortScan < aoRenderInfo[nColIndex]['sW'].length;++nSortScan)
				{
					let poW = aoRenderInfo[nColIndex]['sW'][nSortScan];
					if (poW['v'] == nOldWidth)
					{
						if (--poW['c'] == 0)
							nDelIndex = nSortScan;
						bOldIsDue = true;
					}
					if (poW['v'] > nCurWidth && poW['c'] > 0)
						++nAddIndex;
					else if (poW['v'] == nCurWidth)
					{
						nAddIndex = -1;
						poW['c']++;
					}
					else if (bOldIsDue == true)
						break;
				}
				if (nAddIndex >= 0 && nAddIndex == nDelIndex)
				{
					aoRenderInfo[nColIndex]['sW'][nAddIndex] = {v:nCurWidth,c:1};
					nAddIndex = -1;
					nDelIndex = -1;
				}
				if (nDelIndex >= 0 && aoRenderInfo[nColIndex]['sW'][nDelIndex]['c'] == 0)
					aoRenderInfo[nColIndex]['sW'].splice(nDelIndex,1);
				if (nAddIndex >= 0)
				{
					if (nAddIndex >= aoRenderInfo[nColIndex]['sW'].length)
						aoRenderInfo[nColIndex]['sW'].push({v:nCurWidth,c:1});
					else
						aoRenderInfo[nColIndex]['sW'].splice(nAddIndex,0,{v:nCurWidth,c:1});
				}
				if (aoRenderInfo[nColIndex]['sW'][0]['v'] != aoRenderInfo[nColIndex]['mW'])
				{
					aoRenderInfo[nColIndex]['mW'] = aoRenderInfo[nColIndex]['sW'][0]['v'];
					let poNode = oRenderState['nodes']['head']['map'][poCol['cid']];
					let paoTarget;
					if (poCol['fixed'] == true)
					{
						$domFixHead.find(`[cid="${poCol['cid']}"]`).css('width',aoRenderInfo[nColIndex]['mW']);
						$domFixDataBody.find(`[cid="${poCol['cid']}"]`).css('width',aoRenderInfo[nColIndex]['mW']);
						paoTarget = oRenderState['nodes']['head']['fixArray'];
					}
					else
					{
						$domFillHead.find(`[cid="${poCol['cid']}"]`).css('width',aoRenderInfo[nColIndex]['mW']);
						$domFillDataBody.find(`[cid="${poCol['cid']}"]`).css('width',aoRenderInfo[nColIndex]['mW']);
						paoTarget = oRenderState['nodes']['head']['fillArray'];
					}
					let nGap = poNode['width'] - aoRenderInfo[nColIndex]['mW'];
					for (let nScan = poNode['index'] + 1;nScan < paoTarget.length;++nScan)
					{
						paoTarget[nScan]['left'] -= nGap;
						if (paoTarget[nScan]['left'] - nFillBodyScrollLeft - nFillBodyWidth <= oRenderState['maxRender']['h'])
							$domFillDataBody.find(`[cid="${paoTarget[nScan]['cid']}"]`).css('left',paoTarget[nScan]['left']);
					}
					poNode['width'] = aoRenderInfo[nColIndex]['mW'];
				}
			}
			$domCell[0].style.width = aoRenderInfo[nColIndex]['mW'];
			return {dom:$domCell,isNew:true,renderCol:bHasRenderCol};
		};
		let funcBodyRender = async function(bForceRerender = false,nShowIndex = undefined,bTopShow = false,strShowCid = undefined) //bForceRerender-是否立即渲染（不判断当前渲染环境是否有变化） nShowLine-指定视区需要展示的行号 bTopShow-是否对指定要展示的行置顶/单元格置左上角展示 strShowCid-指定视区需要展示的列（nShowLine未指定时此参数无效）
		{
			if (domThis.offsetParent == null || oCurOpt.allowRender == false)
				return;//当前处于隐藏状态，不进行渲染，免得误判宽高 处于禁止渲染状态也同样不渲染
			if (oCurOpt.waitUpHeadHeigh == true)
				funcAdjustColHeight();
			let nCurSerial = ++nRenderSerial;
			nLastStartRender = (new Date()).getTime();
			++nRenderingCount;
			let nFillBodyWidth = $domFillDataBody.outerWidth();
			let nFillBodyHeight = $domFillDataBody.outerHeight();
			while (1)
			{
				let oFillBodyScroll = {left:$domFillDataBody.scrollLeft(),top:$domFillDataBody.scrollTop()};
				if (oCurOpt['readyLoadData'] == false)
				{
					//未开启内容渲染，仅检测表头渲染情况，确认是否要把fake表头项渲染出来
					let bHasRenderHead = false;
					for (let poNode of oRenderState['nodes']['head']['fixArray'])
					{
						if (poNode['isFake'] == false)
							continue;
						funcRerenderCol(poNode['cid'],false);
						bHasRenderHead = true;
					}
					for (let poNode of oRenderState['nodes']['head']['fillArray'])
					{
						if (poNode['isFake'] == false)
							continue;
						let nOffsetLeft = poNode['left'] - oFillBodyScroll.left;
						if ((nOffsetLeft <= 0 && nOffsetLeft + poNode['width'] > 0) || (nOffsetLeft >= 0 && nOffsetLeft + poNode['width'] - nFillBodyWidth <= 0))
						{
							funcRerenderCol(poNode['cid'],false);
							bHasRenderHead = true;
						}
					}
					if (bHasRenderHead == true)
						funcAdjustColHeight();
					break;
				}
				let bRerender = (bForceRerender == true ? true : false);
				//判断是否需要重新渲染
				let poShowRenderHead;//记录要求要滚入视区显示的列的表头对象
				//	检查当前显示是否满足指定行的显示要求
				if (nShowIndex != undefined)
				{
					bRerender = false;//设置了跳转的话不会触发强制渲染
					nShowIndex = parseInt(nShowIndex);
					if (isNaN(nShowIndex) || nShowIndex < 0)
					{
						--nRenderingCount;
						return;
					}
					let $domLine = $domFillDataBody.find('.largetable_line[lindex="' + nShowIndex + '"]');
					if ($domLine.length == 0)
					{
						if (nShowIndex >= oLineData['data'].length && oLineData['fin'] == true)
						{
							--nRenderingCount;
							console.log('[info]line index' + nShowIndex + 'is out of data range');
							return;
						}
						bRerender = true;
					}
					else
					{
						let nTop = funcParseInt($domLine[0].style.top) - $domFillDataBody.scrollTop();
						let nFillBodyHeight = $domFillDataBody.height();
						if (nTop + oRenderState['inViewMin'] <= 0 ||
							(bTopShow == true && nTop != 0)) //行已渲染，判断是否在视区内
						{
							if ((oLineData['fin'] == true && $domFillDataBody.children(`[lindex="${oLineData['data'].length - 1}"]`).length == 1) || $domFillDataBody.scrollTop() + nTop + nFillBodyHeight - $domFillDataBody[0].scrollHeight <= 0)
								$domFillDataBody.scrollTop($domFillDataBody.scrollTop() + nTop);
							else
								bRerender = true;
						}
						else if (nFillBodyHeight - nTop < oRenderState['inViewMin'])
							$domFillDataBody.scrollTop($domFillDataBody.scrollTop() + nTop + oRenderState['inViewMin'] - nFillBodyHeight);
						if (bRerender == false && strShowCid != undefined && oRenderState['nodes']['head']['map'][strShowCid] != undefined)
						{
							//对横向的显示判断
							poShowRenderHead = oRenderState['nodes']['head']['map'][strShowCid];
							let nOffsetLeft = poShowRenderHead['left'] - $domFillDataBody.scrollLeft();
							if (nOffsetLeft + poShowRenderHead['width'] < oRenderState['inViewMin'] || 
								(nOffsetLeft + parseFloat($domFillScrollBarWidth[0].style.width) >= nFillBodyWidth - oRenderState['inViewMin']) ||
								(bTopShow == true && nOffsetLeft != 0))
								$domFillDataBody.scrollLeft(poShowRenderHead['left']);
						}
						if (bRerender == false)
						{
							//直接把已渲染数据滚入视区（也可能连滚入也没做）也算作一次渲染完成，触发onFinRender事件
							if (typeof(oCurOpt['options']['onFinRender']) == 'function')
								oCurOpt['options']['onFinRender'].call(domThis);
							--nRenderingCount;
							return;//滚入视区后会触发 scroll事件 剩下的再渲染检查及处理留onScroll里进行
						}
					}
				}
				//	检查是否为空数据
				if (oLineData['fin'] == true && oLineData['data'].length == 0)
					break;
				//	检查表头变化
				if (bRerender == false)
				{
					let paoTarget = oRenderState['nodes']['head']['fixArray'];
					if (paoTarget.length != oRenderState['head']['fix'].length)
						bRerender = true;
					else
					{
						for (let nScan = 0;nScan < paoTarget.length;++nScan)
						{
							let poHeadState = oRenderState['head']['fix'][nScan];
							if (paoTarget[nScan]['cid'] != poHeadState['cid'] ||
								aoRenderInfo[poHeadState['index']]['mW'] != poHeadState['width'])
							{
								bRerender = true;
								break;
							}
						}
					}
				}
				if (bRerender == false && oRenderState['head']['fill'].length > 0)
				{
					let poNode = oRenderState['nodes']['head']['map'][oRenderState['head']['fill'][0]['cid']];
					if (poNode == undefined)
						bRerender = true;
					else
					{
						for (let nScan = 0;nScan < oRenderState['head']['fill'].length;++nScan)
						{
							let poHeadState = oRenderState['head']['fill'][nScan];
							if (poNode == undefined || 
								poNode['cid'] != poHeadState['cid'] ||
								aoRenderInfo[poHeadState['index']]['mW'] != poHeadState['width'])
							{
								bRerender = true;
								break;
							}
							poNode = oRenderState['nodes']['head']['fillArray'][poNode['index'] + 1];
						}
					}
				}
				if (bRerender == false && oRenderState['head']['fill'].length == 0 && oRenderState['nodes']['head']['fillArray'].length > 0)
					bRerender = true;
				//	检查已渲染区域与视区间的交叠情况
				if (bRerender == false)
				{
					let nLeftSpace = 0;//已渲染区左侧距离视区左侧的水平差值，负数越小表示左滚免渲染空间越大
					let nRightSpace = 0;//已渲染区右侧距离视区右侧的水平差值，正数越大表示下滚免渲染空间越大
					let adomLineChildren = $domFillDataBody[0].getElementsByClassName('largetable_line');
					let $domLine = (adomLineChildren.length > 0 ? $(adomLineChildren[adomLineChildren.length - 1]) : []);//行渲染从上往下执行，因为下面的可能会因上面行渲染出现扩展了某些列宽，使得下面渲染的单元格变少，所以才一最后一行的渲染结果作为视区判断依据
					if ($domLine.length == 1)
					{
						let adomCellChildren = $domLine[0].children;
						let $domCell = (adomCellChildren.length > 0 ? $(adomCellChildren[0]) : []);
						let nFirstCellOffsetLeft = 0;
						if ($domCell.length != 0)
						{
							nFirstCellOffsetLeft = funcParseInt($domCell[0].style.left);
							nLeftSpace = nFirstCellOffsetLeft - oFillBodyScroll.left;
							$domCell = $(adomCellChildren[adomCellChildren.length - 1]);
							nRightSpace = funcParseInt($domCell[0].style.left) - oFillBodyScroll.left - nFillBodyWidth + aoRenderInfo[aoRenderInfo[$domCell.attr('cid')]['i']]['mW'];
						}
						let nTopSpace = funcParseInt(adomLineChildren[0].style.top) - oFillBodyScroll.top;//已渲染区顶部距离视区顶部的垂直差值，负数越小表示上滚免渲染空间越大
						let nFirstIndex = parseInt($(adomLineChildren[0]).attr('lindex'));
						let nLastIndex = parseInt($domLine.attr('lindex'));
						let nBottomSpace = funcParseInt($domLine[0].style.top) - oFillBodyScroll.top  + aoRenderInfo['mH'][nLastIndex] - nFillBodyHeight;//已渲染区底部距离视区底部的垂直差值，正数越大表示下滚免渲染空间越大
						//各边界的余量判断
						if (nTopSpace > -1 * oRenderState['minReserve']['v'] && nFirstIndex > 0)
							bRerender = true;
						else if (nBottomSpace < oRenderState['minReserve']['v'] && (oLineData['fin'] == false || nLastIndex != oLineData['data'].length - 1))
							bRerender = true;
						else if (nLeftSpace > -1 * oRenderState['minReserve']['h'] && nFirstCellOffsetLeft > 0)
							bRerender = true;
						else if (nRightSpace < oRenderState['minReserve']['h'] && $domCell.length != 0 && oRenderState['nodes']['head']['map'][$domCell.attr('cid')]['index'] + 1 < oRenderState['nodes']['head']['fillArray'].length)
							bRerender = true;
					}
					else if (oLineData['data'].length != 0 || oLineData['fin'] == false)
						bRerender = true;
				}
				if (bRerender == false)
					break;
				//重新渲染
				//	定义环境量计算函数
				let funcEvnGet = function()
				{
					let nQStart,nQEnd;
					let nGapLine = Math.ceil(oRenderState['maxRender']['v'] / oRenderState['defaultLineHeight']);//视区外单个方向延伸行数
					let nViewLine = Math.floor(nFillBodyHeight / oRenderState['defaultLineHeight']);//视区本身预估承载的行数
					let nEvaIndex = 0;//判断界线标准的行索引
					if (nShowIndex == undefined)
					{
						let $domScan = $domFillDataBody.find('.largetable_line:first');
						let nLineTop = ($domScan.length == 0 ? 0 : funcParseInt($domScan[0].style.top) - oFillBodyScroll.top);
						if ($domScan.length == 1)
						{
							if (nLineTop < 0)
							{
								nEvaIndex = parseInt($domScan.attr('lindex'));
								for (;nEvaIndex < oLineData['data'].length;++nEvaIndex)
								{
									if (aoRenderInfo['mH'][nEvaIndex] != undefined)
										nLineTop += aoRenderInfo['mH'][nEvaIndex];
									else
										nLineTop += oRenderState['defaultLineHeight'];
									if (nLineTop >= 0)
										break;
								}
							}
							else
							{
								nEvaIndex = parseInt($domScan.attr('lindex'));
								while (nLineTop > 0 && nEvaIndex > 0)
								{
									--nEvaIndex;
									if (aoRenderInfo['mH'][nEvaIndex] != undefined)
										nLineTop -= aoRenderInfo['mH'][nEvaIndex];
									else
										nLineTop -= oRenderState['defaultLineHeight'];
								}
							}
						}
						nQStart = Math.max(0,nEvaIndex - nGapLine);
						nQEnd = nEvaIndex + nViewLine + nGapLine;
					}
					else
					{
						nQStart = Math.max(nShowIndex - nGapLine,0);
						nQEnd = nShowIndex + nViewLine + nGapLine;
					}
					return {start:nQStart,end:nQEnd,viewLine:nViewLine};
				};
				//	粗算渲染需要的行段
				let oStateBefore = funcEvnGet();
				//	请求数据
				let aoGetData = await funcGetData(oStateBefore['start'],oStateBefore['end']);
				if (oLineData['fin'] == true && aoGetData.length < oStateBefore['end'] - oStateBefore['start'] + 1)
				{
					$domFillDataEnd.show();
					let oComputedStyle = window.getComputedStyle($domFillDataEnd[0]);
					$domFixDataEndFill.css
					({
						marginTop:0,
						marginBottom:0,
						paddingTop:oComputedStyle['marginTop'],
						paddingBottom:oComputedStyle['marginBottom'],
					});
					$domFixDataEndFill.show();
				}
				if (oCurOpt.allowRender == false || nCurSerial != nRenderSerial || aoGetData.length == 0)
				{
					--nRenderingCount;
					return;
				}
				//	再次刷新当前的状况数据，当数据变更后，本次渲染视为无效
				oFillBodyScroll = {left:$domFillDataBody.scrollLeft(),top:$domFillDataBody.scrollTop()};//经过一次await，在这里刷新数据值
				nFillBodyWidth = $domFillDataBody.outerWidth();//经过一次await，在这里刷新数据值
				nFillBodyHeight = $domFillDataBody.outerHeight();//经过一次await，在这里刷新数据值
				let oStateAfter = funcEvnGet();
				for (let strKey in oStateAfter)
				{
					if (oStateBefore[strKey] != oStateAfter[strKey])
					{
						--nRenderingCount;
						return;
					}
				}
				//	记录当前已渲染行
				let mapOldLine = {};
				for (let xdomScan of  $domFillDataBody[0].getElementsByClassName('largetable_line'))
				{
					xdomScan = $(xdomScan);
					mapOldLine[xdomScan.attr('lindex')] = xdomScan;
				}
				//	从表头确定列的开始渲染范围
				if (poShowRenderHead == undefined)
				{
					oStateAfter['colBeforeLeft'] = 0;//滚动数据区行的最左侧渲染单元格的相对行左偏移值
					oStateAfter['colFillRenderCids'] = [];//滚动视区的行左偏移
					for (let poNode of oRenderState['nodes']['head']['fillArray'])
					{
						let nOffsetLeft = poNode['left'] - oFillBodyScroll.left;
						if (oStateAfter['colFillRenderCids'].length == 0 && nOffsetLeft + poNode['width'] < -1 * oRenderState['maxRender']['h'])
						{
							oStateAfter['colBeforeLeft'] += poNode['width'];
							continue;
						}
						if (nOffsetLeft - nFillBodyWidth > oRenderState['maxRender']['h'])
							break;
						oStateAfter['colFillRenderCids'].push(poNode['cid']);
					}
				}
				else
				{
					oStateAfter['colBeforeLeft'] = poShowRenderHead['left'];
					oStateAfter['colFillRenderCids'] = [poShowRenderHead['cid']];
					let paoFillArrayNodes = oRenderState['nodes']['head']['fillArray'];
					for (let nScan = poShowRenderHead['index'] - 1;nScan >= 0;--nScan)
					{
						if (paoFillArrayNodes[nScan]['left'] - oFillBodyScroll.left >= -1 * oRenderState['maxRender']['h'])
						{
							oStateAfter['colBeforeLeft'] = paoFillArrayNodes[nScan]['left'];
							oStateAfter['colFillRenderCids'].unshift(paoFillArrayNodes[nScan]['cid']);
						}
						else
							break;
					}
					for (let nScan = poShowRenderHead['index'] + 1;nScan < paoFillArrayNodes.length;++nScan)
					{
						let poNode = paoFillArrayNodes[nScan];
						if (poNode['left'] - oFillBodyScroll.left - nFillBodyWidth > oRenderState['maxRender']['h'])
							break;
						oStateAfter['colFillRenderCids'].push(poNode['cid']);
					}
				}
				//	数据逐行处理
				let nTotalHeight = $domFillHeightSpace.outerHeight();
				let nOffsetTop = 0;
				let nLineHeight = oCurOpt['options']['lineHeight'];
				if (nLineHeight == undefined)
				{
					for (let nScan = 0;nScan < oStateAfter['start'];++nScan)
					{
						if (aoRenderInfo['mH'][nScan] != undefined)
							nOffsetTop += aoRenderInfo['mH'][nScan];
						else
							nOffsetTop += oRenderState['defaultLineHeight'];
					}
				}
				else
				{
					if (isNaN(nFixLineHeight))
					{
						if (typeof(nLineHeight) == 'number')
							nFixLineHeight = nLineHeight;
						else
						{
							let $domTmp = $('<div style="flex-shrink:0;height:' + oCurOpt['options']['lineHeight'] + '">-</div>').appendTo($domFillDataBody);
							nFixLineHeight = nLineHeight = $domTmp.outerHeight();
							$domTmp.remove();
						}
					}
					else
						nLineHeight = nFixLineHeight;
					nOffsetTop = nLineHeight * oStateAfter['start'];
				}
				let xdomFixInsertAfter,xdomFillInsertAfter;
				let oBaseStyle = {flexShrink:0,height:'100%',position:'sticky'};
				let bColHasRender = false;
				for (let nScan = 0;nScan < aoGetData.length;++nScan)
				{
					let nLineIndex = nScan + oStateAfter['start'];
					//行节点复用/创建
					while (aoRenderInfo['mH'].length <= nLineIndex)
					{
						if (nLineHeight == undefined)
						{
							aoRenderInfo['mH'].push(oRenderState['defaultLineHeight']);
							nTotalHeight += oRenderState['defaultLineHeight'];
						}
						else
						{
							aoRenderInfo['mH'].push(nLineHeight);
							nTotalHeight += nLineHeight;
						}
					}
					let $domCurFixLine,$domCurFillLine;
					let mapFixCol = {},mapFillCol = {};
					if (mapOldLine[nLineIndex] != undefined)
					{
						$domCurFixLine = $domFixDataBody.children(`[lindex="${nLineIndex}"]`);
						for (let xdomCell of $domCurFixLine[0].children)
						{
							xdomCell = $(xdomCell);
							mapFixCol[xdomCell.attr('cid')] = xdomCell;
						}
						$domCurFillLine = $domFillDataBody.children(`[lindex="${nLineIndex}"]`);
						for (let xdomCell of $domCurFillLine[0].children)
						{
							xdomCell = $(xdomCell);
							mapFillCol[xdomCell.attr('cid')] = xdomCell;
						}
						delete mapOldLine[nLineIndex];
						$domCurFixLine[0].style.top = nOffsetTop;
						$domCurFillLine[0].style.top = nOffsetTop;
					}
					else
					{
						if (xdomFixInsertAfter == undefined)
						{
							let strPreLIndex = `[lindex="${nLineIndex - 1}"]`;
							xdomFixInsertAfter = $domFixDataBody.children(strPreLIndex);
							if (xdomFixInsertAfter.length == 0)
							{
								xdomFixInsertAfter = $domFixDataBody[0].children[0];
								xdomFillInsertAfter = $domFillDataBody[0].children[0];
							}
							else
								xdomFillInsertAfter = $domFillDataBody.children(strPreLIndex);
						}
						$domCurFixLine = $(`<div style="top:${nOffsetTop};${nLineHeight != undefined ? `height:${nLineHeight}px` : ''}" class="largetable_line" lindex="${nLineIndex}"></div>`).insertAfter(xdomFixInsertAfter);
						$domCurFillLine = $(`<div style="top:${nOffsetTop};${nLineHeight != undefined ? `height:${nLineHeight}px` : ''}" class="largetable_line" lindex="${nLineIndex}" isSelected="${(oCurOpt['options']['selectMode'].indexOf('line') > 0 && oSelected[nLineIndex] != undefined) ? '1' : ''}"></div>`).insertAfter(xdomFillInsertAfter);
					}
					xdomFixInsertAfter = $domCurFixLine;
					xdomFillInsertAfter = $domCurFillLine;
					//单元格处理
					let $domPre = undefined;
					let nCurCellLeft = 0;
					let bHasNewCell = false;
					//	固定列单元格
					oRenderState['head']['fix'] = [];
					for (let poHeadNode of oRenderState['nodes']['head']['fixArray'])
					{
						let strCid = poHeadNode['cid'];
						let nIndex = aoRenderInfo[strCid]['i'];
						if (mapFixCol[strCid] == undefined)
						{
							oBaseStyle['left'] = nCurCellLeft;
							let oResult = funcCellRender(aoGetData[nScan],nLineIndex,nIndex,{style:oBaseStyle,class:'largetable_cell ',cid:strCid,parent:$domCurFixLine,pre:$domPre},nFillBodyWidth,oFillBodyScroll.left);
							$domPre = oResult['dom'];
							if (oResult['isNew'] == true)
								bHasNewCell = true;
							if (oResult['renderCol'] == true)
								bColHasRender = true;
						}
						else
						{
							$domPre = mapFixCol[strCid];
							$domPre[0].style.left = nCurCellLeft;
						}
						nCurCellLeft += aoRenderInfo[nIndex]['mW'];
						oRenderState['head']['fix'].push({cid:strCid,width:aoRenderInfo[nIndex]['mW'],index:nIndex});
						delete mapFixCol[strCid];
					}
					for (let strKey in mapFixCol)
						mapFixCol[strKey].children().detach().end().remove();
					//	滚动列单元格
					oRenderState['head']['fill'] = [];
					$domPre = undefined;
					nCurCellLeft = oStateAfter['colBeforeLeft'];
					for (let strCid of oStateAfter['colFillRenderCids'])
					{
						let nIndex = aoRenderInfo[strCid]['i'];
						let $domCell;
						if (mapFillCol[strCid] == undefined)
						{
							if ($domPre == undefined)
							{
								let poPreNode = oRenderState['nodes']['head']['fillArray'][oRenderState['nodes']['head']['map'][strCid]['index'] - 1];
								if (poPreNode != undefined)
									$domPre = $domCurFillLine.children(`[cid="${poPreNode['cid']}"]`);
							}
							oBaseStyle['left'] = nCurCellLeft;
							let oResult = funcCellRender(aoGetData[nScan],nLineIndex,nIndex,{style:oBaseStyle,class:'largetable_cell ',cid:strCid,parent:$domCurFillLine,pre:$domPre,isSelected:((oCurOpt['options']['selectMode'].indexOf('cell') > 0 && oSelected[nLineIndex] != undefined && oSelected[nLineIndex].has(strCid)) ? '1' : '')},nFillBodyWidth,oFillBodyScroll.left);
							$domCell = oResult['dom'];
							if (oResult['isNew'] == true)
								bHasNewCell = true;
							if (oResult['renderCol'] == true)
								bColHasRender = true;
						}
						else
						{
							$domCell = mapFillCol[strCid];
							$domCell[0].style.left = nCurCellLeft;
						}
						$domPre = $domCell;
						let nCurWidth = aoRenderInfo[nIndex]['mW'];
						oRenderState['head']['fill'].push({cid:strCid,width:nCurWidth,index:nIndex});
						delete mapFillCol[strCid];
						if (nCurCellLeft - oFillBodyScroll.left + nCurWidth - nFillBodyWidth > oRenderState['maxRender']['h'])
							break;//当到达渲染距离边界时提前结束
						nCurCellLeft += nCurWidth;
					}
					for (let strKey in mapFillCol)
						mapFillCol[strKey].children().detach().end().remove();
					//行高处理
					if (bHasNewCell == true && nLineHeight == undefined)
					{
						nTotalHeight -= aoRenderInfo['mH'][nLineIndex];
						$domCurFixLine[0].style.height = '';
						$domCurFillLine[0].style.height = '';
						let nCurMaxHeight = Math.max($domCurFixLine.outerHeight(),$domCurFillLine.outerHeight(),aoRenderInfo['mH'][nLineIndex]);//高度只扩张，不收缩
						$domCurFixLine[0].style.height = nCurMaxHeight;
						$domCurFillLine[0].style.height = nCurMaxHeight;
						aoRenderInfo['mH'][nLineIndex] = nCurMaxHeight;
						nTotalHeight += aoRenderInfo['mH'][nLineIndex];
					}
					else
					{
						$domCurFixLine[0].style.height = aoRenderInfo['mH'][nLineIndex];
						$domCurFillLine[0].style.height = aoRenderInfo['mH'][nLineIndex];
					}
					nOffsetTop += aoRenderInfo['mH'][nLineIndex];
					//在未指定显示行的情况下检查是否已经渲染足够，[是]的情况下中断渲染
					if (nShowIndex == undefined && funcParseInt($domCurFillLine[0].style.top) - oFillBodyScroll['top'] - nFillBodyHeight > oRenderState['maxRender']['v'])
						break;
				}
				//	清理多余旧数据
				for (let strKey in mapOldLine)
				{
					$domFixDataBody.children(`[lindex="${strKey}"]`).children('[cid]').children().detach().end().end().remove();
					$domFillDataBody.children(`[lindex="${strKey}"]`).children('[cid]').children().detach().end().end().remove();
				}
				$domFixHeightSpace.outerHeight(nTotalHeight);
				$domFillHeightSpace.outerHeight(nTotalHeight);
				//	表头高度调整
				if (bColHasRender == true)
					funcAdjustColHeight();
				//	对指定了显示行、列的处理
				if (nShowIndex != undefined)
				{
					--nRenderingCount;
					funcBodyRender(false,nShowIndex,true,strShowCid);
					return;
				}
				//	一次渲染完成，触发onFinRender事件
				if (typeof(oCurOpt['options']['onFinRender']) == 'function')
					oCurOpt['options']['onFinRender'].call(domThis);
				break;
			}
			//滚动条占区调整
			$domFixScrollBarHeight[0].style.height = nFillBodyHeight - $domFillDataBody[0].clientHeight;
			$domFillScrollBarWidth[0].style.width = nFillBodyWidth - $domFillDataBody[0].clientWidth;
			//根据表头同步表整体内容宽度
			//let $domHeadLastChild = $domFixHead.children(':last');
			/*if ($domHeadLastChild.length == 1)
				$domFixDataBody.children().outerWidth($domHeadLastChild.outerWidth() + $domHeadLastChild.position()['left']);
			else
				$domFixDataBody.children().css('width','');*/
			let poLastHeadNode = oRenderState['nodes']['head']['fillArray'][oRenderState['nodes']['head']['fillArray'].length - 1];
			if (poLastHeadNode != undefined)
				$domFillDataBody.children().css('width',poLastHeadNode['width'] + poLastHeadNode['left']);//因为没使用padding和margin影响外框，所以不需要用outerWidth
			else
				$domFillDataBody.children().css('width','');
			--nRenderingCount;
		};
		//属性值初始化
		let poOrgColumns;
		for (let [strKey,xValue] of Object.entries($.extend({}, $.fn.largetable.defaults, $.fn.largetable.parseOptions(this), xOptions)))
		{
			if (strKey == 'head')
			{
				for (let strSubKey in xValue)
					oCurOpt['options'][strKey][strSubKey] = xValue[strSubKey];
			}
			else if (strKey == 'columns')
			{
				poOrgColumns = xValue;
				continue;
			}
			else
				oCurOpt['options'][strKey] = xValue;
		}
		oCurOpt['isInit'] = false;//属性初始化完成
		//表头初始化
		if (Object.prototype.toString.call(poOrgColumns) != '[object Array]')
		{
			console.warn('wrong columns type');
			return;
		}
		for (let poCol of poOrgColumns)
			funcAddCol(poCol,-1,true);
		funcAdjustColHeight();
		//数据渲染
		if (oCurOpt['options']['readyAfterInit'] == true)
			oCurOpt['readyLoadData'] = true;
		oCurOpt['renderBody'] = funcBodyRender;
		funcBodyRender(false,oCurOpt['options']['initStartIndex']);
		//滚动条处理
		let oJumpScrollEventCount = {vfix:0,vfill:0,hfix:0,hfill:0};
		$domFillDataBody.scroll(function()
		{
			if (oIdleId != undefined)
			{
				window.cancelIdleCallback(oIdleId);
				oIdleId = undefined;
			}
			if (oJumpScrollEventCount['hfill'] == 0)
			{
				if ($domFillDataBody.scrollLeft() != $domFillHead.scrollLeft())
				{
					oJumpScrollEventCount['hfix']++;
					$domFillHead.scrollLeft($domFillDataBody.scrollLeft());
				}
			}
			else
				--oJumpScrollEventCount['hfill'];
			if (oJumpScrollEventCount['vfill'] == 0)
			{
				if ($domFixDataBody.scrollTop() != $domFillDataBody.scrollTop())
				{
					oJumpScrollEventCount['vfix']++;
					$domFixDataBody.scrollTop($domFillDataBody.scrollTop());
				}
			}
			else
				--oJumpScrollEventCount['vfill'];
			if (typeof(oCurOpt['options']['onScroll']) == 'function')
				oCurOpt['options']['onScroll'].call(domThis,$domFillDataBody.scrollTop(),$domFillDataBody.scrollLeft());
			if (oCurOpt['options']['realtimeRender'] == true)
				funcBodyRender();
			else
				window.setTimeout(funcBodyRender,0);
		});
		$domFillHead.scroll(function()
		{
			if (oJumpScrollEventCount['hfix'] > 0)
				--oJumpScrollEventCount['hfix'];
			else
			{
				oJumpScrollEventCount['hfill']++;
				$domFillDataBody.scrollLeft($domFillHead.scrollLeft());
			}
		});
		$domFixDataBody.scroll(function()
		{
			if (oJumpScrollEventCount['vfix'] > 0)
				--oJumpScrollEventCount['vfix'];
			else
			{
				oJumpScrollEventCount['vfill']++;
				$domFillDataBody.scrollTop($domFixDataBody.scrollTop());
			}
		});
		//行选择处理
		let funcCallOnSelectEvent = function(nIndex,bIsSelect,strField)
		{
			if (typeof(oCurOpt['options']['onSelect']) == 'function')
			{
				let poLineObj = oLineData['data'][nIndex];
				if (poLineObj == null)
					poLineObj = undefined;
				oCurOpt['options']['onSelect'].call(domThis,bIsSelect,nIndex,poLineObj,strField);
			}
		};
		$domFillDataBody.on('click','.largetable_line',function()
		{
			if (oCurOpt['options']['selectMode'] == 'single-line')
				oCurOpt.setSelect($(this).attr('lindex'),true);
			else if (oCurOpt['options']['selectMode'] == 'multi-line')
				oCurOpt.setSelect($(this).attr('lindex'),$(this).attr('isSelected') == '1' ? false : true);
		});
		$domFixDataBody.on('click','.largetable_line',function(){$domFillDataBody.children(`[lindex="${$(this).attr('lindex')}"]`).click()});
		$(this).on('mouseenter','.largetable_line',function()
		{
			if (oCurOpt['options']['selectMode'].indexOf('line') > 0)
				$domFillDataBody.children(`[lindex="${$(this).attr('lindex')}"]`)[0].className += ' largetable_line_hover';
		});
		$(this).on('mouseleave','.largetable_line',function()
		{
			let domTarget = $domFillDataBody.children(`[lindex="${$(this).attr('lindex')}"]`)[0];
			domTarget.className = domTarget.className.replace(/ largetable_line_hover/g,'');
		});
		$(this).on('click','.largetable_line>.largetable_cell',function()
		{
			let strCid = $(this).attr('cid');
			let strIndex = $(this).parent().attr('lindex');
			if (oCurOpt['options']['selectMode'] == 'single-cell')
				oCurOpt.setSelect(strIndex,true,true,aoRenderInfo[strCid]['r']['field']);
			else if (oCurOpt['options']['selectMode'] == 'multi-cell')
				oCurOpt.setSelect(strIndex,$(this).attr('isSelected') == '1' ? false : true,true,aoRenderInfo[strCid]['r']['field']);
		});
		$(this).on('mouseenter','.largetable_cell',function()
		{
			if (oCurOpt['options']['selectMode'].indexOf('cell') > 0)
			{
				let poCol = aoRenderInfo[$(this).attr('cid')]['r'];
				if (poCol['fixed'] == false || poCol['allowFixCellSelect'] == true)
					this.className += ' largetable_cell_hover';
			}
		});
		$(this).on('mouseleave','.largetable_cell',function(){this.className = this.className.replace(/ largetable_cell_hover/g,'')});
		//设置定时触发渲染（为了在视区发生变化时能及时响应）
		let funcCycleRener = function()
		{
			if (oCurOpt.isDestroy == true)
				return;//组件已经不存在
			if (nRenderingCount == 0)
				funcBodyRender();
			window.setTimeout(funcCycleRener,(oCurOpt['options']['realtimeRender'] == true ? 500 : 10));
		}
		window.setTimeout(funcCycleRener,500);
		//设置闲时表头渲染，以减少横向滚动时表头渲染的卡顿(当触发滚动条事件后，此处理会终止，以此防止出现乱滚动现象)
		let astrLeftFakeCid = [];//记录剩余要渲染的表头节点
		for (let poNode of oRenderState['nodes']['head']['fixArray'])
		{
			if (poNode['isFake'] == true)
				astrLeftFakeCid.push(poNode['cid']);
		}
		for (let poNode of oRenderState['nodes']['head']['fillArray'])
		{
			if (poNode['isFake'] == true)
				astrLeftFakeCid.push(poNode['cid']);
		}
		let funcIdleColRender = function()
		{
			if (oCurOpt.isDestroy == true || astrLeftFakeCid.length == 0)
			{
				oIdleId = undefined;
				return;
			}
			oIdleId = window.requestIdleCallback(funcIdleColRender);
			if (domThis.offsetParent == null)
				return;//当前处于隐藏状态，不进行渲染，免得误判表头宽高
			let strCid = astrLeftFakeCid.shift();
			let poNode = oRenderState['nodes']['head']['map'][strCid];
			if (poNode == undefined || poNode['isFake'] == false)
				return;
			funcRerenderCol(strCid,false);
			funcAdjustColHeight();
		}
		oIdleId = window.requestIdleCallback(funcIdleColRender);
		//设置销毁监听
		$(domThis).bind('remove',() => oCurOpt.isDestroy = true);
	});
};

$.fn.largetable.methods =
{
	options: function(jq)
	{
		if (jq.length > 0)
			return $.data(jq[0],'largetable_opt').options;
	},
	pauseRender: function(jq)
	{
		jq.each(function()
		{
			$.data(this,'largetable_opt').allowRender = false;
		});
	},
	resumeRender: function(jq)
	{
		jq.each(function()
		{
			$.data(this,'largetable_opt').allowRender = true;
		});
	},
	colOptions: function(jq,strField,nIndex = 0)
	{
		if (jq.length == 0)
		{
			if (nIndex < 0)
				return [];
			return;
		}
		let paoCols = $.data(jq[0],'largetable_opt').filterByField(strField);
		if (nIndex < 0)
			return paoCols;
		return paoCols[nIndex];
	},
	ready: function(jq,nStartIndex = undefined)
	{
		if (isNaN(parseInt(nStartIndex)))
			nStartIndex = undefined;
		jq.each(function()
		{
			let poConf = $.data(this,'largetable_opt');
			if (poConf['readyLoadData'] == true)
				return;
			poConf['readyLoadData'] = true;
			if (nStartIndex != undefined)
				poConf['options']['initStartIndex'] = nStartIndex;
			poConf['renderBody'](false,nStartIndex);
		});
	},
	showColumn: function(jq,strField)
	{
		jq.each(function()
		{
			let paoCols = $.data(this,'largetable_opt').filterByField(strField);
			for (let poCol of paoCols)
				poCol['hidden'] = false;
		});
	},
	hideColumn: function(jq,strField)
	{
		jq.each(function()
		{
			let paoCols = $.data(this,'largetable_opt').filterByField(strField);
			for (let poCol of paoCols)
				poCol['hidden'] = true;
		});
	},
	updateHead: function(jq,strField,xTitle)
	{
		jq.each(function()
		{
			let paoCols = $.data(this,'largetable_opt').filterByField(strField);
			for (let poCol of paoCols)
				poCol['title'] = (xTitle != undefined ? xTitle : poCol['title']);
		});
	},
	reLoad: function(jq)
	{
		jq.each(function()
		{
			$.data(this,'largetable_opt')['reLoad']();
		});
	},
	reRender: function(jq,nLineIndex = undefined,strField = undefined)
	{
		jq.each(function()
		{
			$.data(this,'largetable_opt')['reRender'](true,nLineIndex,strField);
		});
	},
	setScroll: function(jq,nTop = undefined,nLeft = undefined)
	{
		jq.each(function()
		{
			$.data(this,'largetable_opt')['setScroll'](nTop,nLeft);
		});
	},
	jumpToIndex: function(jq,nLineIndex,bTopShow = false)
	{
		jq.each(function()
		{
			$.data(this,'largetable_opt')['jumpToIndex'](nLineIndex,bTopShow);
		});
	},
	getCurShowRange: function(jq)
	{
		if (jq.length > 0)
			return $.data(jq[0],'largetable_opt').getCurShowRange();
	},
	setSelectLine: function(jq,xIndex,bSelect = true,bTriggerEvent = true)
	{
		jq.each(function()
		{
			$.data(this,'largetable_opt')['setSelect'](xIndex,bSelect,bTriggerEvent);
		});
	},
	setSelectCell: function(jq,nIndex,strField,bSelect = true,bTriggerEvent = true,bShowInView = false)
	{
		jq.each(function()
		{
			nIndex = parseInt(nIndex);
			if (isNaN(nIndex))
				return;
			let oCurOpt = $.data(this,'largetable_opt');
			oCurOpt['setSelect'](nIndex,bSelect,bTriggerEvent,strField);
			if (bShowInView == true)
			{
				let aoMatch = oCurOpt['filterByField'](strField);
				if (aoMatch.length == 0)
					return;
				oCurOpt['renderBody'](false,nIndex,false,aoMatch[0]['cid']);
			}
		});
	},
	getSelect: function(jq)
	{
		if (jq.length > 0)
			return $.data(jq[0],'largetable_opt').getSelect();
	}
};

$.fn.largetable.parseOptions = (domTarget) => $.extend(
	{
		width:(domTarget.style.width != '' ? domTarget.style.width : undefined),
		height:(domTarget.style.height != '' ? domTarget.style.height : undefined)
	}, {}//$.parser.parseOptions(domTarget, ['width','height'])
);

$.fn.largetable.defaults =
{
	/////////属性////////
	width:'',//组件宽度
	height:'',//组件高度
	lineHeight:undefined,//数据行行高，设置后渲染性能会有提高
	realtimeRender:true,//是否使用实时渲染（滚动的同时立即渲染） 默认[是]
	head:
	{
		height:'',//表头高度
		minHeight:'',//表头最大高度
		maxHeight:''//表头最小高度
	},
	columns:[],//数据列配置
	readyAfterInit:false,//组件初始化后是否立即加载数据
	initStartIndex:0,//初始渲染的视区内最开始被渲染的数据的索引号
	lazyLoad:true,//组件是否使用懒加载方式加载数据
	selectMode:'single-line',//选择模式
	/////////事件////////
	onLoadData:undefined,//数据需要加载时触发事件
	onScroll:undefined, //滚动条滚动事件
	onSelect:undefined,//行选择状态变更时触发的事件
	onFinRender:undefined //一次数据渲染完成时触发（跳行完成也会触发，虽然此时可能不一定有真正渲染发生）
};
Object.freeze($.fn.largetable.defaults);

if ($.parser.plugins.includes('largetable') == false)
	$.parser.plugins.push('largetable');