// lib/translate.js
const fs = require('fs-extra');
const path = require('path');
const http = require("./http");
const MD5 = require("MD5");
const translate = require('../lib/translate');
const chalk = require('chalk');

// 随机数函数
let givenReadom = (str = "", length)=>{
    let value = str;
    for(var i = 0; i < length; i++) {
        value += Math.floor(Math.random() * 10);
    }
    return value;
}
// 百度翻译
let baiduTranslate = (q, to)=>{
    let appid = "20220126001068673";
    let key = "el4CJSNqtXvbHWGHRba9";
    let salt = givenReadom("geeks", 7);
    let sign = MD5(appid + q + salt + key);
    return http.translate({
        q,
        from: "auto",
        to: to,
        appid,
        salt,
        sign
    })
}

module.exports = (filePath, code)=> {
    // 当前命令行选择的目录
    const cwd  = process.cwd();
    // 目标文件路径
    const targetAir  = path.join(cwd, filePath);
    fs.exists(targetAir, async function(exists){
        // 如果找到文件
        if(exists) {
            // 文件后缀
            let fileExtname = path.extname(targetAir);
            // 文件名称
            let fileName = path.basename(targetAir, fileExtname);
            // 获取文件目录路径
            let fileDirectoryPath =	path.dirname(targetAir);
            
            // 获取文件
            let readerStream = fs.createReadStream(targetAir);
            // 设置文件格式是为UTF8
            readerStream.setEncoding('UTF8');

            // 存放文件内容
            let data = '';
            // 读取到的需要翻译的内容
            let translateContent = "";
            // 处理流
            readerStream.on('data', async (chunk) => {
                var reg = /[\u4e00-\u9fa5]|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5/g;
                let index = 0;
                let term = '';
                data = chunk;
                while (list = reg.exec(chunk)) {
                    if ((list.index !== index + 1) && term) {
                        translateContent += `${term}\n`
                        term = '';
                    }
                    term += list[0];
                    index = list.index;
                }

                translateContent += `${term}\n`
            });

            // 处理流完成后
            readerStream.on('end',  async()=> {
                // 翻译后的内容
                let translationAfterContent = await baiduTranslate(translateContent, code ? code : 'en');
                // 错误处理
                if(translationAfterContent.error_code) {
                    switch(translationAfterContent.error_code * 1) {
                        case 58001:
                            console.log(chalk.red("请检查语言的code是否输入正确"))
                            break;
                        case 54005:
                        case 54003:
                            console.log(chalk.yellow("请勿频繁调用，请至少等待1s"))
                            break;
                        case 52001:
                            translate(filePath, code);
                            break;
                        default:
                            console.log(chalk.red(translationAfterContent.error_code))
                    }
                } else {
                    // 替换翻译后的内容
                    translationAfterContent.trans_result.forEach((content, index)=>{
                        data = data.replace(content.src, content.dst);
                    })
                    // code命名的文件路径 fs writeFile会检测这个文件是否存在如果存在则覆盖，否则创建
                    let codeFileName = path.join(fileDirectoryPath, `${fileName}-${code ? code : 'en'}${fileExtname}`)
                    fs.writeFile(codeFileName, data, function (err) {
                        // 抛出错误
                        if (err) throw err; 
                        // 创建成功
                        console.log(chalk.green('File translation succeeded.')); 
                    });
                }
                
            });
        } else {
            console.error("该文件不存在，请检查文件路径是否正确")
        }
    })
}