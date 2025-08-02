import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/user.interface';
import { Login, RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';

import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { RolesService } from 'src/roles/roles.service';


@Injectable()
export class AuthService {
  // bên kia phải xuất ra UsersService
  constructor(
    private usersService: UsersService,
    // giai ma token : verify va decode 
    private jwtService: JwtService,
    private configService: ConfigService,
    private roleService : RolesService

  ) {}

  // username va pass la 2 thu vien passwort no nem ve
  async validateUser(username: string, pass: string): Promise<any> {
    // user chưa role 
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid) {

        // return user;
        // trả thêm permission 
        const userRole = user.role as unknown as {_id : string , name :string}
        const temp = await this.roleService.findOne(userRole._id)
        const ObjUser ={
          ...user.toObject(),
          permissions : temp?.permissions?? []
        }
        return ObjUser
      }
    }
    return null;
  }

  async login(login : Login,response ) {
    let user = await this.validateUser(login.username,login.password)
    console.log(user)
    if(!user){
      throw new BadRequestException("Not found User")
    }
   // có thêm permission
    const { _id, name, email, role,permissions } = user;
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
      // set 10s
      maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))  // millisecond 
    })

    return {
      access_token: this.jwtService.sign(payload),
      user:{
        _id,
        name,
        email,
        role,
        permissions
      }
    };
  }
  async register(register : RegisterUserDto){
    try {
      let newuser = await this.usersService.register(register)
      console.log(newuser)
      return {
        _id:newuser?._id,
        createdAt : newuser?.createdAt
      }

    }catch(error){
      throw error; // Rất quan trọng: đẩy exception cho NestJS handle
    }
  }

  createRefreshToken =(payload)=>{
    const resfreshToken = this.jwtService.sign(payload,{
      secret:   this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn : ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))/1000,
    })
    return resfreshToken
  }

  processNewToken = async (refresh_token,response)=>{
    try{
      this.jwtService.verify(refresh_token,{
        secret:this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
      })
      // to do 
      const user = await this.usersService.findUserByToken(refresh_token)
      if(user){
         const { _id, name, email, role } = user;
        const payload = {
          sub: 'token login',
          iss: 'from server ',
          _id,
          name,
          email,
          role,
        };
        // fetch user 's role 
        const userRole = user.role as unknown as  {_id : string , name : string }
        const temp = await this.roleService.findOne(userRole._id)
        //////
        const resfreshToken = this.createRefreshToken(payload)
        // update user with refreshToken 
        response.clearCookie('refresh_token')
        // cập nhật refreshtoken 
        await this.usersService.updateUserToken(resfreshToken,_id.toString())
        // set Cookie with refreshToken
        // = time resfreshToken để sau này hết hạn tự mất
        response.cookie('refresh_token', resfreshToken,{
          httpOnly : true,
          // set 10s
          maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")) // millisecond 
        })

        return {
          access_token: this.jwtService.sign(payload),
          user:{
            _id,
            name,
            email,
            role,
            permissions : temp?.permissions??[]
          }
        };
      }
      else{
        throw new BadRequestException("Refresh token không hợp lệ. Vui lòng login ")
      }
    }catch(error){
      console.log(error)
      throw new BadRequestException("Refresh token không hợp lệ. Vui lòng login ")
    }
  }
  logout =async(user : IUser,response : Response)=>{
     response.clearCookie('refresh_token')
    // update user with refreshToken 
    await this.usersService.updateUserToken("",user._id)
    return "ok"
  }
}

