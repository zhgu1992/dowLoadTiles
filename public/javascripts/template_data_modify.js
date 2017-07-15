/*
console.log(modify_pre_url)
console.log(modify_name)
console.log(popup_window_id)
console.log(edit_form_fieldsNameList)
console.log(edit_form_titleList)
console.log(edit_form_styleList)
console.log(data_table_titleList)
console.log(data_table_keyList)
*/

// edit_form_init_form_callback  初始化后的回调
// edit_form_edit_data_callback  触发编辑数据的回调
// edit_form_added_data_callback 新增编辑数据的回调
// edit_form_traverse_data_callback 遍历下载数据的回调

var g_SomeJsonData;

function configEditForm() {
    if (typeof(edit_form_limitRuleList) !== "undefined") {
        EDIT_FORM.setLimitRule(edit_form_fieldsNameList, edit_form_limitRuleList);
    }

    if (typeof(edit_form_init_form_callback) !== "undefined") {
        edit_form_init_form_callback();
    }

    for (var i = 0;i < edit_form_styleList.length;i++) {
        if (edit_form_styleList[i] == "image") {
            EDIT_FORM.configSomeImage(edit_form_fieldsNameList[i], modify_pre_url);
        }
        if (edit_form_styleList[i] == "checkbox") {
            EDIT_FORM.configSomeCheckbox(edit_form_fieldsNameList[i]);
        }
        if (edit_form_styleList[i] == "richedit") {
            EDIT_FORM.configSomeRichedit(edit_form_fieldsNameList[i]);
        }
    }
}


function configEditFormWhenAdd() {
    $("#input_id").val("")
    for (var i = 0;i < edit_form_fieldsNameList.length;i++) {
        EDIT_FORM.configSomeWhenAdd(edit_form_fieldsNameList[i], edit_form_styleList[i]);
    }

    if (typeof(edit_form_added_data_callback) !== "undefined") {
        edit_form_added_data_callback();
    } 

    if (typeof(edit_form_limitRuleList) !== "undefined") {
        EDIT_FORM.clearLimitRuleCache(edit_form_fieldsNameList);
    }
}

function configEditFormWhenModify(index) {
    var tID = g_SomeJsonData[index].fields.id;
    $("#input_id").val(tID);
    var fieldData = g_SomeJsonData[index].fields;
    for (var i = 0;i < edit_form_fieldsNameList.length;i++) {
        var tVal = fieldData[edit_form_fieldsNameList[i]];
        EDIT_FORM.configSomeWhenModify(edit_form_fieldsNameList[i], edit_form_styleList[i], tVal,false);
    }
    if (typeof(edit_form_edit_data_callback) !== "undefined") {
        edit_form_edit_data_callback(fieldData);
    }

    if (typeof(edit_form_limitRuleList) !== "undefined") {
        EDIT_FORM.clearLimitRuleCache(edit_form_fieldsNameList);
    }
}

function configEditFormWhenShowDetail(index) {
    var tID = g_SomeJsonData[index].fields.id;
    $("#input_id").val(tID);
    var fieldData = g_SomeJsonData[index].fields;
    for (var i = 0;i < edit_form_fieldsNameList.length;i++) {
        var tVal = fieldData[edit_form_fieldsNameList[i]];
        EDIT_FORM.configSomeWhenModify(edit_form_fieldsNameList[i], edit_form_styleList[i], tVal,true);
    }
    if (typeof(edit_form_view_data_callback) !== "undefined") {
        edit_form_view_data_callback(fieldData);
    }
}
if(typeof(isAudit) == "undefined")
	updateSomeData();
//更新数据
function updateSomeData() {
	if(typeof data_table_sortIndex == "undefined")
		data_table_sortIndex=undefined
    $.getJSON( modify_pre_url + "-list/", function (data) {
        g_SomeJsonData = data;
        EDIT_FORM.processJsonData(g_SomeJsonData);
        var tableData = MODIFY_TABLE.getTableDataByKeyList(g_SomeJsonData, data_table_keyList);
        if(typeof data_table_widthList == "undefined"){
        	if(typeof showDetail != "undefined"&&showDetail==true)
        		MODIFY_TABLE.createModifyDetailTable(tableData, data_table_id, data_table_titleList, data_table_sortIndex);
        	else if(typeof showDetailOnly != "undefined"&&showDetailOnly==true)
        		MODIFY_TABLE.createDetailTable(tableData, data_table_id, data_table_titleList, data_table_sortIndex);
        	else if(typeof modifyOnly != "undefined"&&modifyOnly==true)
        		MODIFY_TABLE.createModifyOnlyTable(tableData, data_table_id, data_table_titleList, data_table_sortIndex);
        	else if(typeof modifyDetailOnly != "undefined"&&modifyDetailOnly==true)
        		MODIFY_TABLE.createModifyDetailOnlyTable(tableData, data_table_id, data_table_titleList, data_table_sortIndex);
        	else if(typeof readOnly != "undefined"&&readOnly==true)
        		MODIFY_TABLE.createReadOnlyTable(tableData, data_table_id, data_table_titleList, data_table_sortIndex);
        	else if(typeof showUse != "undefined"&&showUse==true)
        		MODIFY_TABLE.createShowUseTable(tableData, data_table_id, data_table_titleList, data_table_sortIndex);
        	else if(typeof showCancel != "undefined"&&showCancel==true)
        		MODIFY_TABLE.createShowCancelTable(tableData, data_table_id, data_table_titleList, data_table_sortIndex);
        	else
        		MODIFY_TABLE.createModifyTable(tableData, data_table_id, data_table_titleList, data_table_sortIndex);
        }
        else{
        	if(typeof showDetail != "undefined"&&showDetail==true)
        		MODIFY_TABLE.createModifyDetailTable(tableData, data_table_id, data_table_titleList, data_table_sortIndex,data_table_widthList);
        	else if(typeof showDetailOnly != "undefined"&&showDetailOnly==true)
        		MODIFY_TABLE.createDetailTable(tableData, data_table_id, data_table_titleList, data_table_sortIndex,data_table_widthList);
        	else if(typeof modifyOnly != "undefined"&&modifyOnly==true)
        		MODIFY_TABLE.createModifyOnlyTable(tableData, data_table_id, data_table_titleList, data_table_sortIndex,data_table_widthList);
        	else if(typeof modifyDetailOnly != "undefined"&&modifyDetailOnly==true)
        		MODIFY_TABLE.createModifyDetailOnlyTable(tableData, data_table_id, data_table_titleList, data_table_sortIndex,data_table_widthList);
        	else if(typeof readOnly != "undefined"&&readOnly==true)
        		MODIFY_TABLE.createReadOnlyTable(tableData, data_table_id, data_table_titleList, data_table_sortIndex,data_table_widthList);
        	else if(typeof showAudit != "undefined"&&showAudit==true)
        		MODIFY_TABLE.createShowAuditTable(tableData, data_table_id, data_table_titleList, data_table_sortIndex,data_table_widthList);
        	else if(typeof showCancel != "undefined"&&showCancel==true)
        		MODIFY_TABLE.createShowCancelTable(tableData, data_table_id, data_table_titleList, data_table_sortIndex,data_table_widthList);
        	else
        		MODIFY_TABLE.createModifyTable(tableData, data_table_id, data_table_titleList, data_table_sortIndex,data_table_widthList);
        }
    });
}

function deleteSomeData(index_list) {
    if (g_SomeJsonData === undefined)
        return;
    
    if (index_list.length === 0)
        return;

    BootstrapDialog.show({
        title: '删除',
        message: '确定删除吗?',
        buttons: [{
            label: '确定',
            action: function(dialog) {
                var id_list = [];
                for (var i = 0;i < index_list.length;i++) {
                    id_list.push(g_SomeJsonData[index_list[i]].fields.id);
                }
                var serialInfo = JSON.stringify(id_list);
                $.get( modify_pre_url + "-delete/?id_list=" + serialInfo, function (data, status) {
                    updateSomeData();
                    toastr.success('删除成功');
                });
                dialog.close();
            }
        }, {
            label: '取消',
            action: function(dialog) {
                dialog.close();
            }
        }]
    });
}

function _audit_single_table_data(index){
	 if (typeof(audit_data) !== "undefined")
			audit_data(index);
}
function _cancel_single_table_data(index){
	 if (typeof(cancel_data) !== "undefined")
			cancel_data(index);
}
function _edit_single_table_data(index) {
    var html = EDIT_FORM.getEditFormHTML("form-editor", modify_pre_url + "-edit/", edit_form_fieldsNameList, edit_form_titleList, edit_form_styleList);
    $.ajaxSetup({//很重要，设置全局同步
    	   async: false
    });
    BootstrapDialog.show({
    	id: 'mySomeModal',
        title: "修改" + modify_name,
        message: html,
        onshown: function(dialogRef) {
            configEditForm();
            configEditFormWhenModify(index);
        },
        buttons: [{
            label: '提交',
            cssClass: 'btn-primary',
            action: function(dialog) {
            	toastr.clear()

                $('#form-editor').ajaxSubmit(function(data) {
					if (data["success"]==0){
	                    updateSomeData();
	                    toastr.success('修改成功');
                		dialog.close();
                	}
                	else{
                		warn_info = "";
	                	for (var w_key in data["info"]){
	                		warn_info += "<p>" + w_key + data["info"][w_key] + "</p>";
	                	}
                		toastr.warning(warn_info);
	                }
                });
            }
        }, {
            label: '取消',
            action: function(dialog) {
                dialog.close();
            }
        }]
    });
}

function _delete_single_table_data(index) {
    console.log(index);
    deleteSomeData([index]);
}

function _delete_checked_table_data(index) {
    console.log(index);
    deleteSomeData(MODIFY_TABLE.getCheckedIndexList());
}

function _added_table_data() {
    var html = EDIT_FORM.getEditFormHTML("form-editor", modify_pre_url + "-edit/", edit_form_fieldsNameList, edit_form_titleList, edit_form_styleList);
    BootstrapDialog.show({
    	 id: 'mySomeModal',
        title: "新增" + modify_name,
        message: html,
        onshown: function(dialogRef) {
            configEditForm();
            configEditFormWhenAdd();
        },
        buttons: [{
            label: '提交',
            cssClass: 'btn-primary',
            action: function(dialog) {
				toastr.clear()

                $('#form-editor').ajaxSubmit(function(data) {
                    if (data["success"]==0){
                        updateSomeData();
                        toastr.success('添加成功');
                        dialog.close();
                    }
                    else{
                        warn_info = "";
                        for (var w_key in data["info"]){
                            warn_info += "<p>" + w_key + data["info"][w_key] + "</p>";
                        }
                        toastr.warning(warn_info);
                    }
                });
            }
        }, {
            label: '取消',
            action: function(dialog) {
                dialog.close();
            }
        }]
    });
    }
   function _view_single_table_data(index){
		//var html = EDIT_FORM.getEditFormHTML("form-editor", permit_pre_url + "-edit/", edit_form_fieldsNameList, edit_form_titleList, edit_form_styleList);
        view_Content(index);
   }
    function view_Content(index) {
    var tID = g_SomeJsonData[index].fields.id;
    $("#input_id").val(tID);
    var html = EDIT_FORM.getEditFormHTML("form-editor", modify_pre_url + "-edit/", edit_form_fieldsNameList, edit_form_titleList, edit_form_styleList);

    BootstrapDialog.show({
    	id: 'mySomeModal',
        title: "查看" + modify_name,
        message: html,
        onshown: function(dialogRef) {
            configEditForm();
            configEditFormWhenShowDetail(index);
        }
        ,buttons: [{
            label: '取消',
            action: function(dialog) {
                dialog.close();
            }
        }]
    });
}