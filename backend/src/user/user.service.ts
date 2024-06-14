import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { User } from './user.interface';

@Injectable()
export class UserService {

    private readonly logger = new Logger(UserService.name);
    private users: User[] = [];

    constructor() {
        try {
            const dataPath = path.resolve(__dirname, '../../src/users.json');
            const data = fs.readFileSync(dataPath, 'utf8');
            this.users = JSON.parse(data);
        } catch (error) {
            this.logger.error(`Failed to read users.json: ${error.message}`);
        }
    }

    async findUsers(email: string, number?: string, signal?: AbortSignal): Promise<User[]> {
        await this.delay(5000, signal);
        return this.users.filter(user =>
            user.email.includes(email) && (!number || user.number.includes(number))
        );
    }

    private delay(ms: number, signal?: AbortSignal) {
        return new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(resolve, ms);
            if (signal) {
                signal.addEventListener('abort', () => {
                    clearTimeout(timeout);
                });
            }
        });
    }
}
