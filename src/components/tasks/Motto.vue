<template>
<div>
    <button class="btn motto-button" @click="fetchMotto">{{ mottoText }}</button>
</div>
</template>

<script>
export default {
    props: ['motto'],
    data() {
        return {
            mottoText: ''
        }
    },
    methods: {
        singleton() {
                var MottoSingleton = /** @class */ (function () {
                function MottoSingleton() {
                }
                MottoSingleton.getInstance = function () {
                    if (!MottoSingleton.instance) {
                        MottoSingleton.instance = new MottoSingleton();
                    }
                    console.log('Singleton deployed');
                    return MottoSingleton.instance;
                };
                return MottoSingleton;
            }());
        },
        fetchMotto() {
            this.$http.get('https://ragnell-49d8d.firebaseio.com/Motto.json').then(response => {
                return response.json()}).then(data => {
                    this.mottoText = data.text;
                });
        }
    },
    beforeCreate() {
        var MottoSingleton = /** @class */ (function () {
            function MottoSingleton() {
        }
        MottoSingleton.getInstance = function () {
            if (!MottoSingleton.instance) {
                MottoSingleton.instance = new MottoSingleton();
        }
            console.log('Singleton deployed');
            return MottoSingleton.instance;
        };
            return MottoSingleton;
        }());
        function deployMotto() {
            var myMotto = MottoSingleton.getInstance();
        }

        this.$http.get('https://ragnell-49d8d.firebaseio.com/Motto.json').then(response => {
                return response.json()}).then(data => {
                    this.mottoText = data.text;
                });
        deployMotto();      
    }
}
</script>