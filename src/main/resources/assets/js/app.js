require('./bootstrap');
$(document).ready(function () {
    var url = window.location;
    $('ul.nav a[href="' + url + '"]').parent().addClass('active');
    $('ul.nav a').filter(function () {
        return this.href == url;
    }).parent().addClass('active');
    $('ul.user-settings a[href="' + url + '"]').parent().addClass('active');
});
window.fbAsyncInit = function () {
    FB.init({
        appId: '400297800351679',
        xfbml: true,
        version: 'v2.8'
    });
    FB.AppEvents.logPageView();
};
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
window.select2 = require('select2');
window.Dropzone = require("dropzone");
window.moment = require('moment');
window.moment.locale('fr');
Vue.component('select2', {
    props: ['options', 'value', 'multiple', 'change'],
    template: '<select ref="select" :multiple="multiple"><slot></slot></select>',
    mounted: function () {
        var vm = this;
        $(this.$el).val(this.value).select2({
            tags: true,
            data: this.options
        }).on('change', function () {
            vm.$emit('input', $(this).val());
            vm.$emit('search');
        })
    },
    watch: {
        value: function (value) {
            $(this.$el).val(value);
        },
        options: function (options) {
            let newOption = [];
            newOption.push('Tous');
            for (let item in options) {
                newOption.push(options[item]);
            }
            $(this.$el).select2('destroy').empty().select2({tags: true, data: newOption});
            if (this.change) {
                $(this.$el).val(newOption[1]).trigger('change');
            }
        }
    },
    destroyed: function () {
        $(this.$el).off().select2('destroy')
    }
});
const documentsSearch = new Vue({
    el: '#documentsSearch',
    data: {
        searchFor: '',
        results: []
    },
    methods: {
        search(){
            axios.post('/documents/search', {
                title: this.searchFor,
            }).then(response=> {
                this.results = response.data;
                $("#mybutton").dropdown('toggle')
            });
        }
    }
});

