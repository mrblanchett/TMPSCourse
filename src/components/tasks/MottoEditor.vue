<template>
<div>
    <h1>Edit motto</h1>
    <div class="row">
    <div class='form-group col-md-6 centered-block'>
        <label>Input your new motto:</label>
            <input class="form-control" type="text" v-model="mottoText">
            <div class="hint">
                <strong>Hint:</strong>
                <br>Click on the motto to see the changes!
            </div> 
            <p style="margin-top: 12px" class="centered"><button class="btn btn-success form-control" @click="saveMotto()">Save motto</button></p>        
        </div>
    </div>
</div>
</template>

<script>
import Motto from './Motto.vue'

export default {
    data() {
        return {
            mottoText: '',
            newMotto: ''
        }
    },
    components: {
        appMotto: Motto,
    },
    methods: {
        saveMotto() {
            // this.newMotto = this.mottoText;
            console.log('new motto:', this.mottoText);
            const data = {
                text: this.mottoText
            };

            this.$http.put('https://ragnell-49d8d.firebaseio.com/Motto.json', data).then(
                    response => {
                    console.log(response)}, error => {console.log(error)});
        }
    }
}
</script>