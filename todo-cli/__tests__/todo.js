/* eslint-disable no-undef */
const todoList = require("../todo");

const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();
describe("TodoList Test Suite", () => {
  beforeAll(() => {
    const pDay = 60 * 60 * 24 * 1000; /*per day*/
    const fDay = new Date();

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
    expect(all.length).toBe(3);
    add({
      title: "test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    expect(all.length).toBe(4);
  });
  test("Should mark a todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
  test("retrieving overdue items", () => {
    expect(overdue().length).toBe(1);
  });
  test("retrieving dueToday items", () => {
    expect(dueToday().length).toBe(2);
  });
  test("retrieving dueLater items", () => {
    expect(dueLater().length).toBe(1);
  });
});
