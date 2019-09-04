export class NotificationsEntry{

    id
    c_id
    name
    date
    type
    read
    changed

    constructor(entry){
        this.id = entry['Id'],
        this.c_id = entry['C_Id'],
        this.name = entry['Campaign_Name'],
        this.date = entry['Campaign_Date'],
        this.type = entry['Type'],
        this.read = entry['Display'],
        this.changed = false
    }

    toDao(){
        return {
            Id : this.id,
            C_Id : this.c_id,
            Campaign_Name : this.name,
            Campaign_Date : this.date,
            Type : this.type,
            Display : this.read
        }
    }
}