const editForm = document.getElementById("taskEditor")
const editformTaskID = document.getElementById('currentlyEditingTaskID')
const taskUl = document.getElementById("taskList")

function editTask(taskID)
{
    editForm.style.display = 'flex'

    let task_id = document.getElementById(taskID)

    editformTaskID.value = taskID
}
