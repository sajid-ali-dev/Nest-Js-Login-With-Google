import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export type GoogleUser = {
  googleId: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  loginWithGoogle(user: GoogleUser) {
    const payload = { sub: user.googleId, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        googleId: user.googleId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
}
