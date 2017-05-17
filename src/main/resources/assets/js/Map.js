import {FormBuilder} from './FormBuilder';
export class Map {
    constructor({
        layers = [],
        defaultLayer = '',
        featureNS = 'urbupdate',
        srsName = 'EPSG:32632',
        workspace = 'workspace',
        format = 'image/png',
        url = 'http://localhost:8080/geoserver',
        btnSelect = {},
        btnDelete = {},
        btnDraw = {},
        google = false,
        bing = true,
        layers_primary_key = 'ID'
    } = {}) {
        this.bing = bing;
        this.layers = layers;
        this.layers_primary_key = layers_primary_key;
        this.defaultLayer = defaultLayer;
        this.featureNS = featureNS;
        this.srsName = srsName;
        this.workspace = workspace;
        this.format = format;
        this.url = url;
        this.bounds = [553582.863643649, 3984163.3300781306,
            625006.0800781315, 4053139.11661919];
        this.formatGeoJSON_array = {};
        this.sourceWFS_array = {};
        this.styles_array = {};
        this.layersWFS_array = {};
        this.formatGML_array = {};
        this.formatWFS_array = {};
        this.map = {};
        this.btnSelect = btnSelect;
        this.btnDelete = btnDelete;
        this.btnDraw = btnDraw;
        this.interactionSelect = new ol.interaction.Select({
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255,0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#FF2828'
                })
            }),
            geometryName: 'the_geom'
        });
        this.interactionDelete = new ol.interaction.Select();
        this.projection = {};
        this.google = google;
        this.perimetreArray = [];
        this.perimetre = 0;
    }

    createMap() {
        let _this = this;
        var mousePositionControl = new ol.control.MousePosition({
            className: 'custom-mouse-position',
            target: document.getElementById('location'),
            coordinateFormat: ol.coordinate.createStringXY(5),
            undefinedHTML: '&nbsp;'
        });
        var projection = this.getProjection();
        var view = new ol.View({
            projection: projection,
            Zoom: 21,
        });

        if (this.google) {
            jQuery('#map').html('<div id="olmap" class="fill"></div><div id="gmap" class="fill"></div>');
            this.map = new ol.Map({
                interactions: ol.interaction.defaults({
                    altShiftDragRotate: false,
                    dragPan: false,
                    rotate: false
                }).extend([new ol.interaction.DragPan({kinetic: null})]),
                controls: ol.control.defaults({
                    zoom: true,
                    attribution: false
                }).extend([mousePositionControl]),
                target: 'olmap',
                view: view
            });
            var mapOptions = {
                mapTypeControl: true,
                mapTypeControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    mapTypeIds: [
                        google.maps.MapTypeId.SATELLITE,
                        google.maps.MapTypeId.ROADMAP,
                        google.maps.MapTypeId.TERRAIN,
                        google.maps.MapTypeId.HYBRID
                    ]
                },
                zoomControl: false
            };
            var gmap = new google.maps.Map(document.getElementById('gmap'), mapOptions);
            this.map.getView().on('change:center', function () {
                var view = _this.map.getView();
                var projection = view.getProjection();
                var center = view.getCenter();
                center = ol.proj.transform(center, projection, 'EPSG:4326');
                gmap.setCenter(new google.maps.LatLng(center[1], center[0]));
            });
            this.map.getView().on('change:resolution', function () {
                var zoom = _this.map.getView().getZoom();
                gmap.setZoom(zoom);
            });
            var olMapDiv = document.getElementById('olmap');
            olMapDiv.parentNode.removeChild(olMapDiv);
            gmap.controls[google.maps.ControlPosition.TOP_LEFT].push(olMapDiv);
        } else if (this.bing) {
            let l = new ol.layer.Tile({
                visible: true,
                preload: Infinity,
                source: new ol.source.BingMaps({
                    key: 'AuGIRikTzpl0eFlAU2U0SIxTpeFtXwzvWjUhWgmzNEHFNvTF_w-MkGW7l1bhMuGn',
                    imagerySet: 'AerialWithLabels'
                })
            });
            this.map = new ol.Map({
                interactions: ol.interaction.defaults({
                    altShiftDragRotate: false,
                    dragPan: false,
                    rotate: false
                }).extend([new ol.interaction.DragPan({kinetic: null})]),
                controls: ol.control.defaults({
                    zoom: true,
                    attribution: false
                }).extend([mousePositionControl]),
                layers: [l],
                loadTilesWhileInteracting: true,
                target: 'map',
                view: view
            });
        }
        else {
            jQuery('#map').html('<div id="olmap" class="fill"></div>');
            this.map = new ol.Map({
                interactions: ol.interaction.defaults({
                    altShiftDragRotate: false,
                    dragPan: false,
                    rotate: false
                }).extend([new ol.interaction.DragPan({kinetic: null})]),
                controls: ol.control.defaults({
                    zoom: true,
                    attribution: false
                }).extend([mousePositionControl]),
                target: 'olmap',
                view: view
            });
        }
    }

    getDraw() {
        let _this = this;
        return new ol.interaction.Draw({
            type: 'MultiPolygon',
            source: this.layersWFS_array[_this.defaultLayer].getSource(),
            geometryName: 'the_geom'
        });
    }

    getProjection() {
        let _this = this;
        if (this.google || this.bing) {
            proj4.defs("EPSG:32632", "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");
            proj4.defs("EPSG:22332", "+proj=utm +zone=32 +a=6378249.2 +b=6356515 +towgs84=-263,6,431,0,0,0,0 +units=m +no_defs");
            return new ol.proj.Projection({
                code: 'EPSG:3857',
                units: 'm',
                axisOrientation: 'neu'
            });
        } else {
            return new ol.proj.Projection({
                code: _this.srsName,
                units: 'm',
                axisOrientation: 'neu'
            });
        }
    }

    createFormatGML(layerName) {
        let _this = this;
        return new ol.format.GML({
            featureNS: _this.featureNS,
            featureType: layerName,
            srsName: _this.srsName
        });
    }

    createFormatWFS(layerName) {
        let _this = this;
        return new ol.format.WFS({
            featureNS: _this.featureNS,
            featureType: _this.workspace + ':' + layerName,
            srsName: _this.srsName
        });
    }

    createImageWMS(layerName) {
        let _this = this;
        return new ol.layer.Image({
            source: new ol.source.ImageWMS({
                ratio: 1,
                url: _this.url + '/' + _this.workspace + '/wms',
                params: {
                    'FORMAT': _this.format,
                    'VERSION': '1.1.1',
                    STYLES: '',
                    LAYERS: _this.workspace + ':' + layerName
                }
            })
        });
    }

    createStyle(color, stroke) {
        return new ol.style.Style({
            fill: new ol.style.Fill({color: color}),
            stroke: new ol.style.Stroke({color: stroke})
        });
    }

    createFormatGeoJSON(layerName) {
        let _this = this;
        return new ol.format.GeoJSON({
            featureNS: _this.featureNS,
            featureType: _this.workspace + ':' + layerName,
            srsname: _this.srsName,
        });
    }

    createSourceWFS(layerName) {
        let _this = this;
        let projection = _this.getProjection();
        let sourceWFS;
        let claims = [];
        sourceWFS = new ol.source.Vector({
                loader: function (extent, resolution, projection) {
                    jQuery.ajax(_this.url + '/' + _this.workspace + '/wfs', {
                        type: 'GET',
                        data: {
                            service: 'WFS',
                            version: '2.0.0',
                            outputFormat: 'application/json',
                            request: 'GetFeature',
                            typename: _this.workspace + ':' + layerName,
                            srsname: _this.srsName,
                            bbox: extent.join(',')
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            if (xhr.status == 404) {
                                Event.$emit('alert', thrownError);
                            }
                        },
                        success: function (response) {
                            let features = [];
                            if (_this.google || _this.bing) {
                                features = _this.formatGeoJSON_array[layerName].readFeatures(response, {
                                    dataProjection: _this.srsName,
                                    featureProjection: 'EPSG:3857'
                                });
                            } else {
                                features = _this.formatGeoJSON_array[layerName].readFeatures(response);
                            }
                            sourceWFS.addFeatures(features);
                        },
                    })
                }
                ,
                strategy: ol.loadingstrategy.bbox
                ,
                projection: 'EPSG:3857'
            }
        )
        ;
        return sourceWFS;
    }

    createLayerWFS(layerName) {
        let _this = this;
        return new ol.layer.Vector({
            name: layerName,
            source: _this.sourceWFS_array[layerName],
            style: _this.styles_array[layerName]
        });
    }

    addFormatGML() {
        let _this = this;
        jQuery.each(_this.layers, function (key, value) {
            if (_this.layers[key]['active']) {
                _this.formatGML_array[_this.layers[key]['name']] = _this.createFormatGML(_this.layers[key]['name']);
            }
        });
    }

    addFormatWFS() {
        let _this = this;
        jQuery.each(_this.layers, function (key, value) {
            if (_this.layers[key]['active']) {
                _this.formatWFS_array[_this.layers[key]['name']] = _this.createFormatWFS(_this.layers[key]['name']);
            }
        });
    }

    addImageWMS() {
        var imageWMS_array = {};
        let _this = this;
        jQuery.each(_this.layers, function (key, value) {
            if (_this.layers[key]['active']) {
                imageWMS_array[_this.layers[key]['name']] = _this.createImageWMS(_this.layers[key]['name']);
            }
        });
        return imageWMS_array;
    }

    addLayersToMap() {
        let _this = this;
        _this.createMap();
        jQuery("#legende").html('<h2>Legend</h2>');
        jQuery.each(_this.layers, function (key, value) {
            _this.styles_array[_this.layers[key]['name']] = _this.createStyle(_this.layers[key]['color'], _this.layers[key]['stroke']);
            _this.formatGeoJSON_array[_this.layers[key]['name']] = _this.createFormatGeoJSON(_this.layers[key]['name']);
            _this.sourceWFS_array[_this.layers[key]['name']] = _this.createSourceWFS(_this.layers[key]['name']);
            _this.layersWFS_array[_this.layers[key]['name']] = _this.createLayerWFS(_this.layers[key]['name']);
            _this.map.addLayer(_this.layersWFS_array[_this.layers[key]['name']]);
            if (_this.google || _this.bing) {
                _this.map.getView().fit(ol.proj.transformExtent(_this.bounds, _this.srsName, 'EPSG:3857'), _this.map.getSize());
                _this.map.getView().setZoom(7);
            } else {
                _this.map.getView().fit(_this.bounds, _this.map.getSize());
            }
            var storage = jQuery.localStorage;
            storage.set(key, 'checked');
            jQuery("#legende").append("" +
                "<div style='flex-basis: 50%;display: flex;'>" +
                "<div style='background-color: " + _this.layers[key]['color'] + "' class='slideThree'>" +
                "<input id='" + _this.layers[key]['name'] + "' type='checkbox' />" +
                "<label for='" + _this.layers[key]['name'] + "'></label>" +
                "</div>" +
                "<p style='margin-left: 5px'>" + _this.layers[key]['name'] + "</p>" +
                "</div>");
        });
        return _this.layersWFS_array;
    }

    detectActionButton() {
        let _this = this;
        _this.btnSelect.click(function () {
            _this.selectAction();
        });
        _this.btnDelete.click(function () {
            _this.deleteAction();
        });
        _this.btnDraw.click(function () {
            _this.drawAction();
        });
    }

    getActiveLayers(layers) {
        let active_layers_array = {};
        jQuery.each(layers, function (key, value) {
            if (layers[key]['active']) {
                active_layers_array[key] = layers[key]['name'];
            }
        });
        return active_layers_array;
    }

    selectAction() {
        let _this = this;
        _this.btnSelect.parent().find('.btn').each(function (index, element) {
            jQuery(this).removeClass('active');
        });
        _this.btnSelect.addClass('active');
        _this.map.removeInteraction(_this.getDraw());
        _this.interactionSelect.on('select', function (evt) {
            var view = _this.map.getView();
            let imageWMS_array = _this.addImageWMS();
            var viewResolution = view.getResolution();
            var mail = '';
            var info = '';
            jQuery.each(imageWMS_array, function (key, value) {
                var source = imageWMS_array[key].getSource();
                var url = source.getGetFeatureInfoUrl(
                    evt.mapBrowserEvent.coordinate, viewResolution, view.getProjection(),
                    {'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50});
                var aa = evt.selected[0].getGeometry().getExtent();
                var oo = ol.extent.getCenter(aa);
                proj4.defs("EPSG:22332", "+proj=utm +zone=32 +a=6378249.2 +b=6356515 +towgs84=-263,6,431,0,0,0,0 +units=m +no_defs");
                var coord = ol.proj.transform(oo, 'EPSG:3857', 'EPSG:4326');
                var lon = coord[0];
                var lat = coord[1];

                if (url) {
                    jQuery.ajax({
                        url: url,
                        dataType: 'json'
                    }).then(function (response) {
                        var feature = response.features[0];
                        if (feature !== undefined) {
                            var props = feature.properties;
                            info += '<h2 style="font-size:14px;color:#FFFFFF;display:inline;margin-bottom:15px;font-weight:bold;border-bottom:1px solid #FFFFFF">' + key + '</h2><div style="color:#ffffff;border: none;line-height:30px;padding:10px;font-size:13px">';
                            jQuery.each(props, function (key, value) {
                                info += '<div class="col-md-4">' + key + ':</div><div class="col-md-8">' + value + '</div>';
                            });
                            axios.get('/features/' + evt.selected[0].get(_this.layers_primary_key)).then(response=> {
                                info += '<div class="col-md-12 alert alert-danger">' +
                                    '<ul style="list-style: none;margin: 0;padding: 0">' +
                                    '<li>' + response.data.claim.title + '</li>' +
                                    '<li>' + response.data.claim.description + '</li>' +
                                    '</ul></div>';
                                info += '</div>';
                                jQuery("#infosPopup").show();
                                jQuery("#infosPopup-bottom").show();
                                document.getElementById('infosPopupCont').innerHTML = info;
                            }).catch(error => {
                                info += '</div>';
                                jQuery("#infosPopup").show();
                                jQuery("#infosPopup-bottom").show();
                                //document.getElementById('nodelist').innerHTML = table;
                                document.getElementById('mailContent').innerHTML = mail;
                                document.getElementById('infosPopupCont').innerHTML = info;
                            });
                        }
                    });
                }
            });
        });
        _this.map.addInteraction(_this.interactionSelect);
    }

    deleteAction() {
        let _this = this;
        _this.addFormatWFS();
        _this.addFormatGML();
        _this.btnDelete.parent().find('.btn').each(function (index, element) {
            jQuery(this).removeClass('active');
        });
        _this.btnDelete.addClass('active');
        _this.map.removeInteraction(_this.interactionSelect);
        _this.map.removeInteraction(_this.getDraw());
        _this.map.addInteraction(this.interactionDelete);
        _this.interactionDelete.getFeatures().on('add', function (e) {
            var layerSelected = e.target.item(0).getLayer(_this.map);
            var s = new XMLSerializer();
            jQuery.ajax(_this.url + '/' + _this.workspace + '/wfs', {
                type: 'POST',
                dataType: 'xml',
                contentType: 'text/xml',
                data: s.serializeToString(_this.formatWFS_array[layerSelected.get('name')].writeTransaction(null, null, [e.target.item(0)], _this.formatGML_array[layerSelected.get('name')])),
                success: function (data) {
                    Event.$emit('alert', 'Votre modification a été enregistré avec succé');
                    _this.layersWFS_array[layerSelected.get('name')].getSource().clear();
                    _this.interactionDelete.getFeatures().clear();
                    _this.map.removeInteraction(_this.interactionDelete);
                }
            }).done();
        });
    }

    drawAction() {
        let _this = this;
        this.btnDraw.parent().find('.btn').each(function (index, element) {
            jQuery(this).removeClass('active');
        });
        this.btnDraw.addClass('active');
        this.map.removeInteraction(this.interactionSelect);
        this.map.removeInteraction(this.interactionDelete);
        let interactionDraw = this.getDraw();
        interactionDraw.on('drawstart', function (e) {
            _this.perimetreArray = [];
            _this.map.on('singleclick', function (evt) {
                var sourceProj = _this.map.getView().getProjection();
                _this.perimetreArray.push(ol.proj.transform(evt.coordinate, sourceProj, 'EPSG:4326'));
            });
        });
        interactionDraw.on('drawend', function (e) {
            _this.map.removeInteraction(interactionDraw);
            proj4.defs("EPSG:32632", "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");
            proj4.defs("EPSG:22332", "+proj=utm +zone=32 +a=6378249.2 +b=6356515 +towgs84=-263,6,431,0,0,0,0 +units=m +no_defs");
            var aa = e.feature.getGeometry().getExtent();
            var oo = ol.extent.getCenter(aa);
            var newFeature = _this.transform_geometry(e.feature);
            var coord = ol.proj.transform(oo, 'EPSG:3857', 'EPSG:4326');
            var lon = coord[0];
            var lat = coord[1];
            var props;
            jQuery("#sendMailNewData").click();
            _this.addFormatWFS();
            _this.addFormatGML();
            let form = new FormBuilder();
            form.init('POST', _this.getActiveLayers(_this.layers));
            jQuery('#select_layer').change(function () {
                var array = _this.layersWFS_array[jQuery('#select_layer').val()].getSource().getFeatures().sort(
                    function (a, b) {
                        return a.get(_this.layers_primary_key) - b.get(_this.layers_primary_key);
                    }
                );
                var fid = _this.layersWFS_array[jQuery('#select_layer').val()].getSource().getFeatures().length;
                console.log(array[0].get(_this.layers_primary_key));
                console.log(array[fid - 2].get(_this.layers_primary_key));
                console.log(array[fid - 1].get(_this.layers_primary_key));
                newFeature.setId(array[fid - 1].get(_this.layers_primary_key) + 1);
                props = form.create(jQuery('#select_layer').val(), _this.layersWFS_array, _this.formatPerimetre(e.feature.getGeometry()), _this.formatArea(e.feature.getGeometry()), _this.layers_primary_key, newFeature.getId());
            });
            jQuery("#saveFeature").click(function () {
                form.submit(jQuery('#select_layer').val(), props, newFeature, _this.formatWFS_array, _this.formatGML_array, _this.formatPerimetre(e.feature.getGeometry()), _this.formatArea(e.feature.getGeometry())).then(response=> {
                    carte.form.model.lon = lon;
                    carte.form.model.lat = lat;
                    carte.form.model.feature = response;
                    $('#addClaim').click();
                });
            });
        });
        this.map.addInteraction(interactionDraw);
    }

    transform_geometry(element) {
        // var sourceProj = this.map.getView().getProjection();
        // console.log(sourceProj);
        proj4.defs("EPSG:32632", "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");
        // console.log(element.getGeometry().getCoordinates());
        // let newFeature = element.clone();
        // newFeature.getGeometry().transform(sourceProj,"EPSG:32632");
        let newFeature = element.clone();
        var polyCoords = [];
        var coords = element.getGeometry().getCoordinates();
        console.log(coords);
        for (var i in coords[0][0]) {
            var c = coords[0][0][i];
            polyCoords.push(ol.proj.transform([parseFloat(c[0]), parseFloat(c[1])], 'EPSG:3857', 'EPSG:32632'));
        }
        newFeature.getGeometry().setCoordinates([[polyCoords]]);
        console.log(newFeature.getGeometry().getCoordinates());
        return newFeature;
    }

    formatArea(polygon) {
        var area;
        //does'it work because our geom is Multipolygon and we need Polygon
        //  var wgs84Sphere = new ol.Sphere(6378137);
        //  var sourceProj = this.map.getView().getProjection();
        //  var geom = (polygon.clone().transform(sourceProj, 'EPSG:4326'));
        //  var polygon = new ol.geom.Polygon(geom.getCoordinates());
        //  var coordinates = geom.getLinearRing(0).getCoordinates();
        // area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
        area = polygon.getArea();
        var output;
        output = (Math.round(area * 100) / 100);
        return output;
    }

    formatPerimetre(polygon) {
        var sourceProj = this.map.getView().getProjection();
        this.perimetre = 0;
        var wgs84Sphere = new ol.Sphere(6378137);
        let lastPoint = ol.proj.transform(polygon.clone().getLastCoordinate(), sourceProj, 'EPSG:4326');
        this.perimetreArray.push(lastPoint);
        for (var i = 0, ii = this.perimetreArray.length - 1; i < ii; ++i) {
            this.perimetre += wgs84Sphere.haversineDistance(this.perimetreArray[i], this.perimetreArray[i + 1]);
        }
        this.perimetre = (Math.round(this.perimetre * 100) / 100);
        return this.perimetre;
    }
}
