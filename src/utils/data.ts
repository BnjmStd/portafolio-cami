import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

const dataDir = process.env.DATA_DIR || join(process.cwd(), "data");

function ensureDir(filePath: string) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

export interface Project {
  id: string;
  image: string;
  title: string;
  description: string;
  slug: string;
}

export interface Model {
  id: string;
  image: string;
  title: string;
  description: string;
  modelPath: string;
}

export function readProjects(): Project[] {
  const file = join(dataDir, "projects.json");
  if (!existsSync(file)) return [];
  return JSON.parse(readFileSync(file, "utf-8"));
}

export function writeProjects(projects: Project[]): void {
  const file = join(dataDir, "projects.json");
  ensureDir(file);
  writeFileSync(file, JSON.stringify(projects, null, 2), "utf-8");
}

export function readModels(): Model[] {
  const file = join(dataDir, "models.json");
  if (!existsSync(file)) return [];
  return JSON.parse(readFileSync(file, "utf-8"));
}

export function writeModels(models: Model[]): void {
  const file = join(dataDir, "models.json");
  ensureDir(file);
  writeFileSync(file, JSON.stringify(models, null, 2), "utf-8");
}
