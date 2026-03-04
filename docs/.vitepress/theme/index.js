// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import './custom.css'
import Giscus from './giscus.vue'

export default {
    ...DefaultTheme,
    // 布局增强：在文档底部添加评论组件
    Layout() {
        return h(DefaultTheme.Layout, null, {
            // 插槽：doc-after 表示在文档内容之后渲染
            'doc-after': () => h(Giscus)
        })
    }
}
