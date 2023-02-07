import React, {useState, useRef} from 'react';
/* 아임포트 모듈을 불러옵니다. */

/* 로딩 컴포넌트를 불러옵니다. */
import {Platform, Linking, Alert} from 'react-native';
import Loading from '../../../components/Loading';
import { useSelector } from 'react-redux';
import { BackHandler, Text } from 'react-native';
import WebView from 'react-native-webview';
import WEBVIEW_SOURCE_HTML from './webviewhtml';
import webview_gen from './webviewhtml';
import DeviceInfo from 'react-native-device-info';

const createOid = () => {
    const now_date = new Date();
    let now_year = now_date.getFullYear();
    let now_month = now_date.getMonth() + 1;
    now_month = now_month < 10 ? '0' + now_month : now_month;
    let now_day = now_date.getDate();
    now_day = now_day < 10 ? '0' + now_day : now_day;
    const datetime = now_date.getTime();
    return now_year + now_month + now_day + datetime;
};

const getHash = (input) => {
    var hash = 0, len = input.length;
    for (var i = 0; i < len; i++) {
      hash  = ((hash << 5) - hash) + input.charCodeAt(i);
      hash |= 0; // to 32bit integer
    }
    return hash;
  }

const onClickPaidLicense = async (payplePaymentRes) => {
    console.log('onClickPaidRes', payplePaymentRes);
    if (payplePaymentRes.PCD_PAY_ISTAX === 'N') {
        // 페이플 결제모달에서 종료시
        alert(payplePaymentRes.PCD_PAY_MSG);
    } else {
        console.log(" PAID SUCCESSFUL")
        // REQUIRES GOING BACK FEATURE 


        // let body = {
        //     licenseName: selectLicense?.name,
        //     price: selectData[LicenseName] * selectData.period,
        //     period: selectData.period,
        //     maximumMemberManageCount:
        //         selectLicense.maximumMemberManageCount,
        //     maximumTeacherManageCount:
        //         selectLicense.maximumTeacherManageCount,
        // };
        // dispatch(PaymentLicense(body, token, navigateBack));
    }
};

const onMessage = (msg) => {
    console.log("!!!=====   paypletpayment onMessage msg    ", msg);
}

export function PayplePaymentScreen({ navigation, route }) {
    const webViewRef = useRef()
    const { user } = useSelector((state) => state.auth);
    const { totalPrice, paymentMethod = 'card', authdata, gym, selectNoblesss } = route.params;
    const [payURL, setpayURL] = useState('');
        

    React.useEffect(() => {
        const backAction = () => {
        navigation.goBack();
        return true;
        };

        const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
        );
        setURL();
        console.log(" !!!!======= user agent    ", DeviceInfo.getUserAgentSync() + " payple-pay-app")
        return () => backHandler.remove();
    }, []);

    /* [필수입력] 결제 종료 후, 라우터를 변경하고 결과를 전달합니다. */
    function callback(res) {
        console.log('!!!======    payment res  ', res);
        route.params.onComplete(res);
        navigation.goBack();
    }
    function onShouldStartLoadWithRequest(event){
        // console.log(" !!!!=========  onShouldStartLoadWithRequest with http based url     ", event);
        // console.log("!!!!========== onShouldStartLoadWithRequest initial      ", event);
        if (
            event.url.startsWith('http://') ||
            event.url.startsWith('https://') ||
            event.url.startsWith('about:blank')
          ){
            console.log(" !!!!=========  onShouldStartLoadWithRequest with http based url     ", event.url);

            try{
                if (event.url.slice(0,42) == "https://www.ffaso.com/payplepaymentsuccess"){
                    var decodedurl = decodeURI(event.url);
                    var currmsg = decodedurl.slice(51)
                    route.params.onComplete({status: true, msg: currmsg});
                    // webViewRef.current?.goBack()
                    return true;

                }else if (event.url.slice(0,41) == "https://www.ffaso.com/payplepaymentfailed"){
                    var decodedurl = decodeURI(event.url);  
                    console.log(" !!!!====== decoded url when payplepaymentfailed     ", decodedurl);
                    var errmsg = decodedurl.slice(50);
                    route.params.onComplete({status: false, msg: errmsg});
                    // webViewRef.current?.goBack()
                    return true;
                }else{
                    return true;
                }
            } catch (err){
                console.log(" !!!==== error    ", err);
                return true;
            }
        } else if (Platform.OS === 'android') {
                console.log("!!!!========== onShouldStartLoadWithRequest  android part    ", event);
                // Linking.openURL(event.url).catch(err => {
                //     alert('앱 실행에 실패했습니다. 설치가 되어있지 않은 경우 설치하기 버튼을 눌러주세요.')
                // });
                // return true;


                var SendIntentAndroid = require("react-native-send-intent");
                SendIntentAndroid.openAppWithUri(event.url)
                .then(isOpened => {
                    if (!isOpened) {
                        console.log("!======== SendIntentAndroid !isOpened     ");
                        Alert.alert('앱 실행에 실패했습니다');
                        webViewRef.current?.goBack()
                    }
                })
                .catch(err => {
                    console.log("!======== SendIntentAndroid error     ", err);
                    Alert.alert(JSON.stringify(err));
                    webViewRef.current?.goBack()
                });
                return false;
            } else {
                console.log(" !!!!============   NOT android    ");
                Linking.openURL(event.url).catch(err => {
                Alert.alert(
                    '앱 실행에 실패했습니다. 설치가 되어있지 않은 경우 설치하기 버튼을 눌러주세요.',
                );
                });
                return false;
            }
    };

    function setURL(){
        var baseURL = "https://www.ffaso.com/payplepayment?";
        baseURL += "PCD_PAY_TYPE=" + "card";
        baseURL += "&PCD_PAY_WORK=" + "PAY";
        baseURL += "&PCD_CARD_VER=" + "02";
        // baseURL += "&PCD_PAYER_NO=" + createOid();
        baseURL += "&PCD_PAYER_NO=" + Math.abs(getHash(user?.email));
        baseURL += "&PCD_PAYER_NAME=" + user?.koreanName;
        baseURL += "&PCD_PAYER_HP=" + user?.phoneNumber;
        baseURL += "&PCD_PAYER_EMAIL=" + user?.email;
        baseURL += "&PCD_PAY_GOODS=" + gym?.name + " " + selectNoblesss.name;
        // baseURL += "&PCD_PAY_TOTAL=" + totalPrice;
        baseURL += "&PCD_PAY_TOTAL=" + String(100);
        baseURL += "&PCD_PAY_ISTAX=" + "N";
        baseURL += "&PCD_AUTH_KEY=" + authdata.data.AuthKey;
        baseURL += "&PCD_PAY_URL=" + authdata.data.return_url.split("=")[2];
        setpayURL(baseURL);
        console.log(authdata.data.return_url.split("="))
        console.log("!!!======== payURL      ", baseURL);
        return;
    }

    const debugging = `
     // Debug
     console = new Object();
     console.log = function(log) {
       window.webViewBridge.send("console", log);
     };
     console.debug = console.log;
     console.info = console.log;
     console.warn = console.log;
     console.error = console.log;
     `;


    return (
        <>
        {payURL != '' ?
            // <></>
            <WebView
                userAgent={DeviceInfo.getUserAgentSync() + " payple-pay-app"} 
                onShouldStartLoadWithRequest={event => {
                    return onShouldStartLoadWithRequest(event);
                }}
                injectedJavaScript={debugging}
                javaScriptCanOpenWindowsAutomatically={true}
                containerStyle={{flex:1, zIndex:0}}
                androidHardwareAccelerationDisabled={true}
                androidLayerType={Platform.OS === 'ios' ? 'hardware' : ''}
                javaScriptEnabled={true}
                source={{uri : payURL}}
                // injectedJavaScript={webview_gen(obj)}
                // source={{uri: "https://www.google.com"}}
                onMessage={(e) => {
                    callback(e)
                }}
                originWhitelist={['*', "https://*", "http://*", "file://*", "sms://*", 'intent://*']}
                allowFileAccess={true}
                domStorageEnabled={true}
                geolocationEnabled={true}
                saveFormDataDisabled={true}
                allowFileAccessFromFileURLS={true}
                allowUniversalAccessFromFileURLs={true}
                // onMessage={(msg) => onMessage(msg)}
            />
        :null}
        </>
    );
}

export default PayplePaymentScreen;