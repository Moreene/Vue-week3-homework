// productModal/delProductModal 必須是在全域環境宣告，假設直接從 mounted 內宣告，會導致該變數作用域只存在 mounted 範圍內（因為 mounted 也屬於函式）
// 而無法在 openModal 函式中順利取得該變數，導致錯誤
let productModal = null;
let delProductModal = null;

const app = Vue.createApp({
    data() {
        return {
            apiUrl: 'https://ec-course-api.hexschool.io/v2',
            apiPath: 'moreene',
            products: [],
            tempProduct: {
                // 儲存小圖
                imagesUrl: []
            },
            // 判斷：是否為新增產品
            isNew: false,
            isShow: false
        };
    },
    methods: {
        // 確認使用者權限
        checkLogin() {
            axios.post(`${this.apiUrl}/api/user/check`)
                .then(res => {
                    this.getProduct();
                    this.isShow = true;
                })
                .catch(err => {
                    alert('您沒有權限進入!');
                    location.href = "index.html";
                });
        },
        // 取得所有產品資訊
        getProduct() {
            axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
                .then(res => {
                    this.products = res.data.products;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 打開modal（透過status判斷要打開的哪一個modal）
        openModal(status, item) {
            if (status === 'new') {
                // 新增產品
                this.tempProduct = {};
                this.isNew = true;
                productModal.show();
            } else if (status === 'edit') {
                // 修改產品
                this.tempProduct = { ...item };
                this.isNew = false;
                productModal.show();
            } else if (status === 'delete') {
                // 刪除產品
                this.tempProduct = { ...item };
                this.isNew = false;
                delProductModal.show();
            };
        },
        // productModal內的"確認"按鈕
        updateProduct() {
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            let http = 'put';

            if (this.isNew) {
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
                http = 'post'
            };
            axios[http](url, { data: this.tempProduct })
                .then((res) => {
                    alert(res.data.message);
                    productModal.hide();
                    this.getProduct();
                }).catch((err) => {
                    alert(err.data.message);
                });
        },
        // delProductModal內的"確認刪除"按鈕
        delProduct() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            axios.delete(url).then((res) => {
                alert(res.data.message);
                delProductModal.hide();
                this.getProduct();
            }).catch((err) => {
                alert(err.response.data.message);
            });
        },
        // 取消新增產品時，清空輸入框
        clearInput() {
            this.newProduct = {};
        },
    },
    mounted() {
        const token = document.cookie.replace(
            /(?:(?:^|.*;\s*)myToken\s*\=\s*([^;]*).*$)|^.*$/, "$1",);
        axios.defaults.headers.common['Authorization'] = token;
        this.checkLogin();

        // modal實例化
        productModal = new bootstrap.Modal(
            this.$refs.productModal,
            {
                keyboard: false,
                backdrop: 'static'
            }
        );
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false,
            backdrop: 'static'
        });
    },
});

app.mount("#app");