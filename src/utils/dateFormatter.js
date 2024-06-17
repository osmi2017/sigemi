// src/utils/dateFormatter.js
import moment from 'moment';
import 'moment/locale/fr';


export const formatDate = (dateString, locale) => {
  moment.locale(locale);
  return moment(dateString).format('LLL'); // LLL is a localized format for date and time
};
