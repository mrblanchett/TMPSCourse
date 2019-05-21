<template>
<div>
    <div class="row">
        <div class="col-md-4"><img class="logo" src="../assets/logo.png"></div>
        <div class="col-md-8 motto">
            <img class="motto-img" src="../assets/motto.png">
            <br>
            <app-motto></app-motto>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12 centered">
            <button class="btn btn-success white"><router-link to="/">View tasks</router-link></button>
            <button class="btn btn-primary white"><router-link to="/add">Add a task</router-link></button>
            <button class="btn btn-success white"><router-link to="/motto">Edit motto</router-link></button>
        </div>
    </div>
    <hr>
</div>
</template>

<script>
import Motto from './tasks/Motto.vue';

export default {
    data() {
        return {
            
        }
    },
    components: {
        appMotto: Motto,
    },
    methods: {
    
    }
}
</script>