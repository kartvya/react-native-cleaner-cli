import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

export async function handleGradleError(errorOutput) {
  const msg = errorOutput || "";
  const mapPath = path.join(__dirname, "../erroConatiner/error-map.json");

  let handled = false;

  if (fs.existsSync(mapPath)) {
    const patterns = JSON.parse(fs.readFileSync(mapPath, "utf-8"));
    for (let pattern of patterns) {
      if (msg.includes(pattern.match)) {
        console.log(chalk.red(`❌ Matched Error:`), chalk.bold(pattern.match));
        console.log(chalk.yellow("💡 Suggestion:"), pattern.suggestion);

        if (pattern.fixCommand) {
          const { confirmFix } = await inquirer.prompt([
            {
              type: "confirm",
              name: "confirmFix",
              message: `⚙️  Do you want to auto-fix this issue?`,
              default: true,
            },
          ]);

          if (confirmFix) {
            const spinner = ora("Applying auto-fix...").start();
            try {
              execSync(pattern.fixCommand, { stdio: "inherit" });
              spinner.succeed("✅ Auto-fix successful!");
              return "FIXED";
            } catch (fixErr) {
              spinner.fail("❌ Auto-fix failed:");
              console.error(chalk.red(fixErr.message));
              return "FAILED_FIX";
            }
          } else {
            console.log(chalk.gray("🛑 Skipped auto-fix by user."));
            return "SKIPPED";
          }
        }

        handled = true;
        break;
      }
    }
  }

  if (!handled) {
    console.error(chalk.red("❌ Unknown error occurred:"));
    console.error(chalk.dim(msg));
    console.log(
      chalk.blueBright("💡 Try running manually:"),
      chalk.cyan("cd android && ./gradlew clean --stacktrace")
    );
  }

  return "UNHANDLED";
}
