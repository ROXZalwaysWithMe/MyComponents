const propsFilter = (props, tObj) => {
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


// usage
// propsFilter(props, typeLimits)
/**
 * eg
 * let props = {
 * 	name: 'abc',
 *  age: 18,
 *  children: [{name: 'c1', age: 1}, {name: 'c2', age: 2, invalidP:'2333'}],
 *  type: { hair: 'green' }
 * }
 * let typeLimits = {
 * 	name: 'String', // {type: 'String', default: ''} if not use default value, will got undefined
 * 	age: 'Number',
 * 	children: {type: 'Array', default: () => [] },
 * 	children__item: {name: 'String', age: 'Number'},
 * 	type: {type: 'Object', default: () => { return {} }},
 * 	type__item: { hair: 'String', eyes: { type: 'String', default: 'Black' } }
 * }
 * 
 *  let res = propsFilter(props, typeLimits)
 * 
 *  got res
 *  {
 * 		name: 'abc',
 * 		age: 18,
 * 		children: [{name: 'c1', age: 1}, {name: 'c2', age: 2}], // invalid value will not copy
 * 		type: { hair: 'green', eyes: 'Black' },
 * 	}
 */