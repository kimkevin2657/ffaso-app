import React, { useCallback, useEffect, useState } from 'react';
import api from '../api/api';
import { Alert } from 'react-native';

export function useFetch(url) {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const callUrl = useCallback(async () => {
    try {
      const { data } = await api.get(url);
      setPayload(data);
    } catch (e) {
      console.log(e.response);
      console.log(e);
      console.log('err');
      setError('error!!');
      if (e.response?.data && e.response?.data?.msg) {
        Alert.alert(e.response?.data?.msg);
      }
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    callUrl().catch((e) => console.log(e));
  }, []);

  return { payload, loading, error };
}
