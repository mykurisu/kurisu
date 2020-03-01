<template>
    <div id="preview">
        <div :class="`content ${extensionName || ''}`" v-html="value"></div>
    </div>
</template>

<script>
export default {
    props: ['value', 'extensionName']
}
</script>

<style lang="less">
@import '../extensions/index.less';

.content {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
}
</style>