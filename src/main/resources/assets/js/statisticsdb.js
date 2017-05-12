import {Form} from "./Form";
const statisticsdb = new Vue({
    el: '#statisticsdb',
    data: {
        statistics: [],
        form: new Form({
            model: {
                nappe: '',
                date: '',
                type: '',
                valeur: 0
            },
        }),
        addNewStatistic: false,
    },
    methods: {
        saveNewStatistic(){
            this.form.post('/statistics').then(response => {
                this.getStatistics();
            });
        },
        deleteStatistic(id){
            this.form.delete('/statistics/' + id).then(response=> {
                this.getStatistics();
            });
        },
        getStatistics(){
            axios.get('/api/statistics').then(response => {
                this.statistics = response.data;
                this.addNewStatistic = false;
            });
        }
    },
    mounted(){
        this.getStatistics();
    }
});