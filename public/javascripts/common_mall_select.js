var MALL_SELECT = new MallSelect();
function MallSelect() {
    var mallSelectJson;
    var currentIndex;
    updateSelectMall();
    function updateSelectMall() {
        $.getJSON( BASE_URL+"/task/task-select-list", function(jsonIn) {
            taskSelectJson = jsonIn;
            var current_name = "";
            var list_html = "";
            for (var i = 0;i < taskSelectJson.length;i++) {
                if (taskSelectJson[i].current) {
                    current_name = taskSelectJson[i].name;
                    currentIndex = i;
                }
                //list_html += '<li><a  style="cursor:pointer" onclick="MALL_SELECT.setSelectMall(' + i + ');">' + mallSelectJson[i].name + '</a></li>';
           		list_html+= '<option value='+taskSelectJson[i].id+'><a  style="cursor:pointer">' + taskSelectJson[i].name + '</a></option>';
            }
            
            var html = "";
            //html += '<button class="btn btn-info dropdown-toggle" type="button" id="dropdownMenu" style="background-color:#dd4b39;border-color:#d84851;width:165px" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
            //html += current_name + ' <span class="caret"></span></button><ul class="dropdown-menu" aria-labelledby="dropdownMenu" style="z-index:1001">' + list_html + "</ul>";
            html+='<select class="selectpicker" data-live-search="true" data-width="165px"  title="'+current_name+'">';
			html+= list_html;
			html+='</select>';
            $("#common_mall_dropdown").html(html);
            $('.selectpicker').selectpicker({
			  style: 'btn-danger',
			  size: 15
			});
			$('.selectpicker').on('changed.bs.select', function (e, clickedIndex) {
			 	MALL_SELECT.setSelectMall(clickedIndex-1);
			});
        });    
    }
    
    this.setSelectMall = function (index) {
        if (currentIndex === index)
            return;
        
        $.get( BASE_URL+ "/task/task-select-modify/?id=" + mallSelectJson[index].id, function (data, status) {
            console.log(data);
            console.log(status);
            var nextURL = getUrlParam('next');
            if (nextURL != null)
            {
            	host = BASE_URL ;
            	window.location.href = host+nextURL;
            	
            }
            else
            {
            	location.reload();
            }
        });
    };

    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    
}
