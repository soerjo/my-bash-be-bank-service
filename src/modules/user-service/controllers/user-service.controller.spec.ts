import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceController } from './user-service.controller';
import { UserServiceService } from '../services/user-service.service';

describe('UserServiceController', () => {
  let controller: UserServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserServiceController],
      providers: [UserServiceService],
    }).compile();

    controller = module.get<UserServiceController>(UserServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
