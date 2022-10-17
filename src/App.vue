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

.w-48.fixed.bg-white.p-4.top-12.left-12(v-if="hasPanel")
  button.btn.btn-primary(@click="startGame") 开始游戏
</template>
