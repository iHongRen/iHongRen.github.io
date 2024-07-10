---
sidebar: false
---

# 读书笔记

<script setup>
import { data } from './reading.data.js'
</script>

<div v-for="(item, index) in data" :key="index">
    <h3 :id="index">{{ item.name }}<a :href="`#${index}`" class="header-anchor"></a></h3>
    <p class="content" v-html="item.content"></p>
    <div v-if="item.imgs" class="imgs">
        <img v-for="(img, imgIndex) in item.imgs" :key="imgIndex" :src="img" width="200" style="object-fit: contain;" data-fancybox="gallery">
    </div>
    <img v-if="item.fullImg" :src="item.fullImg" width="100%" data-fancybox="gallery">
    <!-- <p class="date">{{ item.date }}</p> -->
</div>

<style>
.content {
    white-space: pre-wrap;
}
.imgs {
    display: flex;
    flex-direction: row;
    gap: 10px;
    flex-wrap: wrap;
}
.date {
    color: #666;
    font-size: 14px;
}
</style>
