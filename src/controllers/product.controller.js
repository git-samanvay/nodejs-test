
const pool = require("../db");


exports.createProduct = async (req, res) => {
  const { name, price, category, stock } = req.body;

  const result = await pool.query(
    `INSERT INTO products (name, price, category, stock)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, price, category, stock]
  );

  res.json(result.rows[0]);
};

exports.getProducts = async (req, res) => {
  let {
    page = 1,
    limit = 10,
    category,
    minPrice,
    maxPrice,
    sortBy = "created_at",
    order = "DESC"
  } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;

  let query = `SELECT * FROM products WHERE 1=1`;
  let values = [];
  let index = 1;


  if (category) {
    query += ` AND category = $${index++}`;
    values.push(category);
  }

  if (minPrice) {
    query += ` AND price >= $${index++}`;
    values.push(minPrice);
  }

  if (maxPrice) {
    query += ` AND price <= $${index++}`;
    values.push(maxPrice);
  }

  const allowedSort = ["price", "created_at", "name"];
  if (!allowedSort.includes(sortBy)) sortBy = "created_at";

  const allowedOrder = ["ASC", "DESC"];
  if (!allowedOrder.includes(order.toUpperCase())) order = "DESC";

  query += ` ORDER BY ${sortBy} ${order}`;

  query += ` LIMIT $${index++} OFFSET $${index++}`;
  values.push(limit, offset);

  const result = await pool.query(query, values);

  res.json({
    page,
    limit,
    count: result.rows.length,
    data: result.rows
  });
};


exports.getProductById = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `SELECT * FROM products WHERE id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(result.rows[0]);
};


exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, category, stock } = req.body;

  const result = await pool.query(
    `UPDATE products
     SET name=$1, price=$2, category=$3, stock=$4
     WHERE id=$5 RETURNING *`,
    [name, price, category, stock, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(result.rows[0]);
};


exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    `DELETE FROM products WHERE id=$1 RETURNING *`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({ message: "Deleted successfully" });
};