export class Invitation{

    c_id
    v_id
    participation
    day = null
    time = null

    constructor(c_id, v_id, form){
        
        this.c_id = c_id,
        this.v_id = v_id,
        this.participation = form['participation']
        
        if(form['day_time'] != undefined){
            const day_time = form['day_time'].split('_')
            this.day = day_time[0]
            this.time = day_time[1]
        }
    }

    toDao(){
        return {
            CampaignId : this.c_id,
            VoluntaryId : this.v_id,
            Answer : this.participation,
            DayC : this.day,
            Schedule : this.time
        }
    }
}