# ebook
## https://github.com/futurepress/epub.js

### epubjs核心类介绍
- Book 阅读器的解析
- Rendition 阅读器的渲染
- Locations 阅读器的定位
- Navigation 阅读器的目录
- View Manageer 阅读器视图管理
- EpubCFI 文字级别的定位 定位电子书中的任意一个字符
- Theme 管理场景切换
- Spine 负责指定阅读顺序和Section
- Section 指向一个具体的章节 全文检索 和章节切换
- Contents 管理一个章节中的全部资源内容 
- Hook 钩子函数 生命周期
- Annotations 管理标签 文字的高亮显示


### nvm的安装 mac
- curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
- source ~/.profile

### 快速写px2rem()
- vscode插件 `px to rem with scss`
- 使用方法 mac :`option c`, win :`clt c`
- 命令 `command shift G` 到 `/Users/xxx/.vscode/extensions/medzhidov.px-to-rem-with-scss-1.0.3/out/src/extension.js` 将 text 换成 ``text = text.replace(val, `px2rem(${parseInt(val)}px)`);``


