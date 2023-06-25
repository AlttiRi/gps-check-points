function main() {
    navigator.geolocation.getCurrentPosition(function(location) {
        const obj = {};
        for (const key in location.coords) {
            obj[key] = location.coords[key]
        }
        console.log(location.coords);
        document.querySelector(".main").textContent = JSON.stringify(obj, null, " ");
    });
}

main();

document.querySelector("html").onclick = main;
