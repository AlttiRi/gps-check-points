<script setup lang="ts">
import {Ref, ref} from "vue";

const coordObj: Ref<GeolocationPosition | undefined> = ref();

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
    } catch (e) {
        alert(JSON.stringify(objectify(e as GeolocationPositionError), null, "  "));
    }
}
void onUpdateClick();


import {get, set, del, entries, createStore} from "idb-keyval";
const urlInfoStore = createStore("GPS_Points_DB", "GPS_Points");
async function onSaveClick() {
    if (!coordObj.value) {
        return;
    }
    try {
        await set(coordObj.value.timestamp, objectify(coordObj.value.coords), urlInfoStore);
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
        <button @click="onSaveClick">Save Point</button>
        <table class="coord" v-if="coordObj">
            <tr v-for="[k, v] of Object.entries(objectify(coordObj.coords)).filter(([_k, _v]) => _v)">
                <td>{{ k }}</td>: <td>{{ v }}</td>
            </tr>
            <tr>
                <td>timestamp</td>: <td>{{ coordObj.timestamp }}</td>
            </tr>
        </table>
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
</style>
