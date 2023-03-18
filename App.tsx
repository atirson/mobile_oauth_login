import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import axios from 'axios';

WebBrowser.maybeCompleteAuthSession();

export type UserAuthProps = {
  params: {
    code: string,
  },
  type: string,
}

export type UserTokenProps = {
  access_token: string,
  scope: string,
  token_type: string,
}

export default function App() {
  const [user, setUser] = useState<any>()

  const handleLoginSocial = async () => {
    try {
      const CLIENT_ID = "";
      const CLIENT_SECRET = "";
      const REDIRECT_URI = "https://auth.expo.io/@atirson/mobile_oauth_login";
      const SCOPE = encodeURI("user repo");
      const RESPONSE_TYPE = "code";

      const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&response_type=${RESPONSE_TYPE}`;

      const response = await AuthSession.startAsync({ authUrl }) as UserAuthProps;
      console.log(response)
      
      if (response.type === 'success') {
        const { code } = response.params;
        const { data } = await axios.post<UserTokenProps>('https://github.com/login/oauth/access_token', {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        })

        console.log(data)
        await getUserInfoByToken(data.access_token)
      }
      
    } catch (error) {
      console.log(error)
    }
  }

  const getUserInfoByToken = async (token: string) => {
    const { data } = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      }}
    )

    console.log('User info: ' + data.avatar_url)
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
      <Button title='Click me' onPress={handleLoginSocial} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
