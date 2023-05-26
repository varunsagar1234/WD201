const express = require("express");
const app = express();
var csrf = require("tiny-csrf");
const path = require("path");
const flash = require("connect-flash");
const { Todo, User } = require("./models");
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

app.set("view engine", "ejs");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
//const { Hash } = require("crypto");
const saltRounds = 10;
app.set("views", path.join(__dirname, "views"));
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my-super-secret-key-217567893454",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ where: { email: username } })
        .then(async function (user) {
          console.log("password", user.password);
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid password" });
          }
        })

        .catch((error) => {
          console.log(error);
          return done(null, false, { message: "Invalid Email-Id" });
        });
    }
  )
);
passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id);
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

app.get("/", async (request, response) => {
  response.render("index", {
    title: "Todo application",
    csrfToken: request.csrfToken(),
  });
});

app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    //const allTodos = await Todo.getTodos(loggedInUser);
    const loggedInUser = request.user.id;
    //console.log("id is ",loggedInUser);
    const overduelist = await Todo.overdue(loggedInUser);
    const duetodaylist = await Todo.dueToday(loggedInUser);
    const duelaterlist = await Todo.dueLater(loggedInUser);
    const complete = await Todo.getcompletedlist(loggedInUser);
    //const completed=await Todo.completed();
    if (request.accepts("html")) {
      response.render("todo", {
        title: "Todo application",
        //allTodos,
        overduelist,
        duetodaylist,
        duelaterlist,
        complete,
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({
        //allTodos,
        overduelist,
        duetodaylist,
        duelaterlist,
        complete,
      });
    }
  }
);
app.get("/signup", (request, response) => {
  response.render("signup", {
    title: "Signup",
    csrfToken: request.csrfToken(),
  });
});
app.post("/users", async (request, response) => {
  //Hash password using bcrypt
  const firstname = request.body.firstName;
  const mail = request.body.email;
  const pswd = request.body.password;
  if (!firstname) {
    request.flash("error", "please enter firstname!. It is mandatory");
    return response.redirect("/signup");
  }
  if (!mail) {
    request.flash("error", "please enter mail-id!. It is mandatory");
    return response.redirect("/signup");
  }
  if (!pswd) {
    request.flash("error", "please enter valid password!.It is mandatory");
    return response.redirect("/signup");
  }
  if (pswd.length < 5) {
    request.flash("error", "password must be alteast 5 characters");
    return response.redirect("/signup");
  }
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
  console.log(hashedPwd);

  //console.log("firstname", request.body.firstName);
  try {
    const user = await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashedPwd,
    });
    request.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      response.redirect("/todos");
    });
  } catch (error) {
    console.log(error);
    request.flash("error", error.message);
    return response.redirect("/signup");
  }
});
app.get("/login", (request, response) => {
  response.render("login", { title: "Login", csrfToken: request.csrfToken() });
});
// app.post(
//   "/session",
//   passport.authenticate("local", { failureRedirect: "/login" }),
//   (request, response) => {
//     console.log(request.user);
//     response.redirect("/todos");
//   }
// );
app.get("/signout", (request, response, next) => {
  request.logout((err) => {
    if (err) {
      return next(err);
    }
    response.redirect("/");
  });
});
app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (request, response) {
    console.log(request.user);
    response.redirect("/todos");
  }
);

app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async function (_request, response) {
    console.log("Processing list of all Todos ...");
    // FILL IN YOUR CODE HERE

    // First, we have to query our PostgerSQL database using Sequelize to get list of all Todos.
    // Then, we have to respond with all Todos, like:
    // response.send(todos)
    try {
      const todo = await Todo.findAll();
      return response.json(todo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

// app.get("/todos/:id", connectEnsureLogin.ensureLoggedIn(),async function (request, response) {
//   try {
//     const todo = await Todo.findByPk(request.params.id);
//     return response.json(todo);
//   } catch (error) {
//     console.log(error);
//     return response.status(422).json(error);
//   }
// });

app.post(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log(request.user);
    try {
      await Todo.addTodo({
        title: request.body.title,
        dueDate: request.body.dueDate,
        userId: request.user.id,
      });
      return response.redirect("/todos");
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.put(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    const todo = await Todo.findByPk(request.params.id);
    try {
      const updatedTodo = await todo.setCompletionStatus(
        request.body.completed
      );
      return response.json(updatedTodo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.delete(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log("We have to delete a Todo with ID: ", request.params.id);
    // FILL IN YOUR CODE HERE

    // First, we have to query our database to delete a Todo by ID.
    // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
    // response.send(true)
    try {
      await Todo.remove(request.params.id, request.user.id);
      return response.json(true);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

module.exports = app;
