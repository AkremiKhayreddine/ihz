/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 171);
/******/ })
/************************************************************************/
/******/ ({

/***/ 131:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Map__ = __webpack_require__(159);

jQuery('#google-map-status').change(function () {
    axios.post('getAllCouches').then(function (response) {
        axios.get('admin/getConfig').then(function (config) {
            var map = new __WEBPACK_IMPORTED_MODULE_0__Map__["a" /* Map */]({
                layers: response.data,
                defaultLayer: 'carte_geologique',
                workspace: config.data.workspace,
                srsName: config.data.srsName,
                featureNS: config.data.featureNS,
                btnSelect: $('#btnSelect'),
                btnDelete: $('#btnDelete'),
                btnDraw: $('#btnArea'),
                google: jQuery('#google-map-status').is(':checked')
            });
            var layersWFS_array = map.addLayersToMap();
            map.detectActionButton();
        });
    });
});
ol.Feature.prototype.getLayer = function (map) {
    var this_ = this,
        layer_,
        layersToLookFor = [];
    var check = function check(layer) {
        var source = layer.getSource();
        if (source instanceof ol.source.Vector) {
            var features = source.getFeatures();
            if (features.length > 0) {
                layersToLookFor.push({
                    layer: layer,
                    features: features
                });
            }
        }
    };
    //loop through map layers
    map.getLayers().forEach(function (layer) {
        if (layer instanceof ol.layer.Group) {
            layer.getLayers().forEach(check);
        } else {
            check(layer);
        }
    });
    layersToLookFor.forEach(function (obj) {
        var found = obj.features.some(function (feature) {
            return this_ === feature;
        });
        if (found) {
            //this is the layer we want
            layer_ = obj.layer;
        }
    });
    return layer_;
};
var carte = new Vue({
    el: '#carte',
    data: {
        showConfig: true,
        gMapCheckbox: true,
        positionCheckbox: false
    },
    methods: {
        getAllCouches: function getAllCouches() {
            var vm = this;
            axios.post('getAllCouches').then(function (response) {
                axios.get('admin/getConfig').then(function (config) {
                    var map = new __WEBPACK_IMPORTED_MODULE_0__Map__["a" /* Map */]({
                        layers: response.data,
                        defaultLayer: 'carte_geologique',
                        workspace: config.data.workspace,
                        srsName: config.data.srsName,
                        featureNS: config.data.featureNS,
                        btnSelect: $('#btnSelect'),
                        btnDelete: $('#btnDelete'),
                        btnDraw: $('#btnArea'),
                        google: vm.gMapCheckbox
                    });
                    var layersWFS_array = map.addLayersToMap();
                    map.detectActionButton();
                });
            });
        }
    },
    mounted: function mounted() {
        this.getAllCouches();
    },

    watch: {
        gMapCheckbox: function gMapCheckbox() {
            this.getAllCouches();
        }
    }
});

/***/ }),

/***/ 158:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FormBuilder; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormBuilder = function () {
    function FormBuilder() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$content = _ref.content,
            content = _ref$content === undefined ? jQuery("#formBuilder") : _ref$content;

        _classCallCheck(this, FormBuilder);

        this.content = content;
    }

    _createClass(FormBuilder, [{
        key: 'init',
        value: function init(method, layers) {
            this.content.html('');
            this.content.append('<form class="form-group" method = ' + method + '>');
            var select = '<div  class="form-group" style="margin-bottom: 20px;">' + '<label style="width: 45%;position:relative;float:left">Choisir couche</label>' + '<select id="select_layer" class="form-control" style="background-color: #ffffff;' + 'border: 1px solid #e4e7ea;' + 'border-radius: 0;' + 'box-shadow: none;' + 'color: #565656;' + 'height: 38px;' + 'max-width: 100%;' + 'padding: 7px 12px;' + 'transition: all 300ms linear 0s;width: 50%">' + '<option value="">Choisir couche</option>';
            jQuery.each(layers, function (key, value) {
                select += '<option value="' + layers[key] + '">' + layers[key] + '</option>';
            });
            select += '</select></div>';
            this.content.append(select);
        }
    }, {
        key: 'create',
        value: function create(selected_layer, layersWFS_array) {
            var elements = layersWFS_array[selected_layer].getSource().getFeatures();
            var props = elements[0].getProperties();
            jQuery('#content').remove();
            var content = '<div id="content">';
            jQuery.each(props, function (key, value) {
                if (key !== 'geometry') {
                    content += '<div  class="form-group" style="margin-bottom: 20px;">' + '<label style="width: 45%;position:relative;float:left" class="2">' + key + '</label><input id="' + key + '" style="  background-color: #ffffff;' + 'border: 1px solid #e4e7ea;' + 'border-radius: 0;' + 'box-shadow: none;' + 'color: #565656;' + 'height: 38px;' + 'max-width: 100%;' + 'padding: 7px 12px;' + 'transition: all 300ms linear 0s;width: 50%" class="form-control" ></div>';
                }
            });
            content += '</div>';
            this.content.append(content);
            this.closeForm();
            return props;
        }
    }, {
        key: 'closeForm',
        value: function closeForm() {

            this.content.append('</form');
        }
    }, {
        key: 'submit',
        value: function submit(selected_layer, props, newFeature, formatWFS_array, formatGML_array) {
            var featureProp = {};
            var s = new XMLSerializer();
            jQuery.each(props, function (key, value) {
                if (key !== 'geometry') {
                    featureProp[key] = jQuery('#' + key).val();
                }
            });
            newFeature.setProperties(featureProp);
            jQuery.ajax('http://localhost:8080/geoserver/samar/wfs', {
                type: 'POST',
                dataType: 'xml',
                contentType: 'text/xml',
                data: s.serializeToString(formatWFS_array[selected_layer].writeTransaction([newFeature], null, null, formatGML_array[selected_layer])),
                success: function success(data) {
                    $('#closeModal').click();
                }
            }).done();
        }
    }]);

    return FormBuilder;
}();

/***/ }),

/***/ 159:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__FormBuilder__ = __webpack_require__(158);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Map; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }


var Map = function () {
    function Map() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$layers = _ref.layers,
            layers = _ref$layers === undefined ? [] : _ref$layers,
            _ref$defaultLayer = _ref.defaultLayer,
            defaultLayer = _ref$defaultLayer === undefined ? '' : _ref$defaultLayer,
            _ref$featureNS = _ref.featureNS,
            featureNS = _ref$featureNS === undefined ? 'pfe' : _ref$featureNS,
            _ref$srsName = _ref.srsName,
            srsName = _ref$srsName === undefined ? 'EPSG:22332' : _ref$srsName,
            _ref$workspace = _ref.workspace,
            workspace = _ref$workspace === undefined ? 'workspace' : _ref$workspace,
            _ref$format = _ref.format,
            format = _ref$format === undefined ? 'image/png' : _ref$format,
            _ref$url = _ref.url,
            url = _ref$url === undefined ? 'http://localhost:8080/geoserver' : _ref$url,
            _ref$btnSelect = _ref.btnSelect,
            btnSelect = _ref$btnSelect === undefined ? {} : _ref$btnSelect,
            _ref$btnDelete = _ref.btnDelete,
            btnDelete = _ref$btnDelete === undefined ? {} : _ref$btnDelete,
            _ref$btnDraw = _ref.btnDraw,
            btnDraw = _ref$btnDraw === undefined ? {} : _ref$btnDraw,
            _ref$google = _ref.google,
            google = _ref$google === undefined ? false : _ref$google;

        _classCallCheck(this, Map);

        this.layers = layers;
        this.defaultLayer = defaultLayer;
        this.featureNS = featureNS;
        this.srsName = srsName;
        this.workspace = workspace;
        this.format = format;
        this.url = url;
        this.bounds = [553582.863643649, 3984163.3300781306, 625006.0800781315, 4053139.11661919];
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

    _createClass(Map, [{
        key: 'createMap',
        value: function createMap() {
            var _this = this;
            var mousePositionControl = new ol.control.MousePosition({
                className: 'custom-mouse-position',
                target: document.getElementById('location'),
                coordinateFormat: ol.coordinate.createStringXY(5),
                undefinedHTML: '&nbsp;'
            });
            var projection = this.getProjection();
            var view = new ol.View({
                projection: projection,
                Zoom: 21
            });
            if (this.google) {
                jQuery('#map').html('<div id="olmap" class="fill"></div><div id="gmap" class="fill"></div>');
                this.map = new ol.Map({
                    interactions: ol.interaction.defaults({
                        altShiftDragRotate: false,
                        dragPan: false,
                        rotate: false
                    }).extend([new ol.interaction.DragPan({ kinetic: null })]),
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
                        mapTypeIds: [google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.TERRAIN, google.maps.MapTypeId.HYBRID]
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
                    }).extend([new ol.interaction.DragPan({ kinetic: null })]),
                    controls: ol.control.defaults({
                        zoom: true,
                        attribution: false
                    }).extend([mousePositionControl]),
                    target: 'olmap',
                    view: view
                });
            }
        }
    }, {
        key: 'getDraw',
        value: function getDraw() {
            var _this = this;
            return new ol.interaction.Draw({
                type: 'MultiPolygon',
                source: this.layersWFS_array[_this.defaultLayer].getSource(),
                geometryName: 'the_geom'
            });
        }
    }, {
        key: 'getProjection',
        value: function getProjection() {
            var _this = this;
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
    }, {
        key: 'createFormatGML',
        value: function createFormatGML(layerName) {
            var _this = this;
            return new ol.format.GML({
                featureNS: _this.featureNS,
                featureType: layerName,
                srsName: _this.srsName
            });
        }
    }, {
        key: 'createFormatWFS',
        value: function createFormatWFS(layerName) {
            var _this = this;
            return new ol.format.WFS({
                featureNS: _this.featureNS,
                featureType: _this.workspace + ':' + layerName,
                srsName: _this.srsName
            });
        }
    }, {
        key: 'createImageWMS',
        value: function createImageWMS(layerName) {
            var _this = this;
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
    }, {
        key: 'createStyle',
        value: function createStyle(color, stroke) {
            return new ol.style.Style({
                fill: new ol.style.Fill({ color: color }),
                stroke: new ol.style.Stroke({ color: stroke })
            });
        }
    }, {
        key: 'createFormatGeoJSON',
        value: function createFormatGeoJSON(layerName) {
            var _this = this;
            return new ol.format.GeoJSON({
                featureNS: _this.featureNS,
                featureType: _this.workspace + ':' + layerName,
                srsname: _this.srsName
            });
        }
    }, {
        key: 'createSourceWFS',
        value: function createSourceWFS(layerName) {
            var _this = this;
            var projection = _this.getProjection();
            var sourceWFS = void 0;
            if (this.google) {
                sourceWFS = new ol.source.Vector({
                    loader: function loader(extent, resolution, projection) {
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
                    loader: function loader(extent, resolution, projection) {
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
    }, {
        key: 'createLayerWFS',
        value: function createLayerWFS(layerName) {
            var _this = this;
            return new ol.layer.Vector({
                name: layerName,
                source: _this.sourceWFS_array[layerName],
                style: _this.styles_array[layerName]
            });
        }
    }, {
        key: 'addFormatGML',
        value: function addFormatGML() {
            var _this = this;
            jQuery.each(_this.layers, function (key, value) {
                if (_this.layers[key]['status'] === 'active') {
                    _this.formatGML_array[_this.layers[key]['name']] = _this.createFormatGML(_this.layers[key]['name']);
                }
            });
        }
    }, {
        key: 'addFormatWFS',
        value: function addFormatWFS() {
            var _this = this;
            jQuery.each(_this.layers, function (key, value) {
                if (_this.layers[key]['status'] === 'active') {
                    _this.formatWFS_array[_this.layers[key]['name']] = _this.createFormatWFS(_this.layers[key]['name']);
                }
            });
        }
    }, {
        key: 'addImageWMS',
        value: function addImageWMS() {
            var imageWMS_array = {};
            var _this = this;
            jQuery.each(_this.layers, function (key, value) {
                if (_this.layers[key]['status'] === 'active') {
                    imageWMS_array[_this.layers[key]['name']] = _this.createImageWMS(_this.layers[key]['name']);
                }
            });
            return imageWMS_array;
        }
    }, {
        key: 'addLayersToMap',
        value: function addLayersToMap() {
            var _this = this;
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
                jQuery("#legende").append("<div class='col-md-6 col-sm-12 col-xs-12'><div style='float:left;' class='squaredThree'>" + "<input onclick=\"mapRelaod('" + _this.layers[key]['name'] + "')\" type='checkbox' value='" + _this.layers[key]['name'] + "' id='" + _this.layers[key]['name'] + "' name='" + _this.layers[key]['name'] + "' " + storage.get(key) + " />" + "<label for='" + _this.layers[key]['name'] + "'></label></div><div style='width:25px;height:25px;background-color:" + _this.layers[key]['color'] + ";margin:10px;margin-top:7px;float:left'></div><p style='float:left'>" + _this.layers[key]['name'] + "</p></div>");
            });
            return _this.layersWFS_array;
        }
    }, {
        key: 'detectActionButton',
        value: function detectActionButton() {
            var _this = this;
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
    }, {
        key: 'getActiveLayers',
        value: function getActiveLayers(layers) {
            var active_layers_array = {};
            jQuery.each(layers, function (key, value) {
                if (layers[key]['status'] === 'active') {
                    active_layers_array[key] = layers[key]['name'];
                }
            });
            return active_layers_array;
        }
    }, {
        key: 'selectAction',
        value: function selectAction() {
            var _this = this;
            _this.btnSelect.parent().find('.btn').each(function (index, element) {
                jQuery(this).removeClass('active');
            });
            _this.btnSelect.addClass('active');
            _this.map.removeInteraction(_this.getDraw());
            _this.interactionSelect.on('select', function (evt) {
                var view = _this.map.getView();
                var imageWMS_array = _this.addImageWMS();
                var viewResolution = view.getResolution();
                var mail = '';
                var info = '';
                jQuery.each(imageWMS_array, function (key, value) {
                    var source = imageWMS_array[key].getSource();
                    var url = source.getGetFeatureInfoUrl(evt.mapBrowserEvent.coordinate, viewResolution, view.getProjection(), { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50 });
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
    }, {
        key: 'deleteAction',
        value: function deleteAction() {
            var _this = this;
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
                    success: function success(data) {
                        _this.layersWFS_array[layerSelected.get('name')].getSource().clear();
                        _this.interactionDelete.getFeatures().clear();
                        _this.map.removeInteraction(_this.interactionDelete);
                    }
                }).done();
            });
        }
    }, {
        key: 'drawAction',
        value: function drawAction() {
            var _this = this;
            this.btnDraw.parent().find('.btn').each(function (index, element) {
                jQuery(this).removeClass('active');
            });
            this.btnDraw.addClass('active');
            this.map.removeInteraction(this.interactionSelect);
            this.map.removeInteraction(this.interactionDelete);
            var interactionDraw = this.getDraw();
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
                var form = new __WEBPACK_IMPORTED_MODULE_0__FormBuilder__["a" /* FormBuilder */]();
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
    }, {
        key: 'transform_geometry',
        value: function transform_geometry(element) {
            var newFeature = element.clone();
            var polyCoords = [];
            var coords = element.getGeometry().getCoordinates();
            for (var i in coords[0][0]) {
                var c = coords[0][0][i];
                polyCoords.push(ol.proj.transform([parseFloat(c[0]), parseFloat(c[1])], 'EPSG:3857', 'EPSG:32632'));
            }
            newFeature.getGeometry().setCoordinates([[polyCoords]]);
            return newFeature;
        }
    }]);

    return Map;
}();

/***/ }),

/***/ 171:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(131);


/***/ })

/******/ });