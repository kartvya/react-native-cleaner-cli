# 🧹 React Native Cleaner CLI

A fast and smart command-line tool to clean heavy folders, build Android release APKs, and generate zip files for sharing — specially built for **React Native** developers.

---

## ⚙️ Features

- 🧼 Clean `node_modules`, `Pods`, `.gradle`, etc.
- ⚒️ Android build automation (`./gradlew clean && assembleRelease`)
- 🗜️ Generate zip (ignoring unnecessary files)
- 🧠 Smart error detection & auto-fix with suggestions
- 💬 Friendly CLI prompts with progress spinners

---

## 📦 Installation

```bash
npm install -g react-native-cleaner-cli
```

## 🚀 Usage

Command | Description

- clean [folders] | Clean specified folders
- build-android | Clean & build Android release APK
- generate-zip | Zip the project (excluding heavy folders)

Examples

```bash
rnclean --clean node_modules ios/Pods

rnclean --build-android

rnclean --generate-zip
```
