# language-translate
It is used to translate Chinese in any file into common languages. It is very fast and has a high translation accuracy.

## Basic Usage 
```
language-translation translate File path
```
The file path can be absolute or relative. By default, Chinese will be translated into English and a new file will be generated.

## Specify translation language
```
language-translation translate File path Corresponding languagecode
```
Use this line of commands to translate the file into the specified language.

## How to view the correspondingcode
```
language-translation lang
```
You can get the data in the supported language by using the command in this line. If you want to find the data quickly, you can also use:
```
   language-translation lang Capital letters corresponding to the pronunciation of Chinese initial characters of the language
```

For example, input `language-translation lang Z` You will get this format.
``` js
[
    { name: 'chinese(simplified Chinese character)', code: 'zh' },
    { name: 'chinese(Cantonese)', code: 'yue' },
    { name: 'chinese(classical Chinese)', code: 'wyw' },
    { name: 'chinese(traditional Chinese character)', code: 'cht' }
]
```