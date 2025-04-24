import fs from "node:fs";
import { parse } from "csv-parse";

const tasksFilePath = new URL("./tasks.csv", import.meta.url);

const processFile = async () => {
  const records = [];
  const parser = fs.createReadStream(tasksFilePath).pipe(
    parse({
      delimiter: ",",
      skipEmptyLines: true,
      fromLine: 2,
    })
  );
  
  for await (const record of parser) {
    const [title, description] = record;

    await fetch("http://localhost:3333/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });
    records.push(record);
  }
  return records;
};

(async () => {
  const records = await processFile();
  console.info(records);
})();
