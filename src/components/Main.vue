<script setup lang="ts">
import {computed, Ref, ref, watch} from "vue";
import {set, entries, createStore} from "idb-keyval";
import {formatDate} from "@alttiri/util-js";

const gpsPointsStore = createStore("GPS_Points_DB", "GPS_Points");

const coordObj: Ref<GeolocationPosition | undefined> = ref();
const savedPoints: Ref<GeolocationPosition[]> = ref([]);

async function loadSavedPoints() {
    const gpsEntries: Array<[number, GeolocationCoordinates]> = await entries(gpsPointsStore);
    savedPoints.value = [];
    for (const gpsEntry of gpsEntries) {
        savedPoints.value.push({
            timestamp: gpsEntry[0],
            coords: gpsEntry[1],
        });
    }
    savedPoints.value = savedPoints.value.reverse()
}
void loadSavedPoints();

async function getCoords(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (location: GeolocationPosition) => resolve(location),
            (error: GeolocationPositionError) => reject(error),
            {
                enableHighAccuracy: true,
            },
        );
    });
}

function objectify<T>(target: T): T {
    const obj: any = {};
    for (const key in target) {
        if (isObject(target[key])) {
            obj[key] = objectify(target[key]);
            continue;
        }
        obj[key] = target[key as keyof T];
    }
    return obj as T;
}

async function onUpdateClick() {
    try {
        coordObj.value = await getCoords();
        saved.value = false;
    } catch (e) {
        alert(JSON.stringify(objectify(e as GeolocationPositionError), null, "  "));
    }
}
void onUpdateClick();

const saved = ref(false);
async function onSaveClick() {
    if (!coordObj.value) {
        return;
    }
    try {
        await set(coordObj.value.timestamp, objectify(coordObj.value.coords), gpsPointsStore);
        savedPoints.value.unshift(objectify(coordObj.value));
        saved.value = true;
    } catch (e) {
        alert(JSON.stringify(objectify(e), null, "  "));
    }
}

function isObject(target: any): target is object {
    return typeof target === "object" && !Array.isArray(target) && target !== null;
}

async function exportPoints() {
    const copySavedPoints = [...savedPoints.value];
    copySavedPoints.sort((p1, p2) => p1.timestamp - p2.timestamp);
    const text = JSON.stringify(copySavedPoints);
    console.log(text);
    return text;
}

import * as fflate from "fflate";
import {encodeBase85, decodeBase85} from "@alttiri/base85";
import {renderTemplateString} from "../util";

async function onSharePoints() {
    const pointsText = await exportPoints();
    const pointsTextEnc = encodeBase85(fflate.deflateSync(new TextEncoder().encode(pointsText)));

    if (!navigator.canShare) {
        alert("Sharing is not supported");
        console.log("pointsTextEnc");
        console.log(pointsTextEnc);
        return;
    }

    const share: ShareData = {
        title: pointsTextEnc,
    };
    try {
        await navigator.share(share);
    } catch (e) {
        alert(JSON.stringify(objectify(e), null, "  "));
    }
}
async function importPoints(data: string) {
    const json = new TextDecoder().decode(fflate.inflateSync(decodeBase85(data)));
    const entries: GeolocationPosition[] = JSON.parse(json);
    console.log(entries);
    for (const entry of entries) {
        await set(entry.timestamp, objectify(entry.coords), gpsPointsStore);
    }
    await loadSavedPoints();
}

//@ts-ignore
globalThis.importPoints = importPoints;

// for example, "https://www.google.ru/maps/@{latitude},{longitude},17z"
const template = ref(localStorage.getItem("gps-pattern-url") || "");
watch(template, value => {
    localStorage.setItem("gps-pattern-url", value);
});

const badTemplate = ref(false);
const link = computed(() => {
    if (!coordObj.value) {
        badTemplate.value = false;
        return "";
    }
    const result = renderTemplateString(template.value, coordObj.value.coords);
    badTemplate.value = result.hasUndefined;
    return result.value;
});

</script>

<template>
    <div class="main">
        <button @click="onUpdateClick">Update Point</button>
        <button @click="onSaveClick" :disabled="saved">Save Point</button>
        <button @click="onSharePoints" >Share</button>
        <table class="coord" v-if="coordObj">
            <tr v-for="[k, v] of Object.entries(objectify(coordObj.coords)).filter(([_k, _v]) => _v)">
                <td>{{ k }}</td>: <td>{{ v }}</td>
            </tr>
            <tr class="date">
                <td>timestamp</td>: <td>{{ formatDate(coordObj.timestamp, "YYYY.MM.DD HH:mm:SS", false) }}</td>
            </tr>
        </table>
    </div>
    <div class="saved">
        <hr>
        <input type="text" v-model="template" name="coord-pattern-url" spellcheck="false" :class="{red: badTemplate}">
        <div v-if="template && coordObj">
            <a :href="link" target="_blank" rel="noopener noreferrer">{{ link }}</a>
        </div>
        <div class="saved-coord" v-if="savedPoints.length">
            <hr>
            <div v-for="point of savedPoints" class="entry">
                <div class="date">{{ formatDate(point.timestamp, "YYYY.MM.DD HH:mm:SS", false) }}</div>
                <div v-for="[k, v] of Object.entries(point.coords).filter(([_k, _v]) => _v)">
                    <span>{{ k }}</span>: <span>{{ v }}</span>
                </div>
                <div class="out-link" v-if="template">
                    <a :href="renderTemplateString(template, point.coords).value" target="_blank" rel="noopener noreferrer">link</a>
                </div>
                <hr>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.red {
    border-color: red;
}
.entry {
    position: relative;
    .out-link {
        position: absolute;
        right: 5px;
        bottom: 5px;
    }
}
.entry:not(:hover) {
    .out-link {
        display: none;
    }
}
input {
    font-size: 16px;
    padding: 10px;
    border: 2px solid #ccc;
    border-radius: 5px;
    outline: none;
    box-shadow: none;
    margin-bottom: 5px;

    width: 100%;
    box-sizing: border-box;
}

button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
    border-radius: 4px;
    outline: 0;
    margin: 5px;
}
button:active {
    box-shadow: 0 0 3px grey;
}
button[disabled] {
    background-color: gray;
}
.date {
    color: grey;
}
</style>
