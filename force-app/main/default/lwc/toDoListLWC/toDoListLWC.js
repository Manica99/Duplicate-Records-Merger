import { LightningElement, track, wire } from 'lwc';
import getTasks from'@salesforce/apex/TodoTaskController.getTasks';
import insertTask from'@salesforce/apex/TodoTaskController.insertTask';
import deleteTask from'@salesforce/apex/TodoTaskController.deleteTask';
import { refreshApex } from '@salesforce/apex';

export default class ToDoListLWC extends LightningElement {

    @track
    todoTasks = []

    todoTasksResponse;

    processing = true;

    newTask = '';

    updateTask(event){
        // console.log(event.target.value);
        this.newTask = event.target.value;
    }

    addTaskToList(event){

        this.processing = true;
        insertTask({ subject: this.newTask })
        .then(result => {
            if(this.newTask !=''){
                this.todoTasks.push({
                    id: this.todoTasks.length + 1,
                    name: this.newTask,
                    recordId: result.Id
                })
                this.newTask = '';
        }
        } )
        .catch(error => {
            console.log(error);
        })
        .finally(()=> this.processing = false);

        
        // console.log(this.todoTasks);
        
    }

    deleteFromList(event){
        let idToDelete = event.target.name;
        let todoTasks = this.todoTasks;
        let todoTaskIndex;
        let todoTaskId ;

        this.processing = true;
        

        for(let i=0; i<todoTasks.length; i++){
            if(idToDelete === todoTasks[i].id){
                todoTaskIndex = i;
                todoTaskId = todoTasks[i].recordId;
                break;
            }
        }

        deleteTask({recordId: todoTaskId})
        .then(result => this.todoTasks.splice(todoTaskIndex, 1))
        .catch(error => console.log(error))
        .finally(()=> this.processing = false);


        

        // todoTasks.splice(
        //     todoTasks.findIndex(function(todoTask){
        //         return todoTask.id === idToDelete;
        //     })
        //     , 1
        // );
     }

    @wire(getTasks)
     getTodoTasks(response){
        this.todoTasksResponse = response;
        let data = response.data;
        let error = response.error;

        if(data || error){
            this.processing = false;
        }

        if(data){
            this.todoTasks = [];
            data.forEach(task => {
                this.todoTasks.push({
                    id: this.todoTasks.length + 1,
                    name: task.Subject,
                    recordId: task.Id
                })
            });
        }
     }

     refreshTodoList(){
        this.processing = true;
        refreshApex(this.todoTasksResponse)
        .finally(()=> this.processing = false);
     }

}