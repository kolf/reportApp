import * as React from 'react';

//获取当前日期，格式YYYY-MM-DD
function getFormatDay(date: Date) {
  const day = date.getDate();
  const month = date.getMonth() + 1; //注意月份需要+1
  const year = date.getFullYear();
  //补全0，并拼接
  return year + '-' + completeDate(month) + '-' + completeDate(day);
}

//获取当前时间，格式YYYY-MM-DD HH:mm:ss
function getFormatTime(date: Date) {
  var h = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();
  //补全0，并拼接
  return (
    getFormatDay(date) +
    ' ' +
    completeDate(h) +
    ':' +
    completeDate(m) +
    ':' +
    completeDate(s)
  );
}

//补全0
function completeDate(value) {
  return value < 10 ? '0' + value : value;
}

export const useLocalDate = () => {
  const [date, setDate] = React.useState(new Date());
  const timer = React.useRef(null);

  React.useEffect(() => {
    timer.current = setInterval(() => {
      if (timer.current) {
        setDate(new Date());
      }
    }, 1000);
    return () => {
      clearInterval(timer.current);
      timer.current = null;
    };
  }, []);

  return {date: getFormatTime(date), timer};
};
