# vue-slidePage

### Introduction

vue-slidePage is a fullscreen scrolling component of Vue.js, Based on [slidePage](https://github.com/lipten/slidePage)

### Demo

* [simple](http://lipten.link/projects/slidePage3/examples/simple.html)
* [custom](http://lipten.link/projects/slidePage3/examples/custom.html)

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
