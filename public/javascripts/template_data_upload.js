console.log(upload_indoor_id);
console.log(upload_pre_url);
console.log(upload_extra_fieldsList);
console.log(upload_data_fieldsList);
console.log(data_table_titleList);
console.log(data_table_keyList);
console.log(data_table_sortIndex);

var g_FileInfo;
var g_ExtraInfo;
var g_SomeJsonData

$.widget.bridge('uibutton', $.ui.button);

$("#buttonCommit").attr("disabled","disabled");

var url =  upload_pre_url + "-upload";
url += "?indoorid=" + upload_indoor_id;

$('#fileupload').fileupload({
    url: url,
    dataType: 'json',
    done: function (e, data) {
        console.log(e);
        console.log(data);
        if (data.result.success === 0) {
            $("#buttonCommit").removeAttr("disabled");
            g_ExtraInfo = data.result.extraInfo;
            g_FileInfo = data.result.fileInfo;
            
            $("#inputExtraInfo").val(JSON.stringify(g_ExtraInfo))
            $("#inputFileInfo").val(JSON.stringify(g_FileInfo))
        }
    }
});

updateDataTable(true);
      
function commitUploadData() {
	if(upload_pre_url.indexOf("shp")==-1&&upload_pre_url.indexOf("style")==-1){//shp与style上传不判断
	    if (g_ExtraInfo === undefined || g_FileInfo === undefined)
	        return;
	    if(upload_pre_url==BASE_URL+"/mapeditor/fingerprintrelease")
	    {
		    if(g_ExtraInfo.buildingId===undefined||((g_ExtraInfo.buildingId!==""+upload_indoor_id)&&(g_ExtraInfo.buildingId!=upload_indoor_id))){
		    	alert("上传指纹数据与当前门店不匹配，请重新上传");
		    	return
		    }
		}
		else {
		    if(g_ExtraInfo.buildingID===undefined||((g_ExtraInfo.buildingID!==""+upload_indoor_id)&&(g_ExtraInfo.buildingID!=upload_indoor_id))){
		    	alert("上传门店数据信息有误，请重新上传");
		    	return
			}
    	}
	}
    var url =  upload_pre_url + "-commit?";
    url += "indoorid=" + upload_indoor_id;
    url += "&filename=" + g_FileInfo.filename;
    url += "&fileMD5=" + g_FileInfo.fileMD5;
    url += "&fileSize=" + g_FileInfo.fileSize;
    
    if (typeof(cb_getAddedUrlInfo) !== "undefined") {
        url += cb_getAddedUrlInfo();
    }
    
    for (var i = 0;i < upload_data_fieldsList.length;i++) {
        if (typeof(g_ExtraInfo[upload_extra_fieldsList[i]]) !== "string") {
            url += "&" + upload_data_fieldsList[i] + "=" + JSON.stringify(g_ExtraInfo[upload_extra_fieldsList[i]]);
        }
        else {
            url += "&" + upload_data_fieldsList[i] + "=" + g_ExtraInfo[upload_extra_fieldsList[i]];     
        }
    }
    if(upload_pre_url=="/mapeditor/stylerelease")//style文件没有版本号，为了保持与其他上传文件一致，手动添加参数
    	url +="&data_version="
    $.getJSON(url, function (data) {
//        console.log(data);
        updateDataTable(false);
        $("#inputExtraInfo").val("");
        $("#inputFileInfo").val("");
        $("#buttonCommit").attr("disabled","disabled");
        if(data.success === 0)
        {
	        if (typeof relaseH5Data !== "undefined") {//如果是H5发布页面并且上传成功，需要发布数据
	        	relaseH5Data();
	        }
            toastr.success('上传成功')
        }
        else
        	toastr.error('上传失败')
    });
}

function updateDataTable(isInit) {
    $.getJSON( upload_pre_url + "-list?indoorid=" + upload_indoor_id, function (data) {
        console.log(data);
        g_SomeJsonData = data;
        EDIT_FORM.processJsonData(g_SomeJsonData);
        var tableData = MODIFY_TABLE.getTableDataByKeyList(g_SomeJsonData, data_table_keyList);
        if(typeof data_table_widthList == "undefined")
        	MODIFY_TABLE.createReadOnlyTable(tableData, data_table_id, data_table_titleList, data_table_sortIndex);
        else
        	MODIFY_TABLE.createReadOnlyTable(tableData, data_table_id, data_table_titleList, data_table_sortIndex,data_table_widthList);
    });
}