import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settingsStore", {
    state: () => ({
        addons: [] as any[],
    }),
});