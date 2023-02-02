import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { NormalBoldLabel, NormalLabel } from '../../components/Label';
import { useSelector } from 'react-redux';
import api from '../../api/api';
import moment from 'moment';
import { Container } from '../../components/containers/Container';

const AlertsScreen = ({ navigation }) => {
  const { token } = useSelector((state) => state.auth);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    getAlerts();
  }, []);

  const getAlerts = useCallback(async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      };

      const { data } = await api.get(`alerts/?isMine=true`, config);
      setAlerts(data);
    } catch (e) {
      console.log('e', e);
      console.log('e.res', e.response);
    }
  }, []);

  return (
    <View style={{ backgroundColor: '#FBFBFB', flex: 1 }}>
      <FlatList
        contentContainerStyle={styles.container}
        data={alerts}
        renderItem={({ item }) => <Alert {...item} />}
        keyExtractor={(item, idx) => item.id + idx.toString()}
      />
    </View>
  );
};

export default AlertsScreen;

const Alert = ({ content, createdAt }) => (
  <View style={styles.listBox}>
    <NormalBoldLabel text={content} style={styles.content} />
    <NormalLabel
      text={moment(createdAt).format('YYYY.MM.DD')}
      style={styles.date}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, backgroundColor: '#FBFBFB' },
  listBox: {
    paddingTop: 25,
    borderBottomWidth: 1,
    borderColor: '#E3E5E5',
  },
  content: { color: '#555' },
  date: {
    textAlign: 'right',
    color: '#AAA',
    marginVertical: 5,
    fontSize: 12,
    lineHeight: 16,
  },
});
