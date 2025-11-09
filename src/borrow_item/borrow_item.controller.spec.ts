import { Test, TestingModule } from '@nestjs/testing';
import { BorrowItemController } from './borrow_item.controller';
import { BorrowItemService } from './borrow_item.service';
import { CreateBorrowItemDto } from './dto/create-borrow_item.dto';
import { UpdateBorrowItemDto } from './dto/update-borrow_item.dto';

describe('BorrowItemController', () => {
  let controller: BorrowItemController;
  let service: BorrowItemService;

  const mockBorrowItemService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowItemController],
      providers: [
        {
          provide: BorrowItemService,
          useValue: mockBorrowItemService,
        },
      ],
    }).compile();

    controller = module.get<BorrowItemController>(BorrowItemController);
    service = module.get<BorrowItemService>(BorrowItemService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new borrow item', () => {
      const createBorrowItemDto: CreateBorrowItemDto = {
        id: 1,
        borrowRequestId: 1,
        equipmentId: 1,
        quantity: 2,
        borrowDate: new Date(),
        returnDate: new Date(),
      };

      const expectedMessage = 'This action adds a new borrowItem';
      mockBorrowItemService.create.mockReturnValue(expectedMessage);

      const result = controller.create(createBorrowItemDto);

      expect(result).toBe(expectedMessage);
      expect(mockBorrowItemService.create).toHaveBeenCalledWith(createBorrowItemDto);
    });
  });

  describe('findAll', () => {
    it('should return all borrow items message', () => {
      const expectedMessage = 'This action returns all borrowItem';
      mockBorrowItemService.findAll.mockReturnValue(expectedMessage);

      const result = controller.findAll();

      expect(result).toBe(expectedMessage);
      expect(mockBorrowItemService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a borrow item message', () => {
      const id = '1';
      const expectedMessage = 'This action returns a #1 borrowItem';

      mockBorrowItemService.findOne.mockReturnValue(expectedMessage);

      const result = controller.findOne(id);

      expect(result).toBe(expectedMessage);
      expect(mockBorrowItemService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a borrow item', () => {
      const id = '1';
      const updateBorrowItemDto: UpdateBorrowItemDto = { quantity: 3 };
      const expectedMessage = 'This action updates a #1 borrowItem';

      mockBorrowItemService.update.mockReturnValue(expectedMessage);

      const result = controller.update(id, updateBorrowItemDto);

      expect(result).toBe(expectedMessage);
      expect(mockBorrowItemService.update).toHaveBeenCalledWith(1, updateBorrowItemDto);
    });
  });

  describe('remove', () => {
    it('should remove a borrow item', () => {
      const id = '1';
      const expectedMessage = 'This action removes a #1 borrowItem';

      mockBorrowItemService.remove.mockReturnValue(expectedMessage);

      const result = controller.remove(id);

      expect(result).toBe(expectedMessage);
      expect(mockBorrowItemService.remove).toHaveBeenCalledWith(1);
    });
  });
});
