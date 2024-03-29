import {
    addTaskTC,
    changeTaskAC,
    removeTaskTC,
    tasksReducer,
    TasksType
} from "../reducers/tasks-reducer";
import {addTodoListTC, removeTodoListTC} from "../reducers/todo-lists-reducer";
import {TaskPriorities, TaskStatuses} from "../../api/todolistAPI";
import {v1} from "uuid";

let startState: TasksType

beforeEach(() => {
    startState = {
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                status: TaskStatuses.New,
                description: "",
                todoListId: "todolistId1",
                startDate: "",
                deadline: "",
                addedDate: "",
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: "idle"
            },
            {
                id: "2",
                title: "JS",
                status: TaskStatuses.Completed,
                description: "",
                todoListId: "todolistId1",
                startDate: "",
                deadline: "",
                addedDate: "",
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: "idle"
            },
            {
                id: "3",
                title: "React",
                status: TaskStatuses.New,
                description: "",
                todoListId: "todolistId1",
                startDate: "",
                deadline: "",
                addedDate: "",
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: "idle"
            }
        ],
        "todolistId2": [
            {
                id: "1",
                title: "bread",
                status: TaskStatuses.New,
                description: "",
                todoListId: "todolistId1",
                startDate: "",
                deadline: "",
                addedDate: "",
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: "idle"
            },
            {
                id: "2", title: "milk",
                status: TaskStatuses.Completed,
                description: "",
                todoListId: "todolistId1",
                startDate: "",
                deadline: "",
                addedDate: "",
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: "idle"
            },
            {
                id: "3", title: "tea",
                status: TaskStatuses.New,
                description: "",
                todoListId: "todolistId1",
                startDate: "",
                deadline: "",
                addedDate: "",
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: "idle"
            }
        ]
    }
})

test("correct task should be deleted from correct array", () => {
    const param = {taskId: "2", todolistId: "todolistId2"}
    const action = removeTaskTC.fulfilled(param, "", param)

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                status: TaskStatuses.New,
                description: "",
                todoListId: "todolistId1",
                startDate: "",
                deadline: "",
                addedDate: "",
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: "idle"
            },
            {
                id: "2",
                title: "JS",
                status: TaskStatuses.Completed,
                description: "",
                todoListId: "todolistId1",
                startDate: "",
                deadline: "",
                addedDate: "",
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: "idle"
            },
            {
                id: "3",
                title: "React",
                status: TaskStatuses.New,
                description: "",
                todoListId: "todolistId1",
                startDate: "",
                deadline: "",
                addedDate: "",
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: "idle"
            }
        ],
        "todolistId2": [
            {
                id: "1",
                title: "bread",
                status: TaskStatuses.New,
                description: "",
                todoListId: "todolistId1",
                startDate: "",
                deadline: "",
                addedDate: "",
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: "idle"
            },
            {
                id: "3",
                title: "tea",
                status: TaskStatuses.New,
                description: "",
                todoListId: "todolistId1",
                startDate: "",
                deadline: "",
                addedDate: "",
                order: 0,
                priority: TaskPriorities.Low,
                entityStatus: "idle"
            }
        ]
    })
})


test("correct task should be added to correct array", () => {

    const task = {
        id: v1(),
        title: "juce",
        status: TaskStatuses.New,
        description: "",
        todoListId: "todolistId2",
        startDate: "",
        deadline: "",
        addedDate: "",
        order: 0,
        priority: TaskPriorities.Low
    }
    const param = {todolistId: "todolistId2", title: "juce"}

    const action = addTaskTC.fulfilled({task}, "", param)

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3)
    expect(endState["todolistId2"].length).toBe(4)
    expect(endState["todolistId2"][0].id).toBeDefined()
    expect(endState["todolistId2"][0].title).toBe("juce")
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New)
})

test("status of specified task should be changed", () => {

    const action = changeTaskAC({
        id: "2",
        domainModel: {
            status: TaskStatuses.New
        },
        todolistId: "todolistId2"
    })

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New)
    expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed)
})


test("title of specified task should be changed", () => {

    const action = changeTaskAC({
        id: "3",
        domainModel: {
            title: "coffee"
        },
        todolistId: "todolistId2"
    })

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][2].title).toBe("coffee")
    expect(endState["todolistId1"][2].title).toBe("React")
})


test("new array should be added when new todolist is added", () => {

    const action = addTodoListTC.fulfilled({
            todolist: {
                id: "New todolist",
                title: "What to learn",
                addedDate: "",
                order: 0
            }
        }, "", "What to learn"
    )

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
})


test("property with todolistId should be deleted", () => {

    const action = removeTodoListTC.fulfilled({todolistId: "todolistId2"}, "", "todolistId2")

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState["todolistId2"]).not.toBeDefined()
})
