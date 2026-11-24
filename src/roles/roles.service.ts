import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Association } from '../associations/association.entity.js';
import { User } from '../users/user.entity.js';
import { Role } from './role.entity.js';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Association)
    private readonly associationRepository: Repository<Association>,
  ) {}

  async getAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async getByIds(idUser: number, idAssociation: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { idUser: Equal(idUser), idAssociation: Equal(idAssociation) },
    });

    if (!role) {
      throw new HttpException('Could not find a role for this user in this association', HttpStatus.NOT_FOUND);
    }

    return role;
  }

  async create(name: string, idUser: number, idAssociation: number): Promise<Role> {
    const [user, association] = await Promise.all([
      this.userRepository.findOneBy({ id: Equal(idUser) }),
      this.associationRepository.findOneBy({ id: Equal(idAssociation) }),
    ]);

    if (!user) {
      throw new HttpException(`Could not find a user with the id ${idUser}`, HttpStatus.NOT_FOUND);
    }
    if (!association) {
      throw new HttpException(`Could not find an association with the id ${idAssociation}`, HttpStatus.NOT_FOUND);
    }

    const role = this.roleRepository.create({ name, idUser, idAssociation, user, association });
    return this.roleRepository.save(role);
  }

  async update(idUser: number, idAssociation: number, name: string): Promise<Role> {
    const role = await this.getByIds(idUser, idAssociation);
    role.name = name;
    return this.roleRepository.save(role);
  }

  async remove(idUser: number, idAssociation: number): Promise<boolean> {
    const result = await this.roleRepository.delete({ idUser, idAssociation });

    if (result.affected) {
      return true;
    }

    throw new HttpException('Could not find a role for this user in this association', HttpStatus.NOT_FOUND);
  }
}
