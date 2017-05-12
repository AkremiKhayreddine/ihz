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
            let vm = this;
            var url = window.location.href;
            console.log(url);
            FB.ui({
                method: 'share',
                href: url,
                title: vm.post.title,
                link: url,
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