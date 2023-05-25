import dayjs from "dayjs";

export const parseDate = (date: number) => {
    if(!date) return ''

    return dayjs(date).format("H:mm DD-MM-YYYY")
}


export const getFileType = (file: File) => {
    const types = file.type.split('/');
    
    return types[types.length - 1];
}

export const objectKeys = <T extends object>(obj?: T): (keyof T)[] => {
    if(!obj) return []
    return Object.keys(obj) as (keyof T)[]
  }

  export const objectValues = <T extends object>(obj?: T): T[keyof T][] => {
    if(!obj) return []
    return Object.values(obj) as T[keyof T][]
  }

  export function makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export function validatePhoneNumber(phoneNumber: string) {
    // Regular expression to match phone numbers in the following formats:
    // (XXX) XXX-XXXX or XXX-XXX-XXXX or XXX-XXX-XXXXX
    const regex = /^\((\d{3})\) (\d{3})-(\d{4})$/;
  
    // Return true if the phone number matches the regular expression, false otherwise.
    return regex.test(phoneNumber);
  }