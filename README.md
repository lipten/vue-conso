# vue-conso

### Introduction

vue-conso 是一个模拟浏览器web-console的vue组件，可以作为网站内捕获console和调试的工具。就像jsBin里的console工具一样。

### Demo
http://lipten.link/projects/vue_conso/examples/demo.html

### Usage

#### Install

```bash
$ npm i -S vue-conso
```

Work on a Vue instance:

```HTML
<div id="app">
  <conso></conso>
</div>
```

```JavaScript
var { Conso } = require('vue-conso')
var ConsoleType = Conso.ConsoleType;

new Vue( {
  el: '#app',
  components: {
    Conso,
  }
} )
```

## Props
#### contentWindow
使conso可以对指定的contentWindow的console进行捕获，并且利于划分作用域不会影响top window，传入浏览器窗口window对象，可以是某个Iframe的contentWindow，默认是top window。

# License
MIT
