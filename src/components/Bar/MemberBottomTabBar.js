import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Touchable from '../buttons/Touchable';
import { NormalLabel } from '../Label';

const PATH = [
  {
    focusIcon: require('../../assets/icons/bottomTab/home_focus.png'),
    unFocusIcon: require('../../assets/icons/bottomTab/home_unFocus.png'),
  },
  {
    focusIcon: require('../../assets/icons/bottomTab/nearby_focus.png'),
    unFocusIcon: require('../../assets/icons/bottomTab/nearby_unFocus.png'),
  },
  {
    focusIcon: require('../../assets/icons/bottomTab/scheduler_focus.png'),
    unFocusIcon: require('../../assets/icons/bottomTab/scheduler_unFocus.png'),
  },
  {
    focusIcon: require('../../assets/icons/bottomTab/talk_focus.png'),
    unFocusIcon: require('../../assets/icons/bottomTab/talk_unFocus.png'),
  },
  {
    focusIcon: require('../../assets/icons/bottomTab/myPage_focus.png'),
    unFocusIcon: require('../../assets/icons/bottomTab/myPage_unFocus.png'),
  },
];

const TabBarIcon = ({ source }) => {
  return <Image source={source} style={styles.icon} />;
};

function MemberBottomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          return (
            <Touchable key={index} onPress={onPress} style={styles.bottomBtn}>
              <TabBarIcon
                source={
                  isFocused ? PATH[index].focusIcon : PATH[index].unFocusIcon
                }
              />
              <NormalLabel
                style={{
                  color: isFocused ? '#8082FF' : '#000',
                  marginTop: 8,
                  fontSize: 12,
                  lineHeight: 15,
                }}
                text={label}
              />
            </Touchable>
          );
        })}
      </View>
    </View>
  );
}

export default MemberBottomTabBar;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 80,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  bottomBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 25,
    height: 25,
  },
});
