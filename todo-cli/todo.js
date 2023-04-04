/* eslint-disable no-undef */
const todoList = () => {
  all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    arr = [];
    for (const time of all) {
      if (new Date(today) > new Date(time.dueDate)) {
        arr.push(time);
      }
      //console.log(arr)
    }
    return arr;
    // Write the date check condition here and return the array
    // of overdue items accordingly.
  };

  const dueToday = () => {
    return all.filter((todos) => today == todos.dueDate);
    // Write the date check condition here and return the array
    // of todo items that are due today accordingly.
  };

  const dueLater = () => {
    return all.filter((todos) => today < todos.dueDate);
    // Write the date check condition here and return the array
    // of todo items that are due later accordingly.
  };

  const toDisplayableList = (list) => {
    // Format the To-Do list here, and return the output string
    // as per the format given above.

    let c = "";
    let d = "";
    let s = "";
    for (const time of list) {
      if (time.completed) {
        c = "[x]";
      } else {
        c = "[ ]";
      }
      if (time.dueDate == today) {
        d = " ";
      } else {
        d = time.dueDate;
      }
      const w = time.title;
      s = s + c;
      s = s + " ";
      s = s + w;
      s = s + " ";
      s = s + d;
      s = s + "\n";
      //console.log(s)
    }

    return s.trim();
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};
module.exports = todoList;
