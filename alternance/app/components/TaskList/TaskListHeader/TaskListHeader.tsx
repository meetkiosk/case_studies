import classes from "./TaskListHeader.module.css";
import { Dispatch, SetStateAction } from "react";


export default function TaskListHeader({ 
    setDisplayNewTask, 
    setTitleFilter, 
    setStateFilter, 
    setOwnerFilter
}: { 
    setDisplayNewTask: Dispatch<SetStateAction<boolean>>
    setTitleFilter: Dispatch<SetStateAction<string>>
    setStateFilter: Dispatch<SetStateAction<string>>
    setOwnerFilter: Dispatch<SetStateAction<string>>
}) {

  const handleNewTaskClick = () => {
    setDisplayNewTask(true)
  }
  
  return (
    <>        
        <div className={classes["tasklist-header__main-container"]}>
            <div className={classes["tasklist-header__container"]}>
            <button onClick={handleNewTaskClick} className={classes["tasklist-header___button"]}>+</button>
            <div className={classes["tasklist-header__filter-container"]}>
                <input onChange={(e) => setTitleFilter(e.target.value)} type="text" className={classes["tasklist-header__filter-input"]} placeholder="enter a title..." />
                <input onChange={(e) => setStateFilter(e.target.value)} type="text" className={classes["tasklist-header__filter-input"]} placeholder="enter a state..."/>
                <input onChange={(e) => setOwnerFilter(e.target.value)} type="text" className={classes["tasklist-header__filter-input"]} placeholder="enter an owner..."/>
            </div>
            </div>
        </div>

    </>
  )
}