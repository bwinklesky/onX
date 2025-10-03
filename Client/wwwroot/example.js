window.renderMap = async () => {


    //const [Map, SceneView, WMSLayer] = await $arcgis.import([
    //    "@arcgis/core/Map.js",
    //    "@arcgis/core/views/SceneView.js",
    //    "@arcgis/core/layers/WMSLayer.js",
    //]);

    //const layer = new WMSLayer({
    //    url: "https://ows.terrestris.de/osm/service",
    //});

    //layer.load().then(() => {
    //    const sublayer = layer.findSublayerByName("OSM-WMS");
    //    if (sublayer) {
    //        layer.sublayers = [sublayer];
    //    }
    //});

    //const map = new Map({
    //    basemap: {
    //        baseLayers: [layer],
    //    },
    //});

    //const view = new SceneView({
    //    container: "viewDiv",
    //    map: map,
    //    spatialReference: {
    //        wkid: 102100,
    //    },
    //});


    const [Legend, Graphic] = await $arcgis.import([
        "@arcgis/core/widgets/Legend.js",
        "@arcgis/core/Graphic.js",       
    ]);

    require(["esri/config", "esri/Map", "esri/views/MapView"], async function (esriConfig,
        Map, MapView) {


  
        const WMSLayer = await $arcgis.import("@arcgis/core/layers/WMSLayer.js");
        const WFSLayer = await $arcgis.import("@arcgis/core/layers/WFSLayer.js");
        const FeatureLayer = await $arcgis.import("@arcgis/core/layers/FeatureLayer.js");
        const LayerList = await $arcgis.import("@arcgis/core/widgets/LayerList.js");  
        const FeatureService = await $arcgis.import("@arcgis/core/rest/featureService/FeatureService.js");

        console.log(WMSLayer);

        //const layer2 = new WMSLayer({
        //    url: "https://ows.terrestris.de/osm/service",
        //});


        //layer2.load().then(() => {
        //    const sublayer = layer.findSublayerByName("OSM-WMS");
        //    if (sublayer) {
        //        layer.sublayers = [sublayer];
        //    }
        //});

        //esriConfig.apiKey = "AAPK2ecc83e252294018a265438653dd9cc25DUG27XZzbpWZyhsUauz-x4e3zl8LFZEqy5iP-NBNQRRYSOlkT77xDFsYi2bZY1N";
       
        const map = new Map({
            //layers: [layer],
            basemap: "satellite" // Basemap layer service
        });

        const approvedLayer = new FeatureLayer({
            url: `https://services1.arcgis.com/KbxwQRRfWyEYLgp4/ArcGIS/rest/services/BLM_Natl_Land_Use_Plans_Approved_2022/FeatureServer/1`
        });
        
        map.add(approvedLayer);

        const developmentLayer = new FeatureLayer({
            url: `https://services1.arcgis.com/KbxwQRRfWyEYLgp4/ArcGIS/rest/services/BLM_Natl_Revision_Development_Land_Use_Plans/FeatureServer/0`
        });

        map.add(developmentLayer);

        const view = new MapView({
            map: map,
            center: [-118.805, 34.027], // Longitude, latitude
            zoom: 13, // Zoom level
            container: "viewDiv" // Div element
        });

        const pointGraphic = new Graphic({
            symbol: {
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                color: [0, 0, 139],
                outline: {
                    color: [255, 255, 255],
                    width: 1.5,
                },
            },
        });

        view.on("click", (event) => {

            view.graphics.remove(pointGraphic);

            if (view.graphics.includes(bufferGraphic)) {
                view.graphics.remove(bufferGraphic);
            }

            queryFeatures(event);

        });

        const distance = null;
        const units = null;

        approvedLayer.load().then(() => {
            // Set the view extent to the data extent
            view.extent = approvedLayer.fullExtent;
            approvedLayer.popupTemplate = approvedLayer.createPopupTemplate();
        });

        developmentLayer.load().then(() => {
            // Set the view extent to the data extent
            //view.extent = approvedLayer.fullExtent;
            developmentLayer.popupTemplate = developmentLayer.createPopupTemplate();
        });


        // Create graphic for distance buffer
        const bufferGraphic = new Graphic({
            symbol: {
                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                color: [173, 216, 230, 0.2],
                outline: {
                    // autocasts as new SimpleLineSymbol()
                    color: [255, 255, 255],
                    width: 1,
                },
            },
        });

        function queryFeatures(screenPoint) {

            const point = view.toMap(screenPoint);

            console.log(approvedLayer);

            if (approvedLayer.visible) {
                approvedLayer
                    .queryFeatures({
                        geometry: point,
                        // distance and units will be null if basic query selected
                        spatialRelationship: "intersects",
                        returnGeometry: false,
                        returnQueryGeometry: true,
                        outFields: ["*"],
                    })
                    .then((featureSet) => {
                        // set graphic location to mouse pointer and add to mapview
                        pointGraphic.geometry = point;
                        view.graphics.add(pointGraphic);
                        // open popup of query result
                        view.openPopup({
                            location: point,
                            features: featureSet.features,
                            featureMenuOpen: true,
                        });
                        if (featureSet.queryGeometry) {
                            bufferGraphic.geometry = featureSet.queryGeometry;
                            view.graphics.add(bufferGraphic);
                        }
                    });

            }

            if (developmentLayer.visible) {
                developmentLayer
                    .queryFeatures({
                        geometry: point,
                        // distance and units will be null if basic query selected
                        spatialRelationship: "intersects",
                        returnGeometry: false,
                        returnQueryGeometry: true,
                        outFields: ["*"],
                    })
                    .then((featureSet) => {
                        // set graphic location to mouse pointer and add to mapview
                        pointGraphic.geometry = point;
                        view.graphics.add(pointGraphic);
                        // open popup of query result
                        view.openPopup({
                            location: point,
                            features: featureSet.features,
                            featureMenuOpen: true,
                        });
                        if (featureSet.queryGeometry) {
                            bufferGraphic.geometry = featureSet.queryGeometry;
                            view.graphics.add(bufferGraphic);
                        }
                    });
            }
           
        }

        const layerList = new LayerList({
            view: view
        });

        view.ui.add(layerList, {
            position: "bottom-left"
        });

        let legend = new Legend({
            view: view
        });

        view.ui.add(legend, "bottom-right");

    });
};