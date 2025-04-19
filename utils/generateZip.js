import { execSync } from "child_process";
import path from "path";

export function generateZip() {
  const projectRoot = process.cwd();
  const zipName = path.basename(projectRoot) + ".zip";

  // Exclude heavy folders
  const exclude = ["node_modules", "ios/Pods", "android/.gradle", "*.zip"]
    .map((folder) => `--exclude=${folder}`)
    .join(" ");

  try {
    console.log("🗜️ Creating zip file...");
    execSync(`zip -r ${zipName} . ${exclude}`, {
      cwd: projectRoot,
      stdio: "inherit",
    });
    console.log(`✅ Zip created: ${zipName}`);
  } catch (error) {
    console.error("❌ Failed to create zip:", error.message);
  }
}
