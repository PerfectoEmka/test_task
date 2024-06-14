import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { User } from './user.interface';

@Injectable()
export class UserService {
  private users: User[] = [];
  private abortController: AbortController | null = null;

  constructor() {
    const dataPath = path.resolve(__dirname, '../../src/users.json');
    this.users = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  }

  async findUsers(email: string, number?: string): Promise<User[]> {
    if (this.abortController) {
      this.abortController.abort();
    }

    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    await this.delay(5000, signal);

    return this.users.filter(user =>
      user.email.includes(email) && (!number || user.number.includes(number))
    );
  }

  private delay(ms: number, signal: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        resolve();
      }, ms);

      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new Error('Request aborted'));
      });
    });
  }
}
