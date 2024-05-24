import { Body, Controller, Post } from '@nestjs/common';
import { ZodValidationPipe } from 'src/shared/zod-validation.pipe';
import { LoginDto, LoginSchema } from './schema/login.schema';
import { z } from 'zod';
import { AuthService } from './auth.service';

@Controller("/auth")
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

    @Post("/login")
    async loginOrSignup(
        @Body(
            new ZodValidationPipe(LoginSchema)
        ) dto: LoginDto
    ) {
        return this.authService.loginOrSignup(dto);
    }
}
