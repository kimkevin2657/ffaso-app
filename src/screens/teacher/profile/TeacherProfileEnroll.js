import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Alter,
} from 'react-native';
import { SCREEN_HEIGHT } from '../../../constants/constants';
import api from '../../../api/api';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Touchable from '../../../components/buttons/Touchable';
import CenterModal from '../../../components/modal/CenterModal';
import {
  NoneLabel,
  NormalBoldLabel,
  NormalLabel,
} from '../../../components/Label';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RowContainer from '../../../components/containers/RowContainer';
import { Container } from '../../../components/containers/Container';

const TeacherProfileEnroll = ({ navigation }) => {
  const [careerList, setCareerList] = useState([]);
  const [educationList, setEducationLsit] = useState([]);
  const [certificateList, setCertificateList] = useState([]);
  const [selfIntroductionList, setSelfIntroductionList] = useState([]);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [tempObject, setTempObject] = useState(Object);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userInfoType, setUserInfoType] = useState('');

  const [timesPressed, setTimesPressed] = useState(0);

  const auth = useSelector((state) => state.auth);
  const { user, token } = auth;

  const TouchableLongPress = ({ children, menu, passType, navi }) => {
    // console.log('42');
    return (
      <TouchableOpacity
        delayLongPress={5000}
        onLongPress={() => {
          // console.log('47 onLongPress');
          setTempObject(menu);
          setUserInfoType(passType);
          setIsDeleteModalOpen(true);
        }}
        onPress={() => {
          // console.log('53 onPress');
          navigation.navigate(navi, { content: menu });
        }}
      >
        {children}
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Touchable
          onPress={() => setIsInfoModalOpen(true)}
          style={{ padding: 4 }}
        >
          <Image
            style={styles.iconActionable}
            source={require('../../../assets/icons/TeacherProfileEnroll/icon.png')}
          />
        </Touchable>
      ),
    });
    getTeacherInfos();
  }, []);

  const getTeacherInfos = async () => {
    try {
      const { data } = await api.get(`teacher-infos?userId=${user.id}`);
      setCareerList(data?.careers);
      setCertificateList(data?.certificates);
      setEducationLsit(data?.educations);
      setSelfIntroductionList(data?.introductions);
    } catch (err) {
      console.log('err', err);
      console.log('err', err.response);
    }
  };

  const deleteTeacherInfos = async () => {
    try {
      await api.delete(
        `teacher-infos?type=${userInfoType}&id=${tempObject.id}`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      getTeacherInfos();
    } catch (e) {
      console.log('err', e);
      console.log('err.response', e.response);
    }
  };

  return (
    <Container>
      <CenterModal
        visible={isInfoModalOpen}
        onRequestClose={() => setIsInfoModalOpen(false)}
        style={{ paddingTop: 25, paddingBottom: 24 }}
      >
        <Text style={styles.infoModalText}>
          ????????? ??????{'\n\n'}
          <NormalBoldLabel
            text={"'??????????????? ????????? ??? ?????????' "}
            style={styles.infoModalText}
          />
          ???????????? ????????? ?????? ???????????? :){'\n\n'}
          1. ???????????? ???????????? ????????? ?????? ????????? ????????? ????????? ??? ????????????.
          {'\n'}2. ?????? ????????? ??????????????? ???????????? ???????????? ?????? ????????? ?????????
          ?????? ??? ????????? ??????????????????.{'\n'}3. ???????????? ???????????? ?????? ??????
          ???????????? ?????? ????????????, ????????????, ?????????????????? ????????? ??? ????????????.{'\n'}-
          ???????????? ??? ????????? ???????????? ?????????-???????????? ????????????, ????????? ????????? ??????
          ????????? ????????????, ????????? ?????? ????????? ?????? ??? ?????? ?????????.{'\n'}-
          ??????????????? ??? ????????? ????????? ???????????? ????????? ?????? ????????? ????????? ??? ??????
          ?????????. ?????? ?????? ???????????? ????????? ????????? ????????? ??? ?????? ?????????
          ??????????????????.
        </Text>
        <TouchableOpacity
          style={styles.infoModalBtn}
          onPress={() => setIsInfoModalOpen(false)}
        >
          <NormalLabel text={'??????'} />
        </TouchableOpacity>
      </CenterModal>
      {/* ?????? ????????? ?????? ?????? */}
      <CenterModal
        visible={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        style={{
          paddingTop: 25,
          paddingBottom: 24,
          alignItems: 'center',
        }}
      >
        <AntDesign
          name='exclamationcircle'
          size={33.33}
          style={{ color: 'rgba(128, 130, 255, 0.3)' }}
        />
        <RowContainer style={{ marginBottom: 16, marginTop: 23.33 }}>
          <NoneLabel text={'?????? ?????????'} style={styles.deleteModalMainText} />
          <NoneLabel text={' ?????? '} style={styles.deleteModalMainText2} />
          <NoneLabel
            text={'???????????????????'}
            style={styles.deleteModalMainText}
          />
        </RowContainer>

        <NoneLabel
          text={'?????? ??? ????????? ?????? ????????????.'}
          style={styles.deleteModalBottomText}
        />

        <RowContainer style={{ marginTop: 30 }}>
          <TouchableOpacity
            style={styles.deleteModalCancleButton}
            onPress={() => setIsDeleteModalOpen(false)}
          >
            <NormalLabel text={'??????'} style={styles.modalButtonText} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteModalButton}
            onPress={() => {
              deleteTeacherInfos();
              setIsDeleteModalOpen(false);
            }}
          >
            <NormalLabel text={'??????'} style={styles.modalButtonText} />
          </TouchableOpacity>
        </RowContainer>
      </CenterModal>

      <View style={{ paddingHorizontal: 24 }}>
        <View style={{ marginTop: 24 }}>
          <Text style={styles.careerInput}>?????? ??????</Text>

          <View style={styles.element}>
            <Image
              style={styles.licenseIcon}
              source={require('../../../assets/icons/TeacherProfileEnroll/license.png')}
            />
            <Text style={styles.titleText}>??????</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('CareerAdd')}
            >
              <Text style={styles.addButtonText}>??????</Text>
            </TouchableOpacity>
          </View>
          {/* ?????? map start */}
          {careerList.map((menu, index) => (
            <TouchableLongPress
              navi={'CareerModify'}
              menu={menu}
              passType='??????'
            >
              <View style={{ marginTop: 10 }} key={index}>
                <View style={styles.inputDateBox}>
                  <View style={{ alignItems: 'flex-start' }}>
                    <Text style={styles.dates}>
                      {menu?.entryDate}
                      {' ~ '}
                      {menu?.existDate === null ? '?????? ???' : menu?.existDate}
                    </Text>
                    <Text style={styles.infoTitle}>{menu?.name}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.info}>
                      {menu?.department}
                      {'/'}
                      {menu?.rank}
                    </Text>
                    <Text style={styles.info}>{menu?.description}</Text>
                  </View>
                </View>
              </View>
            </TouchableLongPress>
          ))}
          {/* ?????? map start */}
        </View>

        <View style={{ marginTop: 24 }}>
          <Text style={styles.careerInput}>?????? ??????</Text>
          <View style={styles.element}>
            <Image
              style={styles.licenseIcon}
              source={require('../../../assets/icons/TeacherProfileEnroll/license.png')}
            />
            <Text style={styles.titleText}>??????</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AcademicsAdd')}
            >
              <Text style={styles.addButtonText}>??????</Text>
            </TouchableOpacity>
          </View>

          {educationList.map((menu, index) => (
            <TouchableLongPress
              navi={'AcademicsModify'}
              menu={menu}
              passType='??????'
            >
              <View style={{ marginTop: 10 }} key={index}>
                <View style={styles.inputDateBox}>
                  <View style={{ alignItems: 'flex-start' }}>
                    <Text style={styles.dates}>
                      {menu?.entryDate}
                      {' ~ '}
                      {menu?.existDate}
                    </Text>
                    <Text style={styles.infoTitle}>{menu?.name}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.info}>{menu?.major}</Text>
                    <Text style={styles.info}>{menu?.degree}</Text>
                  </View>
                </View>
              </View>
            </TouchableLongPress>
          ))}
        </View>

        <View style={{ marginTop: 24 }}>
          <Text style={styles.careerInput}>?????????/?????? ??????</Text>
          <View style={styles.element}>
            <Image
              style={styles.licenseIcon}
              source={require('../../../assets/icons/TeacherProfileEnroll/license.png')}
            />
            <Text style={styles.titleText}>?????????/??????</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('CertificateAdd')}
            >
              <Text style={styles.addButtonText}>??????</Text>
            </TouchableOpacity>
          </View>

          {certificateList.map((menu, index) => (
            <TouchableLongPress
              navi={'CertificateModify'}
              menu={menu}
              passType='?????????'
            >
              <View style={{ marginTop: 10 }} key={index}>
                <View style={styles.inputDateBox}>
                  <View style={{ alignItems: 'flex-start' }}>
                    <Text style={styles.dates}>
                      {moment(menu?.createdAt).format('YYYY-MM-DD')}
                    </Text>
                    <Text style={styles.infoTitle}>{menu?.name}</Text>
                  </View>
                </View>
              </View>
            </TouchableLongPress>
          ))}
        </View>

        <View style={{ marginTop: 24, marginBottom: SCREEN_HEIGHT * 0.135 }}>
          <Text style={styles.careerInput}>??????????????? ??????</Text>
          <View style={styles.element}>
            <Image
              style={styles.licenseIcon}
              source={require('../../../assets/icons/TeacherProfileEnroll/license.png')}
            />
            <Text style={styles.titleText}>???????????????</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('SelfInfoAdd')}
            >
              <Text style={styles.addButtonText}>??????</Text>
            </TouchableOpacity>
          </View>

          {selfIntroductionList.map((menu, index) => (
            <TouchableLongPress
              navi={'SelfInfoModify'}
              menu={menu}
              passType='???????????????'
            >
              <View style={{ marginTop: 10 }} key={index}>
                <View style={styles.inputDateBox}>
                  <View style={{ alignItems: 'flex-start' }}>
                    <Text style={styles.dates}>
                      {moment(menu?.createdAt).format('YYYY-MM-DD')}
                    </Text>
                    <Text style={styles.infoTitle}>{menu?.title}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.info}>
                      ????????? ?????? : {menu?.wantedJob}
                    </Text>
                    <Text style={styles.info}>
                      ????????? ?????? : {menu?.wantedRank}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableLongPress>
          ))}
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    lineHeight: 22,
    fontSize: 18,
  },
  deleteModalButton: {
    backgroundColor: '#8082FF',
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5.5,
    borderRadius: 10,
  },
  deleteModalCancleButton: {
    backgroundColor: '#AAA',
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5.5,
    borderRadius: 10,
  },
  deleteModalMainText: { fontSize: 18, fontWeight: '700', lineHeight: 24 },
  deleteModalMainText2: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    color: '#8082FF',
  },
  deleteModalBottomText: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: '#AAA',
  },

  dates: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#AAAAAA',
  },
  titleInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
  },
  backActionable: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
  },
  iconActionable: {
    resizeMode: 'contain',
    width: 25,
    height: 25,
  },
  containerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  inputDateBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    shadowColor: '#171717',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  careerInput: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 15,
    color: '#000000',
  },
  element: {
    flexDirection: 'row',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#E3E5E5',
  },
  licenseIcon: {
    resizeMode: 'contain',
    width: 30,
    height: 20,
    marginBottom: 8,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 15,
    paddingLeft: 6,
    color: '#555',
  },
  addButton: {
    position: 'absolute',
    right: 0,
    bottom: 6,
    width: 40,
    height: 24,
    borderRadius: 5,
    backgroundColor: '#8082FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  info: {
    fontWeight: 'bold',
    color: '#555555',
  },
  infoTitle: {
    fontWeight: 'bold',
    color: '#555555',
    marginTop: 4,
  },
  infoModalText: {
    color: '#555',
    fontSize: 12,
    lineHeight: 18,
  },
  infoModalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18.5,
    borderWidth: 1,
    borderColor: '#e3e5e5',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 23,
  },
});

export default TeacherProfileEnroll;
