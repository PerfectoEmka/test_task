import { Controller, Get, Query, ValidationPipe, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.interface';
import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';
import { Request } from 'express';

class SearchDto {
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsOptional()
    @IsString()
    @Matches(/^\d{6}$/, { message: 'Invalid number format' })
    number?: string;
}

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('search')
    async search(
        @Query(new ValidationPipe({ transform: true, whitelist: true }))
        query: SearchDto,
        @Req() req: Request
    ): Promise<User[]> {
        const abortController = new AbortController();
        req.on('close', () => {
            abortController.abort();
        });
        return await this.userService.findUsers(query.email, query.number, abortController.signal);
    }
}
