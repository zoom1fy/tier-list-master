let counter = 100;

export function nextId(): string {
  return String(counter++);
}

export function ensureIdCounter(min: number) {
  if (counter <= min) counter = min + 1;
}
