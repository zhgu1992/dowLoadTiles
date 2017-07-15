var mapUtils = require('../utils/mapUtils');
var core = require('../utils/core');
var array_ext = require('../utils/array_ext')();
/**
 * map工具类
 */

module.exports ={
    
   /**
    * 
    * 默认是只能选择一个范围，和多个级别建立一个方案
    * @param {any} bounds 
    * @param {any} levels 
    * @returns 
    */
   getTileInfo: function(bounds, levels){
    var thisModel = this;
      var tileSize = 256;
     var basex =  - 20037508.342787;
     var basey =  20037508.342787;
     var minlon = bounds[0];
     var minlat = bounds[1];
     var maxlon = bounds[2];
     var maxlat = bounds[3];
     var xymin = mapUtils.wgs84_to_webmercator(parseFloat(minlon), parseFloat(minlat));
     var xmin = xymin[0];
     var ymin = xymin[1];
     var xymax = mapUtils.wgs84_to_webmercator(parseFloat(maxlon), parseFloat(maxlat));
     var xmax = xymax[0];
     var ymax = xymax[1];
    var  result = [];
    for (var i = 0; i < levels.length; i++){
        var level = levels[i];
        var  tileInfo = thisModel.getTileInfoByLevel(parseInt(level));
        if (!tileInfo.hasOwnProperty("Resolution")){
            console.log("未找到该级别对应的切片");
            return [];
        }
        var colmin = Math.floor(Math.abs(xmin - basex) / (tileSize * tileInfo["Resolution"]));
        var rowmin = Math.floor(Math.abs(ymax - basey) / (tileSize * tileInfo["Resolution"]));
        var colmax = Math.floor(Math.abs(xmax - basex) / (tileSize * tileInfo["Resolution"]));
        var rowmax = Math.floor(Math.abs(ymin - basey) / (tileSize * tileInfo["Resolution"]));
        result.push({"level":parseInt(level),"colmin":colmin,"rowmin":rowmin,"colmax":colmax,"rowmax":rowmax});
    }
    return result;
    
},

/**
 * 
 * 根据level获得切片信息
 * @param {any} level 
 * @returns 
 */
getTileInfoByLevel : function(level){
 var tileinfoList = [
     {
    "Resolution": 156543.03392800014,
    "Scale": 5.91657527591555E8,
    "Level": 0},
    {
    "Resolution": 78271.51696399994,
    "Scale": 2.95828763795777E8,
    "Level": 1},
    {
    "Resolution": 39135.75848200009,
    "Scale":1.47914381897889E8,
    "Level": 2},
    {
    "Resolution": 19567.87924099992,
    "Scale": 7.3957190948944E7,
    "Level": 3},
    {
    "Resolution": 9783.93962049996,
    "Scale": 3.6978595474472E7,
    "Level": 4},
    {
    "Resolution":4891.96981024998,
    "Scale": 1.8489297737236E7,
    "Level": 5},
    {
    "Resolution": 2445.98490512499,
    "Scale": 9244648.868618,
    "Level": 6},
    {
    "Resolution": 1222.992452562495,
    "Scale": 4622324.434309,
    "Level": 7},
    {
    "Resolution": 611.4962262813797,
    "Scale": 2311162.217155,
    "Level": 8},
    {
    "Resolution": 305.74811314055756,
    "Scale": 1155581.108577,
    "Level": 9},
    {
    "Resolution": 152.87405657041106,
    "Scale": 577790.554289,
    "Level": 10},
    {
    "Resolution":  76.43702828507324,
    "Scale": 288895.277144,
    "Level": 11},
    {
    "Resolution": 38.21851414253662,
    "Scale": 144447.638572,
    "Level": 12},
    {
    "Resolution": 19.10925707126831,
    "Scale": 72223.819286,
    "Level": 13},
    {
    "Resolution": 9.554628535634155,
    "Scale": 36111.909643,
    "Level": 14},
    {
    "Resolution":  4.77731426794937,
    "Scale": 18055.954822,
    "Level": 15},
    {
    "Resolution": 2.388657133974685,
    "Scale": 9027.977411,
    "Level": 16},
    {
    "Resolution": 1.1943285668550503,
    "Scale": 4513.988705,
    "Level": 17},
    {
    "Resolution": 0.5971642835598172,
    "Scale": 2256.994353,
    "Level": 18}
    ];
    var tile = {};
    for (var i=0; i < tileinfoList.length; i++){
        if (tileinfoList[i].Level == level){
            tile = tileinfoList[i];
        }
    }
    return tile;
},
  
/**
 * 获得服务器地图数据:
 * "level":level,"colmin":colmin,"rowmin":rowmin,"colmax":colmax,"rowmax":rowmax
 * getTileInfo(bounds, levels)
 * @param {any} type 
 * return {message:"", datas:[], size:0};
 */
getMapDatas : function(type, bounds, levels, dir){
    var thisModel = this;
    var tiles = thisModel.getTileInfo(bounds, levels);
    if (tiles.length == 0){
        console.log("切片数据为空");
        return;
    }
     var datas = {message:"", datas:[], size:0};
    for (var i = 0; i < tiles.length; i++){
        var level = tiles[i].level;
        var colmin = tiles[i].colmin;
        var colmax = tiles[i].colmax;
        var rowmin = tiles[i].rowmin;
        var rowmax = tiles[i].rowmax;
        var message = "";
            if (type == "google"){
                 var results =thisModel.getGoogleMapDatas(level, colmin, colmax, rowmin, rowmax, dir, type);
            }else{
                var results =thisModel.getArcGisMapDatas(level, colmin, colmax, rowmin, rowmax, dir, type);
            }
            if (results.message.length !=0){
                datas.message = "部分数据缺失";
            }
            for (var j = 0; j < results.length; j++){
                var mapDatas = datas.datas;
                mapDatas.push(results[j]);
                datas.size += results[j].size;
            }
    }
    return datas;
},

/**
 * 从服务器获取谷歌地图瓦片数据,目前未判断level级别
 * 所有数据全部传int
 * 如果是连该层级都没有，则直接抛出异常
 * @param {any} level 
 * @param {any} colmin 
 * @param {any} colmax 
 * @param {any} rowmin 
 * @param {any} rowmax 
 * @param {any} dir 数据根目录
 * @return {message : "", results : name, size:}
 */
getGoogleMapDatas : function(level, colmin, colmax, rowmin, rowmax, dir, type){
    var thisModel = this;
     var message = ""; 
     var dir1 = dir +"//" + type + "//" + level.toString();
     var cols =  core.readAllByFolder(dir1,0).path;
     //这种方式效率太低
     //var minuscols = thisModel.minusMapDatas(cols, colmin, colmax, "google", "col");
     //var minuscols =thisModel.generateDatas(type + "col", colmin, colmax).minus(cols);
     var results = {message : "", results : [], size:0};
    //  if (minuscols.length!=0){
    //      message = "行数据缺失!";
    //  }
     for(var i = 0; i < cols.length; i++){
         var col = parseInt(cols[i]);
         if (col >= colmin && col <=colmax){
             //进入列
             var dir2 = dir1 + "//" + cols[i];
             var rowsdata =  core.readAllByFolder(dir2, 1);
             var rows = rowsdata.path;
             var sizeDic = rowsdata.sizeDic;
             //求差集
             //var minusrows = thisModel.minusMapDatas(rows, rowmin, rowmax, "google", "row");
             //var minusrows =thisModel.generateDatas(type + "row", rowmin, rowmax).minus(rows);
            //  if (minusrows.length != 0){
            //      message += "列数据缺失!";
            //  }
             for (var j = 0; j < rows.length; j++){
                 var row = parseInt(rows[j].split(".")[0]);
                 if (row >= rowmin && row <= rowmax){
                     var result = type + "//" + level.toString() + "//" + cols[i] + "//" + rows[j];
                     results.message = message;
                    //  results.results.push({name : result, type : 1});
                    results.results.push(result);
                    results.size += sizeDic[rows[j]];
                 }else{
                     console.log(col+"行下无数据");
                 }

             }
         }else{
             console.log(level+"层级下无数据");
         }
     }
     return results;
},


/**
 * 从服务器获取arcgis地图瓦片数据,目前未判断level级别
 * 所有数据全部传int
 * 
 * @param {any} level 
 * @param {any} colmin 
 * @param {any} colmax 
 * @param {any} rowmin 
 * @param {any} rowmax 
 * @param {any} dir 数据根目录
 * @return {message : "", results : name, size:}
 */
getArcGisMapDatas : function(level, colmin, colmax, rowmin, rowmax, dir, type){
    var thisModel = this;
     var message = ""; 
     //根据type遍历level
     var dir0 = dir +"//" + type;
     var levels = core.readAllByFolder(dir1,0).path;
     var levelurl = "";
    for(var nums = 0; nums < levels.length; nums++){
        var levelindex = parseInt(levels[nums].substr(1));//处理level字符串
        if (level == levelindex){
                levelurl = levels[nums];
        }
    }
     var dir1 = dir +"//" + type + "//" + levelurl;
     var cols =  core.readAllByFolder(dir1,0).path;
     //进入第二层col
    // var minuscols = thisModel.minusMapDatas(cols, colmin, colmax, "", "col");
     //var minuscols =thisModel.generateDatas(type + "col", colmin, colmax).minus(cols);
     var results = {message : "", results : [], size:0};
    //  if (minuscols.length!=0){
    //      message = "行数据缺失!";
    //  }
     for(var i = 0; i < cols.length; i++){
         var col = parseInt(cols[i].substr(1));
         if (col >= colmin && col <=colmax){
             //进入列
             var dir2 = dir1 + "//" + cols[i];
             var rowsdata =  core.readAllByFolder(dir2, 1);
             var rows = rowsdata.path;
             var sizeDic = rowsdata.sizeDic;
             //求差集
             // var minusrows = thisModel.minusMapDatas(rows, rowmin, rowmax, "", "row");
             //var minusrows =thisModel.generateDatas(type + "row", rowmin, rowmax).minus(rows);
            //  if (minusrows.length != 0){
            //      message += "列数据缺失!";
            //  }
             for (var j = 0; j < rows.length; j++){
                 var row = parseInt(rows[j].split(".")[0].substr(1));
                 if (row >= rowmin && row <= rowmax){
                     var result = type + "//" + level.toString() + "//" + cols[i] + "//" + rows[j];
                     results.message = message;
                    //  results.results.push({name : result, type : 1});
                    results.results.push(result);
                    results.size += sizeDic[rows[j]];
                 }

             }
         }
     }
     return results;
},

/**
 * 
 * 将服务器地图瓦片数据处理成数字数组
 * @param {any} type 默认为google
 * @param {any} path 
 */
generateDatas : function(path, type, generate){
    generate = generate || "level";
    type = type || "google";
    var arr = [];
    for (var i = 0; i < path.length; i++){
        if (generate == "level"){
           if(type == "google"){//google层的处理
               var level = parseInt(path[i]);
                arr.push(level);
             }
            else{
                var level = parseInt(path[i].substr(1));
                arr.push(level);
            }
        }else if (generate == "col"){
            if(type == "google"){//google行的处理
              var col = parseInt(path[i]);
              arr.push(col);
             }
            else{
                var col = parseInt(path[i].substr(1));
                arr.push(col);
            }
        }else if (generate == "rows"){
            if(type == "google"){//google列的处理
               var row = parseInt(path[i].split(".")[0]);
               arr.push(row);
             }
            else{
                var row = parseInt(path[i].split(".")[0].substr(1));
                arr.push(row);
            }
        }else{
            console.log("请传入类型");
        }
       
    }
    return arr;
},

/**
 * 判断是否缺少某些切片并存储
 * 
 * @param {any} path 
 * @param {any} min 
 * @param {any} max 
 * @param {any} type 
 * @param {any} generate 
 * @returns 
 */
minusMapDatas : function(path, min, max, type, generate){
    var thisModel = this;
    var arr = thisModel.generateDatas(path, type, generate);
    var i = min;
    var results = [];
    while(i <= max){
        if(!arr.contains(i)){
            results.push(i);
        }
        i++;
    }
    return results;
}

};
  
