import {Inject, Injectable} from '@nestjs/common';
import {UserEntity} from "./data/user.entity";
import {Repository} from "typeorm";
import {CreateUserDto} from "./data/user.dto";

@Injectable()
export class AppService {

    constructor(@Inject('USER_REPOSITORY') private userProviders: Repository<UserEntity>,) {}

    async findAll(): Promise<UserEntity[]> {
        return this.userProviders.find();
    }

    async findById(userId:number): Promise<UserEntity[]> {
        return this.userProviders.findBy({id:userId});
    }
    async save(userDto:CreateUserDto){
        return this.userProviders.save(userDto)
    }

    async update(userId:number, userDto:CreateUserDto,){
        return this.userProviders.update(userId, userDto)
    }

    async delete(userId:number){
        return this.userProviders.delete(userId,)
    }
}
