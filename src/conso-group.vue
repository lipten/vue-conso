<template>
  <div class="group">
    <div class="key-value" v-for="name in getKeys(obj)" :key="name">
      <span class="key">{{name + ':'}}</span>
      <div v-if="!isObject(obj[name])" class="type" :class="isNull(obj[name]) ? 'null' : typeof obj[name]">{{isNull(obj[name]) ? 'null' : obj[name] + ''}}</div>
      <div v-else class="type" :class="typeof obj[name]">
        <em @click="handleExpand(name)">{{getType(obj[name])}}</em> 
        {{expandState(name) ? ' { ' : ''}}
        <group :obj="obj[name]" v-if="expandState(name)"/>
        {{expandState(name) ? ' } ' : ''}}
      </div>
    </div>
  </div>
   
</template>

<script>
export default {
  props: {
    obj: {
      default: {}
    }
  },
  name: "group",
  data() {
    return {
      expand: '0',
    }
  },
  mounted() {
  },
  methods: {
    getKeys(obj) {
      var keys = Object.getOwnPropertyNames(obj)
      if (keys.length > 0) {
        return keys
      }
      var arr = [];
      for(var key in obj) {
        arr.push(key)
      }
      return arr
    },
    isNull(exp) {
      return (!exp && typeof(exp)!="undefined" && exp!=0)
    },
    isBaseType(item) {
      return /string|number|boolean|undefined/.test(typeof item) || this.isNull(item)
    },
    isObject(item) {
      return /object|function/.test(typeof item) && !this.isNull(item)
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
    }
  }
}
</script>

<style scoped lang="less">
.group {
  margin-left: 0.5em;
  .key {
    display: inline-block;
    color: #979797;
    margin-right: .5rem;
    float: left;
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
}
</style>