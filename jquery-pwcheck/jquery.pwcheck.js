//***********密码强弱判断功能使用说明****************//
/*
*==========密码强弱算法：===========
*一、密码强度：弱
*	1.密码长度小于6位；
*	2.密码长度大于等于6位小于等于8位时，密码内容仅含有"有数字、大写字母、小写字母、符号集"中一种字符；
*二、密码强度：中
*	1.密码长度大于等于6位小于等于8位时，密码内容含有"数字、大写字母、小写字母、符号集"中两种或两种以上字符；
*	2.密码长度大于8位小于等于11位时，密码内容含有"数字、大写字母、小写字母、符号集"中一种或两种字符；
*	3.密码长度大于11位时，密码内容仅含有"数字、大写字母、小写字母、符号集"中一种字符；
*二、密码强度：强
*	1.密码长度大于8位小于等于11位时，密码内容含有"数字、大写字母、小写字母、符号集"中三种或三种以上字符；
*	2.密码长度大于11位时，密码内容含有"数字、大写字母、小写字母、符号集"中两种或两种以上字符；
*备注：
*	密码长度不得大于16位。
*	
*
*==============确保页面已经引入了jquery框架，否则将无法执行===============
*	
*	<script type="text/javascript" src="jquery-pwcheck/jquery.pwcheck.js"></script>
*	<link href="jquery-pwcheck/jquery.pwcheck.css" type="text/css" rel="stylesheet" media="all" />
*	<input type="password" id="tbPassword" class="pw_inputstyle w180 fl">
*	<script type="text/javascript">
*		$("#tbPassword").pwcheck({width:180,text:["弱","中","强"]});
*	</script>
*
*/

;(function ($, window, document, undefined) {
    'use strict';
    var old = $.fn.pwcheck;
    var PWCheck = function (element, options) {
		
        this.$element = $(element);
		
        this.options = $.extend({}, $.fn.pwcheck.defaults, options);

        this.render();

        this.setupEvents();

        return this;
    };
	
	// 定义PWCheck的prototype
    PWCheck.prototype = {
		
        constructor: PWCheck,
        
        render: function() {
        	var base = this;
        	var html = '   <div class="pw_level">';
        	html+= '	<div class="pw_grap_box">';
        	html+= '		<div class="pw_grap_tab pw_grap_top">';
        	html+= '			<table width="100%" cellpadding="0" cellspacing="0" border="2">';
        	html+= '				<tr>';
        	html+= '					<td width="33%" height="8" style="background-color:#ec3701;border-radius:5px 0 0 5px;border-right:2px solid #fff;"></td>';
        	html+= '					<td width="33%" style="background-color:#f78115;border-right:2px solid #fff;border-left:2px solid #fff;"></td>';
        	html+= '					<td width="34%" style="background-color:#6ba001;border-radius:0 5px 5px 0;border-left:2px solid #fff;"></td>';
        	html+= '				</tr>';
        	html+= '			</table>';
        	html+= '		</div>';
        	html+= '		<div class="pw_grap_tab pw_grap_bot">';
        	html+= '			<table width="100%" cellpadding="0" cellspacing="0" border="2">';
        	html+= '				<tr>';
        	html+= '					<td width="33%" height="8" style="background-color:#e3e3e3;border-radius:5px 0 0 5px;border-right:2px solid #fff;"></td>';
        	html+= '					<td width="33%" style="background-color:#e3e3e3;border-right:2px solid #fff;border-left:2px solid #fff;"></td>';
        	html+= '					<td width="34%" style="background-color:#e3e3e3;border-radius:0 5px 5px 0;border-left:2px solid #fff;"></td>';
        	html+= '				</tr>';
        	html+= '			</table>';
        	html+= '		</div>';
        	html+= '	</div>';
        	html+= '	<div class="pw_text_box">';
        	html+= '		<table width="100%" cellpadding="0" cellspacing="0" border="0">';
        	html+= '			<tr>';
        	html+= '				<td width="33%">'+base.options.text[0]+'</td><td width="33%">'+base.options.text[1]+'</td><td width="33%">'+base.options.text[2]+'</td>';
        	html+= '			</tr>';
        	html+= '		</table>';
        	html+= '	</div>';
        	html+= '</div>';
			html+= '<div class="clear">';
			html+= '</div>';
			
			//定义密码判断区域为panel
			var panel = $(html);
			//设置密码判断区域的宽度
			panel.width(base.options.width);			
			//设置判断图形里彩条宽度
			$(".pw_grap_tab table",panel).width(parseInt(base.options.width - 8));			
			//设置判断图形里彩条边框宽度
			$(".pw_grap_box",panel).width(parseInt(base.options.width - 2));
			//在当前input对象后面插入密码判断功能区域
			this.$element.after(panel);
			//定义执行动画对象
			this.bar = panel.find(".pw_grap_top");
        },
		
        destroy: function () {
            this.$element.removeData('pwcheck');
            this.$element.unbind('keyup focus');
            return this;
        },
		//定义图形动画方法
		animateTo: function(per){
			this.bar.stop(true).animate({width:per},400);
		},
		//绑定keyup和focus事件，根据检查密码强度结果执行动画
        setupEvents: function () {
			var base = this;
			var element = this.$element;
			element.bind("keyup focus",function () {
				var pwd = element.val();
				if(!pwd){
					base.animateTo("0");
					return;
				}
				if(pwd.length<6){
					base.animateTo("33%");
					return;
				}
				var r = base.checkPwd(pwd);

				if (r < 1) {
					base.animateTo("0");
					return;
				}
				if (r > 0 && r < 2) {
					base.animateTo("33%");
				} else if (r >= 2 && r < 4) {
					base.animateTo("66%");
				} else if (r >= 4) {
					base.animateTo("100%");
				}            
			});
        },
		//检查密码强度
		checkPwd: function(str) {
			var maths, smalls, bigs, corps, cat, num;
			var len = str.length;

			if (len == 0) return 1;

			var cat = /.*[\u4e00-\u9fa5]+.*$/
			if (cat.test(str)) {
				return -1;
			}
			cat = /\d/;
			var maths = cat.test(str);
			cat = /[a-z]/;
			var smalls = cat.test(str);
			cat = /[A-Z]/;
			var bigs = cat.test(str);
			var corps = this.corpses(str);
			var num = maths + smalls + bigs + corps;

			if (len < 6) { return 1; }

			if (len >= 6 && len <= 8) {
				if (num == 1) return 1;
				if (num == 2 || num == 3) return 2;
				if (num == 4) return 3;
			}

			if (len > 8 && len <= 11) {
				if (num == 1) return 2;
				if (num == 2) return 3;
				if (num == 3) return 4;
				if (num == 4) return 5;
			}

			if (len > 11) {
				if (num == 1) return 3;
				if (num == 2) return 4;
				if (num > 2) return 5;
			}
		},
		corpses: function(str) {
			var cat, maths_01, smalls_01, bigs_01, sz = str.match(cat)
			for (var i = 0; i < sz.length; i++) {
				cat = /\d/;
				maths_01 = cat.test(sz[i]);
				cat = /[a-z]/;
				smalls_01 = cat.test(sz[i]);
				cat = /[A-Z]/;
				bigs_01 = cat.test(sz[i]);
				if (!maths_01 && !smalls_01 && !bigs_01) { return true; }
			}
			return false;
		}
    };



    $.fn.pwcheck = function (option) {
        var args = Array.prototype.slice.call(arguments, 1);
        var methodReturn;

        var $this = $(this);
        var data = $this.data('pwcheck');
        var options = typeof option === 'object' && option;

        if (!data) $this.data('pwcheck', (data = new PWCheck(this, options) ));
        if (typeof option === 'string') methodReturn = data[ option ].apply(data, args);

        return ( methodReturn === undefined ) ? $this : methodReturn;
    };
	
	//----------设置默认属性值-------------
    $.fn.pwcheck.defaults = {
        width: 180,
		text: ["危险","一般","安全"]
    };

    $.fn.pwcheck.Constructor = PWCheck;

    $.fn.pwcheck.noConflict = function () {
        $.fn.pwcheck = old;
        return this;
    };

})(jQuery, window, document);