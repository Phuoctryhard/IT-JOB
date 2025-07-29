import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/user.interface';
import { Login, RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
@Injectable()
export class AuthService {
  // bên kia phải xuất ra UsersService
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
      private configService: ConfigService,
  ) {}

  // username va pass la 2 thu vien passwort no nem ve
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid) {
        return user;
      }
    }
    return null;
  }

  async login(login : Login,response ) {
    let user = await this.validateUser(login.email,login.password)
    console.log(user)
    if(!user){
      throw new BadRequestException("Not found User")
    }
   
    const { _id, name, email, role } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server ',
      _id,
      name,
      email,
      role,
    };

    const resfreshToken = this.createRefreshToken(payload)
    // update user with refreshToken 
    await this.usersService.updateUserToken(resfreshToken,_id)
    // set Cookie with refreshToken
    // = time resfreshToken để sau này hết hạn tự mất
    response.cookie('refresh_token', resfreshToken,{
      httpOnly : true,
      maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))  // millisecond 
    })

    return {
      access_token: this.jwtService.sign(payload),
      user:{
        _id,
        name,
        email,
        role,
      }
    };
  }
  async register(register : RegisterUserDto){
    let newuser = await this.usersService.register(register)
    console.log(newuser)
    return {
      _id:newuser?._id,
      createdAt : newuser?.createdAt
    }
  }

  createRefreshToken =(payload)=>{
    const resfreshToken = this.jwtService.sign(payload,{
      secret:   this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn : ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))/1000,
    })
    return resfreshToken
  }
}

