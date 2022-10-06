export class CreateReportDto {
    course_code: string

    course_title: string

    year: string

    lecturer: any

    exams_type: string;
  
    exams_date: string;
    
    exams_venue: string;
    
    semester: string;

    comment: string
}

export class UpdateReportDto {
    is_read: boolean
    
    is_in_progress: boolean

    is_completed: boolean

}