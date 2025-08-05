const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
	res.json({
		message: "API is running!",
		status: "healthy",
	});
});

app.get("/health", (req, res) => {
	res.json({
		status: "healthy",
	});
});

app.get("/test", (req, res) => {
	res.json({
		message: "Test endpoint working!",
		status: "success",
	});
});

app.listen(port, "0.0.0.0", () => {
	console.log(`Server running on port ${port}`);
});
