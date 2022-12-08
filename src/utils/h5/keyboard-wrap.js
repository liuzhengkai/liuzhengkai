import $ from 'jquery'; // 云核安全密码键盘依赖jquery
import "./cc-sk-2.5.0-theme2.css"; // 云核安全密码键盘样式表
import "./cc-sk-2.5.17.min"; // 云核安全密码键盘插件
import { dsUtils } from "@/dsUtils";
const SecurityPad = {

    /**
	 * 安全键盘服务域名
	 */
    serverUrl: "",

	/**
	 * 安全键盘URL
	 */
    keyPadUrl: "osg-p0001/member/p1/f28",

	/**
	 * 安全键盘类型
	 */
    types: {
        Standard: "Standard", 	// 标准键盘：大小写字母+数字+符号
        Normal: "Normal", 		// 一般键盘：大小写字母+数字
        Number: "Number", 		// 数字键盘：纯数字
        Grid: "SixNumber" 		// 数字键盘：纯数字（方格型输入框）
    },

	/**
	 * 各类型父级安全键盘对象 
	 * （与各类型键盘对应）
	 */
    ParentKeyPads: {
        StandardKeyPad: null,
        NormalKeyPad: null,
        NumberKeyPad: null,
        GridKeyPad: null
    },

	/**
	 * 当前页所有安全键盘对象集合 
	 * （与密码输入框对应）
	 */
    SubKeyPads: {

    },

	/**
	 * 方格型输入框输入完成 
	 * 自动提交方法集合
	 */
    GridAutoSubmit: {

    },

	/**
	 * 获得焦点时事件集合
	 */
    FocusEvents: {

    },

	/**
	 * 失去焦点时事件
	 */
    BlurEvents: {

    },

    /**
     * 销毁所有键盘实例
     */
    distoryAll() {
        $.distoryKeyPad();
        this.ParentKeyPads = {
            StandardKeyPad: null,
            NormalKeyPad: null,
            NumberKeyPad: null,
            GridKeyPad: null
        };
        this.SubKeyPads = {};
        this.GridAutoSubmit = {};
        this.FocusEvents = {};
        this.BlurEvents = {};
    },

	/**
	 * 初始化页面安全键盘
	 */
    init(baseUrl, reload) {
        // this.serverUrl = baseUrl;  
        // let productionUrl = 'https://assetctlzhx.95598pay.com'
        // let developmentUrl = 'https://wsgw.95598pay-test.com:29943'
        dsUtils.bridge_init(res => {
        //    console.log(res)
        //   console.log(dsUtils.publishEnv(res.data.host)) 
        //   let publishEnv = dsUtils.publishEnv(res.data.host)
        //   if(publishEnv == '2' || publishEnv == '3'){
        //       this.serverUrl = developmentUrl
        //   } else {
        //       this.serverUrl = productionUrl
        //   }
            this.serverUrl = res.data.host;  
            $.ccsk_ready(() => {
                if (reload === true) {
                    this.distoryAll();
                }
                this.ccsk_init_all();
            });
        });
        
        
    },

	/**
	 * 云核键盘初始化所有
	 */
    ccsk_init_all() {
        // 约定具有class： `keyboard` 的 input='password'输入框为安全键盘输入框，需要进行初始化
        // $(".keyboard input[type='password']").each((i, element) => {
        //     this.ccsk_init_one(element);
        // });
        $(".keyboard").each((i, element) => {
            this.ccsk_init_one(element);
        });
    },

	/**
	 * 云核键盘初始化输入框
	 * @param value	目标输入框
	 */
    ccsk_init_one(value) {
        if (this._empty(value.id) || !this._empty(this.SubKeyPads[value.id])) {
            return;
        }
        // 获取安全键盘类型（与SecurityPad.types一致）
        var ktype = value.getAttribute("data-ktype");
        console.log(`【支付中心】云核密码键盘初始化开始，输入框ID：${value.id}，类型：${ktype}`)
        // 安全键盘初始化参数
        var options = {
            elementId: value.id,
            stacked: false, // 此属性为true，点击空白处不会自动收起
            input_style: {
                "width": $(value).css("width"),
                "height": $(value).css("height"),
                "margin": $(value).css("margin"),
                "padding": $(value).css("padding"),
                "line-height": $(value).css("height"),
                "font-size": $(value).css("font-size"),
                "text-align": $(value).css("text-align"),
            }
        };

        if (!this._empty(value.placeholder)) {
            options["placeholder"] = value.placeholder;
        }

        if (ktype === this.types.Grid) {
            options["length"] = 6;
        } else if (!this._empty(value.getAttribute("maxlength"))) {
            options["length"] = value.getAttribute("maxlength");
        }
        // 调用相应父级安全键盘进行初始化
        // 生成与该输入框对应子安全键盘对象
        // 将子安全键盘对象与输入框id关联并存入集合中保存
        this.SubKeyPads[value.id] = this._getParentKeyPad(ktype).init(options);

        // 如果安全键盘类型是方格型输入框，则需要进一步初始化该输入框
        // 即将一般初始化后的输入框隐藏，生成新的方格型输入框，并绑定相关事件
        if (ktype === this.types.Grid) {
            this._initGird(value.id);
        }

        // 安全键盘加载、初始化完备后触发事件
        this.SubKeyPads[value.id].onload(() => {
            console.log(`【支付中心】云核密码键盘初始化完成，输入框ID：${value.id}，类型：${ktype}`)
        });

        // 安全键盘点击“完成”按钮事件
        this.SubKeyPads[value.id].complete(function (password) {
            console.log(password);
        });

        this.SubKeyPads[value.id].beforeEnter(function () {
            //chrome六位密码键盘弹框会出现密码键盘和原生重叠的问题
            setTimeout(function () {
                $(":focus").blur();
               
                console.log('$(":focus").blur();');
            }, 100);
        });

    },

	/**
	 * 根据 ktype 获取父级安全键盘对象
	 * 优先返回已有的，无则加载
	 * @param {string} ktype
	 * @returns	ParentKeyPad
	 */
    _getParentKeyPad(ktype) {
        if (ktype === this.types.Normal) {
            //  一般键盘 
            return this._NormalParentKeyPad();

        } else if (ktype === this.types.Number) {
            // 普通数字键盘：有确认按钮
            return this._NumberParentKeyPad();

        } else if (ktype === this.types.Grid) {
            // 方格数字键盘：无确认按钮
            return this._GridParentKeyPad();

        } else {
            // 其他均为标准键盘 
            return this._StandardParentKeyPad();
        }
    },

	/**
	 * 获取一般键盘的父级安全键盘对象
	 * 优先返回已有的，无则加载
	 * @returns NormalParentKeyPad
	 */
    _NormalParentKeyPad() {
        if (this.ParentKeyPads.NormalKeyPad === null) {
            console.log(`【支付中心】云核密码键盘初始化接口调用开始，URL：${this.serverUrl + this.keyPadUrl}，类型：${this.types.Normal}`)
            this.ParentKeyPads.NormalKeyPad = $.getCCSKeyPad(this.serverUrl + this.keyPadUrl, this.types.Normal);
        }
        console.log(`【支付中心】云核密码键盘接口已初始化完成，类型：${this.types.Normal}`)
        return this.ParentKeyPads.NormalKeyPad;
    },

	/**
	 * 获取普通数字键盘的父级安全键盘对象
	 * -------有确认按钮--------
	 * 优先返回已有的，无则加载
	 * @returns NumberParentKeyPad
	 */
    _NumberParentKeyPad() {
        if (this.ParentKeyPads.NumberKeyPad === null) {
            console.log(`【支付中心】云核密码键盘初始化接口调用开始，URL：${this.serverUrl + this.keyPadUrl}，类型：${this.types.Number}`)
            this.ParentKeyPads.NumberKeyPad = $.getCCSKeyPad(this.serverUrl + this.keyPadUrl, this.types.Number);
        }
        console.log(`【支付中心】云核密码键盘接口已初始化过，类型：${this.types.Number}`)
        return this.ParentKeyPads.NumberKeyPad;
    },

	/**
	 * 获取方格数字键盘的父级安全键盘对象
	 * -------无确认按钮--------
	 * 优先返回已有的，无则加载
	 * @returns GridParentKeyPad
	 */
    _GridParentKeyPad() {
        if (this.ParentKeyPads.GridKeyPad === null) {
            console.log(`【支付中心】云核密码键盘初始化接口调用开始，URL：${this.serverUrl + this.keyPadUrl}，类型：${this.types.Grid}`)
            this.ParentKeyPads.GridKeyPad = $.getCCSKeyPad(this.serverUrl + this.keyPadUrl, this.types.Grid);
        }
        console.log(`【支付中心】云核密码键盘接口已初始化过，类型：${this.types.Grid}`)
        return this.ParentKeyPads.GridKeyPad;
    },

	/**
	 * 获取标准键盘的父级安全键盘对象
	 * 优先返回已有的，无则加载
	 * @returns StandardParentKeyPad
	 */
    _StandardParentKeyPad() {
        if (this.ParentKeyPads.StandardKeyPad === null) {
            console.log(`【支付中心】云核密码键盘初始化接口调用开始，URL：${this.serverUrl + this.keyPadUrl}，类型：${this.types.Standard}`)
            this.ParentKeyPads.StandardKeyPad = $.getCCSKeyPad(this.serverUrl + this.keyPadUrl, this.types.Standard);
        }
        console.log(`【支付中心】云核密码键盘接口已初始化过，类型：${this.types.Standard}`)
        return this.ParentKeyPads.StandardKeyPad;
    },

	/**
	 * 初始化6位纯数字安全键盘输入框
	 * @param id 目标原始输入框id
	 */
    _initGird(id) {
        var ccskInputId = id + "_ccskinput";// 原有的一般初始化的安全键盘输入框id
        var gridInputId = id + "_gridinput";// 即将要生成的方格型安全键盘输入框id

        // 方格型安全键盘输入框 声明定义  开始  ------------------------------------------------------->
        var gridInput = "<ul id=\"" + gridInputId + "\" class=\"ccsk-6-gird\">";
        gridInput += "<li><span class=\"ccsk-dot\"></span></li>";
        gridInput += "<li><span class=\"ccsk-dot\"></span></li>";
        gridInput += "<li><span class=\"ccsk-dot\"></span></li>";
        gridInput += "<li><span class=\"ccsk-dot\"></span></li>";
        gridInput += "<li><span class=\"ccsk-dot\"></span></li>";
        gridInput += "<li><span class=\"ccsk-dot\"></span></li>";
        gridInput += "</ul>";
        // 方格型安全键盘输入框 声明定义  结束  <-------------------------------------------------------

        // 在`原一般安全键盘输入框`之后填充`新方格型安全键盘输入框`
        // 隐藏`原一般安全键盘输入框`
        $("#" + gridInputId).remove();
        $("#" + ccskInputId).after(gridInput).hide();
        $("#" + gridInputId)[0].style = $("#" + id)[0].style;

        // 将`新方格型安全键盘输入框`关联到`原始输入框`
        $("#" + gridInputId).bind('touchstart', e => {
            $('#' + ccskInputId).trigger('touchstart');
            e.stopPropagation();
        });

        this.SubKeyPads[id].onchange(e => {
            var len = this.length(id);			// 获取当前密码长度
            this._ccsk6girdLengthChanged(id, len);	// 根据密码长度填充输入框方格

            // 执行自动提交事件，条件：
            // 1、该输入框已绑定有效自动提交事件
            // 2、密码长度达到 6
            if (typeof (this.GridAutoSubmit[id]) === "function" && len === 6) {
                this.SubKeyPads[id].hide();
                setTimeout(this.GridAutoSubmit[id], 100);
            } else if (len === 6) {
                // 该输入框未绑定有效自动提交事件，给出出相关提示
                setTimeout(() => console.warn(`【支付中心】已输满6位，自动提交，但该输入框[${id}]未绑定有效自动提交事件`), 100);
            }
        });
    },

	/**
	 * 改变6格里的黑点
	 */
    _ccsk6girdLengthChanged(id, len) {
        if (len < 0 || len > 6) {
            return;
        }
        var gridInputId = id + "_gridinput";// 方格型安全键盘输入框id
        var arr = $("#" + gridInputId).find('.ccsk-dot');
        for (var i = 0; i < 6; i++) {
            if (i < len) {
                $(arr[i]).addClass('ccsk-dot-fill');
            } else {
                $(arr[i]).removeClass().addClass('ccsk-dot');
            }
        }
    },

	/**
	 * 获取密码长度
	 * @param id
	 * @returns {Number}
	 */
    length(id) {
        var len = 0;
        if (!this._empty(this.SubKeyPads[id])) {
            len = this.SubKeyPads[id].getPasswordLength();
        } else {
            console.error(`【支付中心】安全键盘获取密码长度，输入框[${id}]未注册/初始化`)
        }
        return len;
    },

	/**
	 * 判断两个密码是否相同
	 * @param id1
	 * @param id2
	 * @returns {Boolean}
	 */
    same(id1, id2) {
        if (!this._empty(id1) && !this._empty(id2)) {
            if (!this._empty(this.SubKeyPads[id1]) && !this._empty(this.SubKeyPads[id2])) {
                return this.SubKeyPads[id1].identical(this.SubKeyPads[id2]);
            }
        }
        console.error(`【支付中心】安全键盘判断两个密码是否相同，输入框[${id1}，${id2}]中至少有一个未注册/初始化`)
        return false;
    },
	/**
	 * 判断两个密码是否相同
	 * @param id1
	 * @param id2
	 * @returns {Boolean}
	 */
    height(id) {
        console.log(this.SubKeyPads[id].input.classList[1])
        let type= this.SubKeyPads[id].input.classList[1]
    //     console.log(`${this.types[type]}`)
       let height= $('#'+type+'_ccskwarp').height()
        return height;
    },

	/**
	 * 判断是否为空
	 * @param input
	 * @returns {Boolean}
	 */
    _empty(input) {
        if (typeof (input) === "undefined" || input === null || input === "") {
            return true;
        }
        return false;
    },

	/**
	 * 获取密码密文
	 * @param id
	 * @returns {String}
	 */
    value(id) {
        if (this._empty(id) || this._empty(this.SubKeyPads[id])) {
            console.error(`【支付中心】安全键盘获取密码密文，输入框[${id}]未注册/初始化`)
            return "";
        }
        return this.SubKeyPads[id].getPasswordValue();
    },

    clear(id) {
        if (this._empty(id) || this._empty(this.SubKeyPads[id])) {
            console.error(`【支付中心】安全键盘清空指定密码，输入框[${id}]未注册/初始化`)
            return "";
        }
        this.SubKeyPads[id].clear();
        this._ccsk6girdLengthChanged(id, 0);
    },

    clearAll() {
        for (var key in this.SubKeyPads) {
            this.SubKeyPads[key].clear();
            this._ccsk6girdLengthChanged(key, 0);
        }
    },

    hideAll() {
        for (var key in this.SubKeyPads) {
            this.SubKeyPads[key] && this.SubKeyPads[key].hide();
        }
    }
};

export { SecurityPad, $ }