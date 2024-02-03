// import 'intl';
// import 'intl/locale-data/jsonp/en';

export function strToDate(dateStr: any): any{

    if(dateStr==null || dateStr==''){
        return '';
    }

    const inputDate = new Date(dateStr);

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata', // Set the timezone to IST
      };

    const dateFormatter = new Intl.DateTimeFormat('en-IN', options);
    
    const istFormattedDate = dateFormatter.format(inputDate);

    const date = istFormattedDate.split(', ')[0].replaceAll('-', ' ');
    const hours = istFormattedDate.split(', ')[1].split(':')[0];
    const minutes = istFormattedDate.split(', ')[1].split(':')[1].split(' ')[0];
    const meridian = istFormattedDate.split(', ')[1].split(':')[1].split(' ')[1].toUpperCase();
    const datetime = {date, hours, minutes, meridian};

    return datetime;
}

export function dateToStr(date: any, hours: any, minutes: any, meridian: any): any{
    if(meridian=='PM' && hours!='12'){
        hours = Number(hours) + 12;
    }
    if(meridian=='AM' && hours==12){
        hours=0;
    }
    const timestamp = Number(date) + Number(hours)*60*60*1000 + Number(minutes)*60*1000;
    const datetime = (new Date(timestamp)).toISOString();

    return datetime;
}