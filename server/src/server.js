const http = require("http");

const app = require("./app");
const { connect } = require("./database/sql.connect");

const { createTables } = require("./models/index");

const PORT = 8000;

const server = http.createServer(app);

function startServer() {
  connect(async () => {
    // add true parameter to force recreation of all tables
    await createTables();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

startServer();
