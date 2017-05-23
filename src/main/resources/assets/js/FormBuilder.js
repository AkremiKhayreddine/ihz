export class FormBuilder {
    constructor({content = jQuery("#formBuilder")} = {}) {
        this.content = content;
    }

    init(method, layers) {
        this.content.html('');
        this.content.append('<form class="form-group" method = ' + method + '>');
        var select = '<div  class="form-group" style="margin-bottom: 20px;">' +
            '<label style="width: 45%;position:relative;float:left">Choisir couche</label>' +
            '<select id="select_layer" class="form-control" style="background-color: #ffffff;' +
            'border: 1px solid #e4e7ea;' +
            'border-radius: 0;' +
            'box-shadow: none;' +
            'color: #565656;' +
            'height: 38px;' +
            'max-width: 100%;' +
            'padding: 7px 12px;' +
            'transition: all 300ms linear 0s;width: 50%">' +
            '<option value="">Choisir couche</option>';
        jQuery.each(layers, function (key, value) {
            select += '<option value="' + layers[key] + '">' + layers[key] + '</option>';
        });
        select += '</select></div>';
        this.content.append(select);
    }

    create(selected_layer, layersWFS_array) {
        var elements = layersWFS_array[selected_layer].getSource().getFeatures();
        var props = elements[0].getProperties();
        jQuery('#content').remove();
        var content = '<div id="content">';
        jQuery.each(props, function (key, value) {
            if (key !== 'geometry') {
                content += '<div  class="form-group" style="margin-bottom: 20px;">' +
                    '<label style="width: 45%;position:relative;float:left" class="2">' + key +
                    '</label><input id="' + key + '" style="  background-color: #ffffff;' +
                    'border: 1px solid #e4e7ea;' +
                    'border-radius: 0;' +
                    'box-shadow: none;' +
                    'color: #565656;' +
                    'height: 38px;' +
                    'max-width: 100%;' +
                    'padding: 7px 12px;' +
                    'transition: all 300ms linear 0s;width: 50%" class="form-control" ></div>';
            }
        });
        content += '</div>';
        this.content.append(content);
        this.closeForm();
        return props;
    }

    closeForm() {

        this.content.append('</form');
    }

    submit(selected_layer, props, newFeature, formatWFS_array, formatGML_array) {
        var featureProp = {};
        var s = new XMLSerializer();
        jQuery.each(props, function (key, value) {
            if (key !== 'geometry') {
                featureProp[key] = jQuery('#' + key).val();
            }
        });
        newFeature.setProperties(featureProp);
        jQuery.ajax(carte.geoserver.url+'/'+carte.geoserver.workspace+'/wfs', {
            type: 'POST',
            dataType: 'xml',
            contentType: 'text/xml',
            data: s.serializeToString(formatWFS_array[selected_layer].writeTransaction([newFeature], null, null, formatGML_array[selected_layer])),
            success: function (data) {
                $('#closeModal').click();
            }
        }).done();
    }
}