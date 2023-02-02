import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import ColumnView from './ColumnView';
import GradientButton from './buttons/GradientButton';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { renderAge } from '../util';
import SpaceBetweenContainer from './containers/SpaceBetweenContainer';
import { NormalLabel } from './Label';

const TeacherLeftDrawer = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const { teacherGyms = [] } = useSelector((state) => state.teacherGym);

  return (
    <View style={styles.container}>
      <ScrollView style={{ paddingHorizontal: 28 }}>
        <View style={styles.menuTopContainer}>
          <Text style={styles.boldFont}>{user?.email}</Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={() => {
                navigation.closeDrawer();
                navigation.navigate('TeacherAccountSetting');
              }}
            >
              <Image
                source={require('../assets/icons/home/myInfo.png')}
                style={{ width: 27, height: 21 }}
                resizeMode='contain'
              />
              <Text style={{ paddingTop: 5, color: '#555555', fontSize: 12 }}>
                계정설정
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <View style={styles.userBox}>
            {user?.profileImage ? (
              <View>
                <Image
                  style={styles.profileImageBox}
                  source={{ uri: user.profileImage }}
                />
              </View>
            ) : (
              <View>
                <View style={styles.profileImageBox}>
                  <Image
                    style={styles.profileImage}
                    source={require('../assets/images/home/userImage.png')}
                  />
                </View>
              </View>
            )}

            <View style={{ marginLeft: 12 }}>
              <Text style={styles.boldFont}>
                {user?.koreanName} ({user?.englishName})
              </Text>
              <Text
                style={{
                  marginTop: 6,
                  color: '#555555',
                  fontSize: 12,
                  lineHeight: 16,
                }}
              >
                {moment(user?.birth).format('YYYY.MM.DD')} (
                {renderAge(user?.birth)}세){/*1987.07.22(34년 1개월 22일)*/}
              </Text>
              <TouchableOpacity
                style={styles.enrollContainer}
                onPress={() => {
                  navigation.closeDrawer();
                  navigation.navigate('TeacherProfileEnroll');
                }}
              >
                <Text style={styles.enrollProflie}>프로필 등록</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.usageDataBox1}>
            <Text style={styles.boldFont}>근무지 정보</Text>
          </View>
          {teacherGyms.length === 0 && (
            <NormalLabel
              text={'등록된 근무지 정보가 없습니다.'}
              style={{ marginTop: 16 }}
            />
          )}
          {teacherGyms?.map((gym) => (
            <View key={gym.id} style={styles.usageDateBox}>
              <SpaceBetweenContainer>
                <ColumnView>
                  <Text style={{ color: '#aaa', fontSize: 10, lineHeight: 14 }}>
                    강습 시작일 : {user?.firstLessonDate || '-'}
                  </Text>
                  <Text style={styles.boldFont}>{gym.gymName}</Text>
                </ColumnView>

                <TouchableOpacity
                  style={styles.sceduleContainer}
                  onPress={() => {
                    navigation.closeDrawer();
                    // navigation.navigate('WorkTimeSetup');
                    navigation.navigate('ScheduleRegistration');
                  }}
                >
                  <Text style={styles.enrollProflie}>스케줄 등록</Text>
                </TouchableOpacity>
              </SpaceBetweenContainer>
            </View>
          ))}
        </View>
      </ScrollView>
      <GradientButton
        style={{
          justifyContent: 'flex-end',
          marginBottom: 105,
          marginHorizontal: 25,
        }}
        onPress={() => {
          navigation.closeDrawer();
          navigation.navigate('TeacherCenterList');
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: '#fff',
            fontWeight: '700',
          }}
        >
          주변센터 검색
        </Text>
      </GradientButton>
    </View>
  );
};

const styles = StyleSheet.create({
  sceduleContainer: {
    width: 60,
    height: 21,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#8082FF',
    marginTop: 12,
    marginRight: 10,
  },
  enrollContainer: {
    width: 70,
    height: 21,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#8082FF',
    marginTop: 12,
    justifyContent: 'center',
  },
  enrollProflie: {
    width: 60,
    fontSize: 10,
    height: 15,
    alignSelf: 'center',
    marginVertical: 2,
    color: '#8082FF',
    textAlign: 'center',
  },
  container: {
    paddingTop: getStatusBarHeight(),
    flex: 1,
    marginTop: 10,

    backgroundColor: '#FBFBFB',
  },
  menuTopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boldFont: {
    fontSize: 15,
    fontWeight: '600',
    color: 'black',
  },
  header: {
    marginTop: 10,
    marginHorizontal: 28,
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  userBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 30,
  },
  profileImageBox: {
    borderRadius: 46,
    width: 92,
    height: 92,
    borderColor: '#E3E5E5',
    borderWidth: 1,
    backgroundColor: '#fff',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 57,
  },
  usageDataBox1: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    // borderBottomColor: '#aaa',
    marginTop: 8,
    paddingBottom: 12,
    marginBottom: 2,
  },
  usageDateBox: {
    paddingLeft: 10,
    paddingVertical: 10,
    shadowColor: '#aaa',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    backgroundColor: '#fff',
    elevation: 2,
    marginTop: 6,
  },
});

export default TeacherLeftDrawer;
