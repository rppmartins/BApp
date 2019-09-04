export class Questionnaire{

    c_id
    first_time
    spot
    time
    day_time
    organization
    behavior
    help

    constructor(c_id, form){
        
        this['c_id'] = c_id,
        this['first_time'] = form['first_time'],
        this['spot'] = form['spot'] != undefined ? form['spot'] : null,
        this['time'] = form['time'] != undefined ? form['time'] : null,
        this['day_time'] = form['day_time'].replace(/_/g, " "),
        this['organization'] = form['organization'],
        this['behavior'] = form['behavior'],
        this['help'] = form['help']
    }

    toDao(){
        return {
            CampaignId : this.c_id,
            First_Participation : this.first_time,
            Local : this.spot,
            Period : this.time,
            DayTimeParticipation : this.day_time,
            Evaluation_Campaign : this.organization,
            Evaluation_WareHouse : this.behavior,
            Self_Evaluation : this.help
        }
    }
}