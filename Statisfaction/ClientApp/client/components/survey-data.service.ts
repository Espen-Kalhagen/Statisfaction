import { Injectable } from '@angular/core';
import { SurveyInfoModel} from '../../models/models';

@Injectable()
export class SurveyDataService {

    public surveys:SurveyInfoModel[] = [];

    public survey:SurveyInfoModel = null ;


}