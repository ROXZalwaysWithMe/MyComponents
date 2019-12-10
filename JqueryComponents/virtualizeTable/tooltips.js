/**
 * 基于jQuery EasyUI 1.4.5 的tooltip控件修改
 * Licensed under the freeware license: http://www.jeasyui.com/license_freeware.php
 * To use it on other terms please contact us: info@jeasyui.com
 *
 * ┏━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━【Properties】━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━┓
 * ┃ Name               ┃ Type            ┃ Description                                                                                                                                        ┃ Default        ┃
 * ┣━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━┫
 * ┃ position           ┃ string          ┃ 'left','right','top','bottom','auto',                                                                                                              ┃                ┃
 * ┃                    ┃                 ┃ 'horizontal'('left','right'选一边显示),'horizontal-left'('left','right'选一边显示，优先left),'horizontal-right'('left','right'选一边显示，优先right)   ┃ bottom         ┃
 * ┃                    ┃                 ┃ 'vertical'('top','bottom'选一边显示),'vertical-top'('top','bottom'选一边显示，优先top),'vertical-bottom'('top','bottom'选一边显示，优先bottom)         ┃                ┃
 * ┣━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━┫
 * ┃ content            ┃ string/function ┃                                                                                                                                                    ┃                ┃
 * ┣━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━┫
 * ┃ trackMouse         ┃ boolean         ┃ false                                                                                                                                              ┃                ┃
 * ┣━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━┫
 * ┃ deltaX             ┃ number/obj      ┃ "tip显示位置的x轴偏移                                                                                                                                ┃ 0              ┃
 * ┃                    ┃(新增对obj的支持) ┃ 直接输入数值表示相对偏移，使用obj的，其格式为：                                                                                                        ┃                ┃
 * ┃                    ┃                 ┃ {                                                                                                                                                  ┃                ┃
 * ┃                    ┃                 ┃     x:偏移值                                                                                                                                        ┃                ┃
 * ┃                    ┃                 ┃     position: ""relative""/""absolute"" 偏移值是属于相对偏移还是绝对偏移，相对偏移与直接输入数值的形式相同                                               ┃                ┃
 * ┃                    ┃                 ┃ }"                                                                                                                                                 ┃                ┃
 * ┣━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━┫
 * ┃ deltaY             ┃ number/obj      ┃ tip显示位置的y轴偏移，其obj形式与deltaX相同                                                                                                           ┃ 0              ┃
 * ┃                    ┃(新增对obj的支持) ┃                                                                                                                                                    ┃                ┃
 * ┣━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━┫
 * ┃ showEvent          ┃                 ┃                                                                                                                                                    ┃ mouseenter     ┃
 * ┣━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━┫
 * ┃ hideEvent          ┃                 ┃                                                                                                                                                    ┃ mouseleave     ┃
 * ┣━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━┫
 * ┃ showDelay          ┃                 ┃                                                                                                                                                    ┃ 200            ┃
 * ┣━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━┫
 * ┃ hideDelay          ┃                 ┃                                                                                                                                                    ┃                ┃
 * ┣━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━┫
 * ┃ allowPointerEvents ┃ boolean         ┃ tip本身是否响应鼠标事件                                                                                                                              ┃ true           ┃
 * ┃ (新属性)           ┃                 ┃                                                                                                                                                     ┃                ┃
 * ┗━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━┛
 *
 * ┏━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┳━━━━━━━━━━【Events】━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
 * ┃ Name               ┃ Parameters      ┃ Description                                                             ┃
 * ┣━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
 * ┃ onShow (已删除事件) ┃ e               ┃                                                                         ┃
 * ┣━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
 * ┃ onBeforeShow       ┃ none            ┃ tip即将显示前触发，如果事件函数返回false，则显示操作取消                    ┃
 * ┃   (新事件)         ┃                 ┃                                                                         ┃
 * ┃ (取消onShow)       ┃                 ┃                                                                         ┃
 * ┣━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
 * ┃ onAfterShow        ┃ none            ┃                                                                         ┃
 * ┃   (新事件)         ┃                 ┃                                                                         ┃
 * ┃ (取消onShow)       ┃                 ┃                                                                         ┃
 * ┣━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
 * ┃ onHide             ┃ e               ┃                                                                         ┃
 * ┣━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
 * ┃ onUpdate           ┃ content         ┃                                                                         ┃
 * ┣━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
 * ┃ onPosition         ┃ left,top	      ┃                                                                         ┃
 * ┣━━━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
 * ┃ onDestroy          ┃ none            ┃                                                                         ┃
 * ┗━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
 *
 * ┏━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━┳━━━━━【Methods】━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
 * ┃ Name           ┃ Parameters     ┃ Description                                              ┃
 * ┣━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
 * ┃ options        ┃ none           ┃                                                          ┃
 * ┣━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
 * ┃ tip            ┃ none           ┃ 返回tip显示内容的容器dom节点                               ┃
 * ┣━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
 * ┃ arrow          ┃ none           ┃                                                          ┃
 * ┣━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
 * ┃ show           ┃ none           ┃ 显示tip，会触发onBeforeShow和onAfterShow事件               ┃
 * ┣━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
 * ┃ hide           ┃ none           ┃ 隐藏tip，会触发onHide                                     ┃
 * ┣━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
 * ┃ update         ┃ content        ┃                                                          ┃
 * ┣━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
 * ┃ reposition     ┃                ┃                                                          ┃
 * ┣━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
 * ┃ destroy        ┃                ┃                                                          ┃
 * ┗━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
 *
 */

/*绑定mouseenter，mouseleave，鼠标跟随事件*/
function _3(_4){
    var _5=$.data(_4,"tooltip").options;
    $(_4).unbind(".tooltip_new").bind(_5.showEvent+".tooltip",function(e){
        $(_4).tooltip("show",e);
    }).bind(_5.hideEvent+".tooltip",function(e){
        $(_4).tooltip("hide",e);
    }).bind("mousemove.tooltip",function(e){
        if(_5.trackMouse){
            _5.trackMouseX=e.pageX;
            _5.trackMouseY=e.pageY;
            $(_4).tooltip("reposition");
        }
    });
};
//清除延迟执行定时器
function _6(_7){
    var _8=$.data(_7,"tooltip");
    if(_8.showTimer){
        clearTimeout(_8.showTimer);
        _8.showTimer=null;
    }
    if(_8.hideTimer){
        clearTimeout(_8.hideTimer);
        _8.hideTimer=null;
    }
};
/*重新调整位置，reposition*/
function _9(_a){
    var _b=$.data(_a,"tooltip");
    if(!_b||!_b.tip){
        return;
    }
    var _c=_b.options;
    var _d=_b.tip;
    var _e={left:-100000,top:-100000};
    if($(_a).is(":visible")){
        var fitPosition = function(direction) {
            switch (direction) {
                case 'auto':
                    var a = $(window).height() - $(_a).offset().top - $(_a).outerHeight();//a链接距离底部距离
                    if(a > _d.outerHeight() + 12) {
                        return 'bottom';
                    }
                    if($(window).width() - $(_a).outerWidth() -  $(_a).offset().left > _d.outerWidth() + 12) {
                        return 'right';
                    }
                    if($(_a).offset().top > _d.outerHeight() + 12) {
                        return 'top';
                    }
                    if($(_a).offset().left > _d.outerWidth() + 12) {
                        return 'left';
                    }
                    //4个方向都无法容纳时，取一个最优的，这里从左右中选择一个空间大的
                    if($(_a).offset().left > $(window).width() - $(_a).outerWidth() -  $(_a).offset().left ) {
                        return 'left';
                    } else {
                        return 'right';
                    }            
                case 'horizontal':
                    var priority = _c.position.slice(11)
                    if (priority == '') {
                        if ($(_a).offset().left * 2 + $(_a).outerWidth() > $(window).width()) priority = 'left'
                        else priority = 'right'
                    }
                    if (priority == 'left') {
                        if($(_a).offset().left > _d.outerWidth() + 12) {
                            return 'left';
                        }
                        if($(window).width() - $(_a).outerWidth() -  $(_a).offset().left > _d.outerWidth() + 12) {
                            return 'right';
                        }   
                    }
                    if (priority == 'right') {
                        if($(window).width() - $(_a).outerWidth() -  $(_a).offset().left > _d.outerWidth() + 12) {
                            return 'right';
                        }
                        if($(_a).offset().left > _d.outerWidth() + 12) {
                            return 'left';
                        }
                    }
                case 'vertical':
                    var priority = _c.position.slice(9)
                    if (priority == '') {
                        if ($(_a).offset().top * 2 + $(_a).outerHeight() > $(window).height()) priority = 'top'
                        else priority = 'bottom'
                    }
                    if (priority == 'top') {
                        if($(_a).offset().top > _d.outerHeight() + 12) {
                            return 'top';
                        }
                        if(a > _d.outerHeight() + 12) {
                            return 'bottom';
                        }
                    }
                    if (priority == 'bottom') {
                        if(a > _d.outerHeight() + 12) {
                            return 'top';
                        }
                        if($(_a).offset().top > _d.outerHeight() + 12) {
                            return 'bottom';
                        }
                    }
            }
        }
        var result = _c.position;
        if (_c.position.slice(0,10) === 'horizontal') {
           result = fitPosition('horizontal')
        } else if (_c.position.slice(0,8) === 'vertical') {
           result = fitPosition('vertical')
        } else if(['left','right','top','bottom'].includes(_c.position) == false) { // auto
           result = fitPosition('auto');
        } 

        _e=_f(result);

        if(result=="top"&&_e.top<0){
            _e=_f("bottom");
        }else if((result=="bottom")&&(_e.top+_d.outerHeight()>$(window).outerHeight()+$(document).scrollTop())){
            _e=_f("top");
        }
        if (_e.left < 0) {
            if(result == 'left') {
                _e.left = 0;

                var pb = parseInt(_d.css('padding-left')) * 2 + parseInt(_d.css('border-width')) * 2;

                _d.css({width: $(_a).offset().left - 12 - pb});
            } else {
                $(_a).tooltip("arrow").css("left",_d.outerWidth()/2+_e.left);
                _e.left=0;
            }
        } else {
            if (_e.left + _d.outerWidth() > $(window).outerWidth() + $(document).scrollLeft()) {
                if (result == "right") {
                    var pb = parseInt(_d.css('padding-left')) * 2 + parseInt(_d.css('border-width')) * 2;

                    var a = $(window).height() - $(_a).offset().top - $(_a).outerHeight();//a链接距离底部距离
                    _d.css({width: $(window).width() - _e.left - pb});

                } else {
                    var _10 = _e.left;
                    _e.left = $(window).outerWidth() + $(document).scrollLeft() - _d.outerWidth();
                    $(_a).tooltip("arrow").css("left", _d.outerWidth() / 2 - (_e.left - _10));
                }
            }
        }

        //调整top，调整箭头的top
        if(result == 'left' || result == 'right') {
            if ($(window).height() - _d.outerHeight() < _e.top) {
                _e.top = $(window).height() - _d.outerHeight();
            }

            if (_e.top < 0) {
                _e.top = 0;
            }

            $(_a).tooltip("arrow").css("top", $(_a).offset().top - _e.top + $(_a).outerHeight() / 2);//此行为新增加代码
        }
    }
    _d.css({left:_e.left,top:_e.top,zIndex:(_c.zIndex!=undefined?_c.zIndex:$.fn.tooltip.defaults.zIndex++)});
    _c.onPosition.call(_a,_e.left,_e.top);

    var _18=_d.children(".tooltip_arrow_outer");
    var _19=_d.children(".tooltip_arrow");
    var bc="border-"+result+"-color";
    _18.add(_19).css({borderTopColor:"",borderBottomColor:"",borderLeftColor:"",borderRightColor:""});
    _18.css(bc,_d.css(bc));
    _19.css(bc,_d.css("backgroundColor"));

    //根据position:top,bottom,left,right计算位置的坐标
    function _f(_11="bottom"){
        // _c.position=_11||"bottom";
        _d.removeClass("tooltip_top tooltip_bottom tooltip_left tooltip_right").addClass("tooltip_"+_11);
        var _12,top;

        var deltaX;
        var deltaY;
        if(typeof _c.deltaX == 'object') {
            deltaX = _c.deltaX.x;
        } else {
            deltaX = _c.deltaX;
        }

        if(typeof _c.deltaY == 'object') {
            deltaY = _c.deltaY.y;
        } else {
            deltaY = _c.deltaY;
        }

        if(_c.trackMouse){
            t=$();
            _12=_c.trackMouseX+deltaX;
            top=_c.trackMouseY+deltaY;
        }else{
            var t=$(_a);
            if(_c.deltaX.position == 'absolute') {
                _12 = deltaX;
            } else {
                _12 = t.offset().left + deltaX;
            }
            if(_c.deltaY.position == 'absolute') {
                top = deltaY;
            } else {
                top = t.offset().top + deltaY;
            }
        }
        switch(_11){
            case "right":
                _12+=t.outerWidth()+12+(_c.trackMouse?12:0);
                top-=(_d.outerHeight()-t.outerHeight())/2;
                break;
            case "left":
                _12-=_d.outerWidth()+12+(_c.trackMouse?12:0);
                top-=(_d.outerHeight()-t.outerHeight())/2;
                break;
            case "top":
                _12-=(_d.outerWidth()-t.outerWidth())/2;
                top-=_d.outerHeight()+12+(_c.trackMouse?12:0);
                break;
            case "bottom":
                _12-=(_d.outerWidth()-t.outerWidth())/2;
                top+=t.outerHeight()+12+(_c.trackMouse?12:0);
                break;
        }

        if(_c.deltaX.position == 'absolute') _12 = deltaX;
        if(_c.deltaY.position == 'absolute') top = deltaY;

        return {left:_12,top:top};
    };
};
function _13(_14,e){
    var _15=$.data(_14,"tooltip");
    var _16=_15.options;
    var tip=_15.tip;
    if(!tip){
        if(_16.allowPointerEvents == false) {
            var pointer_events = 'style="pointer-events:none;"';
        } else {
            var pointer_events = '';
        }
        tip=$("<div tabindex=\"-1\" class=\"tooltip_new\" " + pointer_events + ">"+"<div class=\"tooltip_content\"></div>"+"<div class=\"tooltip_arrow_outer\"></div>"+"<div class=\"tooltip_arrow\"></div>"+"</div>");
        _15.tip=tip;
        $(tip).bind('remove',()=>$(_14).unbind('remove',_15.removeEvent));
    }
    _6(_14);
    _15.showTimer=setTimeout(function(){

        if(_16.onBeforeShow.call(_14,e) == false || !_17(_14)) {return;}
        //show之前修改内容
        //修改内容和调整位置执行均移动到beforeShow事件执行完毕之后
        tip.appendTo('body');
        $(_14).tooltip("reposition");//show之前调整位置
        tip.show();//此处需要修改，show完成后执行onShow事件，需要拆分为onBeforeShow,onAfterShow 2个事件
        //_16.onShow.call(_14,e);
        $(_14).bind('remove',_15.removeEvent);
        _16.onAfterShow.call(_14,e);
    },_16.showDelay);
};

//隐藏tip
function _1a(_1b,e){
    var _1c=$.data(_1b,"tooltip");
    if(_1c&&_1c.tip){
        _6(_1b);
        _1c.hideTimer=setTimeout(function(){//hideTimer只是设置的定时器的一个标识
            _1c.tip.hide();
            _1c.options.onHide.call(_1b,e);
            _1c.tip.remove();//隐藏tip时直接删除生成的tooltip的div，此行为新增加的代码
            delete _1c.tip;//删除掉挂在a链接元素上的tip属性，这样，下次show时，判断到tip属性不存在，则重新创建
        },_1c.options.hideDelay);
    }
};
/*tooltip的content内容设置，修改content内容*/
function _17(_1d,_1e){//_le为设置的content内容
    var _1f=$.data(_1d,"tooltip");//读取tooltip存储的值
    var _20=_1f.options;
    if(_1e){
        _20.content=_1e;
    }
    if(!_1f.tip){//若tip未构造，退出
        return;
    }
    var cc=typeof _20.content=="function"?_20.content.call(_1d):_20.content;
    _20.onUpdate.call(_1d,cc);//修改content时触发onUpdate事件
    if (cc == '' || cc == void 0) return false
    _1f.tip.children(".tooltip_content").html(cc);
    return true
};
//销毁tip
function _21(_22){
    var _23=$.data(_22,"tooltip");
    if(_23){
        _6(_22);
        var _24=_23.options;
        if(_23.tip){
            _23.tip.remove();
        }
        if(_24._title){
            $(_22).attr("title",_24._title);
        }
        $.removeData(_22,"tooltip");
        $(_22).unbind(".tooltip_new");
        _24.onDestroy.call(_22);
    }
};
$.fn.tooltip=function(_25,_26){
    if(typeof _25=="string"){
        return $.fn.tooltip.methods[_25](this,_26);
    }
    _25=_25||{};
    return this.each(function(){
        var _27=$.data(this,"tooltip");
        if(_27){
            $.extend(_27.options,_25);
        }else{
            $.data(this,"tooltip",
            {
                removeEvent:()=>{let _x=$.data(this,"tooltip");if(_x&&_x.tip)_x.tip.remove()},
                options:$.extend({},$.fn.tooltip.defaults,_25)});
        }
        _3(this);//移入移出事件
        _17(this);//update tip content

    });
};
$.fn.tooltip.methods={options:function(jq){
    return $.data(jq[0],"tooltip").options;
},tip:function(jq){
    return $.data(jq[0],"tooltip").tip;
},arrow:function(jq){
    return jq.tooltip("tip").children(".tooltip_arrow_outer,.tooltip_arrow");
},show:function(jq,e){
    return jq.each(function(){
        _13(this,e);
    });
},hide:function(jq,e){
    return jq.each(function(){
        _1a(this,e);
    });
},update:function(jq,_28){
    return jq.each(function(){
        _17(this,_28);
    });
},reposition:function(jq){
    return jq.each(function(){
        _9(this);
    });
},destroy:function(jq){
    return jq.each(function(){
        _21(this);
    });
}};

$.fn.tooltip.defaults={position:"auto",content:null,trackMouse:false,allowPointerEvents:true,deltaX:0,deltaY:0,showEvent:"mouseenter",hideEvent:"mouseleave",showDelay:200,hideDelay:100,
    /*onShow:function(e){
     },*/onBeforeShow:function() {//由onShow拆解而来

    },
    onAfterShow:function() {//由onShow拆解而来

    },
    onHide:function(e){
    },onUpdate:function(_2b){
    },onPosition:function(_2c,top){
    },onDestroy:function(){
    },
    zIndex:9500
};
