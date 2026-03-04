// .vitepress/theme/index.js

import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import Giscus from './giscus.vue'
export default {
    extends: DefaultTheme,
    Layout: () => h(Giscus)
}
