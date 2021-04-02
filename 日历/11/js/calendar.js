var aim_div = ""; //目标div 放置日历的位置
var m = 0; //使用标识,之前页面记录的几列
var n = 0; //使用标识,根据页面宽度决定日历分为几列
var language = "cn"; //语言选择
var month_arry;
var week_arry;
var month_cn = new Array("一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"); //月
var month_en = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"); //月
var week_cn = new Array("日", "一", "二", "三", "四", "五", "六"); //星期
var week_en = new Array("Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"); //星期
month_arry = month_cn;
week_arry = week_cn;


(function() {
    window.onload = function() {
        window.onresize = change;
        change();
    };

    function change() {
        var obj = $(aim_div);
        var m_obj = $(".fullYearPicker .month-container");
        var width = obj.width();
        var class_width = "month-width-";
        n = parseInt(width / 200);
        if (n == 5) n = 4;
        if (n > 6) n = 6;

        if (n != m) {
            m_obj.removeClass(class_width + m);
            m_obj.addClass(class_width + n);
            m = n;
        }

    };

    function changeHandle() {
        m = 0;
        change();

    }

    //设置年份菜单
    function setYearMenu(year) {
        $(".year .left_first_year").text(year - 1 + "");
        $(".year .left_sencond_year").text(year - 2 + "");
        $(".year .cen_year").text(year);
        $(".year .right_first_year").text(year + 1 + "");
        $(".year .right_sencond_year").text(year + 2 + "");
    }



    function tdClass(i, disabledDay, sameMonth, values, dateStr) {

        var cls = i == 0 || i == 6 ? 'weekend' : '';
        if (disabledDay && disabledDay.indexOf(i) != -1)
            cls += (cls ? ' ' : '') + 'disabled';
        if (!sameMonth) {
            cls += (cls ? ' ' : '') + 'empty';
        } else {
            cls += (cls ? ' ' : '') + 'able_day';
        }
        if (sameMonth && values && cls.indexOf('disabled') == -1 &&
            values.indexOf(',' + dateStr + ',') != -1)
            cls += (cls ? ' ' : '') + 'selected';
        return cls == '' ? '' : ' class="' + cls + '"';
    }

    function renderMonth(year, month, clear, disabledDay, values) {

        var d = new Date(year, month - 1, 1),
            s = "<div class='month-container'>" + '<table cellpadding="3" cellspacing="1" border="0"' +
            (clear ? ' class="right"' : '') +
            '>' +
            '<tr><th colspan="7" class="head"  index="' + month + '">' /* + year + '年'  */ +
            month_arry[month - 1] +
            '</th></tr>' +
            '<tr><th class="weekend">' + week_arry[0] + '</th><th>' + week_arry[1] + '</th><th>' + week_arry[2] + '</th><th>' + week_arry[3] + '</th><th>' + week_arry[4] + '</th><th>' + week_arry[5] + '</th><th class="weekend">' + week_arry[6] + '</th></tr>';
        var dMonth = month - 1;
        var firstDay = d.getDay(),
            hit = false;
        s += '<tr>';
        for (var i = 0; i < 7; i++)
            if (firstDay == i || hit) {
                s += '<td' +
                    tdClass(i, disabledDay, true, values, year +
                        '-' + month + '-' + d.getDate()) +
                    '>' + d.getDate() + '</td>';
                d.setDate(d.getDate() + 1);
                hit = true;
            } else
                s += '<td' + tdClass(i, disabledDay, false) +
                '>&nbsp;</td>';
        s += '</tr>';
        for (var i = 0; i < 5; i++) {
            s += '<tr>';
            for (var j = 0; j < 7; j++) {
                s += '<td' +
                    tdClass(j, disabledDay,
                        d.getMonth() == dMonth, values, year +
                        '-' + month + '-' +
                        d.getDate()) +
                    '>' +
                    (d.getMonth() == dMonth ? d.getDate() :
                        '&nbsp;') + '</td>';
                d.setDate(d.getDate() + 1);
            }
            s += '</tr>';
        }
        return s + '</table></div>' + (clear ? '<br>' : '');
    }

    function getDateStr(td) {
        //console.log("----"+td.parentNode.parentNode.rows[0].cells[0].getAttribute('index')+"-"+ td.innerHTML);
        return td.parentNode.parentNode.rows[0].cells[0].getAttribute('index') + "-" + td.innerHTML;
    }

    function renderYear(year, el, disabledDay, value) {

        el.find('td').unbind();
        var s = '',
            values = ',' + value.join(',') + ',';
        for (var i = 1; i <= 12; i++)
            s += renderMonth(year, i, false, disabledDay, values);
        s += "<div class='date_clear'></div>";
        el
            .find('div.picker')
            .html(s)
            .find('td')
            .click( /*单击日期单元格*/

                function() {
                    //             var m_type = $("#hd-type-option").val();
                    // /*drap_select(start_date,end_date,"workday");*/
                    // drap_select(start_date, end_date, m_type);
                    // console.log("this.className", this.className)
                    if (!/disabled|empty/g.test(this.className)) {
                        $(this).toggleClass('selected');
                    }
                    if (this.className.indexOf('empty') == -1 &&
                        typeof el.data('config').cellClick == 'function') {
                        el
                            .data('config')
                            .cellClick(
                                getDateStr(this),
                                this.className
                                .indexOf('disabled') != -1);
                        open_modal(getDateStr(this), getDateStr(this));
                    }
                    // if (event.button == 0 && ($(this).html() != "&nbsp;")) {
                    //     is_drap = 0;
                    //     end_date = getDateStr($(this)[0]);
                    //     /* console.log("结束值:"+end_date); */
                    //     if (checkDate(start_date, end_date)) {
                    //         open_modal(start_date, end_date);
                    //     } else {
                    //         open_modal(end_date, start_date);
                    //     }
                    // }
                }
            );
        changeHandle();
        day_drap_listen();
    }
    //监听日期拖在
    function day_drap_listen() {
        var is_drap = 0;
        var start_date = "";
        var end_date = "";
        $(".fullYearPicker .picker table td").mousedown(function(event) {
            /*判断是左键才触发  */
            if (event.button == 0 && ($(this).html() != "&nbsp;")) {
                is_drap = 1;
                start_date = getDateStr($(this)[0]);
                /*console.log("开始值:"+start_date); */
            }

        });
        $(".fullYearPicker .picker table td").mouseup(function(event) {
            /*判断是左键才触发  */
            if (event.button == 0 && ($(this).html() != "&nbsp;")) {
                is_drap = 0;
                end_date = getDateStr($(this)[0]);
                /* console.log("结束值:"+end_date); */
                // if (checkDate(start_date, end_date)) {
                //     open_modal(start_date, end_date);
                // } else {
                //     open_modal(end_date, start_date);
                // }
            }


        });
        $(".fullYearPicker .picker table td").mouseover(function() {
            var day = $(this).html();
            if (is_drap == 1 && day != "&nbsp;") {
                var min_date = getDateStr($(this)[0]);
                drap_select(start_date, min_date, "selected");
                /*console.log("拖拽中:"+min_date); */
            }
        });
    }
    /*根据日期判断大小 开始值小于结束值返回true  */
    function checkDate(start, end) {
        var rs = false;
        var start_month = parseInt(start.split("-")[0]);
        var start_day = parseInt(start.split("-")[1]);
        var end_month = parseInt(end.split("-")[0]);
        var end_day = parseInt(end.split("-")[1]);
        if (start_month == end_month) {
            if (start_day < end_day) {
                rs = true;
            }
        } else if (start_month < end_month) {
            rs = true;
        }
        return rs;
    }
    /*窗口添加按钮*/
    $("#calendar_confirm_btn").click(function() {
        var start_date = $("#hd-start-date").val();
        start_date = start_date.split("-")[1] + "-" + start_date.split("-")[2];
        var end_date = $("#hd-end-date").val();
        end_date = end_date.split("-")[1] + "-" + end_date.split("-")[2];

        var m_type = $("#hd-type-option").val();
        /*drap_select(start_date,end_date,"workday");*/
        drap_select(start_date, end_date, m_type);
        close_modal();
    });

    /*拖拽选着  */
    function drap_select(start, end, new_class) {
        var max = 60; //当天数要选择到最后一天取一个大于所以月份的值
        /* console.log("选择:"+start+","+end); */
        //清除选中单元格的样式
        $(".month-container .selected").removeClass("selected");
        var start_month = parseInt(start.split("-")[0]);
        var start_day = parseInt(start.split("-")[1]);
        var end_month = parseInt(end.split("-")[0]);
        var end_day = parseInt(end.split("-")[1]);
        /* console.log("start_month:"+start_month);
        console.log("start_day:"+start_day);
        console.log("end_month:"+end_month);
        console.log("end_day:"+end_day); */
        if (start_month == end_month) {
            if (start_day < end_day) {
                select_month(start_month, start_day, end_day, new_class);
            } else {
                select_month(start_month, end_day, start_day, new_class);
            }
        } else if (start_month < end_month) {
            select_month(start_month, start_day, max, new_class);
            for (var i = start_month + 1; i < end_month; i++) {
                select_month(i, 1, max, new_class);
            }
            select_month(end_month, 1, end_day, new_class);
        } else if (start_month > end_month) {
            select_month(start_month, 1, start_day, new_class);
            for (var i = end_month + 1; i < start_month; i++) {
                select_month(i, 1, max, new_class);
            }
            select_month(end_month, end_day, max, new_class);
        }

    }
    /*按月加载样式*/
    function select_month(month, start, end, new_class) {
        month = month - 1;
        $(".fullYearPicker .picker .month-container:eq(" + month + ") td").each(function() {
            var num = $(this).text();
            if (num >= start && num <= end) {
                /* $(this).addClass("selected"); */
                // if ($(this).hasClass(new_class)) {
                //     console.log("-", $(this).attr('class'))
                //     $(this).removeClass(new_class);
                // }
                // $(this).addClass(new_class);
                $(this).removeClass();
                // $(this).addClass("able_day");
                if (new_class !== "workday") {
                    $(this).attr('class', 'able_day').addClass(new_class);
                } else {
                    $(this).addClass("able_day");
                }
                // $(this).attr('class', 'able_day', new_class);
            }
        });

    }


    //@config：配置，具体配置项目看下面
    //@param：为方法时需要传递的参数
    $.fn.fullYearPicker = function(config, param) {
        if (config === 'setDisabledDay' ||
            config === 'setYear' ||
            config === 'getSelected' ||
            config === 'acceptChange' ||
            config === 'initDate') { //方法
            var me = $(this);
            if (config == 'setYear') { //重置年份
                me.data('config').year = param; //更新缓存数据年份
                me.find('div.year a:first').trigger('click', true);
            } else if (config == 'getSelected') { //获取当前当前年份选中的日期集合（注意不更新默认传入的值，要更新值请调用acceptChange方法）
                return me.find('td.selected').map(function() {
                    var selectStr = getDateStr(this);
                    if (_viewer_.data('config').format === 'YYYY-MM-DD') {
                        var selects = selectStr.split('-');
                        var yy = selects[0];
                        var mm = selects[1];
                        if (Number(mm) < 10) {
                            mm = '0' + mm;
                        }
                        var dd = selects[2];
                        if (Number(dd) < 10) {
                            dd = '0' + dd;
                        }
                        selectStr = yy + '-' + mm + '-' + dd;
                    }
                    return selectStr;
                }).get();
            } else if (config == 'acceptChange') { //更新日历值，这样才会保存选中的值，更换其他年份后，再切换到当前年份才会自动选中上一次选中的值
                me.data('config').value = me.fullYearPicker('getSelected');
            } else {
                me.find('td.disabled').removeClass('lawday');
                me.data('config').disabledDay = param; //更新不可点击星期
                if (param) {
                    me.find('table tr:gt(1)').find('td').each(function() {
                        if (param.indexOf(this.cellIndex) != -1) {
                            this.className = (this.className || '').replace('selected', '') + (this.className ? ' ' : '') + 'lawday';
                        }
                    });
                }
            }
            return this;
        }
        //@year:显示的年份
        //@disabledDay:不允许选择的星期列，注意星期日是0，其他一样
        //@cellClick:单元格点击事件（可缺省）。事件有2个参数，第一个@dateStr：日期字符串，格式“年-月-日”，第二个@isDisabled，此单元格是否允许点击
        //@value:选中的值，注意为数组字符串，格式如['2016-6-25','2016-8-26'.......]
        config = $.extend({
            year: new Date().getFullYear(),
            disabledDay: '',
            value: [],
            initDate: [],
            format: ""
        }, config);
        return this.addClass('fullYearPicker').each(function() {
            var me = $(this),
                year = config.year || new Date().getFullYear(),
                newConifg = {
                    cellClick: config.cellClick,
                    disabledDay: config.disabledDay,
                    year: year,
                    choose: config.choose,
                    initDate: config.initDate,
                    format: config.format,
                    value: config.value
                };
            me.data('config', newConifg);

            me.append('<div class="year">' +
                    '<table>' +
                    '<th class="year-operation-btn"><a href="#"  class="am-icon-chevron-left"></a></th>' +
                    '<th class="left_sencond_year year_btn">' + '' + '</th>' +
                    '<th class="left_first_year year_btn">' + '' + '</th>' +
                    '<th id="cen_year" class="cen_year year_btn">' + year + '</th>' +
                    '<th class="right_first_year year_btn">' + '' + '</th>' +
                    '<th class="right_sencond_year year_btn">' + '' + '</th>' +
                    '<th class="year-operation-btn"><a href="#" class="next am-icon-chevron-right"></a></th>' +
                    '</table>' +
                    '<div class="stone"></div></div><div class="picker"></div>')
                .find('.year-operation-btn').click(function(e, setYear) {
                    if (setYear) {
                        year = me.data('config').year;
                    } else {
                        $(this).children("a").attr("class") == 'am-icon-chevron-left' ? year-- : year++;
                        setYearMenu(year);
                    }
                    renderYear(year, $(this).closest('div.fullYearPicker'), newConifg.disabledDay, newConifg.value);
                    document.getElementById("cen_year").firstChild.data = year;
                    return false;
                }).end().find('select').change(function() {
                    me.fullYearPicker('setYear', this.value);
                });
            setYearMenu(year);
            //年份选择
            $(".year .year_btn").click(function() {
                var class_name = $(this).attr("class");
                if (class_name.indexOf("cen_year") < 0) {
                    var year = parseInt($(this).text());
                    setYearMenu(year);
                    renderYear(year, me, newConifg.disabledDay, newConifg.value);
                }
            });
            renderYear(year, me, newConifg.disabledDay, newConifg.value);
            if (newConifg.initDate.length > 0) {
                newConifg.initDate.forEach(function(p1, p2, p3) {
                    console.log("p1", p1)
                    console.log("p2", p2)
                    console.log("p3", p3)
                    if (newConifg.format === 'YYYY-MM-DD') {
                        var items = p1.date.split('-');
                        var mm = items[1];
                        if (mm[0] === '0') {
                            mm = mm[1];
                        }
                        var dd = items[2];
                        if (dd[0] === '0') {
                            dd = dd[1];
                        }
                        var item = items[0] + '-' + mm + '-' + dd;
                    }
                    console.log("items", items)
                        // $("[date='" + item + "']").addClass("selected")
                    $("[date='" + item + "']").addClass(p1.dateType)
                    console.log("item", $("[date='" + item + "']"))
                })
            }
        });
    };
})();