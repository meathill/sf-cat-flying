<script setup>
import {ref} from "vue";
import GameStage from "./components/stage.vue";
import pkg from '../package.json';

const hasPanel = ref(true);
const stage = ref(null);
const isWin = ref(null);

function doStartGame() {
  hasPanel.value = false;
  isWin.value = null;
  stage.value.startGame();
}

function onGameOver(value) {
  hasPanel.value = true;
  isWin.value = value;
}
</script>

<template lang="pug">
game-stage(
  ref="stage"
  @game-over="onGameOver"
)

.w-48.fixed.bg-white.p-4.shadow-lg.rounded-lg(
  v-if="hasPanel"
  class="left-1/2 bottom-1/2 -ml-24"
)
  .text-2xl.font-bold.mb-4
    | 思否猫飞呀飞

  p(v-if="isWin !== null")
    | {{isWin ? '你赢了' : '你输了'}}

  button.btn.btn-primary.btn-block(@click="doStartGame") 开始游戏

  p.text-sm.text-center.text-gray-400.mt-2 v{{pkg.version}}
</template>
