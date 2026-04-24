const bcrypt = require("bcrypt");
const pool = require("../db");
const { generateToken } = require("../utils/jwt");


exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, email, role",
    [name, email, hashedPassword]
  );

  res.json({ user: result.rows[0] });
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  const userResult = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  const user = userResult.rows[0];
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid password" });

  const token = generateToken(user);

  res.json({ token });
};