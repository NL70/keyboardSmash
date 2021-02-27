const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { pool } = require("./config");
const path = require("path");
const booksRouter = express.Router();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

booksRouter.get("/", (req, res) => {
  pool.query("SELECT * FROM books", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json({ data: results.rows });
  });
});

booksRouter.delete("/:bookId", (req, res) => {
  const bookId = req.params.bookId;
  pool.query("DELETE FROM books WHERE id = $1", [bookId], (error) => {
    if (error) {
      throw error;
    }
    res.status(204).send();
  });
});

booksRouter.post("/", (req, res) => {
  const { author, title } = req.body;
  console.log(req.body);
  pool.query(
    "INSERT INTO books (author, title) VALUES ($1, $2)",
    [author, title],
    (error) => {
      if (error) {
        throw error;
      }
      res.status(201).json({ status: "success", message: "Book added." });
    }
  );
});

if (process.env.NODE_ENV !== "production") {
  const livereload = require("livereload");
  const connectLivereload = require("connect-livereload");

  // Reload browser when saving frontend code
  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(__dirname + "/public");

  // Reload the page when the server has started
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });

  app.use(connectLivereload());
}

// Static files
app.use(express.static("public"));

app.use("/books", booksRouter);

app.use("/mybooks", (req, res) => {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, "/public/myBooks.html"));
});

// Start server
app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening`);
});
