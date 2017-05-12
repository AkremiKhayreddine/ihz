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
        }
    },
    mounted(){
        this.getPosts();
    }
})