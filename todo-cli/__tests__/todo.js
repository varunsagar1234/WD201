/* eslint-disable no-undef */
const todoList = require("../todo");
const pDay = 60 * 60 * 24 * 1000; /*per day*/
const fDay = new Date();

const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();
describe("TodoList Test Suite", () => {
  beforeAll(() => {
    [
      {
        title: "Buy milk",
        completed: false,
        dueDate: new Date(fDay.getTime() - 2 * pDay).toISOString().slice(0, 10),
      },
      {
        title: "Pay Rent",
        completed: false,
        dueDate: new Date().toISOString().slice(0, 10),
      },
      {
        title: "Submit Assignment",
        completed: false,
        dueDate: new Date(fDay.getTime() + 2 * pDay).toISOString().slice(0, 10),
      },
    ].forEach(add);
  });
  test("Should add new todo", () => {
    const count = all.length;
    add({
      title: "test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    expect(all.length).toEqual(count + 1);
  });
  test("Should mark a todo as complete", () => {
    const todocount = all.length;
    add({
      title: "test todo completed",
      completed: false,
      dueDate: new Date(fDay.getTime() - 2 * pDay).toISOString().slice(0, 10),
    });
    expect(all[todocount].completed).toBe(false);
    markAsComplete(todocount);
    expect(all[todocount].completed).toBe(true);
  });
  test("retrieving overdue items", () => {
    const overDueCount = overdue().length;
    add({
      title: "test overdue",
      completed: false,
      dueDate: new Date(fDay.getTime() - 2 * pDay).toISOString().slice(0, 10),
    });
    expect(overdue().length).toEqual(overDueCount + 1);
  });
  test("retrieving dueToday items", () => {
    const dueTodayCount = dueToday().length;
    add({
      title: "test dueToday",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    expect(dueToday().length).toEqual(dueTodayCount + 1);
  });
  test("retrieving dueLater items", () => {
    const dueLaterCount = dueLater().length;
    add({
      title: "test dueToday",
      completed: false,
      dueDate: new Date(fDay.getTime() + 2 * pDay).toISOString().slice(0, 10),
    });
    expect(dueLater().length).toEqual(dueLaterCount + 1);
  });
});
