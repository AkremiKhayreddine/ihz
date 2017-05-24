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
/******/ 	return __webpack_require__(__webpack_require__.s = 186);
/******/ })
/************************************************************************/
/******/ ({

/***/ 139:
/***/ (function(module, exports) {

var statistics = new Vue({
    el: '#statistics',
    data: {
        nappe: 'Tous',
        type: 'Tous',
        message: '',
        dates: [],
        napes: [],
        types: [],
        names: {},
        chartData: []
    },
    methods: {
        getTypeData: function getTypeData() {
            this.nappe = 'Tous';
            this.getNappes();
            this.getData();
        },
        getNappeData: function getNappeData() {
            this.getData();
            this.message = this.type + ' de ' + this.nappe;
        },
        getData: function getData() {
            var _this = this;

            axios.get('/api/statistics/getData', {
                params: {
                    nappe: this.nappe,
                    type: this.type
                }
            }).then(function (response) {
                if (response.data.length == 0) {
                    _this.message = 'Choisir un type ';
                    chart = null;
                } else {
                    if (_this.nappe == 'Tous') {
                        _this.getDates().then(function () {
                            _this.getNappes().then(function () {
                                var array = [];
                                for (var nappe in _this.napes) {
                                    array[nappe] = [];
                                    array[nappe].push(_this.napes[nappe]);
                                    for (var item in response.data) {
                                        if (response.data[item].nappe == _this.napes[nappe]) {
                                            array[nappe].push(response.data[item].valeur);
                                        }
                                    }
                                }
                                _this.chartData = array;
                                _this.chartData[_this.chartData.length] = _this.dates;
                                var vm = _this;
                                var chart = c3.generate({
                                    bindto: '#chart',
                                    data: {
                                        x: 'x',
                                        xFormat: '%Y',
                                        columns: vm.chartData,
                                        type: 'bar',
                                        names: vm.names
                                    },
                                    legend: {
                                        position: 'right'
                                    },
                                    bar: {
                                        width: {
                                            ratio: 0.2
                                        }
                                    },
                                    axis: {
                                        x: {
                                            type: 'timeseries',
                                            tick: {
                                                format: '%Y'
                                            }
                                        },
                                        y: {
                                            tick: {
                                                outer: false,
                                                format: function format(d) {
                                                    return Number(d.toFixed(1));
                                                }
                                            }
                                        }
                                    }
                                });
                            });
                        });
                    } else {
                        var _chart = c3.generate({
                            bindto: '#chart',
                            data: {
                                x: 'x',
                                xFormat: '%Y',
                                json: response.data,
                                keys: {
                                    x: 'date',
                                    value: ['valeur']
                                },
                                type: 'bar'
                            },
                            bar: {
                                width: {
                                    ratio: 0.1 // this makes bar width 50% of length between ticks
                                }
                            },
                            axis: {
                                x: {
                                    type: 'timeseries',
                                    tick: {
                                        format: '%Y'
                                    }
                                },
                                y: {
                                    tick: {
                                        outer: false,
                                        format: function format(d) {
                                            return Number(d.toFixed(1));
                                        }
                                    }
                                }
                            }
                        });
                        _chart.data.names({ valeur: _this.type });
                    }
                }
            });
        },
        getDates: function getDates() {
            var vm = this;
            return new Promise(function (resolve, reject) {
                axios.get('/statistics/getDates', {
                    params: {
                        type: vm.type
                    }
                }).then(function (response) {
                    vm.dates = [];
                    vm.dates.push('x');
                    for (var item in response.data) {
                        vm.dates.push(response.data[item].date);
                    }
                    resolve();
                });
            });
        },
        getNappes: function getNappes() {
            var vm = this;
            this.message = this.type + ' de zaghouan';
            return new Promise(function (resolve, reject) {
                axios.get('/api/statistics/getNappesWithType', {
                    params: {
                        type: vm.type
                    }
                }).then(function (response) {
                    vm.napes = response.data;
                    for (var item in response.data) {
                        vm.names[response.data[item]] = response.data[item];
                    }
                    resolve();
                });
            });
        }
    },
    mounted: function mounted() {
        var _this2 = this;

        axios.post('/api/statistics/getTypes').then(function (response) {
            _this2.types = response.data;
            _this2.type = response.data[0];
        });
    }
});

/***/ }),

/***/ 186:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(139);


/***/ })

/******/ });