<script lang="ts">
import { useSettingsStore } from '@/stores/settings';
export default {
    name: 'BackButton',
    setup() {
        const settingsStore = useSettingsStore();
        return {
        settingsStore,
        };
    },
    props: {
        step: {
            type: Number,
            default() {
                return 1;
            }
        },
    },
}
</script>

<template>
    <div class="left backBtn" @click="settingsStore.step -= step">Back</div>
</template>

<style scoped>
.backBtn {
    padding: 15px;
    background: #EC133A;
    font-weight: bold;
    border-radius: 20px;
    max-width: 200px;
    width: 100%;
    cursor: pointer;
    text-align: center;
    color: white;
}
</style>