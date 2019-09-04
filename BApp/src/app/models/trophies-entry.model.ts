export class TrophiesEntry{

    id
    name
    participations

    constructor(entry){
        this.id = entry['Id'],
        this.name = entry['Name'],
        this.participations = entry['Participations']
    }
}