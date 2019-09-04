export class HistoryEntry{

    text
    time

    constructor(entry){
        this.text = entry['Description'],
        this.time = entry['EventDate'].split('T')[0]
    }
}