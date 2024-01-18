const app = Vue.createApp({
    data() {
        return {
            username: "",
            password: "",
        };
    },
    methods: {
        login(){
            if (!this.username || !this.password) {
                alert('請輸入信箱或密碼!');
                return;
            } else {
                axios.post("https://ec-course-api.hexschool.io/v2/admin/signin", {
                    "username": this.username,
                    "password": this.password
                })
                    .then(res => {
                        const { token, expired } = res.data;
                        document.cookie = `myToken=${token}; expires=${new Date(expired)};`;
                        form.reset();
                        location.href = "product.html" ;
                })
                    .catch(err => {
                        alert(err.data.message);
                    });
            };
        },

    },
});

app.mount("#app");