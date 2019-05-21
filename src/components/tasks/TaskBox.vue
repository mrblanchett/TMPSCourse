<template>
<div class="centered">
    <h1>Task box</h1>
    <div class="row">
            <div class="col-md-4">
                <h2>Daily</h2>
                <button class="btn btn-success" @click="gimme('Daily')">Fetch</button>
                <button class="btn btn-primary" @click="daybreak(true)">Refresh</button>
                <app-task v-for="task in dailyTasks" :key="task" :task="task" :daySwitcher="switchDay"></app-task>
            </div>
            <div class="col-md-4">
                <h2>Scheduled</h2>
                <button class="btn btn-success" @click="gimme('Scheduled')">Fetch</button>
                <button class="btn btn-danger" @click="deadliner">Due today?</button>
                <app-task v-for="task in scheduledTasks" :key="task" :task="task"></app-task>
            </div>
            <div class="col-md-4">
                <h2>Other</h2>
                <button class="btn btn-success" @click="gimme('Classic')">Fetch</button>
                <app-task v-for="task in classicTasks" :key="task" :task="task"></app-task>
            </div>
    </div>    
</div>
</template>

<script>
import { eventBus } from '../../main';
import Task from './Task.vue'

export default {
    data() {
        return {
            dailyTasks: [],
            scheduledTasks: [],
            classicTasks: [],
            dueToday: [],
            switchDay: false,
            stateMachine: false
        }
    },
    components: {
        appTask: Task
    },
    methods: {
        gimme(type) {
            this.$http.get('https://ragnell-49d8d.firebaseio.com/'+type+'.json').then(response => {
                return response.json()}).then(data => {
                    //parse data
                    const resultArray = [];
                    let i = 0;
                    for (let key in data) {
                        resultArray.push(data[key]);
                        resultArray[i].id = key;
                        i++;
                    }

                    //save context for later
                    var vm = this;

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

                    //abstract handler class
                    var AbstractHandler = /** @class */ (function () {
                        function AbstractHandler() {
                        }
                        AbstractHandler.prototype.setNext = function (handler) {
                            this.nextHandler = handler;
                            return handler;
                        };
                        AbstractHandler.prototype.handle = function (request) {
                            if (this.nextHandler) {
                                return this.nextHandler.handle(request);
                            }
                            return null;
                        };
                        return AbstractHandler;
                    }());

                    //daily handler
                    var DailyHandler = /** @class */ (function (_super) {
                        __extends(DailyHandler, _super);
                        function DailyHandler() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        DailyHandler.prototype.handle = function (request) {
                            if (request === 'Daily') {
                                vm.dailyTasks = resultArray;
                                return 'Daily handler took care of your ' + request + ' tasks!';
                            }
                            return _super.prototype.handle.call(this, request);
                        };
                        return DailyHandler;
                    }(AbstractHandler));

                    //scheduled handler
                    var ScheduledHandler = /** @class */ (function (_super) {
                        __extends(ScheduledHandler, _super);
                        function ScheduledHandler() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        ScheduledHandler.prototype.handle = function (request) {
                            if (request === 'Scheduled') {
                                vm.scheduledTasks = resultArray;
                                return 'Scheduled handler took care of your ' + request + ' tasks!';
                            }
                            return _super.prototype.handle.call(this, request);
                        };
                        return ScheduledHandler;
                    }(AbstractHandler));

                    //classic handler
                    var ClassicHandler = /** @class */ (function (_super) {
                        __extends(ClassicHandler, _super);
                        function ClassicHandler() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        ClassicHandler.prototype.handle = function (request) {
                            if (request === 'Classic') {
                                vm.classicTasks = resultArray;
                                return 'Classic handler took care of your ' + request + ' tasks!';
                            }
                            return _super.prototype.handle.call(this, request);
                        };
                        return ClassicHandler;
                    }(AbstractHandler));

                    //
                    function writeData(handler, taskType) {
                        var result = handler.handle(taskType);
                        console.log(result);
                    }
                    var handlerA = new DailyHandler();
                    var handlerB = new ScheduledHandler();
                    var handlerC = new ClassicHandler();
                    handlerA.setNext(handlerB).setNext(handlerC);

                    //write data
                    writeData(handlerA, type);
                });
        },
        deadliner() {
            var vm = this;
            var extra = true;
            let today = new Date();
            let dd = today.getDate();
            let mm = today.getMonth()+1; //January is 0!
            let yyyy = today.getFullYear();
            if (dd<10) {
                dd = '0'+dd
            } 
            if (mm<10) {
                mm = '0'+mm
            }
            today = yyyy + '-' + mm + '-' + dd;

            var ScheduledSubject = /** @class */ (function () {
                function ScheduledSubject() {
                    this.observers = [];
                }
                ScheduledSubject.prototype.attach = function (observer) {
                    console.log('Subject: Attached an observer.');
                    this.observers.push(observer);
                };
                ScheduledSubject.prototype.detach = function (observer) {
                    var observerIndex = this.observers.indexOf(observer);
                    this.observers.splice(observerIndex, 1);
                    console.log('Subject: Detached an observer.');
                };
                ScheduledSubject.prototype.notify = function () {
                    console.log('Subject: Notifying observers...');
                    for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
                        var observer_1 = _a[_i];
                        observer_1.update(this);
                    }
                };
                ScheduledSubject.prototype.announceDate = function () {
                    for (let i = 0; i < vm.scheduledTasks.length; i++) {
                            this.number = i;
                            this.date = vm.scheduledTasks[i].date;
                            console.log('Subject: My date is:', this.date);
                            this.notify();
                    }
                };
                return ScheduledSubject;
            }());
            var ScheduledObserver = /** @class */ (function () {
                function ScheduledObserver() {
                }
                ScheduledObserver.prototype.update = function (subject) {
                    if (subject.date === today) {
                        console.log('Scheduled Observer: Hey, this one is due today!', vm.scheduledTasks[subject.number].text);
                        extra = false;
                        alert("You have a task due today! Don't forget about " + vm.scheduledTasks[subject.number].text);
                    }
                };
                return ScheduledObserver;
            }());
            var subject = new ScheduledSubject();
            var observer = new ScheduledObserver();
            subject.attach(observer);
            subject.announceDate();
            if (extra) {
                alert("No tasks due today!");
            }
            subject.detach(observer);
        },

        daybreak(event) {
            var vm = this;
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
            var Daybreaker = /** @class */ (function () {
                function Daybreaker(c1, c2) {
                    this.component1 = c1;
                    this.component1.setMediator(this);
                    this.component2 = c2;
                    this.component2.setMediator(this);
                }
                Daybreaker.prototype.notify = function (sender, event) {
                    if (event === 'Button') {
                        console.log('Mediator triggers the daybreak in the components');
                        this.component2.daybreak();
                    }
                    else if (event === 'Task') {
                        console.log('Daybreak was successful');
                    }
                };
                return Daybreaker;
            }());
            var BaseComponent = /** @class */ (function () {
                function BaseComponent(mediator) {
                    if (mediator === void 0) { mediator = null; }
                    this.mediator = mediator;
                }
                BaseComponent.prototype.setMediator = function (mediator) {
                    this.mediator = mediator;
                };
                return BaseComponent;
            }());
            var ButtonComponent = /** @class */ (function (_super) {
                __extends(ButtonComponent, _super);
                function ButtonComponent() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ButtonComponent.prototype.triggerDaybreak = function () {
                    console.log('Button component starts the daybreak');
                    this.mediator.notify(this, 'Button');
                };
                return ButtonComponent;
            }(BaseComponent));
            var TaskComponent = /** @class */ (function (_super) {
                __extends(TaskComponent, _super);
                function TaskComponent() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                TaskComponent.prototype.daybreak = function () {
                    console.log('Task component performs daybreak.');
                    vm.switchDay = event;
                    this.mediator.notify(this, 'Task');
                };
                return TaskComponent;
            }(BaseComponent));
            var c1 = new ButtonComponent();
            var c2 = new TaskComponent();
            var mediator = new Daybreaker(c1, c2);
            c1.triggerDaybreak();
            alert('A new day has begun! Click fetch to see your dailies updated');
        },
        addNew(newType) {
            eventBus.$emit('type incoming', newType);
        }       
    }
}
</script>