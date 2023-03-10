<script setup lang="ts">
import { ref } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';
import { v4 as uuidv4 } from 'uuid';
import layouts from '@/data/layouts';
import aesthetics from '@/data/aesthetics';
import themes from '@/data/themes';
const settingsStore = useSettingsStore();
const done = ref('');
const canGenerate = ref(true);
async function zip() {
    JSZipUtils.getBinaryContent('full.zip', function (err: any, data: any) {
        if (err) {
            throw err; // or handle err
        }

        JSZip.loadAsync(data).then(async function (res) {
            // layout edit
            await res.file('resources/index.view')!.async('string').then(function (data) {
                // icon coords
                let newLayout = data.replace(/(!y1_1!)/g, `${parseInt(layouts[settingsStore.layout as keyof typeof layouts].stats[0].y1)}%`);
                newLayout = newLayout.replace(/(!y1_2!)/g, `${parseInt(layouts[settingsStore.layout as keyof typeof layouts].stats[1].y1)}%`);
                newLayout = newLayout.replace(/(!y1_3!)/g, `${parseInt(layouts[settingsStore.layout as keyof typeof layouts].stats[2].y1)}%`);
                newLayout = newLayout.replace(/(!y1_4!)/g, `${parseInt(layouts[settingsStore.layout as keyof typeof layouts].stats[3].y1)}%`);
                newLayout = newLayout.replace(/(!x1_1!)/g, `${5 + parseInt(layouts[settingsStore.layout as keyof typeof layouts].stats[0].x1)}%`);
                newLayout = newLayout.replace(/(!x1_2!)/g, `${5 + parseInt(layouts[settingsStore.layout as keyof typeof layouts].stats[1].x1)}%`);
                newLayout = newLayout.replace(/(!x1_3!)/g, `${5 + parseInt(layouts[settingsStore.layout as keyof typeof layouts].stats[2].x1)}%`);
                newLayout = newLayout.replace(/(!x1_4!)/g, `${5 + parseInt(layouts[settingsStore.layout as keyof typeof layouts].stats[3].x1)}%`);

                newLayout = newLayout.replace(/(!y2_1!)/g, `${parseInt(layouts[settingsStore.layout as keyof typeof layouts].stats[0].y2)}%`);
                newLayout = newLayout.replace(/(!y2_2!)/g, `${parseInt(layouts[settingsStore.layout as keyof typeof layouts].stats[1].y2)}%`);
                newLayout = newLayout.replace(/(!y2_3!)/g, `${parseInt(layouts[settingsStore.layout as keyof typeof layouts].stats[2].y2)}%`);
                newLayout = newLayout.replace(/(!y2_4!)/g, `${parseInt(layouts[settingsStore.layout as keyof typeof layouts].stats[3].y2)}%`);
                newLayout = newLayout.replace(/(!x2_1!)/g, `${5 + parseInt(layouts[settingsStore.layout as keyof typeof layouts].stats[0].x2)}%`);
                newLayout = newLayout.replace(/(!x2_2!)/g, `${5 + parseInt(layouts[settingsStore.layout as keyof typeof layouts].stats[1].x2)}%`);
                newLayout = newLayout.replace(/(!x2_3!)/g, `${5 + parseInt(layouts[settingsStore.layout as keyof typeof layouts].stats[2].x2)}%`);
                newLayout = newLayout.replace(/(!x2_4!)/g, `${5 + parseInt(layouts[settingsStore.layout as keyof typeof layouts].stats[3].x2)}%`);
                // time coords
                newLayout = newLayout.replace(/(!x_1!)/g, `${Math.ceil(30 * parseFloat(layouts[settingsStore.layout as keyof typeof layouts].interface[0].x))}%`);
                newLayout = newLayout.replace(/(!y_1!)/g, `${Math.ceil(30 * parseFloat(layouts[settingsStore.layout as keyof typeof layouts].interface[0].y))}%`);
                // date coords
                newLayout = newLayout.replace(/(!x_2!)/g, `${Math.ceil(30 * parseFloat(layouts[settingsStore.layout as keyof typeof layouts].interface[1].x))}%`);
                newLayout = newLayout.replace(/(!y_2!)/g, `${Math.ceil(30 * parseFloat(layouts[settingsStore.layout as keyof typeof layouts].interface[1].y))}%`);
                // icons
                if (settingsStore.fields.length == 4) {
                    newLayout = newLayout.replace(/(!stat_1!)/g, settingsStore.fields[0].stat);
                    newLayout = newLayout.replace(/(!stat_2!)/g, settingsStore.fields[1].stat);
                    newLayout = newLayout.replace(/(!stat_3!)/g, settingsStore.fields[2].stat);
                    newLayout = newLayout.replace(/(!stat_4!)/g, settingsStore.fields[3].stat);
                } else if (settingsStore.fields.length == 3) {
                    newLayout = newLayout.replace(/(!stat_1!)/g, settingsStore.fields[0].stat);
                    newLayout = newLayout.replace(/(!stat_2!)/g, settingsStore.fields[1].stat);
                    newLayout = newLayout.replace(/(!stat_3!)/g, settingsStore.fields[2].stat);
                    newLayout = newLayout.replace(/(!stat_4!)/g, 'none');
                } else if (settingsStore.fields.length == 2) {
                    newLayout = newLayout.replace(/(!stat_1!)/g, settingsStore.fields[0].stat);
                    newLayout = newLayout.replace(/(!stat_2!)/g, settingsStore.fields[1].stat);
                    newLayout = newLayout.replace(/(!stat_3!)/g, 'none');
                    newLayout = newLayout.replace(/(!stat_4!)/g, 'none');
                } else if (settingsStore.fields.length == 1) {
                    newLayout = newLayout.replace(/(!stat_1!)/g, settingsStore.fields[0].stat);
                    newLayout = newLayout.replace(/(!stat_2!)/g, 'none');
                    newLayout = newLayout.replace(/(!stat_3!)/g, 'none');
                    newLayout = newLayout.replace(/(!stat_4!)/g, 'none');
                }
                newLayout = newLayout.replace(/(!theme!)/g, settingsStore.theme);
                res.file('resources/index.view', newLayout);
            });
            // aesthetic/theme edit
            await res.file(`resources/${settingsStore.theme}.defs`)!.async('string').then(function(data) {
                let newTheme = data.replace(/(!theme0!)/g, settingsStore.aesthetic == null ? themes[settingsStore.theme as keyof typeof themes].default[0] : aesthetics[settingsStore.aesthetic as keyof typeof aesthetics].theme[0]);
                newTheme = newTheme.replace(/(!theme1!)/g, settingsStore.aesthetic == null ? themes[settingsStore.theme as keyof typeof themes].default[1] : aesthetics[settingsStore.aesthetic as keyof typeof aesthetics].theme[1]);
                res.file(`resources/${settingsStore.theme}.defs`, newTheme);
            });
            await res.file(`resources/config.json`)!.async('string').then(function(data) {
                let newTheme = data.replace(/(!theme!)/g, settingsStore.theme);
                newTheme = newTheme.replace(/(!stats!)/g, JSON.stringify(settingsStore.fields));
                res.file(`resources/config.json`, newTheme);
            });
            await res.file(`resources/widget.defs`)!.async('string').then(function(data) {
                let newTheme = data.replace(/(!theme!)/g, settingsStore.theme);
                res.file(`resources/widget.defs`, newTheme);
            });
            await res.file(`app/index.js`)!.async('string').then(function(data) {
                let newTheme = data.replace(/(!theme!)/g, settingsStore.theme);
                res.file(`app/index.js`, newTheme);
            });
            if (settingsStore.customImage != null) {
                // convert base64 customImage to blob and save it
                const byteString = atob(settingsStore.customImage.split(',')[1]);
                const mimeString = settingsStore.customImage.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: mimeString });
                res.file(`resources/placeholder.png`, blob);
            }
            await res.generateAsync({ type: "blob" }).then(function (content) {
                saveAs(content, "watchface.zip");
            });

        });
    });
}
async function genCode() {
    if (!canGenerate.value) return;
    canGenerate.value = false;
    let code = uuidv4();
    await fetch(`${import.meta.env.VITE_API_POST}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            k: code,
            v: settingsStore.getExport()
        }),
    }).then((response) => {
        if (response.status == 200) {
            done.value = code;
        } else {
            alert("Something went wrong. Please try again later.");
        }
        canGenerate.value = true;
    });
}
</script>

<template>
    <div v-if="settingsStore.theme != null && settingsStore.layout != null">
        <h2>Export your customized watch face</h2>
        <div id="exportBtn" :class="{'clickable': canGenerate, 'noclick': !canGenerate}" @click="genCode">Export Style</div>
        <h3>Export Code</h3>
        <textarea v-html="done"></textarea>
        <!--<h3>Debug Output</h3>
        <textarea v-html="settingsStore.getExport()" style="width: 70vw;height:200px"></textarea>-->
    </div>
    <div v-else>
        <h2>Please select a theme and a layout to export your watch face.</h2>
    </div>
    <footer class="d-flex center">
    </footer>
</template>

<style scoped>
#exportBtn {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
}
.noclick {
    cursor: not-allowed;
}
</style>