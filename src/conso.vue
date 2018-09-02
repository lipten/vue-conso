<template>
  <div class="console-list" ref="consoleList">
    <iframe ref="iframe" style="display:none"></iframe>
    <div class="line" v-if="!isObject(item.content)" :class="returnIcon(item)" v-for="item in store" :key="item.key">
      <i></i><div class="type" :class="item.type == 'log-input' || (isNull(item.content) ? 'null' : (typeof item.content))" >{{isNull(item.content) ? 'null' : item.content + ''}}</div>
    </div>
    <div class="line" v-else :class="returnIcon(item)">
      <i></i>
      <div class="type" :class="typeof item.content">
        <em @click="handleExpand(item.key)">{{getType(item.content)}}</em> 
        {{getType(item.content) === 'Array' ? ' [ ' : ' { ' }}
        <group v-if="expandState(item.key)" :obj="item.content"/>
        <span v-else class="preview" @click="handleExpand(item.key)">
          <span v-if="item.type == 'log-error'" class="type string">{{item.content.message}}</span>
          <span v-if="item.type == 'log' && isObject(item.content)">
            <!-- {{getKeys(item.content)}} -->
            <span class="key-value" v-if="index < 5" v-for="(name,index) in getKeys(item.content)" :key="name">
              <span class="key" v-if="getType(item.content) !== 'Array'">{{name}}:</span>
              <span class="value">
                <span class="type preview" :class="(typeof item.content[name])">
                  <em v-if="isObject(item.content[name])">{{getType(item.content[name])}}</em>
                  <span v-else>
                    {{isNull(item.content[name]) ? 'null' : item.content[name] + ''}}
                  </span>
                </span>
                {{4 > index && !!getKeys(item.content)[index+1] ? ',' : getKeys(item.content).length > 5 ? '...' : ''}}
              </span>
            </span>
          </span>
        </span>
        {{getType(item.content) === 'Array' ? ' ] ' : ' } '}}
      </div>
    </div>
    <div class="field">
      <textarea class="input" :rows="input_rows" ref="input"></textarea>
    </div>
  </div>
</template>

<script>
import ConsoleGroup from './conso-group.vue';

const ConsoleType = {
  Error: 'log-error',
  Normal: 'log',
  Input: 'log-input',
  Tips: 'log-tips',
}

export default {
  ConsoleType,
  components: {
    group: ConsoleGroup
  },
  data() {
    this.historyIndex = 0;
    this.keyId = 1;
    this.keydown = (e) => {
      if (e.shiftKey && e.code === 'Enter') {
        e.preventDefault();
        this.input_rows++
      } else if (!e.shiftKey && e.code === 'Enter') {
        e.preventDefault();
        this.input_rows = 1
        this.run()
      }
      if (e.code == 'ArrowUp') {
        e.preventDefault();
        if (this.historyIndex > 0 ) {
          this.historyIndex--
          this.$refs['input'].value = this.history[this.historyIndex]
        }
      }
      if (e.code == 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.$refs['input'].value = this.history[this.historyIndex]
        }
      }
    }
    return {
      store: [],
      history: [],
      input_rows: 1,
      expand: '0',
    }
  },
  props: {
    contentWindow: {
      default() {
        return null
      } 
    }
  },
  mounted() {
    this.$el.addEventListener('keydown', this.keydown)
    var convertArr = ['log', 'debug', 'error']
    var newConsole = !!this.contentWindow ? this.contentWindow.console : this.$refs['iframe'].contentWindow.console
    var _this = this;
    convertArr.forEach((item) => {
      let oldMethod = window.console[item]
      newConsole[item] = (...args) => {
          args.forEach((msg) => {
            if (item === 'error') {
              _this.error(msg)
            } else {
              _this.log(msg)
            }
          });
          oldMethod.apply(window, args)
        }
    })
    
  },
  beforeDestroy() {
    this.$el.removeEventListener('keydown', this.keydown)
  },
  computed: {
  },
  methods: {
    log(msg) {
      this.storePush({
        content: msg
      })
    },
    error(msg) {
      this.storePush({
        type: ConsoleType.Error,
        content: msg
      })
    },
    clear(data) {
      this.keyId = 1
      this.store = [{
        key: this.keyId,
        type: ConsoleType.Normal,
        content: "Console was cleared"
      }]
    },
    getInputElment() {
      return this.$refs['input']
    },
    storePush(data) {
      data.key = this.keyId++
      if (!data.type) {
        data.type = ConsoleType.Normal
      }
      this.store.push(data);
      this.$nextTick(() => {
        this.$refs['input'].focus()
      })
    },
    historyPush(data) {
      this.history.push(data)
    },
    isNull(exp) {
      return (!exp && typeof(exp)!="undefined" && exp!=0)
    },
    isBaseType(item) {
      return /string|number|boolean|undefined/.test(typeof item) || this.isNull(item)
    },
    isObject(item) {
      if (this.isNull(item)) {
        return false;
      }
      if (typeof item == 'object') {
        return 'Object';
      } else if (typeof item == 'function'){
        return 'ƒ ()'
      }
    },
    getType(item) {
      try {
        if (item.constructor.name === 'Function') {
          return 'ƒ ' + item.name + '()'
        } else {
          return item.constructor.name
        }
      } catch (err) {
        return item + 'null'
      }
    },
    getKeys(obj) {
      delete obj.__ob__
      if (Array.isArray(obj)) {
        return  Object.keys(obj)
      }
      var keys = Object.getOwnPropertyNames(obj)
      if (keys.indexOf('__ob__') > -1) {
        keys.splice(keys.indexOf('__ob__'), 1);
      }
      if (keys.length > 0) {
        return keys
      }
      var arr = [];
      for(var key in obj) {
        arr.push(key)
      }
      return arr
    },
    expandState(name) {
      return (new RegExp(name).test(this.expand))
    },
    handleExpand(name) {
      if (this.expandState(name)) {
        this.expand = this.expand.replace('|'+name, '')
      } else {
        this.expand += ('|' + name)
      }
    },
    handlePreview(item) {
      if (item.type == 'log-error') {
        return item.content.message;
      } 
    },
    returnIcon(item) {
      if (item.type == 'log-error') {
        return 'error'
      } else if (item.type == 'log-input') {
        return 'input'
      } else {
        return 'output'
      }
    },
    run() {
      var input = this.$refs['input'].value;
      if (!input) {
        return false;
      }
      this.historyPush(input)
      this.historyIndex = this.history.length
      this.$refs['input'].blur()
      if (/^clear\(\)$/.test(input)) {
        this.clear()
        this.$refs['input'].value = '';
        this.$refs['input'].focus()
        return false;
      }
      this.storePush({
        type: ConsoleType.Input,
        content: input
      })
      this.$refs['input'].value = '';
      if (!/^(var|const|let|switch|return|with|typeof|break|case|catch|try|if|else|delete|for|do|while|throw|)/.test(input) || /^{.+}$/.test(input)) {
        input = '(' + input + ')'
      }
      try {
        var contentWindow = this.contentWindow || this.$refs['iframe'].contentWindow
        var returnContent = contentWindow.eval.call(contentWindow, input);
        this.storePush({
          content: returnContent
        })
      } catch (err) {
        this.storePush({
          type: ConsoleType.Error,
          content: err,
        })
      }
    }
  }
}

</script>


<style scoped lang="less">

.console-list {
  .line {
    border-bottom: 1px solid #eee;
    padding: 10px;
    padding-left: 25px;
    box-sizing: border-box;
    position: relative;
    font-size: 14px;
    i {
      display: inline-block;
      width: 12px;
      height: 12px;
      top: 16px;
      left: 5px;
      position: absolute;
    }
    &.error {
      background: #FDF1F0;
      .type {
        em {
          color: #EB3425;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }
      color: #000;
      i {
        background: url('http://jsconsole.com/error.svg') no-repeat;
        background-size: cover;
      }
    }
    &.input {
      i {
        background: url('http://jsconsole.com/in.svg') no-repeat;
        background-position: 50% 50%;
        background-size: contain;
      }
    }
    &.output {
      color: #aaa;
      i {
        background: url('http://jsconsole.com/out.svg') no-repeat;
        background-position: 50% 50%;
        background-size: contain;
      }
    }
    .short-string {
      &:before {
        content: "\"";
        color: #000;
      }
      &:after {
        content: "\"";
        color: #000;
      }
      color: #4caf50
    }
  }
  .preview {
    cursor: pointer;
  }
  .type {
    display: inline-block;
    &.string {
      &:before,&:after {
        content: "\"";
        color: #000;
      }
      color: #4caf50;
      white-space: nowrap;
      span {
        display: inherit;
      }
    }
    &.number {
      color: #0000c0;
    }
    &.boolean {
      color: #e91e63;
    }
    &.undefined {
      color: #aaa;
    }
    &.null {
      color: #9c27b0;
    }
    &.object, &.function {
      em {
        cursor: pointer;
        color: #2196f3;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .field {
    width: 100%;
    box-sizing: border-box;
    padding-left: 25px;
    position: relative;
    &:before {
      content: "";
      display: inline-block;
      position: absolute;
      width: 12px;
      height: 12px;
      top: 17px;
      left: 5px;
      background: url('http://jsconsole.com/prompt.svg') no-repeat;
      background-position: 50% 50%;
      background-size: contain;
    }
    .input {
      border: 0;
      resize: none;
      outline: 0;
      font-size: 14px;
      padding: 0;
      width: 100%;
      box-sizing: border-box;
      padding-top: 10px;
      line-height: 1.8em;
      font-family: inherit;
    }
  }
}
</style>