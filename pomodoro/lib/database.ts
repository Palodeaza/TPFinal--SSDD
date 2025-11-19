//estoy viendo si se me guardan cambios (lit no hice nada)
// lib/database.ts
import fs from "fs/promises";
import path from "path";

export type Routine = {
  id: string;
  name: string;
  workDuration: number;
  breakDuration: number;
  cycles?: number;
  image?: string;
  category?: string;
  description?: string;
  createdAt?: string;
};

//const DB_PATH = path.join(process.cwd(), "app", "data", "routines.json");
const DB_PATH = path.join(process.cwd(),'routines.json');

class Database {
  private async read(): Promise<Routine[]> {
    try {
      const raw = await fs.readFile(DB_PATH, "utf8");
      return JSON.parse(raw) as Routine[];
    } catch (e) {
      return [];
    }
  }

  private async write(data: Routine[]) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
  }

  async getAll(): Promise<Routine[]> {
    return this.read();
  }

  async getById(id: string): Promise<Routine | undefined> {
    const data = await this.read();
    return data.find((r) => r.id === id);
  }

  async create(payload: Omit<Routine, "createdAt">): Promise<Routine> {
    const data = await this.read();
    const newItem: Routine = {
      ...payload,
      id: payload.id ?? String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    data.push(newItem);
    await this.write(data);
    return newItem;
  }

  async update(id: string, updates: Partial<Routine>): Promise<Routine | null> {
    const data = await this.read();
    const idx = data.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    data[idx] = { ...data[idx], ...updates };
    await this.write(data);
    return data[idx];
  }

  async delete(id: string): Promise<boolean> {
    const data = await this.read();
    const filtered = data.filter((r) => r.id !== id);
    if (filtered.length === data.length) return false;
    await this.write(filtered);
    return true;
  }

  async overwrite(newData: Routine[]) {
    await this.write(newData);
  }
}

export const db = new Database();
