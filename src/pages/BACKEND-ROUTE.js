router.post("/social-auth", (req, res, next) => {
    const { email, password } = req.body;
  
    User.findOne({ email: email })
      .then((foundUser) => {
        if (foundUser) {
          //If user already created, login the user
          const passwordCorrect = bcrypt.compareSync(
            password,
            foundUser.password
          );
  
          if (passwordCorrect) {
            const { _id, email } = foundUser;
            const payload = { _id, email };
  
            const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
              algorithm: "HS256",
              expiresIn: "6h",
            });
  
            res.status(200).json({ authToken: authToken });
          }
          return;
        }
        //If no user found, create the user and login
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        return User.create({ email: email, password: hashedPassword });
      })
      .then((createdUser) => {
        const { email, _id } = createdUser;
        const user = { email, _id };
  
        const authToken = jwt.sign(user, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });
  
        res.status(200).json({ authToken: authToken });
      })
      .catch((err) => next(err));
  });