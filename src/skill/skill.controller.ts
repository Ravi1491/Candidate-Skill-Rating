import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';

@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post('/')
  async create(@Body() createSkillDto: CreateSkillDto) {
    try {
      const { name } = createSkillDto;

      if (!name) {
        throw new Error('Name is required');
      }

      const existingSkill = await this.skillService.findOne({ name });

      if (existingSkill) {
        throw new Error('Skill already exist with this name');
      }

      return this.skillService.create(createSkillDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {
    return this.skillService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillService.findOne(+id);
  }
}
