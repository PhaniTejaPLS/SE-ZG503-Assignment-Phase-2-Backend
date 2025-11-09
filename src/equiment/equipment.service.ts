import { Injectable } from '@nestjs/common';
import { CreateEquimentDto } from './dto/create-equipment.dto';
import { UpdateEquimentDto } from './dto/update-equipment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equipment } from './entities/equipment.entity';
import { Between, Like, Repository } from 'typeorm';

@Injectable()
export class EquipmentService {

  constructor(
    @InjectRepository(Equipment)
    private equimentRepository: Repository<Equipment>
  ) {}

  async create(createEquimentDto: CreateEquimentDto) {
    const equipment = this.equimentRepository.create(createEquimentDto);
    return await this.equimentRepository.save(equipment);
  }

  findAll() {
    return this.equimentRepository.find();
  }

  findOne(id: number) {
    return this.equimentRepository.findOneBy({ id });
  }

getEquipmentByQuery(queryParamObject) {
  console.log('Query Parameters:', queryParamObject);
  
  // Initialize query builder
  const qb = this.equimentRepository.createQueryBuilder('equipment');

  // Clean up invalid or empty query parameters
  this.cleanQueryParameters(queryParamObject);

  // Apply filters based on cleaned parameters
  this.applyNameFilter(qb, queryParamObject);
  this.applyAvailableQuantityFilter(qb, queryParamObject);
  this.applyConditionFilter(qb, queryParamObject);

  return qb.getMany();
}

/**
 * Removes invalid or empty values from query parameters
 */
private cleanQueryParameters(queryParamObject: any): void {
  // Remove empty name parameter
  if (queryParamObject.name === '') {
    delete queryParamObject.name;
  }

  // Remove condition parameter if it's 'All' or 'undefined'
  if (queryParamObject.condition === 'All' || queryParamObject.condition === 'undefined') {
    delete queryParamObject.condition;
  }

  // Remove availablequantity parameter if it's 'undefined'
  if (queryParamObject.availablequantity === 'undefined') {
    delete queryParamObject.availablequantity;
  }
}

/**
 * Applies name filter using LIKE search (case-insensitive partial match)
 */
private applyNameFilter(qb: any, queryParamObject: any): void {
  if (queryParamObject.name) {
    qb.andWhere('equipment.name LIKE :name', { 
      name: `%${queryParamObject.name}%` 
    });
  }
}

/**
 * Applies available quantity filter using BETWEEN (0 to specified max value)
 */
private applyAvailableQuantityFilter(qb: any, queryParamObject: any): void {
  if (queryParamObject.availablequantity) {
    console.log('Available Quantity Filter Applied:', queryParamObject);
    qb.andWhere('equipment.availablequantity BETWEEN :min AND :max', { 
      min: 0, 
      max: parseInt(queryParamObject.availablequantity) 
    });
  }
}

/**
 * Applies condition filter using exact match
 */
private applyConditionFilter(qb: any, queryParamObject: any): void {
  if (queryParamObject.condition) {
    qb.andWhere('equipment.condition = :condition', { 
      condition: queryParamObject.condition 
    });
  }
}


  update(id: number, updateEquimentDto: UpdateEquimentDto) {
    return `This action updates a #${id} equiment`;
  }

  async replace(id: number, updateEquimentDto: UpdateEquimentDto) {
    try{
      let equipment = await this.equimentRepository.findOne({ 
            where: { id }
        });
        console.log(equipment);

        if (!equipment) {
            console.log('Creating new equipment with ID:', id);

            equipment = this.equimentRepository.create(updateEquimentDto);
        } else {

            this.equimentRepository.merge(equipment, updateEquimentDto);
        } 


        return this.equimentRepository.save(equipment);
    }catch(error){
      console.error('Error in replace method:', error);
      throw error;
    }

  }


//   async replace(id: number, updateEquimentDto: UpdateEquimentDto) {
//   try {
//     console.log('Replace method called with ID:', id, 'and data:', updateEquimentDto);
//     // Combine id and update data into a single object
//     const equipmentData = { id, ...updateEquimentDto };

//     // Perform an UPSERT — insert if not exists, update if exists
//     await this.equimentRepository.upsert(equipmentData, ['id']);

//     // Optionally, fetch and return the updated entity
//     return this.equimentRepository.findOne({ where: { id } });

//   } catch (error) {
//     console.error('Error in replace method:', error);
//     throw error;
//   }
// }

  remove(id: number) {
    return `This action removes a #${id} equiment`;
  }
}
