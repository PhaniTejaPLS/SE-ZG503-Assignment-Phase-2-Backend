import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByUsername: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', () => {
      const createUserDto: CreateUserDto = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'student',
      };

      mockUsersService.create.mockReturnValue(undefined);

      controller.create(createUserDto);

      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers: User[] = [
        {
          id: 1,
          name: 'Test User 1',
          email: 'test1@example.com',
          password: 'password123',
          role: 'student',
          borrowRequests: [],
        },
      ];

      mockUsersService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user message', () => {
      const id = '1';
      const expectedMessage = 'This action returns a #1 user';

      mockUsersService.findOne.mockReturnValue(expectedMessage);

      const result = controller.findOne(id);

      expect(result).toBe(expectedMessage);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a user', () => {
      const id = '1';
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      const expectedMessage = 'This action updates a #1 user';

      mockUsersService.update.mockReturnValue(expectedMessage);

      const result = controller.update(id, updateUserDto);

      expect(result).toBe(expectedMessage);
      expect(mockUsersService.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', () => {
      const id = '1';
      const expectedMessage = 'This action removes a #1 user';

      mockUsersService.remove.mockReturnValue(expectedMessage);

      const result = controller.remove(id);

      expect(result).toBe(expectedMessage);
      expect(mockUsersService.remove).toHaveBeenCalledWith(1);
    });
  });
});
