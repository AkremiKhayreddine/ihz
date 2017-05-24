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
/******/ 	return __webpack_require__(__webpack_require__.s = 181);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Errors; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Errors = function () {
    function Errors() {
        _classCallCheck(this, Errors);

        this.errors = {};
    }

    _createClass(Errors, [{
        key: "record",
        value: function record(errors) {
            this.errors = {};
            for (var error in errors) {
                this.errors[errors[error].field] = errors[error].defaultMessage;
            }
        }
    }, {
        key: "has",
        value: function has(field) {
            return this.errors.hasOwnProperty(field);
        }
    }, {
        key: "any",
        value: function any() {
            return Object.keys(this.errors).length > 0;
        }
    }, {
        key: "get",
        value: function get(field) {
            if (this.errors[field]) {
                return this.errors[field];
            }
        }
    }, {
        key: "clear",
        value: function clear(field) {
            if (field) {
                delete this.errors[field];
                return;
            }
            this.errors = {};
        }
    }]);

    return Errors;
}();

/***/ }),

/***/ 134:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Map__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Form__ = __webpack_require__(2);


window.carte = new Vue({
    el: '#carte',
    data: {
        user: {},
        showConfig: true,
        gMapCheckbox: true,
        positionCheckbox: false,
        geoserver: {},
        map: {},
        form: new __WEBPACK_IMPORTED_MODULE_1__Form__["a" /* Form */]({
            model: {
                title: '',
                description: '',
                lon: 0,
                lat: 0,
                feature: ''
            }
        })
    },
    methods: {
        getAuth: function getAuth() {
            var _this = this;
            return new Promise(function (resolve, reject) {
                axios.get('/auth').then(function (response) {
                    _this.user = response.data;
                    var roles = [];
                    for (var role in _this.user.roles) {
                        roles.push(_this.user.roles[role].id);
                    }
                    _this.user.roles = roles;
                    resolve();
                });
            });
        },
        isAdmin: function isAdmin() {
            for (var role in this.user.roles) {
                if (this.user.roles[role] == 1) {
                    return true;
                }
                return false;
            }
        },
        getAllCouches: function getAllCouches() {
            var vm = this;
            axios.post('/map/getAllCouches').then(function (response) {
                axios.get('/admin/geoserver').then(function (config) {
                    vm.geoserver = config.data;
                    vm.map = new __WEBPACK_IMPORTED_MODULE_0__Map__["a" /* Map */]({
                        layers: response.data,
                        defaultLayer: 'carte_geologique',
                        workspace: config.data.workspace,
                        srsName: config.data.srsName,
                        featureNS: config.data.featureNS,
                        url: config.data.url,
                        btnSelect: $('#btnSelect'),
                        btnDelete: $('#btnDelete'),
                        btnDraw: $('#btnArea'),
                        btnEdit: $('#btnEdit'),
                        google: false,
                        layers_primary_key: config.data.layers_primary_key
                    });
                    var layersWFS_array = vm.map.addLayersToMap();
                    vm.map.detectActionButton();
                });
            });
        }
    },
    mounted: function mounted() {
        var _this2 = this;

        this.getAuth().then(function () {
            _this2.getAllCouches();
        });
    },

    watch: {
        gMapCheckbox: function gMapCheckbox(value) {
            this.getAllCouches();
        },
        positionCheckbox: function positionCheckbox(value) {
            this.map.initGeolocation(value);
        }
    }
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
/**
 * OpenLayers 3 Popup Overlay.
 * See [the examples](./examples) for usage. Styling can be done via CSS.
 * @constructor
 * @extends {ol.Overlay}
 * @param {Object} opt_options Overlay options
 */
ol.Overlay.Popup = function (opt_options) {

    var options = opt_options || {};

    if (options.autoPan === undefined) {
        options.autoPan = true;
    }

    if (options.autoPanAnimation === undefined) {
        options.autoPanAnimation = {
            duration: 250
        };
    }

    this.container = document.createElement('div');
    this.container.className = 'ol-popup';

    this.closer = document.createElement('a');
    this.closer.className = 'ol-popup-closer';
    this.closer.href = '#';
    this.container.appendChild(this.closer);

    var that = this;
    this.closer.addEventListener('click', function (evt) {
        that.container.style.display = 'none';
        that.closer.blur();
        evt.preventDefault();
    }, false);

    this.content = document.createElement('div');
    this.content.className = 'ol-popup-content';
    this.container.appendChild(this.content);

    // Apply workaround to enable scrolling of content div on touch devices
    ol.Overlay.Popup.enableTouchScroll_(this.content);

    ol.Overlay.call(this, Object.assign(options, {
        element: this.container
    }));
};

ol.inherits(ol.Overlay.Popup, ol.Overlay);

/**
 * Show the popup.
 * @param {ol.Coordinate} coord Where to anchor the popup.
 * @param {String|HTMLElement} html String or element of HTML to display within the popup.
 */
ol.Overlay.Popup.prototype.show = function (coord, html) {
    if (html instanceof HTMLElement) {
        this.content.innerHTML = "";
        this.content.appendChild(html);
    } else {
        this.content.innerHTML = html;
    }
    this.container.style.display = 'block';
    this.content.scrollTop = 0;
    this.setPosition(coord);
    return this;
};

/**
 * @private
 * @desc Determine if the current browser supports touch events. Adapted from
 * https://gist.github.com/chrismbarr/4107472
 */
ol.Overlay.Popup.isTouchDevice_ = function () {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * @private
 * @desc Apply workaround to enable scrolling of overflowing content within an
 * element. Adapted from https://gist.github.com/chrismbarr/4107472
 */
ol.Overlay.Popup.enableTouchScroll_ = function (elm) {
    if (ol.Overlay.Popup.isTouchDevice_()) {
        var scrollStartPos = 0;
        elm.addEventListener("touchstart", function (event) {
            scrollStartPos = this.scrollTop + event.touches[0].pageY;
        }, false);
        elm.addEventListener("touchmove", function (event) {
            this.scrollTop = scrollStartPos - event.touches[0].pageY;
        }, false);
    }
};

/**
 * Hide the popup.
 */
ol.Overlay.Popup.prototype.hide = function () {
    this.container.style.display = 'none';
    return this;
};

/**
 * Indicates if the popup is in open state
 */
ol.Overlay.Popup.prototype.isOpened = function () {
    return this.container.style.display == 'block';
};

/***/ }),

/***/ 162:
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
            jQuery.ajax(carte.geoserver.url + '/' + carte.geoserver.workspace + '/wfs', {
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

/***/ 163:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__FormBuilder__ = __webpack_require__(162);
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
            featureNS = _ref$featureNS === undefined ? 'featureNS' : _ref$featureNS,
            _ref$srsName = _ref.srsName,
            srsName = _ref$srsName === undefined ? 'EPSG:32632' : _ref$srsName,
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
            _ref$btnEdit = _ref.btnEdit,
            btnEdit = _ref$btnEdit === undefined ? {} : _ref$btnEdit,
            _ref$google = _ref.google,
            google = _ref$google === undefined ? false : _ref$google,
            _ref$bing = _ref.bing,
            bing = _ref$bing === undefined ? true : _ref$bing,
            _ref$layers_primary_k = _ref.layers_primary_key,
            layers_primary_key = _ref$layers_primary_k === undefined ? 'ID' : _ref$layers_primary_k;

        _classCallCheck(this, Map);

        this.bing = bing;
        this.layers = layers;
        this.layers_primary_key = layers_primary_key;
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
        this.btnEdit = btnEdit;
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
        this.iSelect = new ol.interaction.Select({
            wrapX: false
        });
        var _this = this;
        this.iEdit = new ol.interaction.Modify({
            features: _this.iSelect.getFeatures()
        });
        this.projection = {};
        this.google = google;
        this.perimetreArray = [];
        this.perimetre = 0;
    }

    _createClass(Map, [{
        key: 'initGeolocation',
        value: function initGeolocation(is_active) {
            if (is_active) {
                var _this = this;
                var geolocation = new ol.Geolocation({
                    projection: _this.map.getView().getProjection()
                });
                var accuracyFeature = new ol.Feature();
                geolocation.on('change:accuracyGeometry', function () {
                    accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
                });
                var positionFeature = new ol.Feature();
                positionFeature.setStyle(new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 6,
                        fill: new ol.style.Fill({
                            color: '#3399CC'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#fff',
                            width: 2
                        })
                    })
                }));
                geolocation.on('change:position', function () {
                    var coordinates = geolocation.getPosition();
                    positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
                });

                var geoLayer = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: [accuracyFeature, positionFeature]
                    })
                });
                geoLayer.set('name', 'geoLayer');
                _this.map.addLayer(geoLayer);
                geolocation.setTracking(is_active);
            } else {
                var _this2 = this;
                this.map.getLayers().forEach(function (lyr) {
                    if ('geoLayer' == lyr.get('name')) {
                        _this2.map.removeLayer(lyr);
                    }
                });
            }
        }
    }, {
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
                    }).extend([new ol.interaction.MouseWheelZoom(), new ol.interaction.DragPan()]),
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
            } else if (this.bing) {
                var l = new ol.layer.Tile({
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
                    }).extend([new ol.interaction.MouseWheelZoom(), new ol.interaction.DragPan()]),
                    controls: ol.control.defaults({
                        zoom: true,
                        attribution: false
                    }).extend([mousePositionControl]),
                    layers: [l],
                    loadTilesWhileInteracting: true,
                    target: 'map',
                    view: view
                });
            } else {
                jQuery('#map').html('<div id="olmap" class="fill"></div>');
                this.map = new ol.Map({
                    interactions: ol.interaction.defaults({
                        altShiftDragRotate: false,
                        dragPan: false,
                        rotate: false
                    }).extend([new ol.interaction.MouseWheelZoom(), new ol.interaction.DragPan()]),
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
            if (this.google || this.bing) {
                this.defProj4();
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
        key: 'defProj4',
        value: function defProj4() {
            proj4.defs("EPSG:32632", "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");
            proj4.defs("EPSG:22332", "+proj=utm +zone=32 +a=6378249.2 +b=6356515 +towgs84=-263,6,431,0,0,0,0 +units=m +no_defs");
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
                            bbox: extent.join(',')
                        },
                        error: function error(xhr, ajaxOptions, thrownError) {
                            if (xhr.status == 404) {
                                Event.$emit('alert', thrownError);
                            }
                        },
                        success: function success(response) {
                            var features = [];
                            if (_this.google || _this.bing) {
                                features = _this.formatGeoJSON_array[layerName].readFeatures(response, {
                                    dataProjection: _this.srsName,
                                    featureProjection: 'EPSG:3857'
                                });
                            } else {
                                features = _this.formatGeoJSON_array[layerName].readFeatures(response);
                            }
                            sourceWFS.addFeatures(features);
                        }
                    });
                },

                strategy: ol.loadingstrategy.bbox,

                projection: 'EPSG:3857'
            });
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
                if (_this.layers[key]['active']) {
                    _this.formatGML_array[_this.layers[key]['name']] = _this.createFormatGML(_this.layers[key]['name']);
                }
            });
        }
    }, {
        key: 'addFormatWFS',
        value: function addFormatWFS() {
            var _this = this;
            jQuery.each(_this.layers, function (key, value) {
                if (_this.layers[key]['active']) {
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
                if (_this.layers[key]['active']) {
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
                if (_this.google || _this.bing) {
                    _this.map.getView().fit(ol.proj.transformExtent(_this.bounds, _this.srsName, 'EPSG:3857'), _this.map.getSize());
                    _this.map.getView().setZoom(7);
                } else {
                    _this.map.getView().fit(_this.bounds, _this.map.getSize());
                }
                var storage = jQuery.localStorage;
                storage.set(key, 'checked');
                jQuery("#legende").append("" + "<div style='flex-basis: 15%;display: flex;'>" + "<div style='background-color: " + _this.layers[key]['color'] + "' class='slideThree'>" + "<input id='" + _this.layers[key]['name'] + "' type='checkbox' />" + "<label for='" + _this.layers[key]['name'] + "'></label>" + "</div>" + "<p style='margin-left: 5px'>" + _this.layers[key]['name'] + "</p>" + "</div>");
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
            _this.btnEdit.click(function () {
                _this.editAction();
            });
        }
    }, {
        key: 'transactWFS',
        value: function transactWFS(mode, f, layerSelected, interaction) {
            var _this = this;
            var node;
            switch (mode) {
                case 'insert':
                    node = _this.formatWFS_array[layerSelected].writeTransaction([f], null, null, _this.formatGML_array[layerSelected]);
                    break;
                case 'update':
                    node = _this.formatWFS_array[layerSelected].writeTransaction(null, [f], null, _this.formatGML_array[layerSelected]);
                    _this.removeNodeForWfsUpdate(node, "geometry");
                    break;
                case 'delete':
                    node = _this.formatWFS_array[layerSelected].writeTransaction(null, null, [f], _this.formatGML_array[layerSelected]);
                    break;
            }
            var s = new XMLSerializer();
            var payload = s.serializeToString(node);
            jQuery.ajax(carte.geoserver.url + '/' + carte.geoserver.workspace + '/wfs', {
                type: 'POST',
                dataType: 'xml',
                processData: false,
                contentType: 'text/xml',
                data: payload,
                success: function success(data) {
                    if (mode != 'delete') {
                        _this.sourceWFS_array[layerSelected].clear();
                        _this.map.removeInteraction(interaction);
                    } else {
                        _this.deleteFeatures(interaction, interaction.getFeatures(), _this.sourceWFS_array[layerSelected]);
                    }
                }
            }).done();
        }
    }, {
        key: 'deleteFeatures',
        value: function deleteFeatures(interaction, selectedFeat, vectorSource) {
            if (selectedFeat.getLength() > 0) {
                var toDeleteFeat = interaction.getFeatures().getArray()[0];
                vectorSource.removeFeature(toDeleteFeat);
                interaction.getFeatures().remove(toDeleteFeat);
            } else window.alert("Please select a layer first :" + selectedFeat.getLength());
        }
    }, {
        key: 'editAction',
        value: function editAction() {
            var _this = this;
            _this.addFormatWFS();
            _this.addFormatGML();
            this.btnEdit.parent().find('.btn').each(function (index, element) {
                jQuery(this).removeClass('active');
            });
            this.btnEdit.addClass('active');
            this.map.addInteraction(this.iSelect);
            this.map.addInteraction(this.iEdit);
            var s = new XMLSerializer();
            var dirty = {};
            var layerSelected = '';
            _this.iSelect.getFeatures().on('add', function (e) {
                layerSelected = e.target.item(0).getLayer(_this.map).get('name');
                e.element.on('change', function (e) {
                    dirty[e.target.getId()] = true;
                });
            });
            _this.iSelect.getFeatures().on('remove', function (e) {
                var f = e.element;
                if (dirty[f.getId()]) {
                    delete dirty[f.getId()];
                    var featureProperties = f.getProperties();
                    delete featureProperties.boundedBy;
                    var clone = new ol.Feature({
                        the_geom: f.getGeometry()
                    });
                    clone.setProperties(featureProperties);
                    clone.setGeometryName("the_geom");
                    var newFeature = _this.transform_geometry(clone);
                    newFeature.setId(f.getId());
                    newFeature.set('SUPERFICIE', _this.formatArea(f.getGeometry()));
                    _this.transactWFS('update', newFeature, layerSelected, _this.iEdit);
                }
            });
        }
    }, {
        key: 'removeNodeForWfsUpdate',
        value: function removeNodeForWfsUpdate(node, valueToRemove) {
            var propNodes = node.getElementsByTagName("Property");
            for (var i = 0; i < propNodes.length; i++) {
                var propNode = propNodes[i];
                var propNameNode = propNode.firstElementChild;
                var propNameNodeValue = propNameNode.firstChild;
                if (propNameNodeValue.nodeValue === valueToRemove) {
                    propNode.parentNode.removeChild(propNode);
                    break;
                }
            }
        }
    }, {
        key: 'getActiveLayers',
        value: function getActiveLayers(layers) {
            var active_layers_array = {};
            jQuery.each(layers, function (key, value) {
                if (layers[key]['active']) {
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
                    _this.defProj4();
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
                                info += '</div>';
                                jQuery("#infosPopup").show();
                                jQuery("#infosPopup-bottom").show();
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
            _this.addFormatWFS();
            _this.addFormatGML();
            _this.btnDelete.parent().find('.btn').each(function (index, element) {
                jQuery(this).removeClass('active');
            });
            _this.btnDelete.addClass('active');
            _this.map.removeInteraction(_this.interactionSelect);
            _this.map.removeInteraction(_this.iSelect);
            _this.map.removeInteraction(_this.iEdit);
            _this.map.removeInteraction(_this.getDraw());
            _this.map.addInteraction(this.interactionDelete);
            _this.interactionDelete.getFeatures().on('add', function (e) {
                var layerSelected = e.target.item(0).getLayer(_this.map);
                _this.transactWFS('delete', e.target.item(0), layerSelected.get('name'), _this.interactionDelete);
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
            document.addEventListener('keydown', function (e) {
                if (e.which == 27) interactionDraw.removeLastPoint();
            });
            interactionDraw.on('drawstart', function (e) {
                _this.perimetreArray = [];
                _this.map.on('singleclick', function (evt) {
                    var sourceProj = _this.map.getView().getProjection();
                    _this.perimetreArray.push(ol.proj.transform(evt.coordinate, sourceProj, 'EPSG:4326'));
                });
            });
            interactionDraw.on('drawend', function (e) {
                _this.map.removeInteraction(interactionDraw);
                _this.defProj4();
                var extent = e.feature.getGeometry().getExtent();
                var center = ol.extent.getCenter(extent);
                var newFeature = _this.transform_geometry(e.feature);
                var coord = ol.proj.transform(center, 'EPSG:3857', 'EPSG:4326');
                var lon = coord[0];
                var lat = coord[1];
                var props;
                jQuery("#sendMailNewData").click();
                _this.addFormatWFS();
                _this.addFormatGML();
                var form = new __WEBPACK_IMPORTED_MODULE_0__FormBuilder__["a" /* FormBuilder */]();
                form.init('POST', _this.getActiveLayers(_this.layers));
                jQuery('#select_layer').change(function () {
                    var array = _this.layersWFS_array[jQuery('#select_layer').val()].getSource().getFeatures().sort(function (a, b) {
                        return a.get(_this.layers_primary_key) - b.get(_this.layers_primary_key);
                    });
                    var fid = _this.layersWFS_array[jQuery('#select_layer').val()].getSource().getFeatures().length;
                    newFeature.setId(array[fid - 1].get(_this.layers_primary_key) + 1);
                    props = form.create(jQuery('#select_layer').val(), _this.layersWFS_array, _this.formatPerimetre(e.feature.getGeometry()), _this.formatArea(e.feature.getGeometry()), _this.layers_primary_key, newFeature.getId());
                });
                jQuery("#saveFeature").click(function () {
                    form.submit(jQuery('#select_layer').val(), props, newFeature, _this.formatWFS_array, _this.formatGML_array, _this.formatPerimetre(e.feature.getGeometry()), _this.formatArea(e.feature.getGeometry())).then(function (response) {
                        carte.form.model.lon = lon;
                        carte.form.model.lat = lat;
                        carte.form.model.feature = response;
                    });
                });
            });
            this.map.addInteraction(interactionDraw);
        }
    }, {
        key: 'transform_geometry',
        value: function transform_geometry(element) {
            // var sourceProj = this.map.getView().getProjection();
            // console.log(sourceProj);
            proj4.defs("EPSG:32632", "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");
            // console.log(element.getGeometry().getCoordinates());
            // let newFeature = element.clone();
            // newFeature.getGeometry().transform(sourceProj,"EPSG:32632");
            var newFeature = element.clone();
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
    }, {
        key: 'formatArea',
        value: function formatArea(polygon) {
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
            output = Math.round(area * 100) / 100;
            return output;
        }
    }, {
        key: 'formatPerimetre',
        value: function formatPerimetre(polygon) {
            var sourceProj = this.map.getView().getProjection();
            this.perimetre = 0;
            var wgs84Sphere = new ol.Sphere(6378137);
            var lastPoint = ol.proj.transform(polygon.clone().getLastCoordinate(), sourceProj, 'EPSG:4326');
            this.perimetreArray.push(lastPoint);
            for (var i = 0, ii = this.perimetreArray.length - 1; i < ii; ++i) {
                this.perimetre += wgs84Sphere.haversineDistance(this.perimetreArray[i], this.perimetreArray[i + 1]);
            }
            this.perimetre = Math.round(this.perimetre * 100) / 100;
            return this.perimetre;
        }
    }]);

    return Map;
}();

/***/ }),

/***/ 181:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(134);


/***/ }),

/***/ 2:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Errors__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Form; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }


var Form = function () {
    function Form(data) {
        _classCallCheck(this, Form);

        this.model = {};
        this.originalData = data;
        for (var field in data.model) {
            this.model[field] = data.model[field];
        }
        this.errors = new __WEBPACK_IMPORTED_MODULE_0__Errors__["a" /* Errors */]();
    }

    _createClass(Form, [{
        key: 'reset',
        value: function reset() {
            for (var field in this.originalData.model) {
                this.model[field] = '';
            }
            this.errors.clear();
        }
    }, {
        key: 'data',
        value: function data() {
            var data = {};
            for (var property in this.model) {
                data[property] = this.model[property];
            }
            return data;
        }
    }, {
        key: 'submit',
        value: function submit(requestType, url) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                axios[requestType](url, _this.data()).then(function (response) {
                    _this.onSuccess(response.data);
                    resolve(response.data);
                }).catch(function (error) {
                    _this.onFail(error.response.data);
                    reject(error.response.data);
                });
            });
        }
    }, {
        key: 'onSuccess',
        value: function onSuccess(response) {
            this.reset();
        }
    }, {
        key: 'post',
        value: function post(url) {
            return this.submit('post', url);
        }
    }, {
        key: 'delete',
        value: function _delete(url) {
            return this.submit('delete', url);
        }
    }, {
        key: 'patch',
        value: function patch(url) {
            return this.submit('patch', url);
        }
    }, {
        key: 'onFail',
        value: function onFail(errors) {
            this.errors.record(errors);
        }
    }]);

    return Form;
}();

/***/ })

/******/ });