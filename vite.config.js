import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const isDev = mode === 'development';
  const insta = JSON.stringify('2978881fcaa376e34ab33e4f7b0479083cb4b06fa546a745b9fc3c0fa7e6063e');
  return {
    define: {
      '__Camera_Id__': isDev ? insta : null,
    },
    plugins: [vue()],
  }
})
