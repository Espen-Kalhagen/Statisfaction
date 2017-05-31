import { Pipe, PipeTransform } from '@angular/core';
import { SurveyModel } from '../../../models/models';

@Pipe({
    name: 'draft'
})

export class DraftStatePipe implements PipeTransform {

    transform(surveys: SurveyModel[]): any {

        return surveys.filter((survey) => {

            if(survey.general.inProduction == null){return true;}

            return !survey.general.inProduction;
        });
    }
}

@Pipe({
    name: 'production'
})

export class ProductionStatePipe implements PipeTransform {

    transform(surveys: SurveyModel[]): any {

        return surveys.filter((survey) => {

            if(survey.general.inProduction == null){return false;}

            return survey.general.inProduction;
        });
    }
}