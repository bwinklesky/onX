import SceneView from "@arcgis/core/views/SceneView";
import ArcGISMap from "@arcgis/core/Map.js";
import WMSLayer from "@arcgis/core/layers/WMSLayer";
import MapView from "@arcgis/core/views/MapView";
import LayerList from "@arcgis/core/widgets/LayerList";

export class Map {

    constructor() {

       

        const layer = new WMSLayer({
            url: "https://klyk.app/geoserver/mountainmap/wms?service=WMS",
            sublayers: [
                {
                    name: "mountainmap:resorts"
                }
            ]
        });

        const resorts = new WMSLayer({
            title: "MountainMap Ski Resorts",
            url: "https://klyk.io/geoserver/mountainmap/wms?service=WMS",
            sublayers: [
                {
                    title: "Resorts",
                    name: "mountainmap:ski-resorts"
                }
            ]
        });

        const test = new WMSLayer({
            title: "MountainMap Service Layers",
            url: "https://klyk.io/geoserver/mountainmap/wms?service=WMS",
            sublayers: [
                {
                    title: "Resort Boundaries",
                    name: "mountainmap:resorts"
                },
                {
                    title: "Trails",
                    name: "mountainmap:trails"
                },
                {
                    title: "Peaks",
                    name: "mountainmap:peaks"
                }
            ]
        });

        const map = new ArcGISMap({
            layers: [resorts, test],
            basemap: 'satellite',
            ground: "world-elevation",
        });

        const sceneView = new SceneView({
            map,
            container: "viewDiv",
            center: [-118.244, 34.052],
            zoom: 12
        });

        const mapView = new MapView({
            map,
            container: "viewDiv",
            center: [-118.244, 34.052],
            zoom: 12
        });

        const layerList = new LayerList({
            view: sceneView
        });

        // Adds widget below other elements in the top left corner of the view
        sceneView.ui.add(layerList, {
            position: "top-right"
        });

        sceneView.when((e) => {

            console.log("Scene is loaded");

            console.log("MAP:", e);

            e.goTo({
                center: [-111.7732, 40.5725],
                zoom: 14,
                heading: 88,
                tilt: 75
            });

        })

    }

}


var test = new Map();

alert("bob");