<template>
    <Layout>
        <template #doc-after>
            <div style="margin-top: 24px">
                <Giscus
                    :key="page.filePath"
                    repo="iHongRen/iHongRen.github.io"
                    repo-id="MDEwOlJlcG9zaXRvcnk2MjUyMjYxNw=="
                    category="Announcements"
                    category-id="DIC_kwDOA7oE-c4Cerbr"
                    mapping="pathname"
                    strict="0"
                    reactions-enabled="1"
                    emit-metadata="0"
                    input-position="top"
                    :theme="isDark ? 'dark' : 'light'"
                    lang="zh-CN"
                    crossorigin="anonymous"
                />
            </div>
        </template>
    </Layout>
</template>
<script lang="ts" setup>
    import Giscus from '@giscus/vue'
    import { inBrowser, useData } from 'vitepress'
    import DefaultTheme from 'vitepress/theme'
    import { watch } from 'vue'
    const { Layout } = DefaultTheme
    const { isDark, page } = useData()
    // 监听亮/暗模式切换，通知 giscus iframe 同步主题
    watch(isDark, dark => {
        if (!inBrowser) return
        const iframe = document.querySelector('giscus-widget')?.shadowRoot?.querySelector('iframe')
        iframe?.contentWindow?.postMessage({ giscus: { setConfig: { theme: dark ? 'dark' : 'light' } } }, 'https://giscus.app')
    })
</script>
