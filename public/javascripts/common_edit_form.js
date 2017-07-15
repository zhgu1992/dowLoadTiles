//  edit form module
var EDIT_FORM = new EditForm();

function EditForm() {

    var cache_list_info_map = {}

    this.getEditFormHTML = function (formID, formAction, keyList, textList, styleList) {
        var html = ' <form class="form-horizontal" method="GET" id="' + formID + '" action="' + formAction + '"> \
              <div class="form-group">          \
                <div class="col-md-8">          \
                    <input type="hidden" name="id" class="form-control input-sm" id="input_id">   \
                </div>                          \
              </div>                            \
        ';

        for (var i = 0;i < keyList.length;i++) {
            html += '<div class="form-group" id="input_' + keyList[i] + '_form">';
            html += '<label for="input_' + keyList[i] + '" class="col-md-4 control-label">' + textList[i] + '</label>';

            if (styleList === undefined) { 
                html += '<div class="col-md-8"><input type="text" name="';
                html += keyList[i] + '" class="form-control input-sm" id="input_' + keyList[i] + '"></div>';
            }
            else if (styleList[i] === "image") {
                html += '<div class="col-md-8">';
                html += '<input type="hidden" name="' + keyList[i] + '" class="form-control input-sm" id="input_' + keyList[i] + '">';
                html += '<img id="input_' + keyList[i] + '_image" alt="" class="img-thumbnail" style="width:128px;height:128px;">';
                html += '<button id="input_' + keyList[i] + '_btn_modify" type="button" class="btn btn-primary btn-sm"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>';
                html += '<button id="input_' + keyList[i] + '_btn_remove" type="button" class="btn btn-danger btn-sm"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>';
                html += '</div>';
            }
            else if (styleList[i] === "list") {
                html += '<div class="col-md-8">';
                html += '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="input_' + keyList[i] + '_button"></button>';
                html += '<input type="hidden" name="' + keyList[i] + '" class="form-control input-sm" id="input_' + keyList[i] + '"></input>';
                html += '<ul class="dropdown-menu" id="input_' + keyList[i] + '_drop"></ul>';
                html += '</div>';
            }
            else if(styleList[i]==="drop"){
            	  html += '<div class="col-md-8">';
                  html += '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="input_' + keyList[i] + '_button">请选择</button>';
                  html += '<input type="hidden" name="' + keyList[i] + '" class="form-control input-sm" id="input_' + keyList[i] + '"></input>';
                  html += '<ul class="dropdown-menu" id="input_' + keyList[i] + '_drop"></ul>';
                  html += '</div>';
            }
			else if(styleList[i]==="group_drop"){
            	  html += '<div class="col-md-8">';
            	  html += '<div class="dropdown">';
                  html += '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="input_' + keyList[i] + '_button">请选择</button>';
                  html += '<input type="hidden" name="' + keyList[i] + '" class="form-control input-sm" id="input_' + keyList[i] + '"></input>';
                  html += '<ul class="dropdown-menu multi-level" role="menu" aria-labelledby="dropdownMenu" id="input_' + keyList[i] + '_drop"></ul>';
                  html += '</div>';
                  html += '</div>';
            }
            else if (styleList[i] === "textarea_sm") {
                html += '<div class="col-md-8">';
                html += '<textarea id="input_' + keyList[i] + '" name="' + keyList[i] + '" cols="50" rows="3"></textarea>'
                html += '</div>';
            }
            else if (styleList[i] === "textarea_lg") {
                html += '<div class="col-md-8">';
                html += '<textarea id="input_' + keyList[i] + '" name="' + keyList[i] + '" cols="50" rows="10"></textarea>'
                html += '</div>';
            }
            else if (styleList[i] === "richedit") {
                html += '<div class="col-md-8">';
                html += '<input type="hidden" name="' + keyList[i] + '" class="form-control input-sm" id="input_' + keyList[i] + '">';
                html += '<div id="input_' + keyList[i] + '_richedit"></div>'
                html += '</div>';
            }
            else if (styleList[i] === "checkbox") {
                html += '<div class="col-md-8">';
                html += '<input type="hidden" name="' + keyList[i] + '" class="form-control input-sm" id="input_' + keyList[i] + '">';
                html += '<input type="checkbox" id="input_' + keyList[i] + '_checkbox"></input>'
                html += '</div>';
            }
            else if(styleList[i]==="map"){//添加两个隐藏input存放坐标 以及一个input存放商铺名称  一个存放楼层 隐藏
            	  html += '<div class="col-md-8">';
                  html += '<input type="hidden" name="shop_id" class="form-control input-sm" id="input_shop_id">';
                  html += '<input type="hidden" name="lon" class="form-control input-sm" id="input_lon">';
                  html += '<input type="hidden" name="lat" class="form-control input-sm" id="input_lat">';
                  html += '<input type="hidden" name="floor" class="form-control input-sm" id="input_floor">';
                  html += '<input type="hidden" name="shop_name" class="form-control input-sm" id="input_shop_name">';
                  html += '<input type="button"  class="btn btn-default dropdown-toggle" id="input_' + keyList[i] + '_button" onclick="showMap()" value="详情"></input>';
                  html += '</div>';
            }
            else if(styleList[i]==="timespan"){
            	  html += '<div class="col-md-8">';
                  html += '<input type="hidden" name="weekday" class="form-control input-sm" id="input_weekday" value="-1">';
                  html += '<input type="hidden" name="weekend" class="form-control input-sm" id="input_weekend"  value="-1">';
                  html += '<input type="hidden" name="holiday" class="form-control input-sm" id="input_holiday"  value="-1">';
                  html += '<input type="button"  class="btn btn-default dropdown-toggle" id="input_' + keyList[i] + '_button" onclick="showTimeSelect()" value="显示详情"></input>';
                  html += '</div>';
            }
            else if(styleList[i]==="location"){
            	  html += '<div class="col-md-8">';
                  html += '<input type="hidden" name="shop_id" class="form-control input-sm" id="input_shop_id">';
                  html += '<input type="hidden" name="lon" class="form-control input-sm" id="input_lon">';
                  html += '<input type="hidden" name="lat" class="form-control input-sm" id="input_lat">';
                  html += '<input type="hidden" name="floor" class="form-control input-sm" id="input_floor">';
                  html += '<input type="hidden" name="shop_name" class="form-control input-sm" id="input_shop_name">';
                  html += '<input type="hidden" name="outdoor" class="form-control input-sm" id="input_outdoor">';
                  html += '<input type="hidden" name="radius" class="form-control input-sm" id="input_radius">';
                  html += '<input type="hidden" name="type" class="form-control input-sm" id="input_type">';
                  html += '<input type="hidden" name="ibeacon_id" class="form-control input-sm" id="input_ibeacon_id">';
                  html += '<input type="button"  class="btn btn-default dropdown-toggle" id="input_' + keyList[i] + '_button" onclick="showLocationSelect()" value="显示详情"></input>';
                  html += '</div>';
            }
            else if(styleList[i]==="member"){
            	  html += '<div class="col-md-8">';
                  html += '<input type="hidden" name="userlabel" class="form-control input-sm" id="input_userlabel">';
                  html += '<input type="button"  class="btn btn-default dropdown-toggle" id="input_' + keyList[i] + '_button" onclick="showMemberSelect()" value="显示详情"></input>';
                  html += '</div>';
            }
            else if(styleList[i]==="userlabel"){
            	  html += '<div class="col-md-8">';
                  html += '<input type="button"  class="btn btn-default dropdown-toggle" id="input_' + keyList[i] + '_button" onclick="showUserLabel()" value="显示详情"></input>';
                  html += '</div>';
            }
            else if(styleList[i]==="date"){//使用bootstrap datepicker
            	  html += '<div class="col-md-8">';
                  html += '<input type="hidden" name="' + keyList[i] + '" class="form-control input-sm" id="input_' + keyList[i] + '">';
                  html += '<input id="input_' + keyList[i] + '_datePicker"  class="input-append date"  type="text"></input>';
                  html += '</div>';
            }
            else if(styleList[i]==="custom"){//用户自定义
            	  html += '<div class="col-md-8">';
                  html += getCustomHtml(i);
                  html += '</div>';
            }
            else {
                html += '<div class="col-md-8"><input type="' + styleList[i] + '" name="';
                html += keyList[i] + '" class="form-control input-sm" id="input_' + keyList[i] + '"></div>';
            }
            html += '</div>';
        }
        html += '</form>';
        return html;
    }

    this.setShowImage = function (inputKey, imageUrl) {
        $("#input_" + inputKey + "_image").attr("src", imageUrl)
    }

    function configLimitRule(key, limitRule) {
        $("#input_" + key).bind('input propertychange', function() {
            var tVal = $(this).val()
            var isAvalible = true;
            var errorText = "";

            if (limitRule.isMobile !== undefined && limitRule.isMobile) {
                if (parseInt(tVal) != tVal) {
                    isAvalible = false;
                    errorText = "应为整数";
                }
                else {
                    if (tVal.length !== 11) {
                        isAvalible = false;
                        errorText = "应为11位手机号";
                    }
                }
            }

            if (limitRule.isInt !== undefined && limitRule.isInt) {
                if (parseInt(tVal) != tVal) {
                    isAvalible = false;
                    errorText = "应为整数";
                }
            }

            if (limitRule.isFloat !== undefined && limitRule.isFloat) {
                if (isNaN(tVal)) {
                    isAvalible = false;
                    errorText = "应为数字";
                }
            }

            if (limitRule.isEmail !== undefined && limitRule.isEmail) {
                if (tVal.indexOf("@") < 0 || tVal.indexOf(".") < 0)
                    isAvalible = false;
                    errorText = "非法的电子邮件格式";
            }

            if (limitRule.isNotNull !== undefined && limitRule.isNotNull) {
                if (tVal.length === 0) {
                    isAvalible = false;
                    errorText = "不能为空";
                }
            }

            if (isAvalible) {
                $("#input_" + key + "_form").attr("class", "form-group has-success");
                if ($("#input_" + key + "_notice").length > 0) {
                    $("#input_" + key + "_notice").remove();
                }
            }
            else {
                $("#input_" + key + "_form").attr("class", "form-group has-warning");
                if ($("#input_" + key + "_notice").length > 0) {
                    $("#input_" + key + "_notice").html(errorText);
                }
                else {
                    $("#input_" + key).after('<label class="control-label" id="input_' + key + '_notice"></label>')
                    $("#input_" + key + "_notice").html(errorText);
                }
            }
        });
    }

    // key: isNotNull isEmail isInt isFloat isMobile
    this.setLimitRule = function (keyList, limitRuleList) {
        for (var i = 0;i < keyList.length;i++) {
            configLimitRule(keyList[i], limitRuleList[i])
        }
    }
    
    this.clearLimitRuleCache = function (keyList) {
        for (var i = 0;i < keyList.length;i++) {
            $("#input_" + keyList[i] + "_form").attr("class", "form-group");
            if ($("#input_" + keyList[i] + "_notice").length > 0) {
                $("#input_" + keyList[i] + "_notice").remove();
            }
        }
    }

    this.setListSelect = function (inputKey, id) {
        if (id === undefined) {//新增
            if (cache_list_info_map[inputKey] !== undefined && cache_list_info_map[inputKey].length > 0) {
                $("#input_" + inputKey + "_button").html("请选择");
                $("#input_" + inputKey).val("");
            }
        }
        else {//修改
            $("#input_" + inputKey).val(id);
            if (cache_list_info_map[inputKey] !== undefined) {
                for (var i = 0;i < cache_list_info_map[inputKey].length;i++) {
                    if (cache_list_info_map[inputKey][i].id == id) {
                        $("#input_" + inputKey + "_button").html(cache_list_info_map[inputKey][i].text+'<span class="caret"></span>');
                        break;
                    }
                }
            }
        }
        if (typeof(select_callback) !== "undefined")
        	select_callback(inputKey,id);
    }

    this.setListInfo = function (inputKey, listInfo) {
        cache_list_info_map[inputKey] = listInfo;
        var strHtml = "";
        for (var i = 0;i < listInfo.length;i++) {
            strHtml += '<li onclick=\'EDIT_FORM.setListSelect("' + inputKey + '", "' + listInfo[i].id + '")\'><a href="#">'
            strHtml += listInfo[i].text;
            strHtml += '</a></li>';
        }
        $("#input_" + inputKey + "_drop").html(strHtml);
    }
    
     this.configSomeImage = function (field_name, pre_url) {
        $("#input_" + field_name + "_btn_modify").click(function() {

            var html = "";
            html += '<form class="form-horizontal" method="POST" id="form_test" action="' + pre_url + '-upload-logo/">';
            html += '<div class="form-group">';
            html += '<div class="col-md-8">';
            html += '<input type="file" name="image" id="image_test">';
            html += '</div>';
            html += '</div>';
            html += '<button type="submit">提交</button>';
            html += '</form>';

            var imageDialogInstance = new BootstrapDialog({
                title : "图片编辑",
                message: html,
            });

            imageDialogInstance.realize();
            imageDialogInstance.getModalContent().find("#image_test").picEdit({
                formSubmitted: function(response){
                    console.log(response);
                    imageDialogInstance.close();
                    var img_url = JSON.parse(response.response).fileurl;
                    var img_name = JSON.parse(response.response).filename;
                    $("#input_" + field_name + "_image").attr("src", img_url);
                    $("#input_" + field_name).val(img_name);
                }
            });
            imageDialogInstance.open();
        });

        $("#input_" + field_name + "_btn_remove").click(function() {
            $("#input_" + field_name + "_image").attr("src", "");
            $("#input_" + field_name).val("");
        });
    }

    this.configSomeCheckbox = function (field_name) {
       $("#input_" + field_name + "_checkbox").change(function() {
            if ($(this).prop('checked')) {
                $("#input_" + field_name).val(true);
            }
            else {
                $("#input_" + field_name).val(false);
            }
        });
    }

    this.configSomeRichedit = function (field_name) {
       $("#input_" + field_name + "_richedit").summernote({
            height: 300,
            lang: 'zh-CN',
       });

       $("#input_" + field_name + "_richedit").on('summernote.change', function() {
           $("#input_" + field_name).val($("#input_" + field_name + "_richedit").code());
       });
    }
    //数据处理：图片路径转为图片，时间格式化
    this.processJsonData = function (someJsonData) {
        for (var i = 0;i < someJsonData.length;i++) {
            if (someJsonData[i].fields["logo"] !== undefined) {
                someJsonData[i].fields["logo_div"] = "";
                if (someJsonData[i].fields["logo"].length > 0) {
                    someJsonData[i].fields["logo_div"] = '<img style="max-width:80px;max-heigh:80px;vertical-align:middle;" src="' + someJsonData[i].fields["logo"] + '">';
                }
            }
			if (someJsonData[i].fields["small_pic"] !== undefined) {
                someJsonData[i].fields["small_pic_div"] = "";
                if (someJsonData[i].fields["small_pic"].length > 0) {
                    someJsonData[i].fields["small_pic_div"] = '<img style="max-width:80px;max-heigh:80px;vertical-align:middle;" src="' + someJsonData[i].fields["small_pic"] + '">';
                }
            }
            if (someJsonData[i].fields["createtime"] !== undefined) {
                var tDate = new Date(someJsonData[i].fields["createtime"])
                someJsonData[i].fields["createtime"] = tDate.toLocaleString()
            }

            if (someJsonData[i].fields["modifytime"] !== undefined&&someJsonData[i].fields["modifytime"] !="") {
                var tDate = new Date(someJsonData[i].fields["modifytime"])
                someJsonData[i].fields["modifytime"] = tDate.toLocaleString()
            }
			if (someJsonData[i].fields["reg_time"] !== undefined) {
                var tDate = new Date(someJsonData[i].fields["reg_time"])
                someJsonData[i].fields["reg_time"] = tDate.toLocaleString()
            }
            if (someJsonData[i].fields["share_date"] !== undefined) {
                var tDate = new Date(someJsonData[i].fields["share_date"])
                someJsonData[i].fields["share_date"] = tDate.toLocaleString()
            }
            if (typeof(edit_form_traverse_data_callback) !== "undefined") {
                edit_form_traverse_data_callback(someJsonData[i].fields);
            }
        }
    }
    
    this.configSomeWhenAdd = function (field, style) {
        if (style == "image") {
            EDIT_FORM.setShowImage(field, "");
        	$("#input_"+field+"_btn_modify").attr("disabled",false);
        	$("#input_"+field+"_btn_remove").attr("disabled",false);   
        }
        else if (style == "checkbox") {
            $("#input_" + field + "_checkbox").prop("checked", false);
            $("#input_" + field + "_checkbox").attr('disabled',false)
        }
        else if (style == "richedit") {
            $("#input_" + field + "_richedit").code("");
             $("#input_" + field + "_richedit").attr('disabled',false)
        }
        else if(style == "date"){
        	$("#input_" + field + "_datePicker").datepicker("update","");
        	$("#input_" + field + "_datePicker").attr('disabled',false)
        }
        $("#input_" + field).val("");
        $("#input_"+field).attr('disabled',false);
    }
    

    
    //isView为true代表查看，false代表编辑
      this.configSomeWhenModify = function (field, style, tVal,isView) {
        if (style == "image") {
            EDIT_FORM.setShowImage(field, tVal);
            index = tVal.lastIndexOf("/")
            tVal = tVal.substr(index + 1, index.length)
            $("#input_" + field).val(tVal);
            if(isView){
            	$("#input_"+field+"_btn_modify").attr("disabled",true);
            	$("#input_"+field+"_btn_remove").attr("disabled",true);
            }
            else{
            	$("#input_"+field+"_btn_modify").attr("disabled",false);
            	$("#input_"+field+"_btn_remove").attr("disabled",false);            	
            }
            return;
        }
        else if (style == "checkbox") {
            if (tVal) {
                $("#input_" + field + "_checkbox").prop("checked", true);
            }
            else {
                $("#input_" + field + "_checkbox").prop("checked", false);
            }
            if(isView)
        		$("#input_"+field+"_checkbox").attr('disabled',true)
        	else
        		$("#input_"+field+"_checkbox").attr('disabled',false)
        }
        else if (style == "richedit") {
            $("#input_" + field + "_richedit").code(tVal)
            if(isView)
        		$("#input_"+field+"_richedit").attr('disabled',true)
        	else
        		$("#input_"+field+"_richedit").attr('disabled',false)
        }
        else if(style=="map"){
        	$("#input_" + field + "_button").val(html_decode(tVal))
        	$("#input_" + field + "_button").attr('disabled',true)
        }
        else if ((style == "datetime-local") ) {
            // 2015-07-22T07:15:06.939Z
            // to
            // 2015-07-22T07:15
            tVal = tVal.substr(0,16)
        }
        else if(style == "date"){
        	tVal = tVal.substr(0,10)
        	$("#input_"+field+"_datePicker").datepicker('update',tVal);
        	if(isView)
        		$("#input_"+field+"_datePicker").attr('disabled',true)
        	else
        		$("#input_"+field+"_datePicker").attr('disabled',false)
        }
        else if(style=="drop"){
        	if(isView)
        		$("#input_" + field + "_button").attr('disabled',true)
        }
        else if(style=="group_drop"){
        	if(isView)
        		$("#input_" + field + "_button").attr('disabled',true)
        }
        if(style!="timespan"&&style!="map"&&style!="location"&&style!="member")
        	$("#input_"+field).val(tVal);
        if(isView)
        	$("#input_"+field).attr('disabled',true)
        else
        	$("#input_"+field).attr('disabled',false)
    }
	  function html_decode(str) 
	{ 
	    var s = ""; 
	    if (str.length == 0) return ""; 
	    s = str.replace(/&amp;/g, "&"); 
	    s = s.replace(/&lt;/g, "<"); 
	    s = s.replace(/&gt;/g, ">"); 
	    s = s.replace(/&nbsp;/g, " "); 
	    s = s.replace(/&#39;/g, "\'"); 
	    s = s.replace(/&quot;/g, "\""); 
	    s = s.replace(/<br\/>/g, "\n"); 
	    return s; 
	} 
}