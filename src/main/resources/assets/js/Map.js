import {FormBuilder} from './FormBuilder';
export class Map {
    constructor({
        layers = [],
        defaultLayer = '',
        featureNS = 'pfe',
        srsName = 'EPSG:22332',
        workspace = 'workspace',
        format = 'image/png',
        url = 'http://localhost:8080/geoserver',
        btnSelect = {},
        btnDelete = {},
        btnDraw = {},
        google = false
    } = {}) {
        this.layers = layers;
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
        } else {
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
        if (this.google) {
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
        if (this.google) {
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
                            srsname: 'EPSG:3857',
                            bbox: extent.join(',') + ',' + _this.srsName
                        }
                    }).done(function (response) {
                        sourceWFS.addFeatures(_this.formatGeoJSON_array[layerName].readFeatures(response));
                    }).fail(function () {
                        alert("error loading vector layer");
                    });
                },
                strategy: ol.loadingstrategy.bbox,
                projection: _this.getProjection()
            });
        } else {
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
                            bbox: extent.join(',') + ',' + _this.srsName
                        }
                    }).done(function (response) {
                        sourceWFS.addFeatures(_this.formatGeoJSON_array[layerName].readFeatures(response));
                    }).fail(function () {
                        alert("error loading vector layer");
                    });
                },
                strategy: ol.loadingstrategy.bbox,
                projection: _this.getProjection()
            });
        }
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
            if (_this.layers[key]['status'] === 'active') {
                _this.formatGML_array[_this.layers[key]['name']] = _this.createFormatGML(_this.layers[key]['name']);
            }
        });
    }

    addFormatWFS() {
        let _this = this;
        jQuery.each(_this.layers, function (key, value) {
            if (_this.layers[key]['status'] === 'active') {
                _this.formatWFS_array[_this.layers[key]['name']] = _this.createFormatWFS(_this.layers[key]['name']);
            }
        });
    }

    addImageWMS() {
        var imageWMS_array = {};
        let _this = this;
        jQuery.each(_this.layers, function (key, value) {
            if (_this.layers[key]['status'] === 'active') {
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
            if (_this.google) {
                console.log('with googoe');
                _this.map.getView().fit(ol.proj.transformExtent(_this.bounds, _this.srsName, 'EPSG:3857'), _this.map.getSize());
                _this.map.getView().setZoom(7);
            } else {
                _this.map.getView().fit(_this.bounds, _this.map.getSize());
            }
            var storage = jQuery.localStorage;
            storage.set(key, 'checked');
            jQuery("#legende").append("<div class='col-md-6 col-sm-12 col-xs-12'><div style='float:left;' class='squaredThree'>" +
                "<input onclick=\"mapRelaod('" + _this.layers[key]['name'] + "')\" type='checkbox' value='" + _this.layers[key]['name'] + "' id='" + _this.layers[key]['name'] + "' name='" + _this.layers[key]['name'] + "' " + storage.get(key) + " />" +
                "<label for='" + _this.layers[key]['name'] + "'></label></div><div style='width:25px;height:25px;background-color:" + _this.layers[key]['color'] + ";margin:10px;margin-top:7px;float:left'></div><p style='float:left'>" + _this.layers[key]['name'] + "</p></div>");
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
            if (layers[key]['status'] === 'active') {
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
                console.log(evt.selected[0].getId());
                if (url) {
                    jQuery.ajax({
                        url: url,
                        dataType: 'json'
                    }).then(function (response) {
                        var feature = response.features[0];
                        if (feature !== undefined) {
                            var props = feature.properties;
                            mail += '<h2 style="font-size:14px;color:#777777;display:inline;margin-bottom:15px;font-weight:bold;padding-bottom:5px">' + key + '</h2><table border="0" style="color:#777777;font-size:12px;line-height: 200%;border: 1px solid #e4e7ea;border-radius: 2px;width:100%">';
                            info += '<h2 style="font-size:14px;color:#FFFFFF;display:inline;margin-bottom:15px;font-weight:bold;border-bottom:1px solid #FFFFFF">' + key + '</h2><table border="0" style="color:#ffffff;border: none;line-height:30px;padding:10px;font-size:13px">';
                            jQuery.each(props, function (key, value) {
                                mail += '<tr><td style="border:none;padding:5px;">' + key + ':</td><td style="border:none;padding:5px;">' + value + '</td></tr>';
                                info += '<tr><td style="border:none;">' + key + ':</td><td style="border:none;">' + value + '</td></tr>';
                            });
                            mail += '</table>';
                            info += '</table>';
                            jQuery("#infosPopup").show();
                            jQuery("#infosPopup-bottom").show();
                            //document.getElementById('nodelist').innerHTML = table;
                            document.getElementById('mailContent').innerHTML = mail;
                            document.getElementById('infosPopupCont').innerHTML = info;
                        }
                    });
                }
            });
        });
        _this.map.addInteraction(_this.interactionSelect);
    }

    deleteAction() {
        let _this = this;
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
        interactionDraw.on('drawend', function (e) {
            proj4.defs("EPSG:32632", "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");
            proj4.defs("EPSG:22332", "+proj=utm +zone=32 +a=6378249.2 +b=6356515 +towgs84=-263,6,431,0,0,0,0 +units=m +no_defs");
            var aa = e.feature.getGeometry().getExtent();
            var oo = ol.extent.getCenter(aa);
            var newFeature = _this.transform_geometry(e.feature);
            var props;
            jQuery("#sendMailNewData").click();
            _this.addFormatWFS();
            _this.addFormatGML();
            let form = new FormBuilder();
            form.init('POST', _this.getActiveLayers(_this.layers));
            jQuery('#select_layer').change(function () {
                props = form.create(jQuery('#select_layer').val(), _this.layersWFS_array);
            });
            jQuery("#saveFeature").click(function () {
                form.submit(jQuery('#select_layer').val(), props, newFeature, _this.formatWFS_array, _this.formatGML_array);
            });
        });
        this.map.addInteraction(interactionDraw);
    }
    transform_geometry(element) {
        let newFeature = element.clone();
        var polyCoords = [];
        var coords = element.getGeometry().getCoordinates();
        for (var i in coords[0][0]) {
            var c = coords[0][0][i];
            polyCoords.push(ol.proj.transform([parseFloat(c[0]), parseFloat(c[1])], 'EPSG:3857', 'EPSG:32632'));
        }
        newFeature.getGeometry().setCoordinates([[polyCoords]]);
        return newFeature;
    }
}