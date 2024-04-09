<template>
    <div class="item-container">
        <img class="cover" :src="props.cover" onerror="this.src = 'https://dummyimage.com/1280x900&text=image+error'" :alt="props.text">
        <div class="text">
            <span>{{ props.text }}</span>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(['cover', 'text'])
</script>

<style lang="scss">
.item-container {
    position: relative;
    overflow: hidden;
    cursor: pointer;

    img.cover {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .text {
        position: absolute;
        opacity: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 1.6em;
        align-items: center;
        background-image: linear-gradient(to top, rgba(99, 99, 99, 0.74) 0%, rgba(99, 99, 99, 0.01) 40%);
        transition: opacity ease-in-out 0.25s;

        span {
            font-style: italic;
            color: white;
            display: inline-block;
            width: 100%;
            word-wrap: break-word;
        }
    }

    &:hover {
        .text {
            opacity: 1;
        }
    }


}
</style>