import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByUsername: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate user with correct credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockUser: User = {
        id: 1,
        name: 'Test User',
        email: email,
        password: password,
        role: 'student',
        borrowRequests: [],
      };

      mockUsersService.findByUsername.mockResolvedValue(mockUser);

      const result = await service.validateUser(email, password);

      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        borrowRequests: mockUser.borrowRequests,
      });
      expect(mockUsersService.findByUsername).toHaveBeenCalledWith(email);
    });

    it('should throw error when user not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';

      mockUsersService.findByUsername.mockResolvedValue(null);

      await expect(service.validateUser(email, password)).rejects.toThrow('Invalid credentials');
      expect(mockUsersService.findByUsername).toHaveBeenCalledWith(email);
    });

    it('should throw error when password is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      const mockUser: User = {
        id: 1,
        name: 'Test User',
        email: email,
        password: 'password123',
        role: 'student',
        borrowRequests: [],
      };

      mockUsersService.findByUsername.mockResolvedValue(mockUser);

      await expect(service.validateUser(email, password)).rejects.toThrow('Invalid credentials');
      expect(mockUsersService.findByUsername).toHaveBeenCalledWith(email);
    });
  });

  describe('login', () => {
    it('should return access token and user details', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockUser: User = {
        id: 1,
        name: 'Test User',
        email: email,
        password: password,
        role: 'student',
        borrowRequests: [],
      };

      const mockAccessToken = 'mock-access-token';

      mockUsersService.findByUsername.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(mockAccessToken);

      const result = await service.login(email, password);

      expect(result).toEqual({
        access_token: mockAccessToken,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
          borrowRequests: mockUser.borrowRequests,
        },
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });
    });

    it('should throw error when credentials are invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      mockUsersService.findByUsername.mockResolvedValue(null);

      await expect(service.login(email, password)).rejects.toThrow('Invalid credentials');
    });
  });
});
