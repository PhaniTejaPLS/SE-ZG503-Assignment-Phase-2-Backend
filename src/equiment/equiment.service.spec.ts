import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EquipmentService } from './equipment.service';
import { Equipment } from './entities/equipment.entity';
import { CreateEquimentDto } from './dto/create-equipment.dto';
import { UpdateEquimentDto } from './dto/update-equipment.dto';

describe('EquipmentService', () => {
  let service: EquipmentService;
  let repository: Repository<Equipment>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
    merge: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EquipmentService,
        {
          provide: getRepositoryToken(Equipment),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EquipmentService>(EquipmentService);
    repository = module.get<Repository<Equipment>>(getRepositoryToken(Equipment));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new equipment', async () => {
      const createEquipmentDto: CreateEquimentDto = {
        id: 1,
        name: 'Laptop',
        category: 'Electronics',
        condition: 'Good',
        quantity: 10,
        availablequantity: 8,
        description: 'Test laptop',
      };

      const mockEquipment = { ...createEquipmentDto };
      mockRepository.create.mockReturnValue(mockEquipment);
      mockRepository.save.mockResolvedValue(mockEquipment);

      const result = await service.create(createEquipmentDto);

      expect(result).toEqual(mockEquipment);
      expect(mockRepository.create).toHaveBeenCalledWith(createEquipmentDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockEquipment);
    });
  });

  describe('findAll', () => {
    it('should return an array of equipment', async () => {
      const mockEquipment: Equipment[] = [
        {
          id: 1,
          name: 'Laptop',
          tag: 'LAP001',
          condition: 'Good',
          quantity: 10,
          availablequantity: 8,
          borrowItems: [],
        },
        {
          id: 2,
          name: 'Projector',
          tag: 'PROJ001',
          condition: 'Excellent',
          quantity: 5,
          availablequantity: 3,
          borrowItems: [],
        },
      ];

      mockRepository.find.mockResolvedValue(mockEquipment);

      const result = await service.findAll();

      expect(result).toEqual(mockEquipment);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single equipment by id', async () => {
      const id = 1;
      const mockEquipment: Equipment = {
        id: 1,
        name: 'Laptop',
        tag: 'LAP001',
        condition: 'Good',
        quantity: 10,
        availablequantity: 8,
        borrowItems: [],
      };

      mockRepository.findOneBy.mockResolvedValue(mockEquipment);

      const result = await service.findOne(id);

      expect(result).toEqual(mockEquipment);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id });
    });

    it('should return null when equipment not found', async () => {
      const id = 999;
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(id);

      expect(result).toBeNull();
    });
  });

  describe('getEquipmentByQuery', () => {
    it('should filter equipment by name', async () => {
      const queryParams = { name: 'Laptop' };
      const mockEquipment: Equipment[] = [
        {
          id: 1,
          name: 'Laptop',
          tag: 'LAP001',
          condition: 'Good',
          quantity: 10,
          availablequantity: 8,
          borrowItems: [],
        },
      ];

      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockEquipment),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getEquipmentByQuery(queryParams);

      expect(result).toEqual(mockEquipment);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('equipment.name LIKE :name', {
        name: '%Laptop%',
      });
    });

    it('should filter equipment by available quantity', async () => {
      const queryParams = { availablequantity: '5' };
      const mockEquipment: Equipment[] = [
        {
          id: 1,
          name: 'Laptop',
          tag: 'LAP001',
          condition: 'Good',
          quantity: 10,
          availablequantity: 3,
          borrowItems: [],
        },
      ];

      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockEquipment),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getEquipmentByQuery(queryParams);

      expect(result).toEqual(mockEquipment);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'equipment.availablequantity BETWEEN :min AND :max',
        { min: 0, max: 5 },
      );
    });

    it('should filter equipment by condition', async () => {
      const queryParams = { condition: 'Good' };
      const mockEquipment: Equipment[] = [
        {
          id: 1,
          name: 'Laptop',
          tag: 'LAP001',
          condition: 'Good',
          quantity: 10,
          availablequantity: 8,
          borrowItems: [],
        },
      ];

      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockEquipment),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getEquipmentByQuery(queryParams);

      expect(result).toEqual(mockEquipment);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('equipment.condition = :condition', {
        condition: 'Good',
      });
    });

    it('should clean empty name parameter', async () => {
      const queryParams = { name: '' };
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.getEquipmentByQuery(queryParams);

      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        expect.stringContaining('name'),
        expect.anything(),
      );
    });

    it('should clean "All" condition parameter', async () => {
      const queryParams = { condition: 'All' };
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.getEquipmentByQuery(queryParams);

      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(
        expect.stringContaining('condition'),
        expect.anything(),
      );
    });
  });

  describe('replace', () => {
    it('should update existing equipment', async () => {
      const id = 1;
      const updateEquipmentDto: UpdateEquimentDto = {
        name: 'Updated Laptop',
        condition: 'Excellent',
      };

      const existingEquipment: Equipment = {
        id: 1,
        name: 'Laptop',
        tag: 'LAP001',
        condition: 'Good',
        quantity: 10,
        availablequantity: 8,
        borrowItems: [],
      };

      const updatedEquipment = { ...existingEquipment, ...updateEquipmentDto };

      mockRepository.findOne.mockResolvedValue(existingEquipment);
      // merge modifies the first argument in place and returns it
      mockRepository.merge.mockImplementation((target, source) => {
        Object.assign(target, source);
        return target;
      });
      mockRepository.save.mockResolvedValue(updatedEquipment);

      const result = await service.replace(id, updateEquipmentDto);

      expect(result).toEqual(updatedEquipment);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(mockRepository.merge).toHaveBeenCalledWith(existingEquipment, updateEquipmentDto);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should create new equipment if not found', async () => {
      const id = 999;
      const updateEquipmentDto: UpdateEquimentDto = {
        name: 'New Equipment',
        condition: 'Good',
      };

      const newEquipment = { id, ...updateEquipmentDto };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(newEquipment);
      mockRepository.save.mockResolvedValue(newEquipment);

      const result = await service.replace(id, updateEquipmentDto);

      expect(result).toEqual(newEquipment);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(mockRepository.create).toHaveBeenCalledWith(updateEquipmentDto);
      expect(mockRepository.save).toHaveBeenCalledWith(newEquipment);
    });

    it('should handle errors during replace', async () => {
      const id = 1;
      const updateEquipmentDto: UpdateEquimentDto = {
        name: 'Updated Laptop',
      };

      mockRepository.findOne.mockRejectedValue(new Error('Database error'));

      await expect(service.replace(id, updateEquipmentDto)).rejects.toThrow('Database error');
    });
  });

  describe('update', () => {
    it('should return update message', () => {
      const id = 1;
      const updateEquipmentDto: UpdateEquimentDto = { name: 'Updated Name' };
      const result = service.update(id, updateEquipmentDto);

      expect(result).toBe(`This action updates a #${id} equiment`);
    });
  });

  describe('remove', () => {
    it('should return remove message', () => {
      const id = 1;
      const result = service.remove(id);

      expect(result).toBe(`This action removes a #${id} equiment`);
    });
  });
});
