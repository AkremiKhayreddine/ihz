const post = new Vue({
    el: "#post",
    data: {
        post: {}
    },
    methods: {
        getPost(){
            var url = window.location.pathname;
            axios.get("/api/" + url).then(response => {
                this.post = response.data;
            });
        },
        fbShare(){
            let vm =this;
            var url = window.location;
            FB.ui({
                method: 'share',
                href: 'https://ihz-java.herokuapp.com/posts/5',
                title: vm.post.title,
                link: 'https://ihz-java.herokuapp.com/posts/5',
                picture: 'http://www.groupstudy.in/img/logo3.jpeg',
                description: vm.post.description,
            }, function (response) {
            });
        }
    },
    mounted(){
        this.getPost();
    }
})