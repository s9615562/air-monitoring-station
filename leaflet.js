// center
let defultSpot = [23.5, 120.8]
let map = L.map('map').setView(defultSpot, 8);
    
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// click and pop the lng/lat
function onMapClick(e) {
    var popup = L.popup()
    popup
        .setLatLng(e.latlng)
        .setContent(e.loc)
        .openOn(map);
    querySite.textContent = e.loc
    map.setView([e.latlng.lat,e.latlng.lng], 10);
}

// self define mark module
let loc,status;
function setMarker(lat,lng,status,loc){
    var LeafIcon = L.Icon.extend({
        options: {
            iconSize: [30, 30],
        }

    });
    var greenIcon = new LeafIcon({iconUrl: './image/green_pin.png'}),
        redIcon = new LeafIcon({iconUrl: './image/red_pin.png'}),
        blueIcon = new LeafIcon({iconUrl: './image/blue_pin.png'}),
        yellowIcon = new LeafIcon({iconUrl: './image/yellow_pin.png'});
    L.icon = function (options) {
        return new L.Icon(options);
    };

    if (status === "普通") {
        status = blueIcon;
    } else if (status === "對敏感族群不健康") {
        status = yellowIcon;
    } else if (status === "對所有族群不健康") {
        status = redIcon;
    } else if (status === "良好") {
        status = greenIcon;
    }else if (status === "") {
        status = greenIcon;
    } else {
        // 
    }

    let marker = L.marker([lat, lng], { icon: status }).addTo(map).bindPopup(loc);
    marker.on('click', function () {
        onMapClick({ latlng: marker.getLatLng(),loc:loc,status:status });
    });
}
    

//fetch api
let jsonData=[];
let siteData;
async function fetchData(){
    let response = await fetch("https://data.moenv.gov.tw/api/v2/aqx_p_488?api_key=e8dd42e6-9b8b-43f8-991e-b3dee723a52d&limit=1000&sort=datacreationdate%20desc&format=JSON")
    let data = await response.json()
    let element=data.records;
    for(let i = 0; i<85;i++){
        let lat = element[i].latitude
        let lng = element[i].longitude
        let site = element[i].sitename
        let status = element[i].status
        let time = element[i].datacreationdate
        siteData = {
            "site":site,
            "lat":lat,
            "lng":lng
        }
        jsonData.push(siteData)
        setMarker(lat,lng,status,site)
    }
    return jsonData;
}


// input site and get lat and lng
let siteLat,siteLng,siteMarker;
let sites = await fetchData();

function getSite(site){
    sites.forEach(element => {
        if(site == element.site){
            siteLat =element.lat
            siteLng =element.lng
            map.setView([siteLat,siteLng], 10);
            siteMarker = L.marker([siteLat, siteLng], { icon: L.divIcon({ className: 'hidden-icon' }) }).addTo(map).bindPopup(site);
            siteMarker.openPopup();
        }else if(site == "查無區域"){
            siteMarker.closePopup();
            map.setView(defultSpot, 8);
        }else{
            // 
        }
    })
}

// Select the target div
let querySite = document.querySelector('.main_info_title_result');
// Function to be executed when changes are observed
let handleChange = function(mutations) {
    mutations.forEach(function(mutation) {
        // Do something with the changes
        let changedContent = mutation.target.textContent;
        let targetSite = changedContent.replace(/\s/g, '')
        getSite(targetSite)
    });
};

// Create a new MutationObserver
let observer = new MutationObserver(handleChange);

// Configure the observer to watch for changes in the content of the target div
let config = { childList: true, subtree: true };

// Start observing the target div with the specified configuration
observer.observe(querySite, config);

