import { createApp } from "./app.js";

const port = 3001;
const app = createApp();

app.listen(port, "127.0.0.1", () => {
  process.stdout.write(`api listening on ${port}\n`);
});
