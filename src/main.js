import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'
import Editor from './views/Editor.vue'

Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes: [{
        path: '/',
        redirect: '/newArticle'
    }, {
        path: '/:articleID',
        component: Editor
    }]
})

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')