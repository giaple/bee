import React, {useEffect} from 'react'

import _ from 'lodash'
import { TextField } from '@mui/material'
import Button from '@/components/Button'
import { validatePhoneNumber } from '@/utils/func'
import { useCodeVerify, useLogin } from '@/GraphQL/login'
import { EUserType } from '@/dataStructure/categories'
import { useRouter } from 'next/router'

const Login: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = React.useState('')
    const [code, setCode] = React.useState('')
    const [error, setError] = React.useState(false)
    const [loginSuccess, setLoginSuccess] = React.useState(false)
    const router = useRouter()

    const {login, loginError, loginLoading, loginResult} = useLogin({
        onCompleted: (data) => {
            if(data.phoneLogin.success){
                setLoginSuccess(true)
            }
        }
    })

    const {verifyCode} = useCodeVerify({
        onCompleted: (data) => {
            if(data.verifyOtpCode){
                localStorage.setItem('userInfor', JSON.stringify(data.verifyOtpCode))
                router.push('/categories')
            }else{
                setError(true)
            }
        }
    })


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {value} = e.target
        if(error){
            setError(false)
        }
        if(loginSuccess){
            setCode(value)
            return
        }
        setPhoneNumber(value)
    }

    const handleLogin = () => {
        if(loginSuccess){
            verifyCode({
                variables:{
                    input:{
                        phoneNumber: phoneNumber,
                        type: EUserType.Admin,
                        code : code
                    }
                }
            })
            return
        }
        try {
            login({
                variables:{
                    input:{
                        phoneNumber: phoneNumber,
                        type: EUserType.Admin
                    }
                }
            })
        }catch(e){
            console.log(e)
        }
    }

    useEffect(() => {

    }, [loginResult, loginError, loginLoading])

    return (
        <div style={{width: '100vw', height: '100vh', background: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{width: '20%', display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                <TextField
                    id="outlined-basic"
                    label={loginSuccess ? "Verify Code" : "Số điện thoại"}
                    variant="outlined"
                    value={loginSuccess ? code : phoneNumber}
                    onChange={(e) => handleChange(e)}
                    error={error}
                    helperText={error ? loginSuccess ? "Mã của bạn chưa đúng" : phoneNumber ? 'Please enter your phone number' : 'Số điện thoại bạn nhập chưa đúng hoặc chưa được đăng ký' : ''}
                    
                />
                <Button label={loginSuccess ? 'Xác Nhận' : 'Đăng Nhập'} onClick={handleLogin} color='primary' variant='contained'/>
            </div>
            
        </div>
        
    )
}

export default Login