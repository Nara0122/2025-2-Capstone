import {dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay} from 'date-fns';
import enES from 'date-fns/locale/es';
import ko from 'date-fns/locale/ko';

const locales = {
  'ko': ko,
}

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});