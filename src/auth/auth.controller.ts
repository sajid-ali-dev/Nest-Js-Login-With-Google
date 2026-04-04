import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService, GoogleUser } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(
    @Req() req: Request & { user: GoogleUser },
    @Res() res: Response,
  ) {
    const result = this.authService.loginWithGoogle(req.user);
    const payload = JSON.stringify(JSON.stringify(result));
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title></title></head><body><script>
(function(){
try{
var d=JSON.parse(${payload});
sessionStorage.setItem('access_token',d.access_token);
sessionStorage.setItem('user',JSON.stringify(d.user));
location.replace('/?login=success');
}catch(e){
location.replace('/?login=error');
}
})();
</script></body></html>`;
    res.type('html').send(html);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  me(@Req() req: Request & { user: { googleId: string; email: string } }) {
    return req.user;
  }
}
