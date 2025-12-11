import UsersDao from "./dao.js";
export default function UserRoutes(app) {
app.get("/api/users/create-test", async (req, res) => {
  try {
    const existing = await dao.findUserByUsername("testuser");
    if (existing) {
      return res.json({ 
        message: "Test user already exists", 
        user: existing 
      });
    }
    
    const testUser = {
      username: "testuser",
      password: "testpass",
      firstName: "Test",
      lastName: "User",
      role: "STUDENT",
      email: "test@test.com"
    };
    
    const user = await dao.createUser(testUser);
    res.json({ 
      message: "Test user created successfully!", 
      user: user 
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});

 const dao = UsersDao();
  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };

  const deleteUser = async (req, res) => {
      const status = await dao.deleteUser(req.params.userId);
      res.json(status);
  };
  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }

    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }

    const users = await dao.findAllUsers();
    res.json(users);
  };
  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };


  const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    const currentUser = req.session["currentUser"];
   if (currentUser && currentUser._id === userId) {
     req.session["currentUser"] = { ...currentUser, ...userUpdates };
   }
    res.json(currentUser);
   };

  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json(
        { message: "Username already in use" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
   };

  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
    res.json(currentUser);
   } else {
    res.status(401).json({ message: "Unable to login. Try again later." });
   }
};

  const signout = async (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
   };

  const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    res.json(currentUser);
   };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}
