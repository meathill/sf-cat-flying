<script setup>
import {ref} from "vue";
import GameStage from "./components/stage.vue";

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

.w-48.fixed.bg-white.p-4.top-12.flex.justify-center.items-center.shadow-lg.rounded(
  v-if="hasPanel"
  class="top-1/2 left-1/2 -ml-24"
)
  button.btn.btn-primary.btn-block(@click="startGame") 开始游戏
</template>
