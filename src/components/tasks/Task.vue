<template>
    <transition name="poof">          
        <div class="task" v-if="deleted == false" >
            <div class="task-text">Your mission: {{task.text}}<br>
            <span v-if="task.type == 'Scheduled'">Due date: {{task.date}}</span>
            </div>

            <transition name="endjob">
            <div style="display: inline-block" v-if="completed == false">
                <button 
                    class="btn" 
                    :class="{'btn-secondary': task.done, 'btn-success': !task.done}" 
                    @click="done(task.type, task.id)">
                Complete</button> 
            </div>
            <div style="display: inline-block" v-else>
                <button 
                    class="btn" 
                    :class="{'btn-secondary': completed}"
                    @click="done(task.type, task.id)">
                Complete</button> 
            </div>        
            </transition>
            <button class="btn btn-danger" @click="exterminate(task.type, task.id)">Delete</button>
        </div>
    </transition>
</template>

<script>
    export default {
        props: ['task', 'daySwitcher'],
        data() {
            return {
                deleted: false,
                completed: false
            }
        },
        watch: {
            daySwitcher: function() {
                console.log('Component ', this.task.id, ' received the command! Initializing daybreak');
                this.daybreak(this.task.id);
            }
        },
        methods: {
            done(ttype, tid) {
            this.$http.patch('https://ragnell-49d8d.firebaseio.com/'+ttype+'/'+tid+'.json', {"done":true} ).then(
                    response => {
                    console.log(response)}, error => {console.log(error)});
                this.completed = true;        
                
            },
            exterminate(ttype, tid) {
                this.$http.delete('https://ragnell-49d8d.firebaseio.com/'+ttype+'/'+tid+'.json', {"done":true} ).then(
                    response => {
                    console.log(response)}, error => {console.log(error)});
                this.deleted = true;    
            },
            daybreak(tid) {
                    this.$http.patch('https://ragnell-49d8d.firebaseio.com/Daily/'+tid+'.json', {"done":false} ).then(
                    response => {
                    console.log(response)}, error => {console.log(error)});
                }
        }
    }
</script>

<style>
.poof-leave-active {
    transition: opacity 1s;
    opacity: 0;
}

.endjob-leave-active {
    transition: background-color 1s;
    background-color: gray;
}
</style>