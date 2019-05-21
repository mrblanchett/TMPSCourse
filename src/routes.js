import Home from './components/Home.vue'
import TaskAdder from './components/tasks/TaskAdder.vue'
import TaskBox from './components/tasks/TaskBox.vue'
import MottoEditor from './components/tasks/MottoEditor.vue'

export const routes = [
    { path: '/', component: TaskBox },
    { path: '/add', component: TaskAdder },
    { path: '/motto', component: MottoEditor }
];