import React from 'react';
import {
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  NativeModules,
} from 'react-native';
import { isIos } from '../../constants/constants';

const { StatusBarManager } = NativeModules;

export const Container = ({
  children,
  style,
  contentContainerStyle,
  isOnlyStatusBarHeight,
}) => {
  const [statusBarHeight, setStatusBarHeight] = React.useState(0);

  React.useEffect(() => {
    isIos
      ? StatusBarManager.getHeight((statusBarFrameData) => {
          setStatusBarHeight(statusBarFrameData.height);
        })
      : null;
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ ...styles.container, ...style }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={
        isOnlyStatusBarHeight ? statusBarHeight : statusBarHeight + 44
      }
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={contentContainerStyle}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },
});
