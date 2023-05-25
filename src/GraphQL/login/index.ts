import {  gql, useMutation } from "@apollo/client";

const LOGIN = gql`
mutation phoneLogin($input: UserPhoneLoginInput!) {
            phoneLogin(input: $input) {
                message
                success
            }
  }
`;

const CODE_VERIFY = gql`
mutation verifyOtpCode($input: UserVerifyPhoneOTPInput!) {
    verifyOtpCode(input: $input) {
        accessToken
        refreshToken
        userInfo {
            _id
            type
        }
    }
  }
`;

const LOGOUT = gql`
mutation logout($input: UserLogoutInput!) {
    logout(input: $input) {
        message
        success
    }
}
`

type MutationOption = {
    onCompleted: (data: any) => Promise<void> | void
}

export const useLogin = (options: MutationOption) => {
    const [login, {data, loading, error}] = useMutation(LOGIN, {
        ...options
    })

    return {login: login, loginLoading: loading, loginError: error, loginResult: data}
}

export const useCodeVerify = (options: MutationOption) => {
    const [verifyCode, {data, loading, error}] = useMutation(CODE_VERIFY, {
        ...options
    })

    return {verifyCode: verifyCode, loginLoading: loading, loginError: error, loginResult: data}
}

export const useLogout = (options: MutationOption) => {
    const [logout, {data, loading, error}] = useMutation(LOGOUT, {
        ...options
    })

    return {logout: logout, logoutLoading: loading, logoutError: error, logoutResult: data}
}
