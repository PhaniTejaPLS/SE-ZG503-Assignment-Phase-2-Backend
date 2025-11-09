import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BorrowRequestService } from './borrow_request.service';
import { BorrowRequest } from './entities/borrow_request.entity';
import { BorrowItem } from '../borrow_item/entities/borrow_item.entity';
import { CreateBorrowRequestDto } from './dto/create-borrow_request.dto';
import { UpdateBorrowRequestDto } from './dto/update-borrow_request.dto';

describe('BorrowRequestService', () => {
  let service: BorrowRequestService;
  let borrowRequestRepository: Repository<BorrowRequest>;
  let borrowItemRepository: Repository<BorrowItem>;

  const mockBorrowRequestRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockBorrowItemRepository = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BorrowRequestService,
        {
          provide: getRepositoryToken(BorrowRequest),
          useValue: mockBorrowRequestRepository,
        },
        {
          provide: getRepositoryToken(BorrowItem),
          useValue: mockBorrowItemRepository,
        },
      ],
    }).compile();

    service = module.get<BorrowRequestService>(BorrowRequestService);
    borrowRequestRepository = module.get<Repository<BorrowRequest>>(
      getRepositoryToken(BorrowRequest),
    );
    borrowItemRepository = module.get<Repository<BorrowItem>>(getRepositoryToken(BorrowItem));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a borrow request with items', async () => {
      const createBorrowRequestDto: CreateBorrowRequestDto = {
        id: 1,
        requestDate: new Date(),
        userId: 1,
        status: 'pending',
        items: [
          {
            id: 1,
            borrowRequestId: 1,
            equipmentId: 1,
            quantity: 2,
            borrowDate: new Date(),
            returnDate: new Date(),
          },
        ],
      };

      const savedRequest: BorrowRequest = {
        id: 1,
        requestDate: createBorrowRequestDto.requestDate,
        userId: 1,
        status: 'pending',
        approvalDate: null,
        user: null,
        items: [],
      };

      mockBorrowRequestRepository.create.mockReturnValue(savedRequest);
      mockBorrowRequestRepository.save.mockResolvedValue(savedRequest);
      mockBorrowItemRepository.create.mockReturnValue({});
      mockBorrowItemRepository.save.mockResolvedValue({});

      const result = await service.create(createBorrowRequestDto);

      expect(result).toEqual(savedRequest);
      expect(mockBorrowRequestRepository.create).toHaveBeenCalledWith(createBorrowRequestDto);
      expect(mockBorrowRequestRepository.save).toHaveBeenCalledWith(savedRequest);
      expect(mockBorrowItemRepository.create).toHaveBeenCalledTimes(1);
      expect(mockBorrowItemRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of borrow requests', async () => {
      const mockRequests: BorrowRequest[] = [
        {
          id: 1,
          requestDate: new Date(),
          userId: 1,
          status: 'pending',
          approvalDate: null,
          user: null,
          items: [],
        },
      ];

      mockBorrowRequestRepository.find.mockResolvedValue(mockRequests);

      const result = await service.findAll();

      expect(result).toEqual(mockRequests);
      expect(mockBorrowRequestRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a message with id', () => {
      const id = 1;
      const result = service.findOne(id);

      expect(result).toBe(`This action returns a #${id} borrowRequest`);
    });
  });

  describe('update', () => {
    it('should update a borrow request', async () => {
      const id = 1;
      const updateBorrowRequestDto: UpdateBorrowRequestDto = {
        status: 'approved',
      };

      const updateResult = { affected: 1 };
      mockBorrowRequestRepository.update.mockResolvedValue(updateResult);

      const result = await service.update(id, updateBorrowRequestDto);

      expect(result).toEqual(updateResult);
      expect(mockBorrowRequestRepository.update).toHaveBeenCalledWith(id, updateBorrowRequestDto);
    });
  });

  describe('remove', () => {
    it('should delete a borrow request', async () => {
      const id = 1;
      const deleteResult = { affected: 1 };

      mockBorrowRequestRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(id);

      expect(result).toEqual(deleteResult);
      expect(mockBorrowRequestRepository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('findByUserId', () => {
    it('should return borrow requests for a specific user', async () => {
      const userId = 1;
      const mockRequests: BorrowRequest[] = [
        {
          id: 1,
          requestDate: new Date(),
          userId: 1,
          status: 'pending',
          approvalDate: null,
          user: null,
          items: [],
        },
      ];

      mockBorrowRequestRepository.find.mockResolvedValue(mockRequests);

      const result = await service.findByUserId(userId);

      expect(result).toEqual(mockRequests);
      expect(mockBorrowRequestRepository.find).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });

  describe('getRequestDetailsByRequestId', () => {
    it('should return request details with equipment information', async () => {
      const requestId = 1;
      const mockDetails = [
        {
          equipmentName: 'Laptop',
          equipmentTag: 'LAP001',
          borrowedQuantity: 2,
          borrowDate: new Date(),
          returnDate: new Date(),
        },
      ];

      const mockQueryBuilder = {
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(mockDetails),
      };

      mockBorrowItemRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getRequestDetailsByRequestId(requestId);

      expect(result).toEqual(mockDetails);
      expect(mockBorrowItemRepository.createQueryBuilder).toHaveBeenCalledWith('bi');
      expect(mockQueryBuilder.innerJoin).toHaveBeenCalledTimes(2);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('br.id = :requestId', { requestId });
      expect(mockQueryBuilder.getRawMany).toHaveBeenCalled();
    });
  });
});
