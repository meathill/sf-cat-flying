<script setup>
import {ref} from "vue";
import GameStage from "./components/stage.vue";
import pkg from '../package.json';
import {startCamera} from "./service/camera.js";

const LOCAL_KEY = 'sf-cat';

let cameraStream = null;
const useCamera = ref(localStorage.getItem(LOCAL_KEY));
const hasPanel = ref(true);
const stage = ref(null);
const isWin = ref(null);
const isWaitingForOpenCV = ref(true);

let interval = setInterval(() => {
  if (window.opencvIsReady === true) {
    isWaitingForOpenCV.value = false;
    clearInterval(interval);
  }
}, 100);

async function doStartGame() {
  if (useCamera.value && !cameraStream) {
    const camera = await onCameraChange();
    if (!camera) return;
  }

  hasPanel.value = false;
  isWin.value = null;
  stage.value.startGame();
}

function onGameOver(value) {
  hasPanel.value = true;
  isWin.value = value;
}

async function onCameraChange() {
  if (useCamera.value) {
    localStorage.setItem(LOCAL_KEY, '1');
    try {
      cameraStream = await startCamera();
    } catch (e) {
      alert('您需要有摄像头，并允许访问游戏。');
      return;
    }
    return cameraStream;
  } else {
    localStorage.removeItem(LOCAL_KEY);
  }
}
</script>

<template lang="pug">
game-stage(
  ref="stage"
  :camera-stream="cameraStream"
  @game-over="onGameOver"
)

.w-48.fixed.bg-white.p-4.shadow-lg.rounded-lg(
  v-if="hasPanel"
  class="left-1/2 top-1/2 -ml-24 -mt-20"
)
  .text-2xl.font-bold.mb-4.text-center.text-gray-800
    | 思否猫飞呀飞

  p(v-if="isWin !== null")
    | {{isWin ? '你赢了' : '你输了'}}

  button.btn.btn-primary.btn-block(
    type="button"
    :class="{loading: isWaitingForOpenCV}"
    :disabled="isWaitingForOpenCV"
    @click="doStartGame"
  ) 开始游戏
  .form-control.mt-4
    label.label.cursor-pointer.text-sm
      span.label-text 使用摄像头
      input(
        type="checkbox"
        class="toggle ml-2"
        v-model="useCamera"
        @change="onCameraChange"
      )

  p.text-sm.text-center.text-gray-300.absolute.top-full.w-full.mt-2 v{{pkg.version}}
</template>
