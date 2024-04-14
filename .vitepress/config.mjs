import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    lang: 'zh-CN',
    // base: '/',
    title: 'i仙银',
    description: ' ',
    // lastUpdated: true,
    ignoreDeadLinks: true,

    themeConfig: {
        returnToTopLabel: '返回顶部',
        outline: [2, 5],
        outlineTitle: '大纲',
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: '博客', link: '/blog/', activeMatch: '/blog/.*' },
            { text: '读书', link: '/reading/', activeMatch: '/reading/.*' },
            { text: '作品', link: '/product/', activeMatch: '/product/.*' },
            { text: '开源', link: '/open/', activeMatch: '/open/.*' }
        ],

        sidebar: {
            '/blog/': [
                {
                    text: '博客文章列表',
                    items: [{ text: '', link: '/blog/' }]
                }
            ],

            '/reading/': [
                {
                    text: '我的读书',
                    items: [{ text: '', link: '/reading/' }]
                }
            ],

            '/product/': [
                {
                    text: '个人作品',
                    items: [{ text: '', link: '/product/' }]
                }
            ],

            '/open/': [
                {
                    text: '开源作品',
                    items: [{ text: '文章1', link: '/open/' }]
                }
            ]
        },

        search: {
            provider: 'local',
            options: {
                locales: {
                    zh: {
                        translations: {
                            button: {
                                buttonText: '搜索文档',
                                buttonAriaLabel: '搜索文档'
                            },
                            modal: {
                                noResultsText: '无法找到相关结果',
                                resetButtonTitle: '清除查询条件',
                                footer: {
                                    selectText: '选择',
                                    navigateText: '切换'
                                }
                            }
                        }
                    }
                }
            }
        },

        lastUpdated: {
            text: '更新于',
            formatOptions: {
                dateStyle: 'full',
                timeStyle: 'medium'
            }
        },
        footer: {
            copyright: '版权所有 ©2024 i仙银'
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/iHongRen' },
            {
                icon: {
                    svg: '<svg viewBox="0 0 512 415" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2"><g transform="scale(1.45729)"><clipPath id="prefix__a"><path d="M0 0h351.336v284.628H0z"/></clipPath><g clip-path="url(#prefix__a)" fill-rule="nonzero"><path d="M25.84 195.715c0 40.917 53.28 74.078 118.97 74.078 65.691 0 118.971-33.161 118.971-74.078 0-40.918-53.28-74.078-118.971-74.078-65.69 0-118.97 33.16-118.97 74.078" fill="#fff"/><path d="M147.622 263.781c-58.176 5.769-108.401-20.556-112.183-58.71-3.781-38.202 40.336-73.786 98.463-79.556 58.177-5.769 108.402 20.556 112.135 58.71 3.83 38.202-40.287 73.835-98.415 79.556m116.304-126.776c-4.945-1.503-8.338-2.472-5.769-8.969 5.624-14.107 6.206-26.276.097-35.002-11.393-16.29-42.614-15.417-78.392-.437 0 0-11.248 4.897-8.339-3.975 5.478-17.695 4.654-32.482-3.878-41.063-19.392-19.44-71.024.727-115.286 44.99C19.247 125.661 0 160.809 0 191.206c0 58.079 74.514 93.422 147.38 93.422 95.555 0 159.112-55.51 159.112-99.579.049-26.664-22.398-41.79-42.566-48.044" fill="#e6162d"/><path d="M327.387 30.688C304.311 5.09 270.277-4.654 238.862 2.036c-7.272 1.552-11.877 8.727-10.326 15.95 1.551 7.272 8.678 11.878 15.95 10.326 22.349-4.751 46.541 2.182 62.927 20.362 16.387 18.18 20.847 42.954 13.817 64.673-2.278 7.078 1.6 14.641 8.678 16.919 7.078 2.279 14.641-1.599 16.92-8.629v-.049c9.89-30.494 3.636-65.351-19.441-90.9" fill="#f93"/><path d="M291.948 62.685c-11.247-12.459-27.828-17.211-43.099-13.914-6.254 1.309-10.229 7.515-8.92 13.769 1.357 6.253 7.514 10.229 13.72 8.871 7.466-1.599 15.61.728 21.089 6.788a22.126 22.126 0 014.605 21.67c-1.939 6.06 1.358 12.605 7.466 14.593 6.109 1.939 12.605-1.358 14.593-7.466 4.799-14.884 1.793-31.852-9.454-44.311" fill="#f93"/><path d="M150.822 194.648c-2.036 3.491-6.545 5.139-10.035 3.685-3.491-1.406-4.558-5.333-2.57-8.727 2.036-3.393 6.351-5.042 9.793-3.684 3.491 1.26 4.751 5.187 2.812 8.726m-18.568 23.756c-5.624 8.968-17.695 12.895-26.761 8.774-8.92-4.072-11.587-14.495-5.963-23.27 5.575-8.727 17.21-12.605 26.228-8.823 9.114 3.926 12.023 14.253 6.496 23.319m21.138-63.51c-27.683-7.223-58.952 6.594-70.976 30.979-12.265 24.871-.387 52.504 27.537 61.522 28.991 9.356 63.121-4.994 74.999-31.803 11.732-26.277-2.909-53.28-31.56-60.698"/></g></g></svg>'
                },
                link: 'https://weibo.com/u/3169700852',
                // 也可以为无障碍添加一个自定义标签 (可选但推荐):
                ariaLabel: ''
            }
        ]
    }
})
