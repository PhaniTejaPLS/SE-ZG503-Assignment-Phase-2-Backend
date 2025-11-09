import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      const mockUser = { ...createUserDto };
      mockRepository.create.mockReturnValue(mockUser);

      service.create(createUserDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createUserDto);
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
        {
          id: 2,
          name: 'Test User 2',
          email: 'test2@example.com',
          password: 'password456',
          role: 'staff',
          borrowRequests: [],
        },
      ];

      mockRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('should return empty array when no users exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user message with id', () => {
      const id = 1;
      const result = service.findOne(id);

      expect(result).toBe(`This action returns a #${id} user`);
    });
  });

  describe('findByUsername', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';
      const mockUser: User = {
        id: 1,
        name: 'Test User',
        email: email,
        password: 'password123',
        role: 'student',
        borrowRequests: [],
      };

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findByUsername(email);

      expect(result).toEqual(mockUser);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.email = :email', { email });
      expect(mockQueryBuilder.getOne).toHaveBeenCalled();
    });

    it('should return null when user not found', async () => {
      const email = 'nonexistent@example.com';

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findByUsername(email);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should return update message with id', () => {
      const id = 1;
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      const result = service.update(id, updateUserDto);

      expect(result).toBe(`This action updates a #${id} user`);
    });
  });

  describe('remove', () => {
    it('should return remove message with id', () => {
      const id = 1;
      const result = service.remove(id);

      expect(result).toBe(`This action removes a #${id} user`);
    });
  });
});
