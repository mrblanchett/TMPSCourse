<template>
<div>
    <h1>Time to get busy!</h1>
    <div class="row">
    <div class='form-group col-md-6 centered-block'>
        <label>What kind of task is at hand?</label>
            <select class="form-control" name="task-type" v-model="task.type">
                <option value="Scheduled">Scheduled</option>
                <option value="Daily">Daily</option>
                <option value="Classic">Classic</option>
            </select>
        <div class="hint">
            <strong>Hint:</strong>
            <br><strong>Scheduled</strong> tasks come with a deadline
            <br><strong>Daily</strong> tasks can be refreshed every day
            <br><strong>Classic</strong> tasks don't have any special features
        </div> 

        <div v-if="task.type == 'Scheduled'">
            <label>Input your task:</label>
                <input class="form-control" type="text" v-model="task.text">
            <label>Set due date:</label>
                <input class="form-control" type="date" v-model="task.date">
        </div>

        <div v-if="task.type == 'Daily'">
            <label>Input your daily:</label>
                <input class="form-control" type="text" v-model="task.text">
        </div>

        <div v-if="task.type == 'Classic'">
            <label>Input your task:</label>
                <input class="form-control" type="text" v-model="task.text">
        </div>

        <p style="margin-top: 12px" class="centered"><button class="btn btn-success form-control" @click="createTask()">Submit</button></p>       
    </div>
    </div>
</div>
</template>

<script>
const today = new Date();
import { eventBus } from '../../main';

export default {
    data() {
        return {
            task: {
                text: '',
                type: '',
                date: today,
                done: false
            },
        }
    },
    methods: {
    createTask() {
        var vm = this;
        var Facade = /** @class */ (function () {
            function Facade(factory) {
                this.factory = factory;
            }
            Facade.prototype.createTask = function () {
                console.log('Facade initializes factory');
                this.factory.taskFactory();
            };
            return Facade;
        }());
        var factory = /** @class */ (function () {
            function factory() {
            }
            factory.prototype.taskFactory = function () {
                console.log('Factory is running');
                vm.taskFactory(vm.task.type, vm.task.text, vm.task.date);
            };
            return factory;
        }());
        function clientCode(facade) {
            facade.createTask();
        }
        var myFactory = new factory();
        var facade = new Facade(myFactory);
        clientCode(facade);
    },
    taskFactory(taskType, taskText, taskDate) {
        var vm = this;
        var taskWIP = {
            text: '',
            type: '',
            date: today,
            done: false
        }
        //courtesy typescript compiler
        var __extends = (this && this.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
        })();

        //the abstract class
        var TaskCreator = /** @class */ (function () {
        function TaskCreator() {
        }
        TaskCreator.prototype.runFactory = function (taskText, taskExtra) {
            var product = this.createTask();
            product.makeTask(taskText, taskExtra);
        };
        return TaskCreator;
        }());

        //daily maker
        var DailyCreator = /** @class */ (function (_super) {
        __extends(DailyCreator, _super);
        function DailyCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DailyCreator.prototype.createTask = function () {
            return new DailyTask();
        };
        return DailyCreator;
        }(TaskCreator));

        //scheduled maker
        var ScheduledCreator = /** @class */ (function (_super) {
        __extends(ScheduledCreator, _super);
        function ScheduledCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ScheduledCreator.prototype.createTask = function () {
            return new ScheduledTask();
        };
        return ScheduledCreator;
        }(TaskCreator));

        //classic maker
        var ClassicCreator = /** @class */ (function (_super) {
        __extends(ClassicCreator, _super);
        function ClassicCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ClassicCreator.prototype.createTask = function () {
            return new ClassicTask();
        };
        return ClassicCreator;
        }(TaskCreator));

        //a class for dailies
        var DailyTask = /** @class */ (function () {
        function DailyTask() {
        }
        DailyTask.prototype.makeTask = function (taskText) {
            taskWIP.type = 'Daily';
            taskWIP.text = taskText;
            console.log('Made a Daily task: ', taskWIP.text);
            vm.$http.post('https://ragnell-49d8d.firebaseio.com/Daily.json', taskWIP).then(response => {
                console.log(response)}, error => {console.log(error)});
        };
        return DailyTask;
        }());

        //a class for scheduled
        var ScheduledTask = /** @class */ (function () {
        function ScheduledTask() {
        }
        ScheduledTask.prototype.makeTask = function (taskText, taskDate) {
            taskWIP.type = 'Scheduled';
            taskWIP.text = taskText;
            taskWIP.date = taskDate;
            console.log('Made a scheduled task: ', taskWIP.text);
            vm.$http.post('https://ragnell-49d8d.firebaseio.com/Scheduled.json', taskWIP).then(response => {
                console.log(response)}, error => {console.log(error)});
        };
        return ScheduledTask;
        }());

        //a class for classic
        var ClassicTask = /** @class */ (function () {
        function ClassicTask() {
        }
        ClassicTask.prototype.makeTask = function (taskText) {
            taskWIP.type = 'Classic';
            taskWIP.text = taskText;
            console.log('Made a classic task: ', taskWIP.text);
            vm.$http.post('https://ragnell-49d8d.firebaseio.com/Classic.json', taskWIP).then(response => {
                console.log(response)}, error => {console.log(error)});
        };
        return ClassicTask;
        }());

        //client code
        function factoryPicker(creator) {
            creator.runFactory(taskText, taskDate);
        }

        switch(taskType) {
            case 'Daily':
                factoryPicker(new DailyCreator());
                break;
            case 'Scheduled':
                factoryPicker(new ScheduledCreator());
                break;   
            case 'Classic':
                factoryPicker(new ClassicCreator());
                break;
            default:
                console.log('Invalid task type');         
        }
    }
    }
}
</script>