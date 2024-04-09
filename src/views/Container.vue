<template>
    <div class="wrapper">
        <div class="view-container">
            <router-view></router-view>
        </div>
        <n-button secondary type="primary" style="position: absolute;top: 5px;right: 5px;" @click="activate">
            MENU
        </n-button>
        <n-drawer v-model:show="active" :width="400" :placement="'right'" style="--n-body-padding:12px">
            <n-drawer-content>
                <n-menu :options="menuOptions" :root-indent="16" :indent="20" @update:value="handleUpdateValue" />
            </n-drawer-content>
        </n-drawer>
    </div>
</template>

<script setup>
import { ref, h } from "vue";
import { viewRouters } from '@/router/view-router'
import { router } from '@/router';
import { NIcon } from 'naive-ui'
import { GridOutline } from '@vicons/ionicons5'
const active = ref(false)
const activate = () => {
    active.value = true
}

const menuOptions = [
    {
        label: 'Home',
        key: '/grid',
        icon: () => h(NIcon, null, { default: () => h(GridOutline) })
    },
    {
        type: 'divider',
        props: {
            style: {
                margin: '0px'
            }
        }
    },
    ...Object.entries(viewRouters).map(item => {
        const [className, list] = item
        return {
            type: 'group',
            label: className,
            key: className,
            children: list.map(e => ({
                label: e.name,
                key: e.path,
            }))
        }
    })
]


const handleUpdateValue = (routePath) => {
    router.push(routePath)
    active.value = false
}

</script>

<style lang="scss" scoped>
.wrapper {
    display: contents;
}

.view-container {
    width: 100%;
    height: 100%;
}
</style>