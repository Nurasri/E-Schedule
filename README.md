{
"nama": "Admin Utama",
"email": "admin@gmail.com",
"password": "Admin123"
}

source test token
// app.get("/test-token", (req, res) => {
// const authHeader = req.headers.authorization;

// if (!authHeader) {
// return res.status(401).json({
// message: "Token tidak ada",
// });
// }

// const token = authHeader.split(" ")[1];

// try {
// const decoded = jwt.verify(token, process.env.JWT_SECRET);

// res.json({
// valid: true,
// data: decoded,
// });
// } catch (error) {
// res.status(401).json({
// valid: false,
// message: "Token tidak valid",
// });
// }
// });

// app.get("/test-db", async (req, res) => {
// try {
// const [rows] = await db.query("SELECT NOW() AS waktu");

// res.json({
// status: "success",
// database: "connected",
// result: rows,
// });
// } catch (error) {
// res.status(500).json({
// status: "error",
// message: error.message,
// });
// }
// });
