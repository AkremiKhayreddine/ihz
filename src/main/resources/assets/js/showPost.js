const post = new Vue({
    el: "#post",
    data: {
        post: {}
    },
    methods: {
        getPost(){
            var url = window.location.pathname;
            axios.get("/api/"+url).then(response => {
                this.post = response.data;
            });
        }
    },
    mounted(){
        this.getPost();
    }
})