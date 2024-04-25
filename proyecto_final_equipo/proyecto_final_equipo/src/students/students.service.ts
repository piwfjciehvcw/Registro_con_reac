import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import PdfPrinter from 'pdfmake';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

  ) { }
  async create(createStudentDto: CreateStudentDto) {
    const newStudent = this.studentRepository.create(createStudentDto)
    return await this.studentRepository.save(newStudent)
  }

  async findAll() {
    return await this.studentRepository.find({ relations: ['career'] })
  }

  async findOne(matricula: number) {
    return await this.studentRepository.findOne({ where: { matricula: matricula }, relations: ['career'] });
  }

  async update(matricula: number, updateStudentDto: UpdateStudentDto) {
    const studentToUpdate = await this.studentRepository.findOne({ where: { matricula }, relations: ['career'] });
    if (!studentToUpdate) {
      throw new Error(`Student with matricula ${matricula} not found`);
    }

    this.studentRepository.merge(studentToUpdate, updateStudentDto);
    return await this.studentRepository.save(studentToUpdate);
  }

  async remove(matricula: number) {
    const studentToRemove = await this.studentRepository.findOne({ where: { matricula }, relations: ['career'] });
    if (!studentToRemove) {
      throw new Error(`Student with matricula ${matricula} not found`);
    }
    return await this.studentRepository.remove(studentToRemove);
  }

  async generateStudentList() {
    const students = await this.studentRepository.find({ relations: ['career'] });
    const studentListContent = students.map(student => {
      return [student.matricula, student.nombre, student.direccion, student.career.nombre];
    });

    const currentDate = new Date().toLocaleDateString();
    const documentDefinition: TDocumentDefinitions = {
      content: [
        { text: 'Lista de Estudiantes', style: 'header' },
        { text: `Documento generado el: ${currentDate}`, style: 'date' },
        { table: { body: [['Matricula', 'Nombre', 'Direccion', 'Carrera'], ...studentListContent] } }
      ],
      styles: {
        header: {
          bold: true, margin: [0, 0, 0, 10], fontSize: 18,
        },
        date: { margin: [0, 0, 0, 10] },
        text: { margin: [5, 2, 10, 20] }
      }
    };

    const fonts = {
      Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Bold.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-BoldItalic.ttf'
      }
    };
    const printer = new PdfPrinter(fonts);

    return printer.createPdfKitDocument(documentDefinition);
  }

}
