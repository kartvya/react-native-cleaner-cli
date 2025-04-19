import fs from "fs";
import path from "path";

function deleteFolder(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log(`✅ Deleted: ${folderPath}`);
  } else {
    console.log(`ℹ️ Not Found: ${folderPath}`);
  }
}

export function cleanProject(
  targets = ["node_modules", "ios/Pods", "android/.gradle"]
) {
  if (targets.length === 0) {
    console.log("No folders selected for cleaning. Cleaning all by default.");
    targets = ["node_modules", "ios/Pods", "android/.gradle"];
  }

  targets.forEach((target) => {
    const fullPath = path.join(process.cwd(), target);
    deleteFolder(fullPath);
  });

  console.log("🧹 Cleaned up project folders!");
}
