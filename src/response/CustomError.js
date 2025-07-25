//사용자 정의 에러
//직접 정의한 에러 객체로 서비스 로직에서 실패 케이스를 처리할 때 사용합니다.
//일반 Error 클래스보다 더 많은 정보를 담고, API실패 응답용 데이터를 구조화합니다.
//얘는 그냥 틀임! 다른곳에서 얘를 가져다가 에러 다 만들어주면 됨!


export class CustomError extends Error{ 
    //Error는 자바스크립트 내장 객체!
    constructor(code, message, error = {}){
        super(message);
        this.code = code;
        this.message = message;
        this.error = error;
    }
}