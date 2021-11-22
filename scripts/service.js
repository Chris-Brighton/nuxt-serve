const fs = require("fs");
const { service, model } = require("./template/service");

function checkPath(path) {
  return fs.existsSync(path);
}

function makeDir(path) {
  if (!checkPath(path)) {
    try {
      fs.mkdirSync(path);
    } catch (ex) {}
  }
}

function makeFile(path, name, ext, data) {
  if (checkPath(path)) {
    const file = `${path}/${name}.${ext}`;
    try {
      fs.writeFileSync(file, data, { encoding: "utf8" });
    } catch (ex) {}
  }
}

const name = {
  js: "",
  text: "",
  db: "",
};

const unformattedName = process.argv[2];

const words = unformattedName.split(" ").join("").split("-");
for (let i = 1; i < words.length; i++) {
  words[i] = words[i][0].toUpperCase() + words[i].substr(1);
}
name.js = words.join("");

name.text = unformattedName.split(" ").join("");

name.db = unformattedName.split(" ").join("").split("-").join("_");

const fields = [];
if (process.argv.length > 3) {
  for (let i = 3; i < process.argv.length; i++) {
    fields.push(process.argv[i]);
  }
}

const path = `${process.env.PWD}/server/services/${name.text}`;
makeDir(path);
makeFile(path, "index", "js", service(name));
makeFile(path, "model", "js", model(name));
