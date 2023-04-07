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
    // Write the date check condition here and return the array of overdue items accordingly.
    // FILL YOUR CODE HERE
    return all.filter(
      (todos) => new Date().toISOString().slice(0, 10) > todos.dueDate
    );
  };

  const dueToday = () => {
    // Write the date check condition here and return the array of todo items that are due today accordingly.
    // FILL YOUR CODE HERE
    return all.filter(
      (todos) => new Date().toISOString().slice(0, 10) == todos.dueDate
    );
  };

  const dueLater = () => {
    // Write the date check condition here and return the array of todo items that are due later accordingly.
    // FILL YOUR CODE HERE
    return all.filter(
      (todos) => new Date().toISOString().slice(0, 10) < todos.dueDate
    );
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
