import { Form, useLoaderData } from "@remix-run/react";
import { Title } from "@mantine/core";
import classes from "./NewTask.module.css";
import { Dispatch, SetStateAction } from "react";


export default function NewTask({ setDisplayNewTask }: {setDisplayNewTask: Dispatch<SetStateAction<boolean>>}) {


  return (
    <>
        <Title order={3}>Create a new task</Title>
        <Form method="post" onSubmit={() => {setDisplayNewTask(false)}} >
            <div className={classes["new-task__container"]}>
                <div className={classes["new-task__field-container"]}>
                    <Title order={4}>Title</Title>
                    <input name="title" className={classes["new-task__field-input"]} type="text" />
                </div>

                <div className={classes["new-task__field-container"]}>
                    <Title order={4}>State</Title>
                    <div className={classes["new-task__radio-container"]}>
                        <div className={classes["new-task__radio-input"]}>
                            <label htmlFor="todo">Todo</label>
                            <input value="todo" name="state" id="todo" className={classes["new-task__field-input"]} type="radio" />
                        </div>
                        <div className={classes["new-task__radio-input"]}>
                            <label htmlFor="doing">Doing</label>
                            <input value="doing" name="state" id="doing" className={classes["new-task__field-input"]} type="radio" />
                        </div>
                        <div className={classes["new-task__radio-input"]}>
                            <label htmlFor="done">Done</label>
                            <input value="done" name="state" id="done" className={classes["new-task__field-input"]} type="radio" />
                        </div>
                    </div>
                </div>

                <div className={classes["new-task__field-container"]}>
                    <Title order={4}>Owner</Title>
                    <input name="owner" className={classes["new-task__field-input"]} type="text" />
                </div>

                <div className={classes["new-task__field-container"]}>
                    <Title order={4}>Description</Title>
                    <input name="description" className={classes["new-task__field-input"]} type="text" />
                </div>

                <button className={classes["new-task__button"]} type="submit">Create Task</button>

            </div>
        </Form>
    </>
  )

  
}