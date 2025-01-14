import { useLoaderData } from "@remix-run/react";
import {
    Stack,
    Title,
    Space,
  } from "@mantine/core";

import Task from "../components/TaskList/Task";
import { addTask, deleteTask, getAllTasks, TaskType } from "data/tasks";
import TaskListHeader from "../components/TaskList/TaskListHeader/TaskListHeader";
import NewTask from "../components/TaskList/NewTask/NewTask";
import { useState } from "react";


export async function loader() {
    const allTasks = await getAllTasks()
    return Response.json({tasks: allTasks})
}
  
export async function action({ request }: {request: Request}) {

    if (request.method === "POST") {
        const formData = await request.formData();
        // console.log(formData)
        const title = formData.get('title') as string
        const state = formData.get('state') as string
        const owner = formData.get('owner') as string
        const description = formData.get('description') as string

        if (!title || !state || !owner || !description) {
            return Response.json(
                { error: "some fields are missing"},
                { status: 400 }
            )
        }

        const newTask = {
            title,
            state,
            owner,
            description
        }

        addTask(newTask)

        return null
    }

    if (request.method === "DELETE") {
        const formData = await request.formData();
        const taskId= formData.get('taskId')
        await deleteTask(taskId)
        
        return null
    }
    return null
    
}
  
export default function TaskListRoute() {
    const { tasks } = useLoaderData<typeof loader>()

    const [ displayNewTask, setDisplayNewTask ] = useState<boolean>(false)
    const [ titleFilter, setTitleFilter ] = useState<string>("")
    const [ stateFilter, setStateFilter ] = useState<string>("")
    const [ ownerFilter, setOwnerFilter ] = useState<string>("")

    return (
    <Stack maw={800} mr="auto" pt={20} pl={24} justify="center">
        <Title>Welcome to the Kiosk tasklist!</Title>
        <Space />
        <Title order={2}>Tasklist</Title>

            <TaskListHeader 
                setDisplayNewTask={setDisplayNewTask} 
                setTitleFilter={setTitleFilter}
                setStateFilter={setStateFilter}
                setOwnerFilter={setOwnerFilter}
            />

        {displayNewTask && 
            <NewTask setDisplayNewTask={setDisplayNewTask} />
        }

        <div>
        {!displayNewTask && 
                tasks
                .filter((task: TaskType) =>{
                    return task.title.includes(titleFilter);
                })
                .filter((task: TaskType) => {
                    return task.state.includes(stateFilter);
                })
                .filter((task: TaskType) => {
                    return task.owner.includes(ownerFilter);
                })
                .map((task: TaskType, index: number) => {
                    return <Task key={index} task={task} index={index}/>
                })
        }
        </div>      
        
        <Space h="200" />
    </Stack>
    )
}