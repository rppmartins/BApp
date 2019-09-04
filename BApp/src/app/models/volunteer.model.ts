export class Volunteer{

    id 
    user_name
    nif
    birth_date
    nationality
    city
    address
    zipcode
    email
    cellphone
    phone
    type
    title

    constructor(volunteer, email){
        
        this.id = volunteer['Id'],
        this.user_name = volunteer['Name']
        this.nif = volunteer['NIF']
        this.birth_date = volunteer['Birth_Date']
        this.nationality = volunteer['Nationality']
        this.city = volunteer['Locality']
        this.address = volunteer['Address']
        this.zipcode = volunteer['ZipCode']
        this.email = email
        this.cellphone = volunteer['Phone']
        this.phone = volunteer['Telephone']
        this.type = volunteer['Type'] == undefined ? "Campanha" : volunteer['Type']
        this.title = volunteer['Title'] == undefined ? null : volunteer['Title']
    }

    toDao(){
        return {
            Name : this.user_name,
            NIF : this.nif,
            Phone : this.cellphone,
            Telephone : this.phone,
            Email : this.email,
            Birth_Date : this.birth_date,
            Nationality : this.nationality,
            Address : this.address,
            Locality : this.city,
            ZipCode : this.zipcode,
            Type : this.type,
	        Title : null
        }
    }
}