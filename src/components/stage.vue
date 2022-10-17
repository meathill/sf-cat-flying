<script setup>
import {ref} from "vue";

const position = ref(0);
const centerY = document.body.clientHeight / 2;
const isStart = ref(false);

function onMouseMove(e) {
  const {y} = e;
  position.value = y - centerY;
}

function startGame() {
  isStart.value = true;
  position.value = 0;
}

defineExpose({
  startGame,
});
</script>

<script>
export default {
  name: "GameStage"
}
</script>

<template lang="pug">
#stage(@mousemove="onMouseMove")
  .stage-bg(:class="{playing: isStart}")
  img#sf-cat.w-16(
    src="/sf-cat.png"
    alt="思否猫"
    :style="{'--cat-y': position + 'px'}"
  )
</template>
