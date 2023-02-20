
import axios from 'axios';
import api from '../../../api/api';

export const authenticate = (obj = {}) => {
    const form = new FormData();

    form.append('cst_id', 'faso'); // 가맹점 ID (실결제시 .env 파일내 발급받은 운영ID를 작성하시기 바랍니다.)
    // form.append('url', window?.location.href);
    form.append('url', 'https://www.ffaso.com')
    form.append(
        'custKey',
        // '6f35fb4a8826c25ea9c845f1a35ab226a57a7ee81927e6bc53d1b97137dbd7cf'
        "230f79ae154cd97ae79d17458d49b330ec9fc54e8ff78f532c4969fa627e77fd"
    ); // 가맹점 Key (실결제시 .env 파일내 발급받은 운영Key를 작성하시기 바랍니다.)

    //상황별 가맹점 인증 추가 파라미터
    /*
     * PCD_PAY_WORK: req.body.PCD_PAY_WORK,                              // 결제요청 업무구분 (AUTH : 본인인증+계좌등록, CERT: 본인인증+계좌등록+결제요청등록(최종 결제승인요청 필요), PAY: 본인인증+계좌등록+결제완료)
     * PCD_PAYCANCEL_FLAG: req.body.PCD_PAYCANCEL_FLAG,                  // 환불(승인취소) 요청변수
     *
     */
    for (const key in obj) {
        form.append(key, obj[key]);
    }
    console.log("!!!===== form data     ", form);
    const isDev = true;

    /*
    headers = {"Referer": data["url"]}
        res = requests.post(
            "https://democpay.payple.kr/php/auth.php", data=data, headers=headers
        )
    */
    const payload =  {
            cst_id: "faso",
            // "custKey": "6f35fb4a8826c25ea9c845f1a35ab226a57a7ee81927e6bc53d1b97137dbd7cf"
            custKey: "230f79ae154cd97ae79d17458d49b330ec9fc54e8ff78f532c4969fa627e77fd"
        }
    return axios({
            // url: 'https://democpay.payple.kr/php/auth.php',
            url: 'https://cpay.payple.kr/php/auth.php',
            method: 'POST',
            data: payload,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Referer': "https://www.ffaso.com"
            },
            responseType: 'json',
            withCredentials: true
        })

    // 인증 서버에 가맹점 인증 요청
    // return api.post('payple-shop-check', form, {
    //     header: {
    //         'content-type': 'application/json',
    //         // referer: !isDev ? window?.location.href : 'https://www.ffaso.com', // API 서버를 따로 두고 있는 경우, Referer 에 가맹점의 도메인 고정
    //         referer: 'https://www.ffaso.com',
    //     },
    // });
};
