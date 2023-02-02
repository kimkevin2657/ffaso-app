import { CommonActions, StackActions } from '@react-navigation/native';
import moment from 'moment';

export const commaNum = (num) => {
  if (isNaN(parseInt(num))) {
    return num;
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// e.g. NestingNavigate('MemberMyPage', 'MemberAccountSetting')
export const nestingNavigate = (navigation, path1, path2, params) => {
  navigation.navigate(path1, { screen: path2, params });
};

export const resetNavigation = (navigation, path) => {
  const reset = CommonActions.reset({
    index: 0,
    routes: [{ name: path }],
    // key: null,
  });
  navigation.dispatch(reset);
};

export const resetNavigationWithParams = (navigation, path, params) => {
  const reset = CommonActions.reset({
    index: 0,
    routes: [{ name: path, params }],
    // key: null,
  });
  navigation.dispatch(reset);
};

export const resetNestedNavigation = (navigation, path1, path2, params) => {
  const reset = {
    ...CommonActions.reset({
      index: 0,
      routes: [
        {
          name: path1,
          state: {
            routes: [
              {
                name: path2,
                params,
              },
            ],
          },
        },
      ],
    }),
  };
  navigation.dispatch(reset);
};

export const calcDistance = (lat1, lon1, lat2, lon2, unit) => {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    let radlat1 = (Math.PI * lat1) / 180;
    let radlat2 = (Math.PI * lat2) / 180;
    let theta = lon1 - lon2;
    let radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === 'K') {
      dist = dist * 1.609344;
    }
    if (unit === 'N') {
      dist = dist * 0.8684;
    }
    return dist;
  }
};

export const renderDistance = (item, userLatitude, userLongitude) => {
  let locationValue = parseInt(
    calcDistance(
      item.latitude,
      item.longitude,
      userLatitude,
      userLongitude,
      'K'
    ) * 1000
  );
  return locationValue / 1000 >= 10
    ? '10km 이상'
    : locationValue >= 1000
    ? (locationValue / 1000).toFixed(1) + 'km 이내'
    : locationValue + 'm 이내';
};

export const renderAgo = (createdAt) => {
  let days = moment().diff(createdAt, 'days');
  if (days < 1) {
    return '오늘';
  } else if (days < 7) {
    return `${days}일 전`;
  } else {
    return moment(createdAt).format('YYYY-MM-DD');
  }
};

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
}

export const renderAge = (date) => {
  return moment().format('YYYY') - moment(date).format('YYYY') + 1;
};

export const operationHour = (date) => {
  try {
    let timeData = date.split(':');
    let hour = Number(timeData[0]);

    let convertTime = hour;

    return convertTime;
  } catch (e) {
    return null;
  }
};
