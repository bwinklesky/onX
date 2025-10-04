window.renderMap = () => {

    require(["esri/Map", "esri/views/MapView"], async function (Map, MapView) {

        const [Legend, Graphic, Query, FeatureLayer, LayerList] = await $arcgis.import([
            "@arcgis/core/widgets/Legend.js",
            "@arcgis/core/Graphic.js",
            "@arcgis/core/rest/support/Query.js",
            "@arcgis/core/layers/FeatureLayer.js",
            "@arcgis/core/widgets/LayerList.js"
        ]);
                
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

        const stewmapLayer = new FeatureLayer({
            url: 'https://services1.arcgis.com/gGHDlz6USftL5Pau/arcgis/rest/services/Live_all_2023_v4_Stewmap_dataViewAdd/FeatureServer/3'
        })

        map.add(stewmapLayer);

        const view = new MapView({
            map: map,
            center: [-98.57955, 39.8283], // Longitude, latitude
            zoom: 5, // Zoom level
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


        approvedLayer.load().then(() => {
            // Set the view extent to the data extent
            //view.extent = approvedLayer.fullExtent;
            approvedLayer.popupTemplate = approvedLayer.createPopupTemplate();

            console.log(approvedLayer.features);

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

        view.when(function () {
            // Wait for the layer to load before querying
            approvedLayer.when(function () {

                const query = new Query({
                    where: "1=1", // This ensures all features are considered
                    returnGeometry: false,
                    outFields: ["*"], // Returns all fields. Specify an array of field names for specific fields.
                });

                approvedLayer.queryFeatures(query).then(function (results) {
                    // results.features is an array of Graphic objects

                    console.log(results);

                    var data = [];

                    var count = 0;
                    results.features.forEach(function (feature) {
                        
                        data.push(feature.attributes);
                        count++;
                        if (count > 10) {
                            //sendDataToBlazor(data);
                            data = [];
                        }

                        //console.log("Elevation Gain:", feature.attributes.ELEV_GAIN);
                        // Access feature.geometry for spatial information
                    });

                    

                }).catch(function (error) {
                    console.error("Error querying features:", error);
                });
            });
        });

    });
};

function sendDataToBlazor(data) {

    DotNet.invokeMethodAsync('Client', 'ReceiveDataFromJs', JSON.stringify(data))
        .then(() => {
            console.log('Data sent to Blazor successfully.');
        })
        .catch(error => {
            console.error('Error sending data to Blazor:', error);
        });
}