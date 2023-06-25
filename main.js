void main();
document.querySelector("html").onclick = main;


async function main() {
    const obj = await getCoords();
    document.querySelector(".main").textContent = JSON.stringify(obj, null, " ");
}


/** @return {Promise<GeolocationCoordinates>} */
async function getCoords() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(function(location, error) {
            if (error) {
                reject(error);
            }
            resolve(objCoord(location.coords));
        });
    });
}

/** @param {GeolocationCoordinates} coords */
function objCoord(coords) {
    const obj = {};
    for (const key in coords) {
        if (coords[key] === null) {
            continue;
        }
        obj[key] = coords[key];
    }
    return obj;
}
