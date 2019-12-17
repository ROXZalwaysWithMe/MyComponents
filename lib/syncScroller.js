// 滚动同步方法
const syncScroller = function () {
	let nodes = Array.prototype.filter.call(arguments, item => item instanceof HTMLElement)
	let max = nodes.length
	if (!max || max === 1) return
	let sign = 0;
	nodes.forEach((ele, index) => {
		ele.addEventListener('scroll', function () {
			if (!sign) {
				sign = nodes.length - 1;
				let top = this.scrollTop
				let left = this.scrollLeft
				for (node of nodes) {
					if (node == this) continue;
					node.scrollTo(left, top);
				}
			} else
			-- sign;
		});
	});
}
// usage
// syncScroller(node1, node2, node3)