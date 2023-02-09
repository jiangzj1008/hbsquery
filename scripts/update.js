const fs = require("fs");

function updateVersion() {
  const pkgPath = `./package.json`;
  const pkg = fs.readFileSync(pkgPath);
  const info = JSON.parse(pkg);
  const version = info.version.split(".").map((item) => Number(item));

  version[2] += 1;
  info.version = version.join(".");
  const newPkg = JSON.stringify(info, null, 2);

  fs.writeFileSync(pkgPath, newPkg);
}

function main() {
  updateVersion();
}

main();
