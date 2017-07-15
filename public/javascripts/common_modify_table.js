// ModifyTable module 
var MODIFY_TABLE = new ModifyTable();

function ModifyTable() {
    
    var TABLE_READONLY = 0;
    var TABLE_SELECT = 1;
    var TABLE_MODIFY = 2;
    var currentDataTable;
    
    this.createReadOnlyTable = function (dataIn, htmlID, titleList, sortIndex,widthList) {
        createTable(dataIn, htmlID, titleList, sortIndex, 0,widthList);
    }
    
    this.createSelectTable = function (dataIn, htmlID, titleList, sortIndex,widthList) {
        createTable(dataIn, htmlID, titleList, sortIndex, 1,widthList);
    }
    
    this.createModifyTable = function (dataIn, htmlID, titleList, sortIndex,widthList) {
        createTable(dataIn, htmlID, titleList, sortIndex, 2,widthList);
    }
    this.createDetailTable = function (dataIn, htmlID, titleList, sortIndex,widthList) {
    	createTable(dataIn, htmlID, titleList, sortIndex, 3,widthList);
    }
    this.createSelectDetailTable = function (dataIn, htmlID, titleList, sortIndex,widthList) {
    	createTable(dataIn, htmlID, titleList, sortIndex, 4,widthList);
    }
    this.createModifyDetailTable = function (dataIn, htmlID, titleList, sortIndex,widthList) {
    	createTable(dataIn, htmlID, titleList, sortIndex, 5,widthList);
    }
    this.createModifyOnlyTable = function (dataIn, htmlID, titleList, sortIndex,widthList) {
    	createTable(dataIn, htmlID, titleList, sortIndex, 6,widthList);
    }
    this.createModifyDetailOnlyTable = function (dataIn, htmlID, titleList, sortIndex,widthList) {
    	createTable(dataIn, htmlID, titleList, sortIndex, 7,widthList);
    }
    this.createShowUseTable = function (dataIn, htmlID, titleList, sortIndex,widthList) {
    	createTable(dataIn, htmlID, titleList, sortIndex, 8,widthList);
    }
    this.createShowCancelTable = function (dataIn, htmlID, titleList, sortIndex,widthList) {
    	createTable(dataIn, htmlID, titleList, sortIndex, 9,widthList);
    }
    this.getCheckedIndexList = function () {
        var resultList = [];
        for (var i = 0;i < $("input[name='checkList']").length;i++) {
            var tElement = $("input[name='checkList']")[i];
            if ($(tElement).prop('checked')) {
                resultList.push($(tElement).val())
            }
        }
        return resultList;
    }

    this.getEditFormHTML = function (keyList, textList) {
        var html = ' \
              <div class="form-group">          \
                <div class="col-md-8">          \
                    <input type="text" name="id" class="form-control input-sm" id="input_id" readonly>   \
                </div>                          \
              </div>                            \
        ';

        for (var i = 0;i < keyList.length;i++) {
            html += '<div id= "input_' + keyList[i] + '_label" class="form-group"><label for="input_' + keyList[i] + '" class="col-md-4 control-label">';
            html += textList[i] + '</label><div class="col-md-8"><input type="text" name="';
            html += keyList[i] + '" class="form-control input-sm" id="input_' + keyList[i] + '"></div></div>';
        }
        return html;
    }

    this.getViewFormHTML = function (keyList, textList) {
        var html = ' \
              <div class="form-group">          \
                <div class="col-md-8">          \
                    <input type="text" name="id" class="form-control input-sm" id="input_id" readonly>   \
                </div>                          \
              </div>                            \
        ';

        for (var i = 0;i < keyList.length;i++) {
            html += '<div id= "input_' + keyList[i] + '_label" class="form-group"><label for="input_' + keyList[i] + '" class="col-md-4 control-label">';
            html += textList[i] + '</label><div class="col-md-8"><input type="text" name="';
            html += keyList[i] + '" class="form-control input-sm" id="input_' + keyList[i] + '"></div></div>';
        }
        return html;
    }
    this.getTableDataByKeyList = function (jsonDataList, keyList) {
        var tableData = [];
        for (var i = 0;i < jsonDataList.length;i++) {
           var subTableData = [];
           for (var j = 0;j < keyList.length;j++) {
               subTableData.push(jsonDataList[i].fields[keyList[j]]);
           }
           tableData.push(subTableData);
        }
        return tableData;
    }
 //创建表格
 //tableStyle--2 编辑 删除 --3 查看(无checkbox) --4 查看  --5 编辑查看删除 --6 编辑 --7 编辑查看 --8查看使用 --9查看取消
    function createTable(dataIn, htmlID, titleList, sortIndex, tableStyle,widthList) {
        var tTableObject = document.getElementById(htmlID)
        if (tTableObject === null) {
            console.log("no element of" + htmlID)
            return;
        }
        
        if (typeof(currentDataTable) !== "undefined") {
            currentDataTable.fnDestroy()
        }

        var tData = []
        for (var i = 0;i < dataIn.length;i++) {
            var tDict = {};
            tDict["id"] = i.toString();
            for (var j = 0;j < dataIn[i].length;j++) {
                tDict["row" + j.toString()] = dataIn[i][j];
            }
            tData.push(tDict);
        }

        var tHtml = "<thead><tr>";
        
        if (tableStyle > 0&&tableStyle!=3&&tableStyle!=6&&tableStyle!=7&&tableStyle!=8&&tableStyle!=9) {
            tHtml += '<th style="width:15px"><input type="checkbox" id="checkAll"></th>'
        }
        else if (tableStyle==8 || tableStyle==9) {
            tHtml += '<th style="width:30px">序号</th>'
        }
        if(widthList!=undefined){//设置宽度
	        if(widthList.length==titleList.length){
		        for (var i = 0;i < titleList.length;i++) {
			        	if(widthList[i]!=-1)
			        		tHtml += '<th  style="width:'+widthList[i]+'px">' + titleList[i] + "</th>";
			        	else
			        		tHtml += '<th>' + titleList[i] + "</th>";
			    }
	        }
	        else{
	            for (var i = 0;i < titleList.length;i++) {
	            		tHtml += '<th>' + titleList[i] + "</th>";
	        	}
	        }
        }
        else{
            for (var i = 0;i < titleList.length;i++) {
            		tHtml += '<th>' + titleList[i] + "</th>";
        	}
        }
        if (tableStyle === 2) {
            tHtml += "<th style='width:100px'>编辑</th>";
        }
		if (tableStyle === 3||tableStyle === 4) {
		    tHtml += "<th style='width:50px'>详情</th>";
		}
		if (tableStyle === 5) {
		    tHtml += "<th style='width:180px'>操作</th>";
		}
		if (tableStyle === 6) {
		    tHtml += "<th style='width:50px'>编辑</th>";
		}
		if (tableStyle >= 7) {
		    tHtml += "<th style='width:180px'>操作</th>";
		}
		
        tHtml += "</tr></thead><tbody></tbody>";
        tTableObject.innerHTML = tHtml;

        var columnStart = function (nTd, sData, oData, iRow, iCol) {
            $(nTd).html("<input type='checkbox' name='checkList' value='" + sData + "'>");
        }
		var indexStart = function (nTd, sData, oData, iRow, iCol) {
            $(nTd).html(iRow+1);
        }
        var columnEnd = function (nTd, sData, oData, iRow, iCol) {
            $(nTd).html('<button type="button" class="btn btn-primary"' + "onclick='_edit_single_table_data(" + sData + ")'>编辑</button>&nbsp;&nbsp;")
            .append('<button type="button" class="btn btn-danger"' + "onclick='_delete_single_table_data(" + sData + ")'>删除</a>");
        }
		var detailEnd = function (nTd, sData, oData, iRow, iCol) {
            $(nTd).html('<button type="button" class="btn btn-primary"' + "onclick='_view_single_table_data(" + sData + ")'>查看</button>&nbsp;&nbsp;")
        }
        var modifyOnlyEnd = function (nTd, sData, oData, iRow, iCol) {
            $(nTd).html('<button type="button" class="btn btn-primary"' + "onclick='_edit_single_table_data(" + sData + ")'>编辑</button>&nbsp;&nbsp;")
        }
        var modifyDetailEnd = function (nTd, sData, oData, iRow, iCol) {
            $(nTd).html('<button type="button" class="btn btn-primary"' + "onclick='_view_single_table_data(" + sData + ")'>查看</button>&nbsp;&nbsp;")
            .append('<button type="button" class="btn btn-primary"' + "onclick='_edit_single_table_data(" + sData + ")'>编辑</button>&nbsp;&nbsp;")
            .append('<button type="button" class="btn btn-danger"' + "onclick='_delete_single_table_data(" + sData + ")'>删除</a>");
        }
        var modifyDetailOnlyEnd = function (nTd, sData, oData, iRow, iCol) {
            $(nTd).html('<button type="button" class="btn btn-primary"' + "onclick='_edit_single_table_data(" + sData + ")'>编辑</button>&nbsp;&nbsp;")
            .append('<button type="button" class="btn btn-danger"' + "onclick='_view_single_table_data(" + sData + ")'>查看</a>");
        }
        var showUseEnd = function (nTd, sData, oData, iRow, iCol) {
            $(nTd).html('<button type="button" class="btn btn-primary"' + "onclick='_audit_single_table_data(" + sData + ")'>使用</button>&nbsp;&nbsp;")
            .append('<button type="button" class="btn btn-primary"' + "onclick='_edit_single_table_data(" + sData + ")'>编辑</button>&nbsp;&nbsp;")
            .append('<button type="button" class="btn btn-danger"' + "onclick='_view_single_table_data(" + sData + ")'>查看</a>");
        }
        var showCancelEnd = function (nTd, sData, oData, iRow, iCol) {
            $(nTd).html('<button type="button" class="btn btn-primary"' + "onclick='_cancel_single_table_data(" + sData + ")'>取消</button>&nbsp;&nbsp;")
            .append('<button type="button" class="btn btn-danger"' + "onclick='_view_single_table_data(" + sData + ")'>查看</a>");
        }
        var columnsData = []        
        if (tableStyle > 0&&tableStyle!=3&&tableStyle!=6&&tableStyle!=7&&tableStyle!=8&&tableStyle!=9) {
            columnsData.push({"fnCreatedCell":columnStart, "mDataProp":"id", "bSortable": false})
        }
        else if (tableStyle==8 || tableStyle==9) {
            columnsData.push({"fnCreatedCell":indexStart, "mDataProp":"id", "bSortable": false})
        }
        for (var i = 0;i < titleList.length;i++) {
            columnsData.push({"mDataProp":"row"+i.toString()})
        }
        if (tableStyle == 2) {
            columnsData.push({"fnCreatedCell":columnEnd, "mDataProp":"id", "bSortable": false})
        }
		else if (tableStyle == 3||tableStyle == 4) {
            columnsData.push({"fnCreatedCell":detailEnd, "mDataProp":"id", "bSortable": false})
        }
        else if (tableStyle == 5) {
            columnsData.push({"fnCreatedCell":modifyDetailEnd, "mDataProp":"id", "bSortable": false})
        }
        else if (tableStyle == 6) {
            columnsData.push({"fnCreatedCell":modifyOnlyEnd, "mDataProp":"id", "bSortable": false})
        }
        else if (tableStyle == 7) {
            columnsData.push({"fnCreatedCell":modifyDetailOnlyEnd, "mDataProp":"id", "bSortable": false})
        }
        else if (tableStyle == 8) {
            columnsData.push({"fnCreatedCell":showUseEnd, "mDataProp":"id", "bSortable": false})
        }
        else if (tableStyle == 9) {
            columnsData.push({"fnCreatedCell":showCancelEnd, "mDataProp":"id", "bSortable": false})
        }
        var orderInfo;
        if (sortIndex !== undefined) {
        	if(sortIndex >= 0){
	            if (tableStyle > 0) {
	                orderInfo = [[ sortIndex + 1, "desc" ]]
	            }
	            else {
	                orderInfo = [[ sortIndex, "desc" ]]
	            }
            }
           else{
           	if (tableStyle > 0) {
	                orderInfo = [[ -sortIndex + 1, "asc" ]]
	            }
	            else {
	                orderInfo = [[ -sortIndex, "asc" ]]
	            }
           }
        }
        else{
        	orderInfo=false;
        }

        currentDataTable = $("#"+htmlID).dataTable({
            "data" : tData,
            "aoColumns" : columnsData,
            'bPaginate' : true,
            "order": orderInfo,
            "autoWidth": false,
            "deferRender": true,
            "dom": '<"custom_table_toolbar">frtip',
            language: {
                "sProcessing": "处理中...",
                "sLengthMenu": "显示 _MENU_ 项结果",
                "sZeroRecords": "没有匹配结果",
                "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
                "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                "sInfoPostFix": "",
                "sSearch": "搜索:",
                "sUrl": "",
                "sEmptyTable": "表中数据为空",
                "sLoadingRecords": "载入中...",
                "sInfoThousands": ",",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "上页",
                    "sNext": "下页",
                    "sLast": "末页"
                },
                "oAria": {
                    "sSortAscending": ": 以升序排列此列",
                    "sSortDescending": ": 以降序排列此列"
                }
            }
        });

        if (tableStyle > 0) {
            $("#checkAll").on("click", function () {
                //console.log($(this).attr("checked"))
                if ($("#checkAll").prop('checked')) {
                    $("input[name='checkList']").prop("checked", true);
                }
                else {
                    $("input[name='checkList']").prop("checked", false);
                }
            });

            if (tableStyle == 2||tableStyle==5||tableStyle==6||tableStyle==7) {
                var toolsHTML = '<button type="button" class="btn btn-primary" onclick="_added_table_data()">新增</button>';
                if(tableStyle!=6&&tableStyle!=7)
                	toolsHTML += '&nbsp;&nbsp;<button type="button" class="btn btn-danger" onclick="_delete_checked_table_data()">删除</button>';
                $("div.custom_table_toolbar").html(toolsHTML);
            }    
        }        
    }
}


