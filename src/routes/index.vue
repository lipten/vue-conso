<template>
  <div class="route-index">
    <console-line ref="conso"/>
  </div>
</template>

<script>
let moment = require("moment");
import ConsoleLine, {ConsoleType} from '@/components/conso.vue';
export default {
  components: {
    ConsoleLine,
  },
  data() {
    return {
    };
  },
  mounted() {
    
  },
};
</script>

<style scoped lang="scss">
$top-height: 70px;
$nav-height: 60px;
$left-width: 220px;
.route-index {
  position: relative;
  box-sizing: border-box;
  height: 100%;
	box-sizing: border-box;
}
</style>
