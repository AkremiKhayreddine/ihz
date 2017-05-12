import {Map} from './Map';
jQuery('#google-map-status').change(function () {
    axios.post('getAllCouches').then(function (response) {
        axios.get('admin/getConfig').then(config => {
            const map = new Map({
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
            let layersWFS_array = map.addLayersToMap();
            map.detectActionButton();
        });
    });
});
ol.Feature.prototype.getLayer = function (map) {
    var this_ = this, layer_, layersToLookFor = [];
    var check = function (layer) {
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
const carte = new Vue({
    el: '#carte',
    data: {
        showConfig: true,
        gMapCheckbox: true,
        positionCheckbox: false
    },
    methods: {
        getAllCouches(){
            let vm = this;
            axios.post('getAllCouches').then(function (response) {
                axios.get('admin/getConfig').then(config => {
                    const map = new Map({
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
                    let layersWFS_array = map.addLayersToMap();
                    map.detectActionButton();
                });
            });
        }
    },
    mounted(){
        this.getAllCouches();
    },
    watch: {
        gMapCheckbox: function () {
            this.getAllCouches();
        },
    },
});
