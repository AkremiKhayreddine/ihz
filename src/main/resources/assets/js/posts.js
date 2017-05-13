const posts = new Vue({
    el: "#posts",
    data: {
        posts: []
    },
    methods: {
        getPosts(){
            axios.get('/api/posts').then(response => {
                this.posts = response.data;
                for (let i in this.posts) {
                    this.posts[i].updated_at = moment(this.posts[i].updated_at).from(moment());
                }
            })
        },
        deletePost(id){
            axios.delete('/api/posts/' + id).then(response => {
                this.getPosts();
            })
        },
        fbShare(id){
            let vm = this;
            var url = window.location.href;
            FB.ui({
                method: 'share',
                href: url,
                title: vm.posts[id].title,
                link: url,
                picture: 'http://www.groupstudy.in/img/logo3.jpeg',
                description: vm.posts[id].description,
            }, function (response) {
            });
        }
    },
    mounted(){
        this.getPosts();
    }
})