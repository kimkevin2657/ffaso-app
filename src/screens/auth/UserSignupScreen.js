import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import SignupForm from '../../components/signup/SignupForm';

const UserSignupScreen = ({ route }) => {
  const [type, setType] = useState(route.params.type);
  return (
    <ScrollView>
      {/*<SignupTop />*/}
      <SignupForm type={type} />
    </ScrollView>
  );
};

export default UserSignupScreen;
