import Handlebars from 'hbsfy/runtime';
import moment from 'moment';

export default class ViewHelper{
  initialize(){
    Handlebars.registerHelper('dateFormat', function (dateString, format) {
      return moment(dateString).format(format);
    });

    Handlebars.registerHelper('dateFormatToLocal', function (dateString, format) {
      var localTime  = moment.utc(dateString).toDate();
      return moment(localTime).format(format);
    });

    /*jshint maxcomplexity: 20 */
    Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
      switch (operator) {
        case '==':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
        case 'in':
          if (v2.indexOf(v1) !== -1){
            return options.fn(this);
          } else {
            return options.inverse(this);
          }
        /* falls through */
        default:
          return options.inverse(this);
      }
    });
    /*jshint maxcomplexity: 15 */

    Handlebars.registerHelper('sumFormat', function (value) {
      if (!isNaN(parseFloat(value)) && isFinite(value)) {
        value = parseFloat(value);
        let postfix;
        let d = Math.round(value * 100 - Math.floor(value) * 100);
        if (d === 0) {
          postfix = '00';
        } else if (d < 10) {
          postfix = `0${d}`;
        } else {
          postfix = d.toString();
        }
        value = Math.floor(value).toString().replace(/./g, function (c, i, a) {
          return i && c !== ' ' && ((a.length - i) % 3 === 0) ? ' ' + c : c;
        });
        return `${value}.${postfix}`;
      } else {
        return '';
      }
    });

    Handlebars.registerHelper('include', function(template) {
      return new Handlebars.SafeString(Handlebars.partials[template]);
    });
  }
}
