var express = require('express');
var path = require('path');
//var _ = require('lodash');
var fs = require('fs');
var archiver = require('archiver');
var array_ext = require('../utils/array_ext')();
//var multer = require('multer');


var mapTools = require('../utils/map');
//mapTools.Hello();

var fs_ext = require('../utils/fs_ext')();
var core = require('../utils/core');
var router = express.Router();

var sysInfo = core.getServerInfo();
var rootDir = path.resolve(__dirname,"../..");//项目路径
var zipDir = path.join(path.resolve(__dirname,"../"), "zip");//zip路径
var uploadDir = path.join(path.resolve(__dirname,"../"), "uploads");//上传路径
var zipName = "test1.zip";//压缩包名字

//打包和下载考虑使用客户端定时发送请求，直到获得成功状态码


//下载单个文件,多个文件采用压缩方式进行
router.get('/downloadSingle',function(req, res, next){
    var currDir = path.normalize(req.query.dir),
        comefrom = req.query.comefrom,
        fileName = req.query.name,
        currFile = path.join(currDir,fileName),
        fReadStream;

    fs.exists(currFile,function(exist) {
        if(exist){
            res.set({
                "Content-type":"application/octet-stream",
                "Content-Disposition":"attachment;filename="+encodeURI(fileName)
            });
            fReadStream = fs.createReadStream(currFile);
            fReadStream.on("data",(chunk) => res.write(chunk,"binary"));
            fReadStream.on("end",function () {
                res.end();
                //删除生成的压缩文件
                if(comefrom == "archive"){
                    //setTimeout(() => fs.unlink(path.join(zipDir,zipName)), 100);
                }
            });
        }else{
            res.set("Content-type","text/html");
            res.send("file not exist!");
            res.end();
        }
    });
});

//获取下载文件的地址, data = {dir:"E://test//20",fileArray:[{name:"20",type:0}]};
router.post('/download',function(req, res){
    var currDir = path.normalize(req.body.dir),
    	fileArray = req.body.fileArray,
        filesCount = 0,     //非文件夹文件个数
        fileNameArray = [];
    
    //将文件和文件夹分开命名
    fileArray.forEach(function(file) {
        if(file.type == 1){
            filesCount++;
            fileNameArray.push(file.name);
        }else{
            fileNameArray.push(path.join(file.name,"**"));  //文件夹格式：folderName/**
        }
    });

    if(fileArray.length == 0){
        res.send({"code":"fail", "summary":"no files"});
        return;
    }

    if(filesCount == 1 && fileNameArray.length == 1){
        //只有一个文件的时候直接走get
        var downloadUrl = "/fileService/downloadSingle?dir="+encodeURIComponent(currDir)+"&name="+encodeURIComponent(fileNameArray[0]);
        res.send({"code":"s_ok", "url":downloadUrl});
    }else{
        //多个文件就压缩后再走get
        var output = fs.createWriteStream(path.join("zip",zipName));
        var archive = archiver.create('zip', {});
        archive.pipe(output);   //和输出流相接
        //打包文件
        archive.bulk([ 
            {
                cwd:currDir,    //设置相对路径
                src: fileNameArray,
                expand: currDir
            }
        ]);

        archive.on('error', function(err){
            res.send({"code":"failed", "summary":err});
            throw err;
        });
        archive.on('end', function(a){
            //输出下载链接
            var downloadUrl = "/fileService/downloadSingle?dir="+encodeURIComponent(zipDir)+"&name="+encodeURIComponent(zipName)+"&comefrom=archive";
            res.send({"code":"s_ok", "url":downloadUrl});
        });
        archive.finalize();
    }
});

//上传文件
// var upload = multer({ dest: './uploads/'});
// var cpUpload = upload.fields([
//     {name: 'file'},
//     {name: 'src'}
// ]);
// router.post("/uploadFile",cpUpload, function(req, res, next){
//     var files = req.files.file,
//         dir = req.body.dir;

//     var fsPromise = function(file){
//         return new Promise(function(resolved,rejected){
//             fs.rename(path.join(uploadDir,file.filename),path.join(dir,file.originalname),function(err){
//                 if(err){
//                     rejected(err);
//                 }else{
//                     resolved();
//                 }
//             });
//         });
//     }
//     Promise.all(files.map(fsPromise))
//     .then(function(){
//         res.set({
//             'Content-Type':'text/html'
//         });
//         res.send({"code":"s_ok"});
//         // res.end();
//     })
//     .catch(function(err) {
//         res.send({"code":"failed", "summary":err});
//     });
// });

//这里需要使用2.0.0版本的archiver
//data = {dir:"E://test//20",fileArray:[{name:"20",type:0}]};
//根据类型，level，minCol，maxCol，minRow，maxRow获取文件
router.post('/getFilesByMap', function(req, res){
      var type = req.body.type;
      var levels = req.body.levels;
      var bounds = req.body.bounds;
     
     // var currDir = path.normalize(req.body.dir);
     var currDir = req.body.dir;
     var fileDatas = mapTools.getMapDatas(type, bounds, levels, currDir);
      //var fileDatas = mapTools.getGoogleMapDatas(level, colmin, colmax, rowmin, rowmax, currDir, type);
      var fileNameArray =  fileDatas.results;
      var totalSize = fileDatas.size;
    if(fileNameArray.length == 0){
        res.send({"code":"fail", "summary":"no files"});
        return;
    }

    if(fileNameArray.length == 1){
        //只有一个文件的时候直接走get
        var downloadUrl = "/fileService/downloadSingle?dir="+encodeURIComponent(currDir)+"&name="+encodeURIComponent(fileNameArray[0]);
        res.send({"code":"s_ok", "url":downloadUrl});
    }else{
        //多个文件就压缩后再走get
        var output = fs.createWriteStream(path.join("zip",zipName));
        var archive = archiver.create('zip', {});
            archive.on('error', function(err){
            console.log("error");
            res.send({"code":"failed", "summary":err});
            throw err;
        });
        //文件流关闭
        output.on('close', function(){
            console.log('Archive wrote %d bytes', archive.pointer());
            var downloadUrl = "/fileService/downloadSingle?dir="+encodeURIComponent(zipDir)+"&name="+encodeURIComponent(zipName)+"&comefrom=archive";
            res.send({"code":"s_ok", "url":downloadUrl});
            //res.send({"code" : "s_ok"});
        });
        //进度
         archive.on('progress', function(progress) {
             var percent = 100 - ((totalSize - progress.fs.processedBytes) / totalSize) * 100;
            console.log('%s / %s (%d %)', core.bytesToSize(progress.fs.processedBytes),  core.bytesToSize(totalSize), percent);
         })
        //结束
        archive.on('end', function(a){
             console.log('Archive wrote %d bytes', archive.pointer());
        });         
        archive.pipe(output);   //和输出流相接
        //打包文件 1.0.0版本
        // archive.bulk([ 
        //     {
        //         cwd:currDir,    //设置相对路径
        //         src: fileNameArray,
        //         expand: currDir
        //     }
        // ]);
        /**
         * 2.0.0版本采用此种方式
         */
        for (var i in fileNameArray){
            var url = currDir + '//' + fileNameArray[i];
            archive.file(url,{name:url});
        }
        archive.finalize();         
    }
   

});



module.exports = router;
