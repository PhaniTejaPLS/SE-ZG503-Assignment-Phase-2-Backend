import { Test, TestingModule } from '@nestjs/testing';
import { BorrowRequestController } from './borrow_request.controller';
import { BorrowRequestService } from './borrow_request.service';
import { CreateBorrowRequestDto } from './dto/create-borrow_request.dto';
import { UpdateBorrowRequestDto } from './dto/update-borrow_request.dto';
import { BorrowRequest } from './entities/borrow_request.entity';

describe('BorrowRequestController', () => {
  let controller: BorrowRequestController;
  let service: BorrowRequestService;

  const mockBorrowRequestService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByUserId: jest.fn(),
    getRequestDetailsByRequestId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowRequestController],
      providers: [
        {
          provide: BorrowRequestService,
          useValue: mockBorrowRequestService,
        },
      ],
    }).compile();

    controller = module.get<BorrowRequestController>(BorrowRequestController);
    service = module.get<BorrowRequestService>(BorrowRequestService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new borrow request', async () => {
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

      const mockRequest: BorrowRequest = {
        id: 1,
        requestDate: createBorrowRequestDto.requestDate,
        userId: 1,
        status: 'pending',
        approvalDate: null,
        user: null,
        items: [],
      };

      mockBorrowRequestService.create.mockResolvedValue(mockRequest);

      const result = await controller.create(createBorrowRequestDto);

      expect(result).toEqual(mockRequest);
      expect(mockBorrowRequestService.create).toHaveBeenCalledWith(createBorrowRequestDto);
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

      mockBorrowRequestService.findAll.mockResolvedValue(mockRequests);

      const result = await controller.findAll();

      expect(result).toEqual(mockRequests);
      expect(mockBorrowRequestService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a borrow request message', () => {
      const id = '1';
      const expectedMessage = 'This action returns a #1 borrowRequest';

      mockBorrowRequestService.findOne.mockReturnValue(expectedMessage);

      const result = controller.findOne(id);

      expect(result).toBe(expectedMessage);
      expect(mockBorrowRequestService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('findByUser', () => {
    it('should return borrow requests for a user', async () => {
      const userId = '1';
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

      mockBorrowRequestService.findByUserId.mockResolvedValue(mockRequests);

      const result = await controller.findByUser(userId);

      expect(result).toEqual(mockRequests);
      expect(mockBorrowRequestService.findByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('findReqeustDetailsById', () => {
    it('should return request details', async () => {
      const requestId = '1';
      const mockDetails = [
        {
          equipmentName: 'Laptop',
          equipmentTag: 'LAP001',
          borrowedQuantity: 2,
          borrowDate: new Date(),
          returnDate: new Date(),
        },
      ];

      mockBorrowRequestService.getRequestDetailsByRequestId.mockResolvedValue(mockDetails);

      const result = await controller.findReqeustDetailsById(requestId);

      expect(result).toEqual(mockDetails);
      expect(mockBorrowRequestService.getRequestDetailsByRequestId).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a borrow request', async () => {
      const id = '1';
      const updateBorrowRequestDto: UpdateBorrowRequestDto = {
        status: 'approved',
      };

      const updateResult = { affected: 1 };
      mockBorrowRequestService.update.mockResolvedValue(updateResult);

      const result = await controller.update(id, updateBorrowRequestDto);

      expect(result).toEqual(updateResult);
      expect(mockBorrowRequestService.update).toHaveBeenCalledWith(1, updateBorrowRequestDto);
    });
  });

  describe('remove', () => {
    it('should remove a borrow request', async () => {
      const id = '1';
      const deleteResult = { affected: 1 };

      mockBorrowRequestService.remove.mockResolvedValue(deleteResult);

      const result = await controller.remove(id);

      expect(result).toEqual(deleteResult);
      expect(mockBorrowRequestService.remove).toHaveBeenCalledWith(1);
    });
  });
});
