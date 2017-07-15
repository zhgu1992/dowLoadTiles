
/**
 * 
 * map基础工具类
 */
const x_pi = 3.14159265358979324  // 3000.0 / 180.0
const pi = 3.1415926535897932384626  // π
const a = 6378245.0  // 长半轴
const ee = 0.00669342162296594323  // 扁率

module.exports = {

    wgs84_to_webmercator: function(xLon, yLat){
        if(Math.abs(xLon) > 180 && Math.abs(yLat) > 90){
            return;
         }
        var semimajorAxis = 6378137.0;  // WGS84 spheriod semimajor axis
        var east = xLon * 0.017453292519943295;
        var north = yLat * 0.017453292519943295;
        var northing = 3189068.5 * Math.log((1.0 + Math.sin(north)) / (1.0 - Math.sin(north)))
        var easting = semimajorAxis * east;

        return [easting, northing]
    }

}