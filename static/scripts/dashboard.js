editForm = document.getElementById("taskEditor")
formTaskID = document.getElementsByName('task_idx')[0]
taskUl = document.getElementById("taskList")

function editTask(taskName)
{
    editForm.style.display = 'flex'

    names = Array.from(taskUl.getElementsByTagName("strong"))
    nameArray = names.map(element => element.innerText);

    formTaskID.value = nameArray.indexOf(taskName)
}
