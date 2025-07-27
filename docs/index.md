---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: ""
  text: ""
  tagline: "春风若有怜花意，能否许我再少年"
  # actions:
  #   - theme: brand
  #     text: 博客文章
  #     link: /blog/
  #   - theme: alt
  #     text: 关于我
  #     link: /about



features:
  - title: 简介
    details: 90后 成都 软件工程
#   - title: 技能
#     details: iOS、HarmonyOS、JS、TS、Python、Vue、Node、Electron
  - title: 爱好
    details: 阅读/历史/运动/分享
---

<style>
  .image-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 2rem;
  }

  .image-wrapper img {
    width: 100%;
  }
  
  @media (min-width: 768px) {
    .image-container {
      flex-direction: row;
    }
    .image-wrapper img {
      width: auto;
      height: 300px;
      object-fit: contain;
    }
  }
</style>

<div class="image-container">
  <div class="image-wrapper">
    <img 
      src="https://github-readme-stats.vercel.app/api?username=iHongRen&show_icons=true&theme=ambient_gradient" 
      alt="GitHub Stats" 
      data-fancybox="gallery"
    >
  </div>
  <div class="image-wrapper">
    <img 
      src="https://github-readme-stats.vercel.app/api/top-langs/?username=iHongRen&layout=compact" 
      alt="Top Languages" 
      data-fancybox="gallery"
    >
  </div>
</div>

