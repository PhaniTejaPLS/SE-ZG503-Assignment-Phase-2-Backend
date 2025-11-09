import { Test, TestingModule } from '@nestjs/testing';
import { BorrowItemService } from './borrow_item.service';
import { CreateBorrowItemDto } from './dto/create-borrow_item.dto';
import { UpdateBorrowItemDto } from './dto/update-borrow_item.dto';

describe('BorrowItemService', () => {
  let service: BorrowItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BorrowItemService],
    }).compile();

    service = module.get<BorrowItemService>(BorrowItemService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return a create message', () => {
      const createBorrowItemDto: CreateBorrowItemDto = {
        id: 1,
        borrowRequestId: 1,
        equipmentId: 1,
        quantity: 2,
        borrowDate: new Date(),
        returnDate: new Date(),
      };

      const result = service.create(createBorrowItemDto);

      expect(result).toBe('This action adds a new borrowItem');
    });
  });

  describe('findAll', () => {
    it('should return a findAll message', () => {
      const result = service.findAll();

      expect(result).toBe('This action returns all borrowItem');
    });
  });

  describe('findOne', () => {
    it('should return a findOne message with id', () => {
      const id = 1;
      const result = service.findOne(id);

      expect(result).toBe(`This action returns a #${id} borrowItem`);
    });
  });

  describe('update', () => {
    it('should return an update message with id', () => {
      const id = 1;
      const updateBorrowItemDto: UpdateBorrowItemDto = { quantity: 3 };
      const result = service.update(id, updateBorrowItemDto);

      expect(result).toBe(`This action updates a #${id} borrowItem`);
    });
  });

  describe('remove', () => {
    it('should return a remove message with id', () => {
      const id = 1;
      const result = service.remove(id);

      expect(result).toBe(`This action removes a #${id} borrowItem`);
    });
  });
});
