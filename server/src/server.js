const http = require("http");

const app = require("./app");
const connect = require("./database/sql.connect");

const User = require("./models/user");

const PORT = 8000;

const server = http.createServer(app);

function startServer() {
  connect(async () => {
    await User.sync({ force: true });

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

startServer();
