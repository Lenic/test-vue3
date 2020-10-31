<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "/@/components/HelloWorld.vue"; // @ is an alias to /src
import { composeRight } from "../utils/compose";

export default defineComponent({
  name: "Home",
  components: {
    HelloWorld
  },
  setup() {
    let dd = composeRight<number, number>((c) => {
      debugger;
      console.log("default");

      return c + 1;
    });

    dd = dd.add((n, c) => {
      debugger;
      console.log("run 2:");

      return c + 2 + n();
    });

    dd = dd.add((n, c) => {
      debugger;
      console.log("run 3:");

      return c + 3 + n();
    });

    dd = dd.add((n, c) => {
      debugger;
      console.log("run 4:");

      return c + 4 + (n ? n() : 0);
    });

    console.log("result", dd.exec(10));
  }
});
</script>
