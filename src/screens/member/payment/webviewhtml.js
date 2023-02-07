export  const WEBVIEW_SOURCE_HTML =   `
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js">< /script>
    <!-- payple js 호출. 테스트/운영 선택 -->
    <script src="https://democpay.payple.kr/js/cpay.payple.1.0.1.js">< /script> <!-- 테스트 -->
    
    `;

const webview_gen = (obj) =>{  

    
    return `
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js">< /script>
    <!-- payple js 호출. 테스트/운영 선택 -->
    <script src="https://democpay.payple.kr/js/cpay.payple.1.0.1.js">< /script> <!-- 테스트 -->
    <!-- <script src="https://cpay.payple.kr/js/cpay.payple.1.0.1.js">< /script> -->  <!-- 운영 -->
    
    <script>  
    $(document).ready( function () {    	
            
                var obj = new Object();
                obj.PCD_PAY_TYPE = "card";       	
                obj.PCD_PAY_WORK = "PAY";

                /* 01 : 빌링키결제 */
                obj.PCD_CARD_VER = "02"
                
                obj.PCD_PAYER_NO = "${obj.PCD_PAYER_NO}";
                obj.PCD_PAYER_NAME = "${obj.PCD_PAYER_NAME}";
                obj.PCD_PAYER_HP = "${obj.PCD_PAYER_HP}";
                obj.PCD_PAYER_EMAIL = "${obj.PCD_PAYER_EMAIL}";
                obj.PCD_PAY_GOODS = "${obj.PCD_PAY_GOODS}";
                obj.PCD_PAY_TOTAL = "${obj.PCD_PAY_TOTAL}";
                obj.PCD_PAY_ISTAX = "N";
                // obj.PCD_PAY_TAXTOTAL = 10;

                /* 파트너 인증시 받은 AuthKey 값 입력  */
                obj.PCD_AUTH_KEY = "${obj.PCD_AUTH_KEY}";

                /* 파트너 인증시 받은 return_url 값 입력  */
                obj.PCD_PAY_URL = "${obj.PCD_PAY_URL}";

                /* 결과를 콜백 함수로 받고자 하는 경우 함수 설정 추가 */
                // obj.callbackFunction = getResult;  // getResult : 콜백 함수명
                // obj.callbackFunction = "";

                // obj.PCD_RST_URL = 'app.post의 path';
                
                PaypleCpayAuthCheck(obj);
                
                event.preventDefault(); 	
    
    });
    < /script>
    `;

}

export default webview_gen;

