
import { Pipe, PipeTransform } from '@angular/core';
import { SurveyModel } from '../../../models/models';

@Pipe({
    name: 'surveyfilter'
})

export class SurveyFilterPipe implements PipeTransform {

    transform(surveys: SurveyModel[], keyword: string): any {

        if (keyword === undefined) return surveys;
        if(keyword.trim() === "" ) return surveys;

        return surveys.filter((survey) => {
            return survey.general.title.toLowerCase().includes(keyword.toLowerCase());
        });
        
    }
}