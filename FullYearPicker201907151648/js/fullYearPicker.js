(function() {
    //记录当前选中的日期
    var fullYearPicker_nowSelect = null;
    var fullYearPicker_last = null;
    var _viewer_ = this;

    function tdClass(i, disabledDay, sameMonth, values, dateStr) {
        var cls = i == 0 || i == 6 ? '' : '';
        if (disabledDay && disabledDay.indexOf(i) != -1) cls += (cls ? ' ' : '') + 'disabled';
        if (!sameMonth) cls += (cls ? ' ' : '') + 'empty';
        if (sameMonth && values && cls.indexOf('disabled') == -1 && values.indexOf(',' + dateStr + ',') != -1) cls += (cls ? ' ' : '') + 'selected';
        return cls == '' ? '' : ' class="' + cls + '"';
    }

    function renderMonth(year, month, clear, disabledDay, values) {
        var d = new Date(year, month - 1, 1),
            s = '<table cellpadding="3" cellspacing="1" border="0"' + (clear ? ' class="right"' : '') + '>' +
            '<tr><th colspan="7" class="head">' + year + '年' + month + '月</th></tr>' +
            '<tr><th class="">日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th class="">六</th></tr>';
        var dMonth = month - 1;
        var firstDay = d.getDay(),
            hit = false;
        s += '<tr>';
        for (var i = 0; i < 7; i++)
            if (firstDay == i || hit) {
                s += '<td date="' + year + '-' + month + '-' + d.getDate() + '"' + tdClass(i, disabledDay, true, values, year + '-' + month + '-' + d.getDate()) + '>' + d.getDate() + '</td>';
                d.setDate(d.getDate() + 1);
                hit = true;
            } else s += '<td date=""' + tdClass(i, disabledDay, false) + '></td>';
        s += '</tr>';
        for (var i = 0; i < 5; i++) {
            s += '<tr>';
            for (var j = 0; j < 7; j++) {
                var dateStr = d.getMonth() == dMonth ? year + '-' + month + '-' + d.getDate() : "";
                s += '<td date="' + dateStr + '"' + tdClass(j, disabledDay, d.getMonth() == dMonth, values, year + '-' + month + '-' + d.getDate()) + '>' + (d.getMonth() == dMonth ? d.getDate() : '') + '</td>';
                d.setDate(d.getDate() + 1);
            }
            s += '</tr>';
        }
        return s + '</table>' + (clear ? '<br>' : '');
    }

    function getDateStr(td) {
        return td.parentNode.parentNode.rows[0].cells[0].innerHTML.replace(/[年月]/g, '-') + td.innerHTML
    }

    function renderYear(year, el, disabledDay, value) {
        el.find('td').unbind();
        var s = '',
            values = ',' + value.join(',') + ',';
        for (var i = 1; i <= 12; i++) s += renderMonth(year, i, i % 4 == 0, disabledDay, values);
        el.find('div.picker').html(s).find('td').click(function() {
            console.log("labelType", $('#labelType').val())
            if (!/disabled|empty/g.test(this.className)) {
                // $(this).toggleClass('selected')
            };
            if (this.className.indexOf('empty') == -1 && typeof el.data('config').cellClick == 'function') {
                el.data('config').cellClick(getDateStr(this), this.className.indexOf('disabled') != -1);
                $(".fullYearPicker td").removeClass("arrow_box");
                $(this).addClass("arrow_box");
                fullYearPicker_nowSelect = getDateStr(this);
                _viewer_.data('config').choose(_viewer_.fullYearPicker('getSelected'));
                // if(!$("[date='"+getDateStr(this)+"']").hasClass("selected")){
                //     fullYearPicker_nowSelect = null;
                //     //$(this).removeClass("arrow_box");
                // }else{
                //     fullYearPicker_nowSelect = getDateStr(this);
                //
                // }
            }
        });
    }

    //批量选中日期
    $.fn.selectDates = function(dateArray) {
            dateArray.forEach(function(item) {
                $("[date='" + item + "']").addClass("selected");
            });
        }
        //Power by Showbo,http://www.w3dev.cn/
        //@config：配置，具体配置项目看下面
        //@param：为方法时需要传递的参数
    $.fn.fullYearPicker = function(config, param) {
        if (config === 'setDisabledDay' || config === 'setYear' || config === 'getSelected' || config === 'acceptChange' || config === 'setColors' || config === 'setLabel' || config === 'setLawday' || config === 'initDate') { //方法
            var me = $(this);
            if (config == 'setYear') { //重置年份
                me.data('config').year = param; //更新缓存数据年份
                me.find('div.year a:first').trigger('click', true);
            } else if (config == 'getSelected') { //获取当前当前年份选中的日期集合（注意不更新默认传入的值，要更新值请调用acceptChange方法）
                return me.find('td.selected').map(function() {
                    // return me.find('td').map(function() {
                    var selectStr = getDateStr(this);
                    // console.log("this.className", ['lawday', 'tradeday', 'festivalday'].includes(this.className))
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
            } else if (config == 'setColors') { //设置单元格颜色 param格式为{defaultColor:'#f00',dc:[{d:'2017-8-2',c:'blue'}..]}，dc数组c缺省会用defaultColor代替，defaultColor也缺省默认红色
                return me.find('td').each(function() {
                    var d = getDateStr(this);
                    for (var i = 0; i < param.dc.length; i++)
                        if (d == param.dc[i].d) this.style.backgroundColor = param.dc[i].c || param.defaultColor || '#f00';
                });
            } else if (config == 'setLabel') {
                return me.find('td').each(function() {
                    var d = getDateStr(this);
                    for (var i = 0; i < param.dt.length; i++)
                        if (d == param.dt[i].d) {
                            $(this).addClass(param.dt[i].t)
                        }
                });
            } else if (config == 'setLawday') {
                me.find('td').removeClass();
                if (param) {
                    me.find('table tr:gt(1)').find('td').each(function() {
                        if ($(this).attr('date') && param.date.indexOf(this.cellIndex) != -1) {
                            $(this).addClass(param.label)
                        }
                    });
                }
            } else {
                me.find('td.disabled').removeClass('disabled');
                me.data('config').disabledDay = param; //更新不可点击星期
                console.log("param", param)
                if (param) {
                    me.find('table tr:gt(1)').find('td').each(function() {
                        // console.log("this", param, this.cellIndex)
                        if ($(this).attr('date') && param.indexOf(this.cellIndex) != -1)
                            this.className = (this.className || '').replace('selected', '') + (this.className ? ' ' : '') + 'disabled';
                    });
                }
            }
            return this;
        }
        //@year:显示的年份
        //@disabledDay:不允许选择的星期列，注意星期日是0，其他一样
        //@cellClick:单元格点击事件（可缺省）。事件有2个参数，第一个@dateStr：日期字符串，格式“年-月-日”，第二个@isDisabled，此单元格是否允许点击
        //@value:选中的值，注意为数组字符串，格式如['2016-6-25','2016-8-26'.......]
        //@yearScale:配置这个年份变为下拉框，格式如{min:2000,max:2020}
        config = $.extend({ year: new Date().getFullYear(), disabledDay: '', value: [], initDate: [], format: "", disable: false }, config);
        return this.addClass('fullYearPicker').each(function() {
            _viewer_ = $(this);
            _viewer_.html("");
            var me = $(this),
                year = config.year || new Date().getFullYear();
            newConifg = {
                cellClick: config.cellClick,
                disabledDay: config.disabledDay,
                year: year,
                value: config.value,
                yearScale: config.yearScale,
                choose: config.choose,
                initDate: config.initDate,
                format: config.format,
                disable: config.disable
            };
            me.data('config', newConifg);
            console.log(newConifg)
            var selYear = '';
            if (newConifg.yearScale) {
                selYear = '<select>';
                for (var i = newConifg.yearScale.min, j = newConifg.yearScale.max; i < j; i++) selYear += '<option value="' + i + '"' + (i == year ? ' selected' : '') + '>' + i + '</option>';

                selYear += '</select>';
            }
            selYear = selYear || year;
            me.append('<div class="year"><a href="#">上一年</a>' + selYear + '年<a href="#" class="next">下一年</a></div><div class="picker"></div>')
                .find('a').click(function(e, setYear) {
                    if (setYear) year = me.data('config').year;
                    else this.innerHTML == '上一年' ? year-- : year++;
                    me.find('select').val(year);
                    renderYear(year, $(this).closest('div.fullYearPicker'), newConifg.disabledDay, newConifg.value);
                    this.parentNode.firstChild.nextSibling.data = year + '年';
                    return false;
                }).end().find('select').change(function() {
                    me.fullYearPicker('setYear', this.value);
                });
            if (_viewer_.data('config').disable === true) {
                _viewer_.data('config').disabledDay = '0,1,2,3,4,5,6';
            }
            renderYear(year, me, newConifg.disabledDay, newConifg.value);

            if (newConifg.initDate.length > 0) {
                newConifg.initDate.forEach(function(p1, p2, p3) {
                    // console.log("p1", p1)
                    // console.log("p2", p2)
                    // console.log("p3", p3)
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
                        // console.log("items", items)
                        var item = items[0] + '-' + mm + '-' + dd;
                    }
                    // $("[date='" + item + "']").addClass("selected")
                    $("[date='" + item + "']").addClass(p1.dateType)
                })
            }
        });
    };


})();