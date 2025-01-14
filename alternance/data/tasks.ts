export type TaskType = {
    id: number
    title: string
    state: string
    owner: string
    description: string
}
import prisma from "./prisma"

export const addTask = async (task: TaskType) => {
    try {
        const savedTask = await prisma.task.create({
            data: {
                title: task.title,
                state: task.state,
                owner: task.owner,
                description: task.description
            }
        })

        return Response.json(
            { success: true, data: savedTask },
            { status: 201 }
        )
    } catch (error) {
        console.log("error while creating task: ", error)
    }
}

export const getAllTasks = async () => {
    try {
        const allTasks = await prisma.task.findMany({
            select: {
                id: true,
                title: true,
                state: true,
                owner: true,
                description: true
            }
        })


        return allTasks

    } catch (error) {
        console.log('error while getting all tasks: ', error)
    }
}

export const deleteTask = async (taskId: number) => {
    try {
        const deletedTask = await prisma.task.delete({
            where: {
                id: Number(taskId)
            }
        })

        console.log("deleted task: ", deletedTask)
    } catch (error) {
        console.log('error while deleting task: ', error)
    }
}