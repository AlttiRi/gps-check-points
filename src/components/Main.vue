<script setup lang="ts">
import {Ref, ref} from "vue";
import {set, entries, createStore} from "idb-keyval";
import {formatDate} from "@alttiri/util-js";

const gpsPointsStore = createStore("GPS_Points_DB", "GPS_Points");

const coordObj: Ref<GeolocationPosition | undefined> = ref();
const savedPoints: Ref<GeolocationPosition[]> = ref([]);

!async function loadSavedPoints() {
    const gpsEntries: Array<[number, GeolocationCoordinates]> = await entries(gpsPointsStore);
    for (const gpsEntry of gpsEntries) {
        savedPoints.value.push({
            timestamp: gpsEntry[0],
            coords: gpsEntry[1],
        });
    }
    savedPoints.value = savedPoints.value.reverse()
}();


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
</script>

<template>
    <div class="main">
        <button @click="onUpdateClick">Update Point</button>
        <button @click="onSaveClick" :disabled="saved">Save Point</button>
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
        <div class="saved-coord" v-if="savedPoints.length">
            <hr>
            <div v-for="point of savedPoints">
                <div class="date">{{ formatDate(point.timestamp, "YYYY.MM.DD HH:mm:SS", false) }}</div>
                <div v-for="[k, v] of Object.entries(point.coords).filter(([_k, _v]) => _v)">
                    <span>{{ k }}</span>: <span>{{ v }}</span>
                </div>
                <hr>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
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
