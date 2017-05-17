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
        addUser(){
            this.form.post('/api/users').then(data => {
                $('#closeUserModal').click();
                this.getUsers();
            });
        },
        editUser(){
            this.editForm.patch('/api/users/' + this.editForm.model.id).then(data => {
                $('#closeEditModal').click();
                this.getUsers();
            });
        },
        deleteUser(userId){
            axios.delete('/api/users/' + userId).then(() => {
                this.getUsers();
            });
        },
        assignRole(user){
            axios.post('/api/users/' + user.id + '/assignRole', {
                roles: user.roles
            }).then(response => {

            });
        }
    },
    mounted(){
        this.getUsers();
        this.getRoles();
    }
});