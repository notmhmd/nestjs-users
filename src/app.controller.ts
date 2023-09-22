import {Controller, Get, NotFoundException, ParseIntPipe} from '@nestjs/common';
import {AppService} from './app.service';
import {CreateUserDto, UserDto} from "./data/user.dto";
import {plainToClass, plainToInstance} from "class-transformer";
import {EventPattern, MessagePattern, Payload, RpcException} from "@nestjs/microservices";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @MessagePattern('user.get')
    async getUsers(): Promise<string> {
        const users = await this.appService.findAll()
        return JSON.stringify(plainToInstance(UserDto, users))
    }

    @MessagePattern('user.get')
    async getUser(@Payload('userId', ParseIntPipe) userId: number): Promise<string> {
        const user = await this.appService.findById(userId)
        if (!user) {
            throw new RpcException(new NotFoundException("user was not found!"))
        }
        return JSON.stringify(plainToInstance(UserDto, user))
    }

    @EventPattern('user.create')
    async createUser(@Payload() productDto:CreateUserDto) {
      const userEntity = await this.appService.save(productDto);

      if(!userEntity) {
        throw new RpcException("not able to add user")
      }
    }

    @MessagePattern('user.update')
    async updateUser(@Payload() {userId, createUserDto}): Promise<string> {
      const updateResult = await this.appService.update(parseInt(userId), createUserDto)
      if (updateResult.affected){
        return "updated successfully"
      }
      throw new RpcException(new NotFoundException("User was not found!"))
    }


    @MessagePattern('user.delete')
    async deleteUsers(): Promise<string> {
        const users = await this.appService.findAll()
        return JSON.stringify(plainToInstance(UserDto, users))
    }

}
