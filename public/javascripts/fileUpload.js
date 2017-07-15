/**
 * 上传回调函数
 */
function FileUpload_onselect()
{
    var path;
    path=$("#fileupload").val();
    var name;
    name=path.split('\\'); 
    var bb=name[name.length-1];          
    $("#filename").html(bb);
}