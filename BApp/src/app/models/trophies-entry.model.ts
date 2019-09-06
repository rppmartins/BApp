export class TrophiesEntry{

    id
    name
    participations

    constructor(entry){
        this.id = entry['Id'],
        this.name = this.formatName(entry['Name']),
        this.participations = entry['participations']
    }

    formatName(full_name){
        const name = full_name.split(' ')
        return name.length > 2 ? `${name[0]} ${name[name.length-1]}` : full_name
    }
}