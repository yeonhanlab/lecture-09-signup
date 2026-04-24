import styled from "styled-components";
import {useState, type SubmitEvent } from "react";
import {useNavigate} from "react-router";
import {Title, Wrap} from "../Components/components.tsx";



const Card = styled.form`
    background-color: white;
    padding: 40px;
    border-radius: 16px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 15px;
`;



const Input = styled.input`
    padding: 14px;
    border-radius: 10px;
    border: 1px solid #ddd;
    transition: all 0.5s;

    &:focus {
        outline: none;
        border: 1px solid #6c5ce7;
`;

const Button = styled.button`
    
    padding: 14px;
    background-color: #6c5ce7;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    margin-top: 20px;
    
`;

const ErrorText = styled.span`
    color: #d63031;
    font-size: 12px;
    margin-top: 4px;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;

`;

type ErrorType = {
    // 프로퍼티가 몇 개가 될진 모르겠지만(0개도 허용한다는 말. 그래서 초기값은 그냥 객체만 넣어줄 수 있다), 그 프로퍼티의 key는 string이고 그 프로퍼티의 값은 모두 다 string이다.
    [key: string]: string;
};


function Home() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    const [error, setError] = useState<ErrorType>({});

    const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        // 1. 기존 form 태그의 onSubmit 기능 무력화
        event.preventDefault();

        // 2. 유효성 검사
        const result = validate(); // 유효성 검사에 성공하면 true, 실패하면 false
        if (!result) return;

        // 3. 백엔드에게 전송
        //모든 검증을 통과하면, 그 입력한 값들을 백엔드에게 전송(하나라도 실패하면 실행하면 안된다는 말)
        const data = { username, password, email, name };
        const queryString = new URLSearchParams(data).toString(); // 객체를 쿼리스트링을 만들어서 string으로 형변환
        navigate(`/result?${queryString}`)
    };



    const validate = () => {
        const newErrors: ErrorType = {};

    // 전송하기 전, 유효성 검사를 먼저 진행하고서 사용자를 이동 (set은 덮어쓰기방식)
    // 1. username이 올바른가?
    if (!username.trim()) newErrors.username = "아이디는 필수 입력 항목입니다. ";
    // 2. 비밀번호는 입력이 되었는가?
    if (!password.trim()) newErrors.password = "비밀번호는 필수 입력 항목입니다. ";
    else if (password.length < 6) newErrors.password = "비밀번호는 최소 6자 이상이어야 합니다.";
    // 3. 이름이 입력이 되었는가?
    if (!name.trim()) newErrors.name = "이름은 필수 입력 항목입니다.";
    // 4. 이메일이 입력이 되었는가?
    if (!email.trim()) newErrors.email = "이메일은 필수 입력 항목입니다.";
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
       newErrors.email = "이메일 형식이 올바르지 않습니다.";
    // 이메일은 꼭 중간에 @가 들어갔는지 .이 있는지 확인해줘야 함
    // ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$   => 뭔가 규칙성을 갖고 있는 string에 대한 검증을 할 때에는 "정규식"을 사용

        setError(newErrors);

        // 1. 무조건 state의 값을 바꿔주는 건 setState 메서드를 통해서만 바꿔줄 수 있기 때문 =>
        // 객체(또는 array)라서 일어나는 일. 타이밍이 어긋나는 일 발생
        // 2, setState라는 메서드를 계속 쓰고 있음 => 여러번 사용할 때 타이밍의 문제



    // 리턴은 true, false로 검증이 성공했는지 실패했는지만 반환
    // error라고 하는 객체에 항목이 있으면 실패
    // Object.keys(객체) => 매개변수로 넣은 객체의 프로퍼티 key들을 뽑아내는 메서드. 반환값은 array
    // 집어넣는 객체가 { username: "실패" } 라면 Object.keys(객체)의 반환값은 ["username"]
    return Object.keys(newErrors).length === 0;

    };

    return (
        <Wrap>
            <Card onSubmit={onSubmit}>
                <Title>회원가입</Title>
                <InputGroup>
                    <Input placeholder={"아이디"} onChange={(event) => {
                        setUsername(event.target.value);
                    }}
                    />
                    {/* 아이디에 대해 검사하고 실패한 내용을 출력해줘야 함 */}
                    {error.username && <ErrorText>{error.username}</ErrorText>}
                </InputGroup>
                <InputGroup>
                    <Input placeholder={"비밀번호"} type={"password"} onChange={(event) => {
                        setPassword(event.target.value);
                    }}/>
                    {error.password && <ErrorText>{error.password}</ErrorText>}
                    {/* 비밀번호에 대해 검사하고 실패한 내용을 출력해줘야 함 */}
                </InputGroup>
                <InputGroup>
                    <Input placeholder={"이름"} onChange={(event) => {
                        setName(event.target.value);
                    }}/>
                    {error.name && <ErrorText>{error.name}</ErrorText>}
                </InputGroup>
                <InputGroup>
                    <Input placeholder={"이메일"} type={"email"} onChange={(event) => {
                        setEmail(event.target.value);
                    }}/>
                    {error.email && <ErrorText>{error.email}</ErrorText>}
                </InputGroup>
                <Button type={"submit"}>회원가입</Button>
            </Card>
        </Wrap>

    );
}

export default Home;