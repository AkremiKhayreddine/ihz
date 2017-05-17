import {Form} from "./Form";
window.users = new Vue({
    el: '#users',
    data: {
        users: [],
        roles: [],
        assignedRoles: [],
        form: new Form({
            model: {
                name: '',
                email: '',
                password: '',
                password_confirmation: ''
            }
        })
    },
    methods: {
        getUsers(){
            axios.get('/api/users').then(response => {
                this.users = response.data;
                for (let item in this.users) {
                    if (this.users[item].roles.length > 0) {
                        let ob = {};
                        for (let i in this.users[item].roles) {
                            ob[this.users[item].roles[i].id] = this.users[item].roles[i].name;
                        }
                        this.users[item].roles = ob;
                    }
                }
            })
        },
        addUser(){
            this.form.post('/users').then(response => {
                this.getUsers();
                $('#addUser').modal('toggle');
            });
        },
        getRoles(){
            axios.get('/api/roles').then(response => {
                this.roles = response.data;
            });
        },
    },
    mounted(){
        this.getUsers();
        this.getRoles();
    }
});