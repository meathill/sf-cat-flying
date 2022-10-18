<script setup>
import {ref} from "vue";
import EventEmitter from 'eventemitter3';
import {observer} from "../service/index.js";
import {startCamera, startVideoProcessing} from "../service/camera.js";

const emit = defineEmits(['game-end']);

let interval;
let pipeCount = 0;
let stream = null;
let streaming = false;
const centerY = document.body.clientHeight / 2;
const emitter = new EventEmitter();
const isStart = ref(false);
const position = ref(0);
const stageBackground = ref(null);
const video = ref(null);

emitter.on('result', y => {
  position.value = y - document.body.clientHeight / 2;
});

function onHit(e) {
  //console.log(e.detail, e.target);
}
function onMouseMove(e) {
  const {y} = e;
  position.value = y - centerY;
}
function onVideoCanplay() {
  if (!streaming) {
    streaming = true;
  }
  startVideoProcessing(emitter, video.value);
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
async function startGame() {
  // opencv 处理
  stream = await startCamera();
  video.value.srcObject = stream;
  video.value.play();

  // 原始游戏处理
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
#stage(:class="{'opacity-50': !isStart}")
  .stage-bg(ref="stageBackground" :class="{playing: isStart}" @hit="onHit")
  video(ref="video" @canplay="onVideoCanplay")
  img#sf-cat.w-16(
    src="/sf-cat.png"
    alt="思否猫"
    :style="{'--cat-y': position + 'px'}"
  )
</template>
