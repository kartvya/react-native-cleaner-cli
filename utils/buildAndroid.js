import { spawnSync } from "child_process";
import fs from "fs";
import ora from "ora";
import path from "path";
import { handleGradleError } from "../helpers/handleGradleError.js";

function runGradleCommand(command, cwd) {
  const gradle = spawnSync("./gradlew", [command], {
    cwd,
    encoding: "utf-8",
    shell: true,
  });

  return {
    success: gradle.status === 0,
    stdout: gradle.stdout,
    stderr: gradle.stderr,
    error: gradle.error,
  };
}

export async function buildAndroid() {
  const androidDir = path.join(process.cwd(), "android");
  const gradlewPath = path.join(androidDir, "gradlew");

  // Check if gradlew exists
  if (!fs.existsSync(gradlewPath)) {
    console.error(
      "❌ gradlew not found in android/. Are you in a React Native project?"
    );
    return;
  }

  // Ensure gradlew is executable
  try {
    fs.accessSync(gradlewPath, fs.constants.X_OK);
  } catch (err) {
    console.log("🔧 gradlew is not executable. Fixing permissions...");
    try {
      fs.chmodSync(gradlewPath, 0o755);
      console.log("✅ gradlew is now executable.");
    } catch (chmodError) {
      console.error(
        "❌ Failed to make gradlew executable:",
        chmodError.message
      );
      return;
    }
  }

  const cleanSpinner = ora("Running ./gradlew clean...").start();
  const cleanResult = runGradleCommand("clean", androidDir);

  if (cleanResult.success) {
    cleanSpinner.succeed("✅ Clean complete!");
  } else {
    cleanSpinner.fail("❌ Clean failed.");
    const fixStatus = await handleGradleError(
      cleanResult.stderr || cleanResult.stdout
    );
    if (fixStatus === "FIXED") {
      console.log("🔁 Retrying clean after fix...");
      return buildAndroid(); // Retry
    }
    return;
  }

  // Build step
  const buildSpinner = ora(
    "📦 Building APK with ./gradlew assembleRelease..."
  ).start();

  const buildResult = runGradleCommand("assembleRelease", androidDir);

  if (buildResult.success) {
    buildSpinner.succeed("✅ Build complete!");
  } else {
    buildSpinner.fail("❌ Build failed.");
    const fixStatus = await handleGradleError(
      buildResult.stderr || buildResult.stdout
    );
    if (fixStatus === "FIXED") {
      console.log("🔁 Retrying build after fix...");
      return buildAndroid(); // Retry
    }
    return;
  }
}
