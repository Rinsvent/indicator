import {useEffect, useState} from "react";
import Input from '@mui/material/Input';

export default function Avatar() {
    const [nickname, setNickname] = useState<string>('')

    useEffect(() => {
        const nn = localStorage.getItem('nickname') || ''
        setNickname(nn)
    }, []);

    return (
        <>
            <Input placeholder="Anonymous" value={nickname}  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const nickname = event.target.value
                localStorage.setItem('nickname', nickname)
                setNickname(nickname);
            }} />
        </>
    );
}
