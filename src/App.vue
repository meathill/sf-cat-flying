<script setup>
import {ref} from "vue";
import GameStage from "./components/stage.vue";
import pkg from '../package.json';

const hasPanel = ref(true);
const stage = ref(null);

function startGame() {
  hasPanel.value = false;
  stage.value.startGame();
}
</script>

<template lang="pug">
game-stage(
  ref="stage"
  @game-end="hasPanel = true"
)

.w-48.fixed.bg-white.p-4.shadow-lg.rounded(
  v-if="hasPanel"
  class="left-1/2 bottom-1/2 -ml-24"
)
  button.btn.btn-primary.btn-block(@click="startGame") 开始游戏

  p.text-sm.text-center.text-gray-400.mt-2 v{{pkg.version}}
</template>
