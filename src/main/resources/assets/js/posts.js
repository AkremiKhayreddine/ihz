const posts = new Vue({
    el: "#posts",
    data: {
        posts: []
    },
    methods: {
        getPosts(){
            axios.get('/api/posts').then(response => {
                this.posts = response.data;
            })
        },
        deletePost(id){
            axios.delete('/api/posts/' + id).then(response => {
                this.getPosts();
            })
        }
    },
    mounted(){
        this.getPosts();
    }
})