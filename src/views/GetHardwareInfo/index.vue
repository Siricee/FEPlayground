<template>
    <div>
        <p>
            Platform: {{ vendor }}
        </p>
        <p>
            GPU: {{ renderer }}
        </p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            vendor: '',
            renderer: '',
        }
    },
    mounted() {
        function getHardwareInfo() {
            const gl = document.createElement('canvas').getContext('webgl')
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
            if (!debugInfo) return
            const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
            return { vendor, renderer }
        }
        const { vendor, renderer } = getHardwareInfo()
        this.vendor = vendor
        this.renderer = renderer
    },
};
</script>