<script setup>
import {ref} from "vue";
import {observer} from "../service/index.js";

const emit = defineEmits(['game-end']);

let interval;
let pipeCount = 0;
const centerY = document.body.clientHeight / 2;
const isStart = ref(false);
const position = ref(0);
const stageBackground = ref(null);

function onHit(e) {
  console.log(e.detail, e.target);
}
function onMouseMove(e) {
  const {y} = e;
  position.value = y - centerY;
}
function addPipe() {
  const pipe = document.createElement("div");
  const position = Math.random() < 0.5 ? "up" : "down";
  pipe.className = ["pipe", 'pipe-' + position].join(' ');
  pipe.style.left = 150 + 30 * pipeCount + 'vw';
  stageBackground.value.appendChild(pipe);
  pipeCount++;
  observer.observe(pipe);

  if (pipeCount > 30) {
    clearInterval(interval);
    emit('game-end');
  }
}
function startGame() {
  isStart.value = true;
  position.value = 0;
  pipeCount = 0;
  const pipes = stageBackground.value.children;
  for (const child of pipes) {
    observer.unobserve(child);
  }
  stageBackground.value.innerHTML = '';
  interval = setInterval(() => {
    addPipe();
  }, 1000);
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
  .stage-bg(ref="stageBackground" :class="{playing: isStart}" @hit="onHit")
  img#sf-cat.w-16(
    src="/sf-cat.png"
    alt="思否猫"
    :style="{'--cat-y': position + 'px'}"
  )
</template>
