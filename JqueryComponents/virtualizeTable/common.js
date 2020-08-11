/*
 * 公共函数定义，必须先在界面构建js后引入
 * create by zonbylie
 */
var CCommon = new function()
{
	//////↓内部变量↓////////
	var m_oFullMaskTip;
	var m_strBrowser = undefined;//undefined表示未设置提示
	var m_oHideCal;//隐藏的用于计算字符串占用宽度的节点
	var m_oUsers = undefined;//用于用户选择的数据记录
	
	//定义浏览器关闭时的提示窗
	window.onbeforeunload = function(oEvent)
	{
		if (m_strBrowser != undefined)
		{
			oEvent.returnValue =  m_strBrowser;
			window.event.returnValue =  m_strBrowser;
		}
	};
	
	//////↓通用函数↓////////
	/**
	 * 获得访问网址的开始部分
	 * @return string,返回网址开始部分
	 */
	this.GetUrlPre = ()=>"./system/";
	
	/**
	 * 显示等待界面
	 * @param require string strMsg,界面要显示的信息
	 * @param optional bool bAddCount = true,是否同时增加隐藏次数，用于在调用HideFullMask时确认是否真正需要隐藏屏蔽层
	 * @return void
	 */
	this.SetFullMask = function(strMsg,bAddCount = true)
	{
		if (typeof(m_oFullMaskTip) == "undefined")
		{
			m_oFullMaskTip = new function()
			{
				var m_oMask	= $('<div style="z-index:99999;position:fixed;left:0px;top:0px;background-color:rgba(204, 203, 202, 0.5)"></div>').appendTo('body');
				var m_oTip	= $(`<div style="
					overflow:hidden;
					border:1px solid #336699;
					font-size:13px;
					width:max-content;
					margin:auto;
					top:40%;
					position:relative;
					padding:5px 10px 5px 26px;
					background:url('./front/core/graphic/loading.gif') 5px center no-repeat;
					background-color:white;
					"></div>`).appendTo(m_oMask);
				var m_astrStack = [];
				
				this.Show = function(strMsg,bAddCount)
				{
					if (bAddCount == true)
						m_astrStack.push(strMsg);
					m_oMask.css
					({
						width	:	'100%',
						height	:	$(document).height()
					});
					m_oMask.show();
					m_oTip.html(strMsg);
				}
				
				this.Hide = function(bSubCount,bForceClose)
				{
					var strLastTip = '';
					if (m_astrStack.length > 0)
					{
						if (bSubCount == true)
							strLastTip = m_astrStack.pop();
						strLastTip = m_astrStack[m_astrStack.length - 1];
					}
					if (m_astrStack.length == 0 || bForceClose == true)
					{
						m_oMask.hide();
						m_astrStack = [];
					}
					else
						m_oTip.html(strLastTip);
				}
				
				this.SetText = function(strMsg)
				{
					if (strMsg == undefined)
						strMsg = ''
					console.log(strMsg);
					m_oTip.html(strMsg);
				}
			};
		}
		m_oFullMaskTip.Show(strMsg,bAddCount);
	};
	
	/**
	 * 隐藏显示等待界面
	 * @param optional bool bSubCount = true,是否同时减少隐藏次数的操作，用于确认是否真正需要隐藏屏蔽层
	 * @param optional bool bForceClose = false,是否强制关闭屏蔽层,默认[否]
	 * @return void
	 */
	this.HideFullMask = function(bSubCount = true,bForceClose = false)
	{
		if (typeof(m_oFullMaskTip) != "undefined")
			m_oFullMaskTip.Hide(bSubCount,bForceClose);
	};
	
	/**
	 * 显示错误消息框
	 * @param require string strTitle,消息标题
	 * @param require string strErrMsg,消息内容
	 * @return void
	 */
	this.ShowErrMsg = function(strTitle,strErrMsg)
	{
		$.messager.error({title:strTitle,msg:strErrMsg});
	};
	
	/**
	 * 显示警告消息框
	 * @param require string strTitle,消息标题
	 * @param require string strWarnMsg,消息内容
	 * @return void
	 */
	this.ShowWarnMsg = function(strTitle,strWarnMsg)
	{
		$.messager.alert({title:strTitle,msg:strWarnMsg});
	};
	
	/**
	 * 显示提示消息框
	 * @param require string strTitle,消息标题
	 * @param require string strMsg,消息内容
	 * @return void
	 */
	this.ShowInfoMsg = function(strTitle,strMsg)
	{
		$.messager.show({title:strTitle,msg:strMsg});
	};
	
	/**
	 * 显示提示消息条
	 * @param require string strHtmlContent,消息内容，支持html
	 * @param optional obj domParent = $('body'),jquery对象，消息提示的父层容器，不传递时将直接把body作为父容器
	 * @param optional bool bHoldSpace = false,是否占据空间,true-占据，false-不占 如果不占据空间，需要父容器有设置position属性
	 * @param optional uint uAutoHide = 5000,自动隐藏的时间（单位:秒），设置为0表示不隐藏
	 * @return void
	 */
	this.ShowInfoTip = function(strHtmlContent, domParent = $('body'), bHoldSpace = false,  uAutoHide = 5000)
	{
		var domTipView;
		var oViewCommonCss = 
		{
			zIndex:9000,
			height:'26px',
			lineHeight:'26px',
			backgroundColor:'#c7ec7f',
			backgroundImage:'url("front/core/graphic/tip_info.png")',
			backgroundRepeat:'no-repeat',
			backgroundPosition:'5px center',
			boxShadow:'1px 1px #86bb55',
			color:'#336699',
			opacity:0,
		};
		var oContentCommonCss = 
		{
			textAlign:'center',
			whiteSpace:'nowrap',
			overflow:'hidden',
			textOverflow:'ellipsis',
			position:'absolute',
			left:'30px',
			right:'35px',
			top:'0px'
		}
		if (bHoldSpace == true)
			domTipView = $('<div style="width:100%;position:relative;"><span>' + strHtmlContent + '</span></div>').prependTo(domParent);
		else
		{
			domTipView = $('<div style="position:absolute;\
										top:0px;\
										left:0px;\
										right:0px;"><span>' + strHtmlContent + '</span></div>').appendTo(domParent);
		}
		domTipView.find('span').css(oContentCommonCss);
		domTipView.css(oViewCommonCss);
		var domClose = $('<span class="msg_tip_close_sign">×</span>').appendTo(domTipView);
		//定义淡出动画
		var funcFadeOut = function()
		{
			domTipView.animate(
			{
				'opacity':'0'
			},{
				duration: 200,
				done: function(){domTipView.remove();}
			});
		}
		//定义点击[X]事件
		domClose.click(function()
		{
			funcFadeOut();
		});
		//执行淡入动画
		domTipView.animate(
		{
			'opacity':'1'
		},{
			duration: 600,
			done: function()
			{
				//淡入完毕停留指定时间，执行淡出
				if (uAutoHide > 0)
				{
					setTimeout(function ()
					{
						funcFadeOut();
					}, uAutoHide);
				}
			}
		});
	}
	//为ShowInfoTip函数定义样式
	$('<style type="text/css">\
		.msg_tip_close_sign\
		{\
			float: right;\
			padding-right: 5px;\
			font-size: 25px;\
			margin-top: -1px;\
			width: 25px;\
			cursor: pointer;\
		}\
		.msg_tip_close_sign:hover\
		{\
			font-weight:bold;\
		}\
	</style>').appendTo('head')
	
	/**
	 * 显示询问消息框
	 * @param require string strTitle,消息标题
	 * @param require string strMsg,消息内容
	 * @param optional function fYes = undefined,点击[是]按钮后的处理函数
	 * @param optional function fNo = undefined,点击[否]按钮后的处理函数
	 * @return void
	 */
	this.ShowQueryMsg = function(strTitle,strMsg,fYes = undefined,fNo = undefined)
	{
		var funcConfirm = function(bYes)
		{
			if (bYes == true && typeof(fYes) == 'function')
				fYes();
			else if (bYes == false && typeof(fNo) == 'function')
				fNo();
		}
		$.messager.asked({title:strTitle,msg:strMsg,lconfirm:'是',ncancel:'否',askedYes:funcConfirm,askedNo:funcConfirm});
	};
	
	/**
	 * 获取当前设置的浏览器关闭时的提示信息
	 * @return undefined/string,有设置的时候返回设置的字符串，如果返回undefined，说明没有设置
	 */
	this.GetBrowserCloseTip = function(){return m_strBrowser;}
	
	/**
	 * 设置浏览器关闭时的提示信息
	 * @param require string strTipInfo,设置关闭时的提示信息，如果传入undefined，表示清理设置
	 * @return void
	 */
	this.SetBrowserCloseTip = function(strTipInfo){m_strBrowser = strTipInfo;}
	
	/**
	 * 清理浏览器关闭时的提示信息
	 * @return void
	 */
	this.ClearBrowserCloseTip = function(){m_strBrowser = undefined;}
	
	/**
	 * 创建可监听数据变更的Array/Object对象
	 * 【补充1】创建时Array/Object对象在转换成被监听对象的分布后将于原对象分离（即对原对象的修改不再影响监听对象）
	 * 【补充2】关于被监听对象的定义：在非深度监听情况下创建的被监听对象，其被监听部分只有一层，此时关于【补充1】的影响也只有一层
	 * 			如：a={f1:1,f2:2} b={r1:a,r2:a} 如果对b建立非深度监听的监听对象c，当执行c['r1']=0的修改时，b['r1']不受影响 但如果修改c['r1']['f1']=0 则a['f1']也会改变
	 * 【补充3】在深度监听的覆盖下，与原对象分离的影响会扩展到对应的深度中，同样以【补充2】的例子说明，假定c是基于b的全深度监听对象，则修改c['r1']['f1']=0对a也不会有影响
	 * 【补充4】对监听对象设置值时具有的引用关系会保留，但如果被引用的对象也需要被转换成被监听对象，则虽然关系保留，但也与原对象不再是同一对象
	 * 			基于【补充3】的例子，因为生成出监听对象c的b中，b['r1']和b['r2']指向同一对象a，在生成c后，虽然c['r1']和c['r2']与a不是同一对象，但c['r1']与c['r2']引用自共同对象这点依然保留着，也即c['r1']==c['r2']
	 * 【补充5】深度监听的引用关系的保留只会在一次设值中有效，具体包含的场景有：
	 * 			1、通过CreateObservableObj创建监听对象时（如【补充3】的例子）
	 * 			2、直接赋值Array/Object，如在【补充3】例子下，执行 c['ext'] = [a,a]，则c['ext'][0] == c['ext'][1]
	 * 			多次设值间曾经的引用关系不会保留，如在【补充5】的第2点中，虽然c['ext'][0]和c['ext'][1]是指向同一对象，但c['ext'][0] != c['r1']，因为c['r1']是在初始化时就被确定的
	 * 【补充7】对已经是可监听对象再次使用CreateObservableObj只是直接返回该对象，而不是在那基础上再生成新对象
	 * 【补充8】基于【补充7】的说明，如果深度监听对象被赋的值也是可监听对象，则也不会重新封装对象，此时能衍生出如下的引用用法：
	 * 			通过修改【补充5】第2点的赋值： c['ext'] = [c['r1'],c['r1']] 可以让c['r1']、c['r2']、c['ext'][0]、c['ext'][1]都指向同一对象
	 * 【补充9】对【补充7、8】的进一步补充，关于不对可监听对象重复封装，也包括不对其内部绑定的事件，其原本所属的绝对路径等的变更，使用【补充8】的例子做说明：
	 * 			虽然此时c['r1']、c['r2']、c['ext'][0]、c['ext'][1]指向同一个监听对象，但该监听对象的绝对路径依然是认为在c['r1']中，因为最初是基于那个位置被创建的
	 * 使用方法：
	 *    void function addEventListener(eventFunc,eventType = 'allchange',listenPopup = false,...listenKeys = null)
	 * 		@info 添加事件监听函数(事件发生在数据变更后)
	 * 				【注】使用splice函数时，触发的改变按照索引对应，所以删除元素时如果引发后面元素的索引移动，则对被移动元素的新索引位置产生修改事件
	 * 		@param require function eventFunc,事件函数，定义为 void function(eventInfo) 传入eventInfo为变更项的路径说明：
	 * 			[{
	 * 				key:产生值改变层中改变的键名/索引/Symbol
	 * 				relativePath:变更键/索引/Symbol相对注册事件时的路径，传入值为数组，数组内各项对应一个层次的键/索引/Symbol，索引0表示注册事件时所在层
	 * 				fullPath:变更键/索引/Symbol对完整对象/数组的路径，传入值为数组，数组内各项对应一个层次的键/索引/Symbol，索引0表示完整对象/数组的顶层
	 * 				changeType:变更类型 'add'/'modify'/'del'/'set',其中'set'仅在没变更时才会出现
	 * 				isPopup:是否冒泡事件（变更点不在当前层）
	 * 				value:【冒泡事件不带此属性】变更后的值，如果是删除，将不存在此属性
	 * 				eventKey:【非冒泡事件不带此属性】冒泡触发事件时对应触发层的键
	 * 				eventRelativePath:【非冒泡事件不带此属性】冒泡触发事件时对应触发层的相对注册事件路径
	 * 				eventFullPath:【非冒泡事件不带此属性】冒泡触发事件时对应触发层的完整路径
	 * 			},......]
	 * 			【另关于事件函数中this的说明】：函数的this指向是触发事件key对应的Array/Object对象（意思是对于冒泡上来的事件，this也仅为当前层的对象，而不是最初触发key所在的对象）
	 * 		@param optional string/[string] eventType = 'allchange',事件类型，可填值为 'add'/'modify'/'del'/'set'/'allchange'，
	 * 			'allchange'属于伪事件，实际转换为['add','modify','del']
	 * 			'set'事件是只要有设置动作就会触发，不一定是值有变化，通知时的事件类型会是'add'/'modify'/'del'/'set'四种之一
	 * 		@param optional bool listenPopup = false,是否对冒泡的变更也触发本监听
	 * 		@param optional string/number/array()/null ...listenKeys = null,指定监听事件触发范围，一个参数表示一个范围，其各种取值说明如下：
	 * 			null - 监听当前层所有索引
	 * 			string/number - 监听当前层特定索引
	 * 			array - 在深度监听时可指定监听子层的索引/键/Symbol，其中空数组表示监听全部(如果当前为深度监听，则此处的全部包括所有层次的索引/键/Symbol) 数组索引0的项表示当前层（与直接的null/索引/键/Symbol等价），往下的索引项表示进一步的子层 数组中各项定义为：
	 * 				null - 监听对应层所有索引
	 * 				string/number/Symbol - 监听对应层的特定索引/键/Symbol
	 * 				【举例】传参 [null,'k1'] 表示监听当前层所有的键/索引/Symbol下，子层键名为"k1"的键
	 * 
	 *    void function removeEventListener(eventFunc = undefined,eventType = 'allchange',...removeKeys = null)
	 * 		@info 删除事件监听函数
	 * 		@param optional function eventFunc = undefined,如果传入了函数，则需要与添加时一致才能删除，如果留空(undefined)，则清理指定eventType下所有监听事件函数
	 * 		@param optional string/[string] eventType = 'allchange',事件类型，可填值为 'add'/'modify'/'del'/'set'/'allchange'
	 * 		@param optional string/number/array()/null ...removeKeys = null,指定要删除监听的范围，其各种取值说明如下：
	 * 			null - 删除监听当前层所有索引
	 * 			string/number/Symbol - 删除监听当前层特定索引
	 * 			array - 删除监听当前层/指定子层的索引/键/Symbol，其中空数组表示删除全部监听(如果当前为深度监听，则此处的全部包括所有层次的键) 数组索引0的项表示当前层（与直接的null/索引/键/Symbol等价），往下的索引项表示进一步的子层 数组中各项定义为：
	 * 				null - 删除监听对应层所有索引
	 * 				string/number/Symbol - 指定删除监听对应层的特定索引/键/Symbol
	 * 
	 *    void function addValueValid(validFunc,...validKeys = null)
	 * 		@info 设置设值验证（包括删除也视为设值，但在对验证函数的传入参数会有与修改不同的体现）
	 * 				【注1】验证的触发只对赋值的直接字段，比如某字段值是个数组类型，整个数组被替换时只会触发该字段的验证，而不会触发数组内各索引甚至更下层的验证
	 * 				【注2】数组中会产生值在不同索引间移动的方法（如sort）在移动时不会触发无指定索引的验证，且移动会保留原引用关系
	 * 				【注3】在深度监听下，Array和Object类型的赋值，会采用值传递（包括子层部分）
	 * 				【注4】数组涉及批量修改的方法（如push），如果其中有一项不通过验证，则整个方法不会产生效果
	 * 		@param require function validFunc,验证函数，定义如下：
	 * 			bool/[true,any]/any function(eventInfo)
	 * 			@this 函数的this指向是触发事件key对应的Array/Object对象（意思是对于冒泡上来的事件，this也仅为当前层的对象，而不是最初触发key所在的对象）
	 * 			@param any eventInfo-即将要设置的值及其路径信息，具体结构定义为：
	 * 				{
	 * 					key:产生值改变层中改变的键名/索引
	 * 					relativePath:变更键/索引相对注册事件时的路径，传入值为数组，数组内各项对应一个层次的键/索引，索引0表示注册事件时所在层
	 * 					fullPath:变更键/索引对完整对象/数组的路径，传入值为数组，数组内各项对应一个层次的键/索引，索引0表示完整对象/数组的顶层
	 * 					value:要设置的值，如果是删除，将不存在此属性（以此区分是修改的赋值undefined还是删除）
	 * 					changeType:变更类型 'add'/'modify'/'del'
	 * 				}
	 * 			@return bool - 返回false将阻止该值的设置
	 * 					[true,any] - 返回带两个元素的数组，且第一个值为true时，表示使用数组第二个作为设置值
	 * 								【注1】如果设置了多个验证函数，当前返回的any值将作为剩余未执行验证函数的传入值
	 * 								【注2】删除的情况下返回的新值不会被采用
	 * 					any - 剩下的其他返回情况都视为允许设置
	 * 		@param optional string/number/array()/null ...validKeys = null,指定验证触发范围，其各种取值说明如下：
	 * 			null - 验证当前层所有索引
	 * 			string/number/Symbol - 验证当前层特定索引/键/Symbol
	 * 			array - 验证复数索引或在深度监听时指定验证子层的索引/键，其中空数组表示验证全部(如果当前为深度监听，则此处的全部包括所有层次的键) 数组索引0的项表示当前层（与直接的null/索引/键/Symbol等价），往下的索引项表示进一步的子层 数组中各项定义为：
	 * 				null - 验证对应层所有索引
	 * 				string/number/Symbol - 指定验证对应层的特定索引/键/Symbol
	 * 
	 *    void function removeValueValid(validFunc = undefined,...validKeys = null)
	 * 		@info 删除设值验证
	 * 		@param optional function validFunc = undefined,要删除的验证函数，传入undefined表示清理满足validKeys下的所有函数
	 * 		@param optional string/number/array()/null ...validKeys = null,指定要删除验证的范围，其各种取值说明如下：
	 * 			null - 删除验证当前层所有索引
	 * 			string/number/Symbol - 删除验证当前层特定索引/键/Symbol
	 * 			array - 删除验证当前层/指定子层的索引/键/Symbol，其中空数组表示删除全部验证(如果当前为深度监听，则此处的全部包括所有层次的键) 数组索引0的项表示当前层（与直接的null/索引/键/Symbol等价），往下的索引项表示进一步的子层 数组中各项定义为：
	 * 				null - 删除验证对应层所有索引
	 * 				string/number/Symbol - 指定删除验证对应层的特定索引/键/Symbol
	 * 
	 *    void function disableEvents()
	 * 		@info 禁止所有事件触发（包括验证）
	 * 
	 *    void function enableEvents()
	 * 		@info 允许触发事件（包括验证）
	 * 
	 * @param require array/object xTarget,创建所依据的Array/Object
	 * @param optional bool bCheckModifyByRef = true,针对复杂类型，是否基于引用关系判断数据变更
	 * @param optional bool bDeepObserve = false,是否深度监听 设置为true时数组内复杂类型的变更也同时处于监听状态，且所有赋值都基于值传递（即比如a[0]={...}，此时a[0]存储的对象是所赋值对象的复制品）
	 * @param optional int nObserveDeep = undefined,【仅开启了深度监听时有效】最大监听深度，默认undefined表示不限制，深度从当前层的子层开始计算，因此深度1表示仅监听到当前层的子层
	 * @param system map/undefined xRefRec, 【系统使用的字段，请勿传递】用于在深度监听下识别引用循环
	 * @return Array,返回创建后的新对象
	 */
	this.CreateObservableObj = function(xTarget,bCheckModifyByRef = true,bDeepObserve = false,nObserveDeep,xRefRec = undefined)
	{
		let strObjType = Object.prototype.toString.call(xTarget);
		if (['[object Array]','[object Object]'].includes(strObjType) == false)
			return;
		if (xTarget['##in_observe##'] === true)
			return xTarget;//已被监听的对象不重复封装监听
		let xRealObj = (strObjType == '[object Array]' ? [] : {});//对象实体
		let axPreFull = [];//前置完整层
		let mapCurCallback = new Map();//当前层的监听 key-null/特定键(索引全转字符串)/Symbol value-Map(key-处理函数 value-{preRelative:前置相对路径数组, listenType:{key-监听的事件类型 value-是否冒泡（此项对验证回调无效）}})
		let mapSubCallback = new Map();//子层的监听 key-null/特定键(索引全转字符串)/Symbol value-Map(key-处理函数 value-[{listenKeys:往下子层监听的键（数组形式）,preRelative:前置相对路径数组, listenType:{key-监听的事件类型 value-是否冒泡}},...])
		let funcParentCallback = undefined;//上层监听回调，用于深度监听时的事件冒泡
		let xObserveDeep = nObserveDeep;
		let bAllowTriggerEvent = true;
		let xObjToObserve = xRefRec;//new Map() 初始化时记录引用关系，以判断引用循环的情况 只会在初始化过程中作为Map使用，此后会变成undefined
		let oProxy;

		let funcPopupChange = (axKeyTraces) => funcTriggerChangeEvent(axKeyTraces);//下层冒泡上来的变更 axKeyTraces-[{key:变更键/索引/Symbol链, ctype:变更类型},...]

		let funcParsePath = function(axOrgPath) //把路径信息标准化 返回false表示转换失败 注意判断返回值是否为false要用===
		{
			let aoListenKeys = [];
			if (axOrgPath.length == 0)
				axOrgPath.push(null);
			for (let xPath of axOrgPath)
			{
				if (xPath === null)
					aoListenKeys.push([null]);
				else if (typeof(xPath) != 'object')
				{
					let strKeyType = Object.prototype.toString.call(xPath);
					if (['[object Symbol]','[object String]','[object Number]'].includes(strKeyType) == false)
					{
						console.warn('invalid listen path');
						return false;
					}
					if (strKeyType == '[object Number]')
						aoListenKeys.push(['' + xPath]);
					else
						aoListenKeys.push([xPath]);
				}
				else if (Object.prototype.toString.call(xPath) == '[object Array]')
				{
					let aoSubPath = [];
					for (let xSub of xPath)
					{
						let strKeyType = Object.prototype.toString.call(xSub);
						if (xSub === null)
							aoSubPath.push(null);
						else if (['[object Symbol]','[object String]','[object Number]'].includes(strKeyType))
						{
							if (strKeyType == '[object Number]')
								aoSubPath.push('' + xSub);
							else
								aoSubPath.push(xSub);
						}
						else
						{
							console.warn('invalid listen path');
							return false;
						}
					}
					if (aoSubPath.length != 0)
						aoListenKeys.push(aoSubPath);
					else
					{
						aoListenKeys = [[]];
						break;
					}
				}
				else
				{
					console.warn('invalid listen path');
					return false;
				}
			}
			if (aoListenKeys.length == 0)
				aoListenKeys = [[]];
			return aoListenKeys;
		};

		let funcRegistEvent = function(pmapNode,xKey,poFuncPathObj) //注册事件到当前层的特定类型中
		{
			let pmapFunc;
			if (pmapNode.has(xKey) == false)
			{
				pmapFunc = new Map();
				pmapNode.set(xKey,pmapFunc);
			}
			else
				pmapFunc = pmapNode.get(xKey);
			if (pmapFunc.has(poFuncPathObj['func']))
			{
				if (poFuncPathObj['listenKeys'] == undefined)
				{
					//合并替换事件
					let poOldFuncListenType = pmapFunc.get(poFuncPathObj['func'])['listenType'];
					for (let strCType in poFuncPathObj['listenType'])
						poOldFuncListenType[strCType] = poFuncPathObj['listenType'][strCType];
				}
				else
				{
					let aoFuncDefs = pmapFunc.get(poFuncPathObj['func']);
					let bMerged = false;
					for (let poFuncDef of aoFuncDefs)
					{
						if (poFuncPathObj['listenKeys'].length != poFuncDef['listenKeys'].length)
							continue;
						let bMatch = true;
						for (let nCmpScan = 0;nCmpScan < poFuncDef['listenKeys'].length;++nCmpScan)
						{
							if (poFuncPathObj['listenKeys'][nCmpScan] != poFuncDef['listenKeys'][nCmpScan])
							{
								bMatch = false;
								break;
							}
						}
						if (bMatch == true)
						{
							//合并替换事件
							let poOldFuncListenType = poFuncDef['listenType'];
							for (let strCType in poFuncPathObj['listenType'])
								poOldFuncListenType[strCType] = poFuncPathObj['listenType'][strCType];
							bMerged = true;
							break;
						}
					}
					if (bMerged == false)
						aoFuncDefs.push(poFuncPathObj);
				}
			}
			else if (poFuncPathObj['listenKeys'] == undefined)
				pmapFunc.set(poFuncPathObj['func'],poFuncPathObj);
			else
				pmapFunc.set(poFuncPathObj['func'],[poFuncPathObj]);
		};

		let funcUnregistEvent = function(pmapNode,xKey,funcDel = undefined,setCTypes,axSub = undefined) //取消当前层的事件注册
		{
			if (pmapNode.has(xKey) == false)
				return;
			let pmapFuncs = pmapNode.get(xKey);
			if (funcDel != undefined && pmapFuncs.has(funcDel) == false)
				return;
			for (let funcToDel of (funcDel == undefined ? [...pmapFuncs.keys()] : [funcDel]))
			{
				let xDef = pmapFuncs.get(funcToDel);
				if (Object.prototype.toString.call(xDef) == '[object Object]')
				{
					for (let strCType of setCTypes)
						delete xDef['listenType'][strCType];
					let bTypeExist = false;
					for (let strType in xDef['listenType'])
					{
						bTypeExist = true;
						break;
					}
					if (bTypeExist == false)
						pmapFuncs.delete(funcToDel);
				}
				else if (axSub === undefined)
					continue;
				else
				{
					for (let nSubScan = 0;nSubScan < xDef.length;++nSubScan)
					{
						let poFuncDef = xDef[nSubScan];
						if (axSub.length != poFuncDef['listenKeys'].length)
							continue;
						let bMatch = true;
						if (axSubPath.length > 0)
						{
							for (let nCmpScan = 0;nCmpScan < axSub.length;++nCmpScan)
							{
								if (axSub[nCmpScan] != poFuncDef['listenKeys'][nCmpScan])
								{
									bMatch = false;
									break;
								}
							}
						}
						if (bMatch == true)
						{
							for (let strCType of setCTypes)
								delete poFuncDef['listenType'][strCType];
							let bTypeExist = false;
							for (let strType in poFuncDef['listenType'])
							{
								bTypeExist = true;
								break;
							}
							if (bTypeExist == false)
							{
								xDef.splice(nSubScan,1);
								--nSubScan;
							}
						}
					}
					if (xDef.length == 0)
						pmapFuncs.delete(funcToDel);
				}
			}
		};

		let funcValidSpKey = function(xKey,xValue,strChangeType) //验证特定键值是否满足设值函数的要求 返回false表示不满足，返回true表示满足，返回[true,替换值]表示使用新值去设置
		{
			if (bAllowTriggerEvent == false)
				return true;
			let oOrgEventInfo = {key:xKey,fullPath:Object.freeze([...axPreFull,xKey]),changeType:strChangeType};
			let xCurValue = xValue;
			for (let xScan of [xKey,null])
			{
				let xKeyForMap = xScan;
				if (typeof(xScan) == 'number')
					xKeyForMap = '' + xScan;
				if (mapCurCallback.has(xKeyForMap))
				{
					for (let [funcValid,poFuncValid] of mapCurCallback.get(xKeyForMap))
					{
						if (poFuncValid['listenType'].hasOwnProperty('valid') == false)
							continue;
						let oEventInfo = Object.assign({},oOrgEventInfo);
						oEventInfo['relativePath'] = [...poFuncValid['preRelative'],xKey];
						if (strChangeType != 'del')
							oEventInfo['value'] = xCurValue;
						let xResult = funcValid.call(oProxy,oEventInfo);
						if (xResult === false)
							return false;
						if (Object.prototype.toString.call(xResult) == '[object Array]' && xResult.length == 2 && xResult[0] === true)
							xCurValue = xResult[1];
					}
				}
			}
			if (xValue !== xCurValue)
				return [true,xCurValue];
			return true;
		};

		let funcTriggerChangeEvent = function(xKeyInfos) //触发某一种类型的变更通知（包括事件冒泡）xKeyInfos为{key,ctype}或是其组成的数组 冒泡事件下xKeyInfos里key字段的各项为描述层次的数组
		{
			if (bAllowTriggerEvent == false)
				return;
			if (Object.prototype.toString.call(xKeyInfos) != '[object Array]')
				xKeyInfos = [xKeyInfos];
			//构造原始事件结构
			let mapKeyToEventInfo = new Map([ [null,{add:[],modify:[],del:[],set:[]}] ]); //key-键 value-{add:[],modify:[],del:[]}
			let axPopupKeyInfos = [];
			let bIsPopup = false;
			for (let poKeyInfo of xKeyInfos)
			{
				let oNewEventInfo;
				let xKey = poKeyInfo['key'];
				let xTriggerKey;
				let strChangeType = poKeyInfo['ctype'];
				if (Object.prototype.toString.call(poKeyInfo['key']) != '[object Array]') //当前层事件
				{
					oNewEventInfo = {key:xKey,fullPath:Object.freeze([...axPreFull,xKey]),changeType:strChangeType,isPopup:false};
					if (strChangeType != 'del')
						oNewEventInfo['value'] = xRealObj[xKey];
					if (axPreFull.length > 0)
						axPopupKeyInfos.push({key:[axPreFull[axPreFull.length - 1],xKey],ctype:strChangeType});
					xTriggerKey = xKey;
				}
				else //冒泡事件
				{
					oNewEventInfo = {subLink:xKey,key:xKey[xKey.length - 1],fullPath:Object.freeze([...axPreFull,...xKey]),changeType:strChangeType,isPopup:true};
					if (axPreFull.length > 0)
						axPopupKeyInfos.push({key:[axPreFull[axPreFull.length - 1],...xKey],ctype:strChangeType});
					bIsPopup = true;
					xTriggerKey = xKey[0];
				}
				if (mapKeyToEventInfo.has(xTriggerKey) == false)
					mapKeyToEventInfo.set(xTriggerKey,{add:[],modify:[],del:[],set:[]});
				mapKeyToEventInfo.get(xTriggerKey)[strChangeType].push(oNewEventInfo);
				mapKeyToEventInfo.get(null)[strChangeType].push(oNewEventInfo);
				if (strChangeType != 'set')
				{
					mapKeyToEventInfo.get(xTriggerKey)['set'].push(oNewEventInfo);
					mapKeyToEventInfo.get(null)['set'].push(oNewEventInfo);
				}
			}
			//事件触发
			for (let [xTriggerKey,mapEventInfos] of mapKeyToEventInfo)
			{
				let xKeyForMap = xTriggerKey;
				if (typeof(xTriggerKey) == 'number')
					xKeyForMap = '' + xTriggerKey;
				if (mapCurCallback.has(xKeyForMap) == false)
					continue;
				for (let [funcEvent,poFuncEvent] of mapCurCallback.get(xKeyForMap))
				{
					let aoAllowEvents = [];
					for (let strCType of ['add','modify','del','set'])
					{
						if (poFuncEvent['listenType'].hasOwnProperty(strCType) && (bIsPopup == false || poFuncEvent['listenType'][strCType] === true))
						{
							if (strCType != 'set')
								aoAllowEvents.push(...mapEventInfos[strCType]);
							else
								aoAllowEvents = mapEventInfos['set'];//set事件内包含了所有其他三类事件
						}
					}
					if (aoAllowEvents.length == 0)
						continue; //忽略不响应冒泡的事件
					let aoCurEventInfos = [];
					for (let poEventInfo of aoAllowEvents)
					{
						if (bIsPopup == false)
							aoCurEventInfos.push(Object.assign({relativePath:[...poFuncEvent['preRelative'],poEventInfo['key']]},poEventInfo));
						else
						{
							let xEventKey = poEventInfo['subLink'][0];
							let oNewEventInfo = Object.assign({eventKey:xEventKey,eventFullPath:[...axPreFull,xEventKey],eventRelativePath:[...poFuncEvent['preRelative'],xEventKey],relativePath:[...poFuncEvent['preRelative'],...poEventInfo['subLink']]},poEventInfo);
							delete oNewEventInfo['subLink'];
							aoCurEventInfos.push(oNewEventInfo);
						}
					}
					funcEvent.call(oProxy,aoCurEventInfos);
				}
			}
			if (typeof(funcParentCallback) == 'function' && axPopupKeyInfos.length > 0)
				funcParentCallback(axPopupKeyInfos);
		};

		let funcSetValue = function(xKey,xValue,axSetTarget = xRealObj,xRelativeKey = undefined) //赋值操作，对象和数组的赋值在深度监听下将新建监听对象
		{
			let strValueType = Object.prototype.toString.call(xValue);
			if (bDeepObserve == false || ['[object Object]','[object Array]'].includes(strValueType) == false || xObserveDeep === 0)
				axSetTarget[xKey] = xValue;
			else if (xObjToObserve != undefined &&  xObjToObserve.has(xValue) == true)
				axSetTarget[xKey] = xObjToObserve.get(xValue);
			else if (xValue['##in_observe##'] === true)
				axSetTarget[xKey] = xValue;
			else
			{
				if (xRelativeKey == undefined)
					xRelativeKey = xKey;
				axSetTarget[xKey] = CCommon.CreateObservableObj(xValue,bCheckModifyByRef,bDeepObserve,(xObserveDeep === undefined ? undefined : xObserveDeep - 1),xObjToObserve);
				axSetTarget[xKey]._setPreFullPath([...axPreFull,xRelativeKey]);
				axSetTarget[xKey]._setParentCallback(funcPopupChange);
				if (bAllowTriggerEvent == false)
					axSetTarget[xKey].disableEvents();
				//挂载子层事件
				for (let xScan of [xRelativeKey,null])
				{
					let strMapKey = xScan;
					if (typeof(xScan) == 'number')
						strMapKey = '' + xScan;
					if (mapSubCallback.has(strMapKey) == false)
						continue;
					for (let [funcEvent,paoFuncPathObj] of mapSubCallback.get(strMapKey))
					{
						for (let poFuncPathObj of paoFuncPathObj)
						{
							let oNewFuncPathObj = {preRelative:[...poFuncPathObj['preRelative'],xRelativeKey],func:funcEvent};
							for (let strEventType of Object.keys(poFuncPathObj['listenType']))
							{
								if (strEventType != 'valid')
									axSetTarget[xKey].addEventListener(oNewFuncPathObj,strEventType,poFuncPathObj['listenType'][strEventType],poFuncPathObj['listenKeys']);
								else
									axSetTarget[xKey].addValueValid(oNewFuncPathObj,poFuncPathObj['listenKeys']);
							}
						}
					}
				}
			}
		};

		let funcArrayCommonChange = function(strFuncName,...args) //处理数组中会产生不定数量项变更的情况 如果出现部分变更被取消，整个操作会被取消
		{
			if (mapCurCallback.size == 0 && funcParentCallback == undefined)
				return xRealObj[strFuncName].apply(xRealObj,args);
			let axOrg = [...xRealObj];//浅拷贝数组，用于验证变化
			let axTest = [...xRealObj];//浅拷贝数组，用于测试变化
			let xReturn = axTest[strFuncName].apply(axTest,args);
			let setIsOrgValue = new Set(axOrg);//记录旧有值，以赋值时直接复用
			let aoCInfos = [];
			let aoAInfos = [];
			let aoDInfos = [];
			let aoReSetOnly = [];
			//比较变更值，并验证变更是否被允许
			for (let nScan = 0;nScan < Math.max(axOrg.length,axTest.length);++nScan)
			{
				let bOldHasProperty = axOrg.hasOwnProperty(nScan);
				let bNewHasProperty = axTest.hasOwnProperty(nScan);
				let xCurCType;
				if (bOldHasProperty && bNewHasProperty) //修改
				{
					if ((bCheckModifyByRef == true && axOrg[nScan] !== axTest[nScan]) ||
						(bCheckModifyByRef == false && CCommon.ObjContentChanged(axOrg[nScan],axTest[nScan])))
						xCurCType = ['modify',aoCInfos,axTest[nScan]];
					else
					{
						aoReSetOnly.push({key:nScan,ctype:'set'});
						continue;
					}
				}
				else if (bNewHasProperty) //新增
					xCurCType = ['add',aoAInfos,axTest[nScan]];
				else //删除
					xCurCType = ['del',aoDInfos,undefined];
				let xValidResult = funcValidSpKey(nScan,xCurCType[2],xCurCType[0]);
				if (xValidResult === false)
					return;
				if (xCurCType[0] != 'del' && typeof(xValidResult) == 'object')
					axTest[nScan] = xValidResult[1];
				xCurCType[1].push({key:nScan,ctype:xCurCType[0]});//放入变更
			}
			//应用变更值
			if (aoAInfos.length > 0 || aoDInfos.length > 0)
				xRealObj[strFuncName].apply(xRealObj,args);//对实际数组执行一次，以对齐数组长度
			if (bDeepObserve == true && (xObserveDeep === undefined || xObserveDeep > 1) && xObjToObserve == undefined) //设置了深度监听下，需要处理新设置值（及其下层）的依赖映射
				xObjToObserve = new Map();
			for (let poInfo of [...aoCInfos,...aoAInfos])
			{
				let nScan = poInfo['key'];
				if (setIsOrgValue.has(axTest[nScan]))
					xRealObj[nScan] = axTest[nScan];
				else
					funcSetValue(nScan,axTest[nScan]);
			}
			xObjToObserve = undefined;
			//触发变更通知
			funcTriggerChangeEvent([...aoCInfos,...aoAInfos,...aoDInfos,...aoReSetOnly]);
			return xReturn;
		};

		//提供事件挂载方法，并重写部分内置方法实现
		let mapReplaceFunc = 
		{
			_setPreFullPath:(axFull) => (axPreFull = axFull), //上层用于设置当前层的完整层信息
			_setParentCallback:function(funcCallback) //设置把事件冒泡给上层的函数
			{
				if (funcCallback === undefined || typeof(funcCallback) == 'function')
					funcParentCallback = funcCallback;
			},
			disableEvents:function(xDealedSet)
			{
				if (bAllowTriggerEvent == false)
					return;
				bAllowTriggerEvent = false;
				if (bDeepObserve == false || xObserveDeep === 0)
					return;
				if (Object.prototype.toString.call(xDealedSet) != '[object Set]')
					xDealedSet = new Set();
				xDealedSet.add(oProxy);
				for (let xKey in xRealObj)
				{
					if (typeof(xRealObj) == 'object' && typeof(xRealObj[xKey]['disableEvents']) == 'function' && xDealedSet.has(xRealObj[xKey]) == false)
						xRealObj[xKey]['disableEvents'](xDealedSet);
				}
			},
			enableEvents:function(xDealedSet)
			{
				if (bAllowTriggerEvent == true)
					return;
				bAllowTriggerEvent = true;
				if (bDeepObserve == false || xObserveDeep === 0)
					return;
				if (Object.prototype.toString.call(xDealedSet) != '[object Set]')
					xDealedSet = new Set();
				xDealedSet.add(oProxy);
				for (let xKey in xRealObj)
				{
					if (typeof(xRealObj) == 'object' && typeof(xRealObj[xKey]['enableEvents']) == 'function' && xDealedSet.has(xRealObj[xKey]) == false)
						xRealObj[xKey]['enableEvents'](xDealedSet);
				}
			},
			addEventListener:function(funcEvent,xEventType = 'allchange',bListenPopup = false,...axListenKeys)
			{
				if (Object.prototype.toString.call(xEventType) != '[object Array]')
					xEventType = [xEventType];
				let setCTypes = new Set();
				for (let strCType of xEventType)
				{
					if (['add','modify','del','set','allchange'].includes(strCType) == false)
					{
						console.warn('unknow event type:' + strCType);
						return;
					}
					if (strCType == 'allchange')
					{
						setCTypes.add('add');
						setCTypes.add('modify');
						setCTypes.add('del');
					}
					else
						setCTypes.add(strCType);
				}
				if (typeof(bListenPopup) != 'boolean')
				{
					console.warn('conf of listenPopup is not a boolean value');
					return;
				}
				//构建函数信息对象
				let oFuncPathObj;
				if (typeof(funcEvent) == 'function')
					oFuncPathObj = {preRelative:[],func:funcEvent,listenType:{}};
				else if (Object.prototype.toString.call(funcEvent) == '[object Object]')
				{
					if (Object.prototype.toString.call(funcEvent['preRelative']) != '[object Array]' || typeof(funcEvent['func']) != 'function')
						return;
					oFuncPathObj = {preRelative:[...funcEvent['preRelative']],func:funcEvent['func'],listenType:{}};
				}
				else
				{
					console.warn('wrong event function');
					return;
				}
				for (let strCType of setCTypes)
					oFuncPathObj['listenType'][strCType] = bListenPopup;
				//预处理监听路径
				let aoListenKeys = funcParsePath(axListenKeys);
				if (aoListenKeys === false)
					return;
				//注册事件
				let bSetSubLayout = bDeepObserve == true && (xObserveDeep === undefined || xObserveDeep > 0);
				let funcSubSet = function(axScanKeys,axSubPath)
				{
					for (let xSubKey of axScanKeys) //对下层已存在的处理
					{
						if (typeof(xSubKey) == 'string' && xSubKey == parseFloat(xSubKey))
							xSubKey = parseFloat(xSubKey);
						let xCurValue = xRealObj[xSubKey];
						if (['[object Object]','[object Array]'].includes(Object.prototype.toString.call(xCurValue)) == false || typeof(xCurValue['addEventListener']) != 'function')
							continue;
						if (axSubPath.length == 0 && oFuncPathObj['dealedSet'].has(xCurValue))//只有所有层绑定监听的情况下需要处理循环引用问题
							continue;
						let oNewFuncInfo = {preRelative:[...oFuncPathObj['preRelative'],xSubKey],func:oFuncPathObj['func'],dealedSet:oFuncPathObj['dealedSet']};
						xCurValue.addEventListener(oNewFuncInfo,xEventType,bListenPopup,axSubPath);
					}
				};
				for (let axPath of aoListenKeys)
				{
					if (axPath.length == 1) //只监听当前
						funcRegistEvent(mapCurCallback,axPath[0],oFuncPathObj);
					else if (axPath.length == 0) //监听当前及下层所有
					{
						funcRegistEvent(mapCurCallback,null,oFuncPathObj);
						if (bSetSubLayout)
						{
							if (oFuncPathObj['dealedSet'] == undefined)
							{
								if (typeof(funcEvent) != 'function' && Object.prototype.toString.call(funcEvent['dealedSet']) == '[object Set]')
									oFuncPathObj['dealedSet'] = funcEvent['dealedSet'];
								else
									oFuncPathObj['dealedSet'] = new Set();
							}
							oFuncPathObj['dealedSet'].add(oProxy);
							funcRegistEvent(mapSubCallback,null,Object.assign({listenKeys:[]},oFuncPathObj));
							funcSubSet(Object.keys(xRealObj),[]);//对下层已存在的处理
						}
					}
					else if (bSetSubLayout)
					{
						let axSubPath = [...axPath];
						let xCurKey = axSubPath.shift();
						let axScanKeys = (xCurKey == null ? [...Object.keys(xRealObj)] : [xCurKey]);
						funcSubSet(axScanKeys,axSubPath);//对下层已存在的处理
						funcRegistEvent(mapSubCallback,xCurKey,Object.assign({listenKeys:axSubPath},oFuncPathObj));
					}
				}
			},
			removeEventListener:function(funcEvent,xEventType = 'allchange',...axListenKeys)
			{
				if (Object.prototype.toString.call(xEventType) != '[object Array]')
					xEventType = [xEventType];
				let setCTypes = new Set();
				for (let strCType of xEventType)
				{
					if (['add','modify','del','set','allchange'].includes(strCType) == false)
					{
						console.warn('unknow event type:' + strCType);
						return;
					}
					if (strCType == 'allchange')
					{
						setCTypes.add('add');
						setCTypes.add('modify');
						setCTypes.add('del');
					}
					else
						setCTypes.add(strCType);
				}
				let oFuncObj;
				if (funcEvent === undefined || typeof(funcEvent) == 'function')
					oFuncObj = {func:funcEvent};
				else if (Object.prototype.toString.call(funcEvent) == '[object Object]')
					oFuncObj = funcEvent;
				else
				{
					console.warn('wrong event function');
					return;
				}
				//预处理路径信息
				let aoListenKeys = funcParsePath(axListenKeys);
				if (aoListenKeys === false)
					return;
				//删除事件注册
				let bSetSubLayout = bDeepObserve == true && (xObserveDeep === undefined || xObserveDeep > 0);
				let funcSubDel = function(axScanKeys,axSubPath)
				{
					for (let xSubKey of axScanKeys) //对下层已存在的处理
					{
						if (typeof(xSubKey) == 'string' && xSubKey == parseFloat(xSubKey))
							xSubKey = parseFloat(xSubKey);
						let xCurValue = xRealObj[xSubKey];
						if (['[object Object]','[object Array]'].includes(Object.prototype.toString.call(xCurValue)) == false || typeof(xCurValue['removeEventListener']) != 'function')
							continue;
						if (axSubPath.length == 0 && oFuncObj['dealedSet'].has(xCurValue))//只有全部层撤销监听的情况下需要处理循环引用问题
							continue;
						xCurValue.removeEventListener(oFuncObj,xEventType,axSubPath);
					}
				};
				for (let axPath of aoListenKeys)
				{
					if (axPath.length == 1) //只取消当前层的监听
						funcUnregistEvent(mapCurCallback,axPath[0],oFuncObj['func'],setCTypes);
					else if (axPath.length == 0) //取消当前及下层所有
					{
						funcUnregistEvent(mapCurCallback,null,oFuncObj['func'],setCTypes);
						funcUnregistEvent(mapSubCallback,null,oFuncObj['func'],setCTypes,[]);
						if (bSetSubLayout)
						{
							if (Object.prototype.toString.call(oFuncObj['dealedSet']) != '[object Set]')
								oFuncObj['dealedSet'] = new Set();
							oFuncObj['dealedSet'].add(oProxy);
							funcSubDel(Object.keys(xRealObj),[]);//对下层已存在的处理
						}
					}
					else if (bSetSubLayout)
					{
						let axSubPath = [...axPath];
						let xCurKey = axSubPath.shift();
						let axScanKeys = (xCurKey == null ? [...Object.keys(xRealObj)] : [xCurKey]);
						funcSubDel(axScanKeys,axSubPath);//对下层已存在的处理
						funcUnregistEvent(mapSubCallback,xCurKey,funcEvent,setCTypes,axSubPath);
					}
				}
			},
			addValueValid:function(funcValid,...axValidKeys)
			{
				//构建函数信息对象
				let oFuncPathObj;
				if (typeof(funcValid) == 'function')
					oFuncPathObj = {preRelative:[],func:funcValid,listenType:{valid:null}};
				else if (Object.prototype.toString.call(funcValid) == '[object Object]')
				{
					if (Object.prototype.toString.call(funcValid['preRelative']) != '[object Array]' || typeof(funcValid['func']) != 'function')
						return;
					oFuncPathObj = {preRelative:[...funcValid['preRelative']],func:funcValid['func'],listenType:{valid:null}};
				}
				else
				{
					console.warn('wrong event function');
					return;
				}
				//预处理监听路径
				let aoValidKeys = funcParsePath(axValidKeys);
				if (aoValidKeys === false)
					return;
				//注册验证函数
				let bSetSubLayout = bDeepObserve == true && (xObserveDeep === undefined || xObserveDeep > 0);
				let funcSubSet = function(axScanKeys,axSubPath)
				{
					for (let xSubKey of axScanKeys) //对下层已存在的处理
					{
						if (typeof(xSubKey) == 'string' && xSubKey == parseFloat(xSubKey))
							xSubKey = parseFloat(xSubKey);
						let xCurValue = xRealObj[xSubKey];
						if (['[object Object]','[object Array]'].includes(Object.prototype.toString.call(xCurValue)) == false || typeof(xCurValue['addValueValid']) != 'function')
							continue;
						if (axSubPath.length == 0 && oFuncPathObj['dealedSet'].has(xCurValue))//只有所有层绑定监听的情况下需要处理循环引用问题
							continue;
						let oNewFuncInfo = {preRelative:[...oFuncPathObj['preRelative'],xSubKey],func:oFuncPathObj['func'],dealedSet:oFuncPathObj['dealedSet']};
						xCurValue.addValueValid(oNewFuncInfo,axSubPath);
					}
				};
				for (let axPath of aoValidKeys)
				{
					if (axPath.length == 1) //只监听当前
						funcRegistEvent(mapCurCallback,axPath[0],oFuncPathObj);
					else if (axPath.length == 0) //监听当前及下层所有
					{
						funcRegistEvent(mapCurCallback,null,oFuncPathObj);
						if (bSetSubLayout)
						{
							if (oFuncPathObj['dealedSet'] == undefined)
							{
								if (typeof(funcValid) != 'function' && Object.prototype.toString.call(funcValid['dealedSet']) == '[object Set]')
									oFuncPathObj['dealedSet'] = funcValid['dealedSet'];
								else
									oFuncPathObj['dealedSet'] = new Set();
							}
							oFuncPathObj['dealedSet'].add(oProxy);
							funcRegistEvent(mapSubCallback,null,Object.assign({listenKeys:[]},oFuncPathObj));
							funcSubSet(Object.keys(xRealObj),[]);//对下层已存在的处理
						}
					}
					else if (bSetSubLayout)
					{
						let axSubPath = [...axPath];
						let xCurKey = axSubPath.shift();
						let axScanKeys = (xCurKey == null ? [...Object.keys(xRealObj)] : [xCurKey]);
						funcSubSet(axScanKeys,axSubPath);//对下层已存在的处理
						funcRegistEvent(mapSubCallback,xCurKey,Object.assign({listenKeys:axSubPath},oFuncPathObj));
					}
				}
			},
			removeValueValid:function(funcValid = undefined,...axValidKeys)
			{
				let oFuncObj;
				if (funcValid === undefined || typeof(funcValid) == 'function')
					oFuncObj = {func:funcValid};
				else if (Object.prototype.toString.call(funcValid) == '[object Object]')
					oFuncObj = funcValid;
				else
				{
					console.warn('wrong event function');
					return;
				}
				//预处理路径信息
				let aoValidKeys = funcParsePath(axValidKeys);
				if (aoValidKeys === false)
					return;
				//删除验证函数的注册
				let bSetSubLayout = bDeepObserve == true && (xObserveDeep === undefined || xObserveDeep > 0);
				let funcSubDel = function(axScanKeys,axSubPath)
				{
					for (let xSubKey of axScanKeys) //对下层已存在的处理
					{
						if (typeof(xSubKey) == 'string' && xSubKey == parseFloat(xSubKey))
							xSubKey = parseFloat(xSubKey);
						let xCurValue = xRealObj[xSubKey];
						if (['[object Object]','[object Array]'].includes(Object.prototype.toString.call(xCurValue)) == false || typeof(xCurValue['removeValueValid']) != 'function')
							continue;
						if (axSubPath.length == 0 && oFuncObj['dealedSet'].has(xCurValue))//只有全部层撤销监听的情况下需要处理循环引用问题
							continue;
						xCurValue.removeValueValid(oFuncObj,axSubPath);
					}
				};
				for (let axPath of aoValidKeys)
				{
					if (axPath.length == 1) //只取消当前层的监听
						funcUnregistEvent(mapCurCallback,axPath[0],funcValid,['valid']);
					else if (axPath.length == 0) //取消当前及下层所有
					{
						funcUnregistEvent(mapCurCallback,null,funcValid,['valid']);
						funcUnregistEvent(mapSubCallback,null,funcValid,['valid'],[]);
						if (bSetSubLayout)
						{
							if (Object.prototype.toString.call(oFuncObj['dealedSet']) != '[object Set]')
								oFuncObj['dealedSet'] = new Set();
							oFuncObj['dealedSet'].add(oProxy);
							funcSubDel(Object.keys(xRealObj),[]);//对下层已存在的处理
						}
					}
					else if (bSetSubLayout)
					{
						let axSubPath = [...axPath];
						let xCurKey = axSubPath.shift();
						let axScanKeys = (xCurKey == null ? [...Object.keys(xRealObj)] : [xCurKey]);
						funcSubDel(axScanKeys,axSubPath);
						funcUnregistEvent(mapSubCallback,xCurKey,funcValid,['valid'],axSubPath);
					}
				}
			}
		};
		if (strObjType == '[object Array]')
		{
			mapReplaceFunc['copyWithin'] = (...axArgs) => funcArrayCommonChange.apply(null,['copyWithin',...axArgs]);
			mapReplaceFunc['fill'] = (...axArgs) => funcArrayCommonChange.apply(null,['fill',...axArgs]);
			mapReplaceFunc['pop'] = function()
			{
				let xPopIndex = xRealObj.length - 1;
				if (xPopIndex < 0 || funcValidSpKey(xPopIndex,xRealObj[xPopIndex],'del') == false)
					return;
				let xNode = xRealObj.pop();
				funcTriggerChangeEvent({key:xPopIndex,ctype:'del'});
				return xNode;
			};
			mapReplaceFunc['push'] = function(...axArgs)
			{
				let nStartIndex = xRealObj.length;
				let aoAIndexes = [];
				for (let nScan = 0;nScan < axArgs.length;++nScan)
				{
					let xValue = axArgs[nScan];
					let xValidResult = funcValidSpKey(nStartIndex + nScan,xValue,'add');
					if (xValidResult === false)
						return; //一处验证不过则整个操作取消
					if (typeof(xValidResult) == 'object')
						axArgs[nScan] = xValidResult[1];
					aoAIndexes.push({key:nStartIndex + nScan,ctype:'add'});
				}
				let nReturn = xRealObj.push.apply(xRealObj,axArgs);
				if (bDeepObserve == true && (xObserveDeep === undefined || xObserveDeep > 1) && xObjToObserve == undefined) //设置了深度监听下，需要处理新设置值（及其下层）的依赖映射
					xObjToObserve = new Map();
				for (let nScan = 0;nScan < axArgs.length;++nScan)
					funcSetValue(nScan + nStartIndex,axArgs[nScan],xRealObj);
				xObjToObserve = undefined;
				funcTriggerChangeEvent(aoAIndexes);
				return nReturn;
			};
			mapReplaceFunc['reverse'] = () => funcArrayCommonChange.apply(null,['reverse']);
			mapReplaceFunc['shift'] = function()
			{
				if (xRealObj.length <= 0)
					return;
				if (funcValidSpKey(0,xRealObj[0],'del') == false)
					return;
				let xNode = xRealObj.shift();
				funcTriggerChangeEvent({key:0,ctype:'del'});
				return xNode;
			};
			mapReplaceFunc['sort'] = (...axArgs) => funcArrayCommonChange.apply(null,['sort',...axArgs]);
			mapReplaceFunc['splice'] = (...axArgs) => funcArrayCommonChange.apply(null,['splice',...axArgs]);
			mapReplaceFunc['unshift'] = (...axArgs) => funcArrayCommonChange.apply(null,['unshift',...axArgs]);
			xRealObj = [...xTarget];//复制原数组
		}
		else
			xRealObj = Object.assign({},xTarget);
		//代理绑定
		oProxy = new Proxy(xRealObj,
		{
			get:function(xReal,xKey)
			{
				if (xKey == '##in_observe##') //特殊
					return true;
				if (mapReplaceFunc[xKey] != undefined)
					return mapReplaceFunc[xKey];
				return xReal[xKey];
			},
			set:function(xReal,xKey,xValue) //防止在严格模式下抛类型异常，本函数无论设置是否成功都返回true
			{
				if (mapReplaceFunc[xKey] != undefined)
					return true;//禁止覆写内置方法
				let bAdd = false;
				if (xReal.hasOwnProperty(xKey) == false)
					bAdd = true;
				else if ((bCheckModifyByRef == true && xReal[xKey] === xValue) ||
						 (bCheckModifyByRef == false && CCommon.ObjContentChanged(xReal[xKey],xValue) == false))
				{
					funcTriggerChangeEvent({key:xKey,ctype:'set'});
					return true;//值没有变化
				}
				if (typeof(xKey) == 'string' && xKey == parseFloat(xKey))
					xKey = parseFloat(xKey);
				let xValidResult = funcValidSpKey(xKey,xValue,(bAdd ? 'add' : 'modify'));
				if (xValidResult === false)
					return true;//修改验证不通过
				if (typeof(xValidResult) == 'object')
					xValue = xValidResult[1];
				if (bDeepObserve == true && (xObserveDeep === undefined || xObserveDeep > 2) && xObjToObserve == undefined) //设置了深度监听且剩余监听深度在两层（该值包含当前层）以上时，需要处理新设置值（及其下层）的依赖映射
					xObjToObserve = new Map();
				//再次验证值是否有改动
				if ((bCheckModifyByRef == true && xReal[xKey] === xValue) ||
					 (bCheckModifyByRef == false && CCommon.ObjContentChanged(xReal[xKey],xValue) == false))
				{
					funcTriggerChangeEvent({key:xKey,ctype:'set'});
					return true;//值没有变化
				}
				//设置值并触发变更事件
				funcSetValue(xKey,xValue);
				xObjToObserve = undefined;
				if (bAdd)
					funcTriggerChangeEvent({key:xKey,ctype:'add'});
				else
					funcTriggerChangeEvent({key:xKey,ctype:'modify'});
				return true;
			},
			deleteProperty:function(xReal,xKey)
			{
				if (mapReplaceFunc[xKey] != undefined)
					return false;//禁止删除内置方法
				if (xReal.hasOwnProperty(xKey) == false)
					return true;
				if (typeof(xKey) == 'string' && xKey == parseFloat(xKey))
					xKey = parseFloat(xKey);
				if (funcValidSpKey(xKey,undefined,'del') === false)
					return false;//删除验证不通过
				delete xReal[xKey];
				funcTriggerChangeEvent({key:xKey,ctype:'del'});
				return true;
			},
			defineProperty:function(xReal,xProerty,oDescriptor)
			{
				if (mapReplaceFunc[xProerty] != undefined)
					return false;//禁止调整内置方法
				for (let strKey in oDescriptor)
				{
					if (typeof(oDescriptor[strKey]) == 'function')
					{
						let funcOld = oDescriptor[strKey];
						oDescriptor[strKey] = (...axArgs) => funcOld.apply(oProxy,axArgs);
					}
					else
						oDescriptor[strKey] = oDescriptor[strKey];
				}
				oDescriptor['configurable'] = true; //必须为可配置，疑似本函数return后外部的defineProperty才开始验证参数配置，所以这里设置为不可配置的话，后继验证会报错
				if (xReal.hasOwnProperty(xProerty))
				{
					let poPropertyDef = Object.getOwnPropertyDescriptor(xReal,xProerty);
					if (oDescriptor.hasOwnProperty('enumerable') == false)
						oDescriptor['enumerable'] = poPropertyDef['enumerable'];
				}
				else
				{
					if (oDescriptor.hasOwnProperty('enumerable') == false)
						oDescriptor['enumerable'] = false;
				}
				if (oDescriptor.hasOwnProperty('value'))
				{
					if (oDescriptor.hasOwnProperty('writable') == false)
						oDescriptor['writable'] = false;
				}
				return Reflect.defineProperty(xReal,xProerty,oDescriptor);
			}
		});
		//根据数据生成内置数组/对象
		if (bDeepObserve == true && (xObserveDeep === undefined || xObserveDeep > 0)) //针对深度监听来初始化下层
		{
			if (xObjToObserve == undefined)
				xObjToObserve = new Map();
			if (xObjToObserve.has(xTarget) == false)
				xObjToObserve.set(xTarget,oProxy);
			for (let xSubKey in xRealObj)
				funcSetValue(xSubKey,xRealObj[xSubKey]);
			xObjToObserve = undefined;
		}
		return oProxy;
	}

	/**
	 * 计算字符串在页面占用宽度
	 * @param require string strStr,要计算显示宽度的字符串
	 * @param optional object amapExtStyle,计算时要额外考虑的显示样式，使用key-value形式提供
	 * @param optional object astrClass,额外添加的class控制，要添加多个时以数组形式给出，否则直接给出字符串
	 * @return {'width':占据宽度,
	 *          'height':占据高度}
	 */
	this.GetStringWidthHeight = function(strStr,amapExtStyle = {},astrClass = undefined)
	{
		if (m_oHideCal == undefined)
		{
			$('body').append('<span id="hide_test_text_width"></span>');
			m_oHideCal = $('#hide_test_text_width');
		}
		m_oHideCal.removeAttr('style').removeAttr('class');
		for (var strStyleKey in amapExtStyle)
			m_oHideCal.css(strStyleKey,amapExtStyle[strStyleKey]);
		if (astrClass == undefined)
			astrClass = [];
		if (typeof(astrClass) == 'string')
			astrClass = [astrClass];
		else if (typeof(astrClass) != 'object' || astrClass.length === undefined)
			astrClass = [];
		for (var nLoop = astrClass.length - 1;nLoop >= 0;nLoop--)
		{
			if (astrClass[nLoop] == '')
				continue;
			m_oHideCal.addClass(astrClass[nLoop]);
		}
		m_oHideCal.css('visibility','hidden').css('white-space','nowrap');
		m_oHideCal.text(strStr);
		return {'width':m_oHideCal.width(),'height':m_oHideCal.height()};
	};
	
	/**
	 * 转义文本为html显示安全的文本
	 * @param require string strTarget,要转义字符串
	 * @param optional bool bParseEnter = true,是否把换行转成html标签，默认[是]
	 * @return string,返回转义后的字符串
	 */
	this.HtmlEncode = function(strTarget,bParseEnter = true)
	{
		if (typeof(strTarget) != 'string')
			return "";
		strTarget = strTarget.replace(/&/g,"&amp;");
		strTarget = strTarget.replace(/</g,"&lt;");
		strTarget = strTarget.replace(/>/g,"&gt;");
		strTarget = strTarget.replace(/"/g,"&quot;");
		strTarget = strTarget.replace(/'/g,"&apos;");
		strTarget = strTarget.replace(/ /g,"&nbsp;");
		strTarget = strTarget.replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;");
		if (bParseEnter == undefined || bParseEnter == true)
			strTarget = strTarget.replace(/\n/g,"<br/>");
		return strTarget;
	}
	
	/**
	 * 从html文本中获取删除html内容后的纯文本
	 * @param require string strTarget,带html标签的字符串
	 * @return string,返回去除html标签后的纯文本
	 */
	this.HtmlText = function(strTarget)
	{
		if (typeof(strTarget) != 'string')
			return "";
		let astrHeadDiv = strTarget.split('<');
		let strRet = astrHeadDiv[0];
		for (let strScan of astrHeadDiv)
		{
			let astrTail = strScan.split('>');
			if (astrTail.length != 2)
				continue;
			strRet += astrTail[1];
		}
		return strRet;
	}

	/**
	 * 复制对象及其子层的函数(浅复制，new一类的无法使用本函数复制)
	 * @param require any poToCopy,要复制的对象（即使是字符串一类也可以复制，但没意义）
	 * @return any,返回与poToCopy的同类型对象
	 */
	this.ObjCopy = function(poToCopy)
	{
		let funcInnerCopyObj = function(xTarget)
		{
			let xNew;
			let strType = Object.prototype.toString.call(xTarget);
			if (strType == '[object Object]')
			{
				xNew = {};
				for (let xKey in xTarget)
					xNew[xKey] = funcInnerCopyObj(xTarget[xKey]);
			}
			else if (strType == '[object Array]')
			{
				xNew = [];
				for (let nScan = 0;nScan < xTarget.length;++nScan)
					xNew.push(funcInnerCopyObj(xTarget[nScan]));
			}
			else
				xNew = xTarget;
			return xNew;
		}
		return funcInnerCopyObj(poToCopy);
	}
	
	/**
	 * 比较两对象内容上是否相同（数组比较时不考虑数组内出现顺序），如出现一个对象被多处引用的情况，将会直接视为有变动
	 * @param require any xCmp1,
	 * @param require any xCmp2,
	 * @param optional bool bTypeEqual = false,是否要求类型严格一致
	 * @param optional bool bCheckArraySerial = false,是否检查数组内出现次序
	 * @return bool,内容有变化返回true，否则返回false
	 */
	this.ObjContentChanged = function(xCmp1,xCmp2,bTypeEqual = false,bCheckArraySerial = false)
	{
		let setHasScan = new Set();
		let funcRecursionCmp = function(xCmp1,xCmp2)
		{
			if (typeof(xCmp1) != 'object' && typeof(xCmp2) != 'object') //针对非复杂类型比较
				return (bTypeEqual == false ? xCmp1 != xCmp2 : xCmp1 !== xCmp2);
			else if (typeof(xCmp1) == 'object' && typeof(xCmp2) == 'object') //同为复杂类型的比较
			{
				if (xCmp1 == xCmp2) //排除引用关系
					return false;
				if (setHasScan.has(xCmp1) && setHasScan.has(xCmp2))
					return true;//两边的对象都曾经比较过，为避免陷入无限循环，直接忽略并视为整个内容有变动
				setHasScan.add(xCmp1);
				setHasScan.add(xCmp2);
				let strType1 = Object.prototype.toString.call(xCmp1);
				if (strType1 != Object.prototype.toString.call(xCmp2))
					return true;
				if (strType1 == '[object Object]')
				{
					if (Object.keys(xCmp1).length != Object.keys(xCmp2).length)
						return true;
					for (let [xKey,xValue] of Object.entries(xCmp1))
					{
						if (xCmp2.hasOwnProperty(xKey) == false)
							return true;
						if (funcRecursionCmp(xValue,xCmp2[xKey]) == true)
							return true;
					}
				}
				else if (strType1 == '[object Array]')
				{
					if (xCmp1.length != xCmp2.length)
						return true;
					let axTmp = [...xCmp2];
					for (let nIndex1 = 0;nIndex1 < xCmp1.length;++nIndex1)
					{
						let xValue1 = xCmp1[nIndex1];
						let bExist = false;
						if (bCheckArraySerial == false)
						{
							for (let nIndex2 in axTmp)
							{
								if (funcRecursionCmp(xValue1,axTmp[nIndex2]) == false)
								{
									bExist = true;
									axTmp.splice(nIndex2,1);
									break;
								}
							}
						}
						else
							bExist = !funcRecursionCmp(xValue1,axTmp[nIndex1]);
						if (bExist == false)
							return true;
					}
				}
				else if (strType1 == '[object Set]')
				{
					if (xCmp1.size != xCmp2.size)
						return true;
					for (let xKey of xCmp1)
					{
						if (xCmp2.has(xKey) == false)
							return true;
					}
				}
				else if (strType1 == '[object Map]')
				{
					if (xCmp1.size != xCmp2.size)
						return true;
					for (let xKey of xCmp1)
					{
						if (xCmp2.has(xKey) == false || funcRecursionCmp(xCmp1.get(xKey),xCmp2.get(xKey)) == true)
							return true;
					}
				}
				else if (strType1 == '[object RegExp]')
				{
					if (xCmp1.toString() != xCmp2.toString())
						return true;
				}
				else
					return true;
			}
			else
				return true;
			return false;
		};
		return funcRecursionCmp(xCmp1,xCmp2);
	}
	
	/**
	 * 设置cookies
	 * @param require string strName,
	 * @param require string strValue,
	 * @param optional int nExpireDays = 30,过期天数
	 */
	this.SetCookie = function(strName, strValue, nExpireDays)
	{
		if (nExpireDays == undefined)
			nExpireDays = 30;
		var oDate = new Date();
		oDate.setTime(oDate.getTime() + nExpireDays * 24 * 3600 * 1000);
		document.cookie = escape(strName) + "=" + escape(strValue) + ";expires=" + oDate.toGMTString();
	}
	
	/**
	 * 得到cookies
	 * @param require string strName
	 * @return string,查询成功返回值，否则返回空字符串
	 */
	this.GetCookie = function(strName)
	{
		if (document.cookie.length > 0)
		{
			strName = escape(strName);
			var nStart = document.cookie.indexOf(strName + "=");
			if (nStart != -1)
			{
				nStart = nStart + strName.length + 1;
				var nEnd = document.cookie.indexOf(";", nStart);
				if (nEnd == -1)
					nEnd = document.cookie.length;
				return unescape(document.cookie.substring(nStart, nEnd));
			}
		}
		return "";
	}
	
	let m_mapSendBuf = {};//AjaxQuery专用，用于合并请求 key-strUrl+'\t'+strMethod.toUpperCase() value-[{param:mapData,succCallback:[],failedCallback:[]}]
	/**
	 * 发起ajax请求，并处理返回结果(对502错误会做重试处理)
	 * @param require string strUrl,请求的地址
	 * @param require string strMethod = 'POST',请求方式
	 * @param optional map mapData = {},传递的参数，GET也可以用，此时将把参数连接到strUrl上，并完成参数转义
	 * @param optional function funcSuccCallback = undefined,执行成功时的回调，这里“执行成功”的定义是被请求方返回了可解析的json数据，且该数据中success字段值为1/true
	 *                                           传入给回调函数的参数：poJson,返回的完整json数据
	 * @param optional function funcFailedCallback = undefined,执行失败时的回调，包括网络异常一类的失败或json解析的失败
	 *                                           传入给回调函数的参数：poJson,返回的完整json数据，其中success=0,error=错误描述信息
	 * @param optional bool strFullMaskHtml = '',设置非空字符串时将在请求过程中加上全页面蒙层，并在蒙层上显示所设置内容
	 * @param optional int nRetry50x = 5,在遇到50x类错误时重试的最大重试次数
	 * @param optional bool bAllowMergeQuery = false,是否允许当当前请求里出现完全一样的请求时，把两者合并为一个来处理
	 * @return void
	 */
	this.AjaxQuery = function(strUrl,strMethod = 'POST',mapData = {},funcSuccCallback = undefined,funcFailedCallback = undefined,strFullMaskHtml = '',nRetry50x = 5,bAllowMergeQuery = false)
	{
		strMethod = strMethod.toUpperCase();
		if (strMethod != 'POST')
		{
			let astrParams = [];
			for (let strKey in mapData)
			{
				let pxNode = mapData[strKey];
				if (typeof(pxNode) == 'object')
				{
					if (!(xTarget instanceof Array))
						continue;
					for (let nScan = 0;nScan < pxNode.length;++nScan)
						astrParams.push(strKey + '=' + encodeURIComponent(pxNode[nScan]));
				}
			}
			if (strUrl.indexOf('?') < 0)
				strUrl += '?';
			strUrl += astrParams.join('&');
		}
		if (strFullMaskHtml != '')
			CCommon.SetFullMask(strFullMaskHtml);
		let poBindNode;
		let strSendKey;
		let funcAjaxQuery = function()
		{
			$.ajax
			({
				url		:	strUrl,
				async	:	true,
				cache	:	false,
				type	:	strMethod,
				data	:	(strMethod == 'POST' ? mapData : undefined),
				success	:	function(oRsp)
				{
					var oRspJson
					try
					{
						oRspJson = JSON.parse(oRsp);
					}
					catch (eErr)
					{
						console.log(eErr.message);
						oRspJson = {success:0,error:"后台返回数据解析出错!"};
					}
					if (strFullMaskHtml != '')
						CCommon.HideFullMask();
					let afuncSucc = [];
					let afuncFailed = [];
					if (bAllowMergeQuery == true)
					{
						afuncSucc = poBindNode['succCallback'];
						afuncFailed = poBindNode['failedCallback'];
						for (let nScan = 0;nScan < m_mapSendBuf[strSendKey].length;++nScan)
						{
							if (m_mapSendBuf[strSendKey][nScan] == poBindNode)
							{
								if (m_mapSendBuf[strSendKey].length == 1)
									delete m_mapSendBuf[strSendKey];
								else
									m_mapSendBuf[strSendKey].splice(nScan,1);
								break;
							}
						}
					}
					else
					{
						afuncSucc.push(funcSuccCallback);
						afuncFailed.push(funcFailedCallback);
					}
					if (oRspJson.success)
					{
						for (let funcCallback of afuncSucc)
						{
							if (typeof(funcCallback) == 'function')
								funcCallback.call(this,oRspJson);
						}
					}
					else if (oRspJson.success == 0)
					{
						for (let funcCallback of afuncFailed)
						{
							if (typeof(funcCallback) == 'function')
								funcCallback.call(this,oRspJson);
						}
					}
				},
				error	:	function(oErr)
				{
					if ((oErr.status == 502 || oErr.status == 504) && nRetry50x > 0) //对502/504错误做重试
					{
						--nRetry50x;
						funcAjaxQuery();
						return;
					}
					if (strFullMaskHtml != '')
						CCommon.HideFullMask();
					let afuncFailed = [];
					if (bAllowMergeQuery == true)
					{
						afuncFailed = poBindNode['failedCallback'];
						for (let nScan = 0;nScan < m_mapSendBuf[strSendKey].length;++nScan)
						{
							if (m_mapSendBuf[strSendKey][nScan] == poBindNode)
							{
								if (m_mapSendBuf[strSendKey].length == 1)
									delete m_mapSendBuf[strSendKey];
								else
									m_mapSendBuf[strSendKey].splice(nScan,1);
								break;
							}
						}
					}
					else
						afuncFailed = funcFailedCallback;
					if (funcFailedCallback != undefined)
					{
						var oJson = {success:0,error:oErr.status + ":" + oErr.statusText};
						funcFailedCallback.call(this,oJson);
					}
				}
			});
		};
		let bQuery = true;
		if (bAllowMergeQuery == true)
		{
			strSendKey = strUrl + '\t' + strMethod + '\t';
			if (m_mapSendBuf[strSendKey] == undefined)
				m_mapSendBuf[strSendKey] = [];
			for (let poNode of m_mapSendBuf[strSendKey])
			{
				if (CCommon.ObjContentChanged(mapData,poNode['param']) == false)
				{
					poNode['succCallback'].push(funcSuccCallback);
					poNode['failedCallback'].push(funcFailedCallback);
					bQuery = false;
				}
			}
			if (bQuery == true)
			{
				poBindNode = {param:mapData,succCallback:[funcSuccCallback],failedCallback:[funcFailedCallback]};
				m_mapSendBuf[strSendKey].push(poBindNode);
			}
		}
		if (bQuery == true)
			funcAjaxQuery();
		else if (strFullMaskHtml != '')
			CCommon.HideFullMask();
	}
	
	/**
	 * AjaxQuery的promise版本,funcSuccCallback回调使用resolve代替，funcFailedCallback回调使用reject代替
	 * @param require string strUrl,请求的地址
	 * @param require string strMethod = 'POST',请求方式
	 * @param optional map mapData = {},传递的参数，GET也可以用，此时将把参数连接到strUrl上，并完成参数转义
	 * @param optional bool strFullMaskHtml = '',设置非空字符串时将在请求过程中加上全页面蒙层，并在蒙层上显示所设置内容
	 * @return void
	 */
	this.AjaxPromise = (strUrl,strMethod = 'POST',mapData = {},strFullMaskHtml = '') => new Promise(function(funcResolve,funcReject){
		nLeftRetry = 5;
		strMethod = strMethod.toUpperCase();
		if (strMethod != 'POST')
		{
			var astrParams = [];
			for (var strKey in mapData)
			{
				var pxNode = mapData[strKey];
				if (typeof(pxNode) == 'object')
				{
					if (!(xTarget instanceof Array))
						continue;
					for (var nScan = 0;nScan < pxNode.length;++nScan)
						astrParams.push(strKey + '=' + encodeURIComponent(pxNode[nScan]));
				}
			}
			if (strUrl.indexOf('?') < 0)
				strUrl += '?';
			strUrl += astrParams.join('&');
		}
		if (strFullMaskHtml != '')
			CCommon.SetFullMask(strFullMaskHtml);
		var funcAjaxQuery = function(){
			$.ajax
			({
				url		:	strUrl,
				async	:	true,
				cache	:	false,
				type	:	strMethod,
				data	:	(strMethod == 'POST' ? mapData : undefined),
				success	:	function(oRsp)
				{
					var oRspJson
					try
					{
						oRspJson = JSON.parse(oRsp);
					}
					catch (eErr)
					{
						console.log(eErr.message);
						oRspJson = {success:0,error:"后台返回数据解析出错!"};
					}
					if (strFullMaskHtml != '')
						CCommon.HideFullMask();
					if (oRspJson.success)
						funcResolve(oRspJson);
					else if (oRspJson.success == 0)
						funcReject(oRspJson);
				},
				error	:	function(oErr)
				{
					if (oErr.status == 502 && nLeftRetry > 0) //对502错误做重试
					{
						--nLeftRetry;
						funcAjaxQuery();
						return;
					}
					if (strFullMaskHtml != '')
						CCommon.HideFullMask();
					var oJson = {success:0,error:oErr.status + ":" + oErr.statusText};
					funcReject(oJson);
				}
			});
		};
		funcAjaxQuery();
	});
	
	let oStoreForWHApproximate = //GetStringWidthHeightApproximate专用的缓存结构
	{
		12:[
			0,9,9,9,9,9,9,9,9,0,
			0,0,0,0,9,9,9,9,9,9,
			9,9,9,9,9,9,9,9,9,9,
			9,9,3.564,3.75,5.23438,7.67188,7.04688,10.6875,10.4531,3.07813,
			4.01563,4.01563,5.46875,8.90625,2.89063,5.20313,2.89063,5.14063,7.04688,7.04688,
			7.04688,7.04688,7.04688,7.04688,7.04688,7.04688,7.04688,7.04688,2.89063,2.89063,
			8.90625,8.90625,8.90625,5.79688,12.375,8.45313,7.53125,8.03125,9.14063,6.60938,
			6.375,8.9375,9.28125,3.53125,4.76563,7.625,6.17188,11.7344,9.76563,9.78125,
			7.34375,9.78125,7.84375,6.9375,6.89063,8.96875,8.125,12.2188,7.75,7.25,
			7.45313,4.01563,5,4.01563,8.90625,5.39063,3.54688,6.64063,7.67188,6.03125,
			7.6875,6.8125,4.17188,7.6875,7.39063,3.20313,3.21875,6.54688,3.20313,11.25,
			7.40625,7.64063,7.67188,7.6875,4.59375,5.5625,4.48438,7.40625,6.3125,9.48438,
			6.35938,6.09375,5.90625,4.01563,3.23438,4.01563,8.90625,3.5625,9,9,
			9,9,9,9,9,9,9,9,9,9,
			9,9,9,9,9,9,9,9,9,9,
			9,9,9,9,9,9,9,9,9,9,
			3.5625,3.75,7.04688,7.04688,7.20313,7.04688,3.23438,5.85938,5.4375,11.5156,
			5.10938,6.67188,8.90625,0,11.5156,5.39063,4.90625,8.90625,4.8125,4.8125,
			3.6875,7.5625,6.01563,2.89063,2.67188,4.625,5.625,6.67188,11.8125,12.0625,
			11.8125,5.79688,8.45313,8.45313,8.45313,8.45313,8.45313,8.45313,11.2656,8.03125,
			6.60938,6.60938,6.60938,6.60938,3.53125,3.53125,3.53125,3.53125,9.14063,9.76563,
			9.78125,9.78125,9.78125,9.78125,9.78125,8.90625,9.78125,8.96875,8.96875,8.96875,
			8.96875,7.25,7.34375,7.17188,6.64063,6.64063,6.64063,6.64063,6.64063,6.64063,
			10.7813,6.03125,6.8125,6.8125,6.8125,6.8125,3.20313,3.20313,3.20313,3.20313,
			7.29688,7.40625,7.64063,7.64063,7.64063,7.64063,7.64063,8.90625,7.64063,7.40625,
			7.40625,7.40625,7.40625,6.35938,7.67188,6.35938
		]
	};
	/**
	 * 粗略计算字符串宽高度(比GetStringWidthHeight效率高，需要大量调用时建议使用本函数)
	 * @param require in strStr,要计算显示宽度的字符串
	 * @param optional in nCalType = 3,计算类型 1-仅宽度 2-仅高度 3-宽高
	 * @param optional in nFontSize = 12,字符尺寸，如传入12表示使用font-size=12px的字号
	 * @param optional in bIsBold = false,是否粗体
	 * @param optional in bSingleLine = true,是否视为单行数据（无视回车）
	 * @param optional in oLimit = {},上下限限制，对象内支持的项为 maxW-最大宽度的数值(基于px单位) minW-最小宽度的数值(基于px单位) maxH-最大高度的数值(基于px单位) minH-最小高度的数值(基于px单位) 结果会按照这些值调整，且最小值优先级高于最大值
	 * @return int/obj,nCalType!=3时，返回单值，nCalType=3时，返回{w:宽度值,h:高度值}
	 */
	this.GetStringWidthHeightApproximate = function(strStr,nCalType = 3,nFontSize = 12,bIsBold = false,bSingleLine = true,oLimit = {})
	{
		let astrLines;
		strStr = '' + strStr;
		if (bSingleLine == true)
			astrLines = [strStr];
		else
			astrLines = strStr.split('\n');
		//计算宽度
		let nWidth = 0;
		if ((nCalType & 1) > 0)
		{
			let nMaxWidth = parseFloat(oLimit['maxW']);
			if (oStoreForWHApproximate[nFontSize] == undefined)
				oStoreForWHApproximate[nFontSize] = [].fill(null,0,256);
			let anRef = oStoreForWHApproximate[nFontSize];
			for (let strLine of astrLines)
			{
				let nSubWidth = 0;
				for (let nScan = 0;nScan < strLine.length;++nScan)
				{
					let nCode = strLine[nScan].charCodeAt();
					if (nCode >= 256)
						nSubWidth += nFontSize;
					else
					{
						if (anRef[nCode] === null)
							anRef[nCode] = oStoreForWHApproximate[12][nCode] / 12 * nFontSize;
						nSubWidth += anRef[nCode];
					}
					if (isNaN(nMaxWidth) == false && nSubWidth > nMaxWidth)
					{
						nSubWidth = nMaxWidth;
						break;
					}
				}
				nWidth = Math.max(nWidth,nSubWidth);
				if (bIsBold == true && (isNaN(nMaxWidth) == true || (isNaN(nMaxWidth) == false && nWidth < nMaxWidth)))
				{
					nWidth += nWidth * 0.07;
					if (isNaN(nMaxWidth) == false && nWidth > nMaxWidth)
						nWidth = nMaxWidth;
				}
			}
			let nMinWidth = parseFloat(oLimit['minW']);
			if (isNaN(nMinWidth) == false && nWidth < nMinWidth)
				nWidth = nMinWidth;
		}
		//计算高度
		let nHeight = 0;
		if ((nCalType & 2) > 0)
		{
			nHeight = 16 / 12 * nFontSize * astrLines.length;
			let nMaxHeight = parseFloat(oLimit['manH']);
			if (isNaN(nMaxHeight) == false && nHeight > nMaxHeight)
				nHeight = nMaxHeight;
			let nMinHeight = parseFloat(oLimit['minH']);
			if (isNaN(nMinHeight) == false && nHeight < nMinHeight)
				nHeight = nMinHeight;
		}
		//返回结果
		if ((nCalType & 3) == 3)
			return {w:nWidth,h:nHeight};
		else if ((nCalType & 1) > 0)
			return nWidth;
		return nHeight;
	}
	
	/**
	 * 针对后端异步返回数据接口的调用操作封装，在请求完成前整个界面会处于屏蔽状态
	 * @param require uint uPid,关联项目id
	 * @param require string strAddr,初始请求地址，函数请求时会采用post请求
	 * @param optional obj poParam = undefined,post参数
	 * @param optional function funcSuccess = undefined,成功完成请求时调用的函数
	 *                                                  函数参数：xRsp-异步结果返回的数据，如果该数据为json格式，则传入时已是json对象
	 *                                                            strFullLog-完整日志内容
	 *                                                  返回值：无
	 * @param optional function funcFailed = undefined,请求返回失败时调用的函数(如果设置了显示窗口，则只有在窗口关闭时触发)
	 *                                                 函数参数：strErrDesc-错误描述
	 *                                                           strLastLog-最后收到的日志（包含错误）
	 *                                                           strFullLog-完整日志内容
	 *                                                 返回值：无
	 * @param optional string strWaitTitle = '',等待过程中显示的标题内容
	 * @param optional bool nShowLogMode = 1,等待过程中显示执行日志的方式，-1 - 不显示日志，仅显示设置的标题内容
	 *                                                                     0 - 仅在转圈过程中显示设置标题内容及收到的最后一条日志内容
	 *                                                                     1 - 【默认】显示日志输出窗口
	 *                                                                     2 - 不额外显示任何东西，用户可以继续操作
	 * @param optional bool bErrShowLog = true,当出错时是否把日志显示在独立窗口中（同时显示关闭按钮）（nShowLogMode=1时直接在原窗口显示，其他模式下新建显示窗口）
	 * @param optional function funcGap = undefined,请求间隔回调的函数
	 *												函数参数：无
	 *												返回值：无
	 */
	this.AnsyBackQuery = function(uPid,strAddr,poParam,funcSuccess,funcFailed,strWaitTitle = '',nShowLogMode = 1,bErrShowLog = true,funcGap)
	{
		var poThis = this;
		var oInfoWin = undefined;
		var strLastLog = '';
		var strFullLog = '';
		var strRecentRecvLog = '';//最后一次收到的有内容日志
		var strTmpStoreLog = '';
		var strExtTitle = ' ';
		var funcInnerSuccess = function(xRsp)
		{
			if (oInfoWin != undefined)
				oInfoWin['main'].window('close',true,true);
			else if (nShowLogMode !== 2)
				poThis.HideFullMask(true);
			if (typeof(funcSuccess) == 'function')
				funcSuccess(xRsp,strFullLog);
		};
		var funcInnerError = function(oErrJson)
		{
			if (nShowLogMode !== 2 && oInfoWin == undefined)
				poThis.HideFullMask(true);
			if (bErrShowLog != true)
			{
				if (oInfoWin)
					oInfoWin['main'].window('close',true,true);
			}
			else
			{
				if (oInfoWin == undefined)
				{
					//为显示错误而临时创建错误窗口
					oInfoWin['main'] = $('<div></div>').appendTo('body');
					oInfoWin['main'].window
					({
						width	:	600,
						height	:	400,
						modal	:	true
					});
					oInfoWin['textArea'] = $('<div style="overflow:auto;font-size:12px;margin:5px;margin-right:0px;"></div>').appendTo(oInfoWin['main']);
					oInfoWin['textArea'].scrollTop(oInfoWin['textArea'][0].scrollHeight);
				}
				oInfoWin['main'].window
				({
					closable:true,
					title	:strWaitTitle + '&nbsp;<font style="color:#fb4035">[执行出错]</font>',
					closeMode:'destroy',
					onClosed:function()
					{
						if (typeof(funcFailed) == 'function')
							funcFailed(oErrJson.error,strTmpStoreLog + strLastLog,strFullLog);
					}
				});
				$('<font style="color:red">[Error]' + oErrJson.error + '</font>').appendTo(oInfoWin['textArea']);
				oInfoWin['textArea'].scrollTop(oInfoWin['textArea'][0].scrollHeight);
				return;
			}
			if (typeof(funcFailed) == 'function')
				funcFailed(oErrJson.error,strTmpStoreLog + strLastLog,strFullLog);
			console.log(strLastLog);
		};
		if (nShowLogMode == 1)
		{
			oInfoWin = {main:$('<div style="display:flex;flex-direction:column;height:100%;"></div>').appendTo('body')};
			oInfoWin['main'].window
			({
				width	:	600,
				height	:	400,
				closable:	false,
				title	:	strWaitTitle + ' ',
				modal	:	true
			});
			oInfoWin['proc'] = $('<div style="display:none;flex-shrink:0;"></div>').appendTo(oInfoWin['main']);
			oInfoWin['textArea'] = $('<div style="flex-grow:1;overflow:auto;font-size:12px;margin:5px;margin-right:0px;"></div>').appendTo(oInfoWin['main']);
			oInfoWin['proc'].progressbar({value:0});
		}
		else if (nShowLogMode != 2)
			poThis.SetFullMask(strWaitTitle,true);
		//初次请求
		CCommon.AjaxQuery(strAddr,'POST',(poParam == undefined ? [] : poParam),function(oRspJsonFst)
		{
			//循环请求的准备
			var strKey = oRspJsonFst.key;
			var nReaded = 0;
			var funcAppendInfo = function(oRspJson)
			{
				if (oRspJson.proc != undefined && oInfoWin != undefined)
				{
					oInfoWin['proc'].show();
					oInfoWin['proc'].progressbar({value:oRspJson.proc});
				}
				if (oRspJson.info != undefined && oRspJson.info != '')
				{
					oRspJson.info = oRspJson.info.replace(/(\r\n|\n\r|\n|\r)/g,'<br/>');
					strFullLog += oRspJson.info;
					if (strLastLog.length > 6000)
					{
						strTmpStoreLog = strLastLog;
						strLastLog = strRecentRecvLog + oRspJson.info;
						if (oInfoWin)
							oInfoWin['textArea'].html('<font>' + strLastLog + '</font>');
					}
					else
					{
						strLastLog += oRspJson.info;
						if (oInfoWin)
							$('<font>' + oRspJson.info + '</font>').appendTo(oInfoWin['textArea']);
					}
					if (oRspJson.info != '')
						strRecentRecvLog = oRspJson.info;
					if (oInfoWin)
						oInfoWin['textArea'].scrollTop(oInfoWin['textArea'][0].scrollHeight);
					else if (typeof(m_oFullMaskTip) != "undefined" && nShowLogMode == 0)
					{
						var astrInfo = oRspJson.info.split('<br/>');
						var nCheckScan = astrInfo.length - 1;
						while (nCheckScan >= 0)
						{
							if (astrInfo[nCheckScan] == '')
							{
								--nCheckScan;
								continue;
							}
							if (strWaitTitle == '')
								m_oFullMaskTip.SetText(astrInfo[nCheckScan]);
							else
								m_oFullMaskTip.SetText(strWaitTitle + '<br/>' + astrInfo[nCheckScan]);
							break;
						}
					}
				}
			};
			var fInnerLoopFunc = function()
			{
				if (funcGap != undefined)
					funcGap();
				CCommon.AjaxQuery(poThis.GetUrlPre() + '/common/AnsyGetResult','POST',{pid:uPid,key:strKey,lastRead:nReaded},function(oRspJsonLoop)
				{
					funcAppendInfo(oRspJsonLoop);
					nReaded = oRspJsonLoop.readed;
					if (oRspJsonLoop.result != undefined)
						funcInnerSuccess(oRspJsonLoop.result);
					else
					{
						if (oInfoWin)
						{
							strExtTitle += '·';
							if (strExtTitle.length >= 8)
								strExtTitle = ' ·';
							oInfoWin['main'].window('setTitle',strWaitTitle + strExtTitle);
						}
						setTimeout(fInnerLoopFunc,500);//500毫秒刷新一次
					}
				},function(oRspErr)
				{
					funcAppendInfo(oRspErr);
					funcInnerError({error:oRspErr.error});
				});
			}
			if (oInfoWin)
				$('<font style="color:#1F45FC">[Info]向后端请求数据，等待返回中</font><br/>').appendTo(oInfoWin['textArea']);
			setTimeout(fInnerLoopFunc,250);//首次请求，使用250毫秒刷新，后面的请求都统一为500
		},function(oRspErr)
		{
			funcInnerError({error:oRspErr.error});
		});
	}
	
	/**
	 * 下载指定的文件
	 * @param require uint uPid,项目id,
	 * @param require uint uFileId,文件id,
	 * @param require string strQueryLoc,文件对应的版本信息
	 * @param optional string strDownloadFileName = '',下载文件的文件名，不指定时由服务器自行决定
	 * @return void,发起异步下载，弹出另存为窗口，失败时错误内容会直接以json格式写在下载的文件中
	 */
	this.DownloadFile = function(uPid,uFileId,strQueryLoc,strDownloadFileName)
	{
		var strDomNode = '<form action="' + this.GetUrlPre() + 'common/DownloadFile" method="post" target="_blank">';
		strDomNode += '<input type="hidden" name="pid" value="' + uPid + '"/>';
		strDomNode += '<input type="hidden" name="fileId" value="' + uFileId + '"/>';
		strDomNode += '<input type="hidden" name="verQuery"/>';
		if (strDownloadFileName != undefined && strDownloadFileName != '')
			strDomNode += '<input type="hidden" name="fileName"/>';
		strDomNode += '</form>';
		var domTmpForm = $(strDomNode).appendTo('body');
		domTmpForm.find('input[name="verQuery"]').val(strQueryLoc);
		domTmpForm.find('input[name="fileName"]').val(strDownloadFileName);
		domTmpForm.submit().remove();
	}
	
	/**
	 * 时间戳转日期
	 * @param require Date oDate = undefined,转换使用的时间对象，默认使用当前时间
	 * @return string,返回时间格式为 "4位年-2位月-2位日 2位时:2位分:2位秒"
	 */
	this.FormatDate = function(oDate = undefined)
	{
		if (oDate == undefined)
			oDate = new Date();
		return oDate.getFullYear() + "-" + (oDate.getMonth() +1 < 10 ? '0'+(oDate.getMonth() + 1) : oDate.getMonth() + 1) + "-" + oDate.getDate() + " " + oDate.getHours() + ":" + oDate.getMinutes() + ":" + oDate.getSeconds();
	}
	
	/**
	 * 文本差异比较并拼接
	 * @param require strTextA,比较文本A
	 * @param require strTextB,比较文本B
	 * @param optional funcRenderCallback = undefined,渲染回调，当遇到[增(相对B而言)]、[删(相对A而言)]、[改]的内容时会回调此函数以决定组拼的内容
	 *           function(strContent,strOpType)
	 *              param strContent,内容（与传入内容一致，如果用于html，要注意转义）
	 *              param strOpType,差异类型 'add'-新增/'modify'-修改/'delete'-删除/'equal'-相同
	 *              return string,返回内容将直接作为拼接内容使用
	 * @return string,返回已对差异拼接处理的字符串数组：[文本A的拼接串,文本B的拼接串]
	 */
	this.MarkDiff = function(strTextA,strTextB,funcRenderCallback = undefined)
	{
		var oCmpCollect = new difflib.SequenceMatcher(strTextA,strTextB);
		var aoOpCode = oCmpCollect.get_opcodes();
		var strResultTextA = '';
		var strResultTextB = '';
		for (nLoop = 0;nLoop < aoOpCode.length;++nLoop)
		{
			var oOpCode = aoOpCode[nLoop];
			if (oOpCode[0] == 'equal')
			{
				let strParse = strTextA.substring(oOpCode[1],oOpCode[2]);
				if (typeof(funcRenderCallback) == 'function')
					strParse = funcRenderCallback(strParse,'equal');
				strResultTextA += strParse;
				strResultTextB += strParse;
			}
			else if (oOpCode[0] == 'delete')
			{
				let strParse = strTextA.substring(oOpCode[1],oOpCode[2]);
				if (typeof(funcRenderCallback) == 'function')
					strParse = funcRenderCallback(strParse,'add');
				strResultTextA += strParse;
			}
			else if (oOpCode[0] == 'replace')
			{
				let strParse = strTextA.substring(oOpCode[1],oOpCode[2]);
				if (typeof(funcRenderCallback) == 'function')
					strParse = funcRenderCallback(strParse,'modify');
				strResultTextA += strParse;
				strParse = strTextB.substring(oOpCode[3],oOpCode[4]);
				if (typeof(funcRenderCallback) == 'function')
					strParse = funcRenderCallback(strParse,'modify');
				strResultTextB += strParse;
			}
			else
			{
				let strParse = strTextB.substring(oOpCode[3],oOpCode[4]);
				if (typeof(funcRenderCallback) == 'function')
					strParse = funcRenderCallback(strParse,'delete');
				strResultTextB += strParse;
			}
		}
		return [strResultTextA,strResultTextB];
	}
	
	/**
	 * 异步动态加载js文件（不限制AMD规范的js）
	 * @param require string strJsUrl,js文件路径，对应script的src属性
	 * @param optional function fCallback = undefined,加载完成后的回调函数，默认无处理
	 * @return void
	 */
	this.AnsyLoadJs = function(strJsUrl,fCallback)
	{
		var oScriptNode = document.createElement("script");
		oScriptNode.src = strJsUrl;
		oScriptNode.charset = "utf-8";
		oScriptNode.async = 'async';
		oScriptNode.onload = oScriptNode.onreadystatechange = function()
		{
			if (this.readyState != undefined && !(this.readyState == "loaded" || this.readyState == "complete"))
				return;
			if (fCallback != undefined)
				fCallback();
			$(oScriptNode).remove();
		}
		document.getElementsByTagName("head")[0].appendChild(oScriptNode);
	};
	
	/**
	 * 带加载失败重试的requirejs封装
	 * @param require [string] astrDep,依赖
	 * @param optional int nRetry = 3,失败重试次数
	 * @info 注1：then传入的参数会以数组包装的形式存入，此举是为了保证多参数传递也能有效
	 * @info 注2：requirejs原本的回调不支持async函数，使用本方法可以在then中使用
	 */
	this.PromiseJs = function(astrDep,nRetry = 3)
	{
		return new Promise(function(funcResolve,funcReject)
		{
			let funcTmp = (...axArgs) => funcResolve(axArgs);
			let funcRetry = function()
			{
				--nRetry;
				if (nRetry == 0)
				{
					funcReject();
					return;
				}
				window.setTimeout(() => require(astrDep,funcTmp,funcRetry),50);
			};
			require(astrDep,funcTmp,funcRetry);
		});
	}

	/**
	 * 创建用户帐号输入提示框
	 * @param require dom oTextbox,输入框input关联的textbox对象
	 * @param optional bool bInit = false,是否立即初始化，默认[否]
	 * @return void
	 */
	this.CreateUserSelTextbox = function(oTextbox,bInit)
	{
		var poThis = this;
		if (bInit == undefined)
			bInit = false;
		var funcWaitingLoad = function()
		{
			oTextbox.val('loading...');
			oTextbox.css('color', '#9E9E9E');
			oTextbox.attr('readonly', true);
			oTextbox.attr('disabled', true);//for IE
		};
		var funcClearWaiting = function(strShowValue)
		{
			oTextbox.val(strShowValue);
			oTextbox.attr('readonly', false);
			oTextbox.css('color', '#000000');
			oTextbox.attr('disabled', false);//for IE
			if (document.activeElement != oTextbox[0] || bInit == false)
			{
				bInit = true;
				oTextbox.focus();
			}
		};
		var funcInitChooser = function(strSetText) //strSetText - 要恢复的设置文本
		{
			var poData;
			poData = m_oUsers;
			if (oTextbox.attr('user_choose_has_init') == undefined)
			{
				setChooser(poData,oTextbox);
				oTextbox.attr('user_choose_has_init',true);
			}
			funcClearWaiting(strSetText);
		};
		oTextbox.focus(function()
		{
			var strCurText = oTextbox.val();
			var nLeftFin = 2;//初始化剩余等待，当到达0时初始化完成
			if (typeof(Actb) == 'undefined')
			{
				funcWaitingLoad();
				poThis.AnsyLoadJs('front/lib/userchooser.js',function()
				{
					if (--nLeftFin == 0)
						funcInitChooser(strCurText);
					else if (document.activeElement == oTextbox[0])
						oTextbox.blur();
				});
			}
			else
				--nLeftFin;
			if (m_oUsers == undefined)
			{
				funcWaitingLoad();
				poThis.AnsyLoadJs(CCommon.GetUrlPre() + '/common/LoadFullUser',function() /*http://top.oa.com/js/users.js*/
				{
					m_oUsers = window._arrusers;
					if (--nLeftFin == 0)
						funcInitChooser(strCurText);
					else if (document.activeElement == oTextbox[0])
						oTextbox.blur();
				});
			}
			else
				--nLeftFin;
			if (nLeftFin == 0)
				funcInitChooser(strCurText);
		});
		if (bInit != false)
		{
			oTextbox.focus();
			oTextbox.blur();
			oTextbox.focus();
		}
	}
}
	