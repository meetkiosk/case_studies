import { Form } from "@remix-run/react";

import classes from "./Task.module.css";
import { useState } from "react";
import { TaskType } from "data/tasks";

export default function Task({ task, index }: { task: TaskType, index: number}) {
  
  const [ displayDescription, setDisplayDescription ] = useState<boolean>(false)

  return (
    <>
      <div className={classes["task__item-container"]}>
        <p className={classes["task__item"]}>{index}</p>
        <p className={classes["task__item"]}>{task.title}</p>
        <p className={classes["task__item"]}>{task.state}</p>
        <p className={classes["task__item"]}>{task.owner}</p>
        <button onClick={() => {setDisplayDescription(!displayDescription)}} className={classes["task__description-button"]}>{displayDescription ? "hide description" : "show description"}</button>
        
        <Form method="delete">
          <input type="hidden" name="taskId" value={task.id} />
          <button className={classes["task__delete-item"]} type="submit">X</button>
        </Form>
      </div>
      {displayDescription &&

      <div className={classes["task__description"]}>
        <p>Task description</p>
        <p>{task.description}</p>
      </div>

      }

    </>
  )

  
}