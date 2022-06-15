#! /usr/bin/env node
const program = require('commander')
const translate = require('../lib/translate');
const lang = require('../lib/commonLang.json');
const figlet = require('figlet');
const chalk = require('chalk');

// 翻译命令
program
  .command('translate <file-path> [translated-code]')
  .description(chalk.cyan('翻译文件'))
  .action((fileName, code) => {
    translate(fileName, code);
  })
  
// 支持的语言
program.command('lang [initials]')
  .description(chalk.cyan('查看支持翻译语言的code，默认展示全部，也可带上该语言第一个字的首字母查看'))
  .action((initials, options) => {
    let filterLang = {};
    for(var key in lang) {
      lang[key].length ? filterLang[key] = lang[key] : ""
    }
    initials ? console.log(lang[initials]) : console.log(filterLang)
  })

// 其他信息
program
  .name('translate') // 名称
  .version(`v${require('../package.json').version}`) // 版本
  .usage('<command> [option]') // 命令 和 选项

// 绘制logo 和 提示语 在触发帮助时执行
let help = () => {
  // 使用 figlet 绘制 Logo
  console.log('\r\n' + figlet.textSync('geek', {
      width: 80,
      whitespaceBreak: true,
  }));
}
// 监听--help
program.on('--help', help).on('-h', help);


// 解析用户执行命令传入参数 在此之后的代码不会执行
program.parse(process.argv);