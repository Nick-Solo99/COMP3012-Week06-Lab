import type { TTip } from "./types";
import { randomUUID } from "crypto";

type TUser = { id: string; username: string; password: string; tips: TTip[] };

let database: TUser[] = [
  {
    id: "A0328Xhf8",
    username: "jimmy123",
    password: "jimmy123!",
    tips: [
      {
        id: "1",
        text: "Prefer const over let when you can.",
        likes: 2,
        createdAt: Date.now() - 10000,
      },
    ],
  },
  {
    id: "BFGZ8328X",
    username: "sandra123",
    password: "sandra123!",
    tips: [
      {
        id: "2",
        text: "Name things clearly, future you will thank you.",
        likes: 5,
        createdAt: Date.now() - 5000,
      },
    ],
  },
];

// Add a userId field and modify inner logic to use it
export function getTips(userId: string) {
  return database.find(u => u.id === userId)?.tips;
}

// Add a userId field and modify inner logic to use it
export function addTip(text: string, userId: string) {
  const tip: TTip = {
    id: randomUUID(),
    text: text,
    likes: 0,
    createdAt: Date.now(),
  };
    database.find(u => u.id === userId)?.tips.push(tip);
  return tip;
}

// Add a userId field and modify inner logic to use it
export function like(id: string, userId: string) {
  const foundTip = database.find(u => u.id === userId)?.tips.find((tip) => tip.id === id);
  if (foundTip) {
    foundTip.likes++;
  }
  return foundTip;
}

// Add a userId field and modify inner logic to use it
export function dislike(id: string, userId: string) {
  const foundTip = database.find(u => u.id === userId)?.tips.find((tip) => tip.id === id);
  if (foundTip) {
    foundTip.likes--;
  }
  return foundTip;
}

// Add a userId field and modify inner logic to use it
export function remove(id: string, userId: string) {
  const tipToDelete = database.find(u => u.id === userId)?.tips.findIndex((tip) => tip.id === id);
  if (tipToDelete != undefined && tipToDelete != -1) {
      database.find(u => u.id === userId)?.tips.splice(tipToDelete, 1);
  }
}

export function findUsername(username: string) {
    return database.find(u => u.username === username);
}