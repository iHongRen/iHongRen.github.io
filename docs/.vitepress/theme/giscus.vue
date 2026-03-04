<template>
    <div class="giscus-container" v-if="enableGiscus" />
</template>

<script setup>
    import { useRoute } from 'vitepress'
    import { ref, watch } from 'vue'

    // 配置Giscus参数（替换为你自己的）
    const giscusConfig = {
        repo: 'iHongRen/iHongRen.github.io',
        'repo-id': 'MDEwOlJlcG9zaXRvcnk2MjUyMjYxNw==',
        category: 'Announcements',
        'category-id': 'DIC_kwDOA7oE-c4Cerbr',
        mapping: 'pathname',
        strict: '0',
        'reactions-enabled': '1',
        'emit-metadata': '1',
        'input-position': 'top',
        theme: 'preferred_color_scheme',
        lang: 'zh-CN',
        crossorigin: 'anonymous',
        async: 'true'
    }

    const route = useRoute()
    const enableGiscus = ref(false)

    // 仅在生产环境加载Giscus（避免开发环境重复加载）
    watch(
        () => route.path,
        async newPath => {
            if (import.meta.env.PROD) {
                enableGiscus.value = true
                await loadGiscusScript()
            }
        },
        { immediate: true }
    )

    // 动态加载Giscus脚本
    function loadGiscusScript() {
        return new Promise(resolve => {
            // 避免重复加载脚本
            if (document.querySelector('script[src="https://giscus.app/client.js"]')) {
                resolve()
                return
            }

            const script = document.createElement('script')
            script.src = 'https://giscus.app/client.js'
            script.async = true
            script.crossOrigin = 'anonymous'

            // 注入Giscus配置参数
            Object.entries(giscusConfig).forEach(([key, value]) => {
                script.setAttribute(`data-${key}`, value)
            })

            script.onload = resolve
            document.body.appendChild(script)
        })
    }
</script>

<style scoped>
    /* 评论区容器样式，可按需调整 */
    .giscus-container {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #eee;
    }

    /* 适配移动端 */
    @media (max-width: 768px) {
        .giscus-container {
            margin-top: 20px;
            padding: 0 10px;
        }
    }
</style>
