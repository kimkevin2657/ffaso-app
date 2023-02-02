import React from 'react';
import { Text, StyleSheet, Image, ScrollView } from 'react-native';
import ColumnView from '../../ColumnView';
import { NormalBoldLabel, NormalLabel } from '../../Label';
import RowContainer from '../../containers/RowContainer';
import { commaNum } from '../../../util';
import Touchable from '../../buttons/Touchable';

const SubTitle = ({ title, price }) => {
  return (
    <RowContainer style={styles.subTitle}>
      <NormalBoldLabel text={title} />
      <RowContainer>
        <NormalBoldLabel
          text={commaNum(price) + ' 원'}
          style={{ color: '#8082ff' }}
        />
        <Image
          source={require('../../../assets/images/memberShipRes/memberShipCheck.png')}
          style={styles.checkSize}
          resizeMode={'contain'}
        />
      </RowContainer>
    </RowContainer>
  );
};

export default SubTitle;

export const SubTitleInfo = ({ title, onPress, isOpen, content }) => {
  return (
    <ColumnView style={styles.centerContianer}>
      <RowContainer style={styles.subTitle2}>
        <Text style={styles.infoStyle}>{title}</Text>
        <Touchable onPress={onPress}>
          <Image
            source={require('../../../assets/images/memberShipRes/memberShipUnCheck.png')}
            style={styles.checkSize}
            resizeMode={'contain'}
          />
        </Touchable>
      </RowContainer>

      {isOpen && (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 30 }}
          nestedScrollEnabled={true}
          style={styles.agreementContainer}
        >
          <NormalLabel text={content} style={styles.agreementContent} />
        </ScrollView>
      )}
    </ColumnView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
  },
  centerContianer: {
    flex: 1,
    marginHorizontal: 24,
    paddingTop: 25,
  },
  subTitle: {
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 24,
  },
  subTitle2: {
    justifyContent: 'space-between',
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#E3E5E5',
  },
  infoStyle: {
    fontSize: 15,
    lineHeight: 17,
    color: '#555555',
  },
  checkSize: {
    height: 15,
    width: 15,
    marginLeft: 5,
  },
  agreementContainer: {
    height: 70,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#aaa',
    color: '#aaa',
    marginTop: 9,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  agreementContent: {
    color: '#aaa',
    fontSize: 10,
  },
});
