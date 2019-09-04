export class VolunteerView{

    header_name
    full_name
    profile_url
    info

    constructor(user, stored_name, stored_image){
        
        let header_name = ''
        
        if(stored_name != undefined) header_name = stored_name
        else {
            const full_name = user['user_name'].split(' ')
            header_name = `${full_name[0]} `
            if(full_name.length > 1) header_name +=  `${full_name[full_name.length-1]}`
        }
        
        const image = stored_image == undefined ? "/assets/default_profile.jpg" : stored_image

        this.header_name = header_name,
        this.full_name = user['user_name'],
        this.profile_url = image,
        this.info = {
            'Numero identificação fiscal: ':`${user['nif']}`,
            'Idade: ':`${this.getAge(user['birth_date'])} anos`,
            'Nacionalidade: ':`${user['nationality']}`,
            'Cidade: ':`${user['city']}`,
            'Morada: ':`${user['address']}`,
            'Código Postal: ':`${user['zipcode']}`,
            'Email: ':`${user['email']}`,
            'Telemovel: ':`${user['cellphone']}`,
            'Telefone: ': user['phone'] == "" ? "Sem Informação" : `${user['phone']}`
        }
    }

    private getAge(birth_date){
        const birth_arr = birth_date.split("-")
        const birth_year = birth_arr[0]
        const birth_month = birth_arr[1]
        const birth_day = birth_arr[2]
    
        const curr_date = new Date()
        const curr_year = curr_date.getFullYear()
        const curr_month = curr_date.getMonth()+1
        const curr_day = curr_date.getDate()
    
        let age = curr_year - parseInt(birth_year)
    
        if(birth_month > curr_month) age -= 1
        else if(birth_month == curr_month && birth_day > curr_day) age -= 1
    
        return age
    }
}