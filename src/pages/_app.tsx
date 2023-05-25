import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'

import client from '@/GraphQL/apolloClient'
import { appWithTranslation } from 'next-i18next'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()
  
  useEffect(() => {
    const userInfor = localStorage.getItem('userInfor')
    if (!userInfor) {
      router.push('/login')
    }
  }, [])

  return <ApolloProvider client={client}>
    <Component {...pageProps} />
  </ApolloProvider>
}

export default appWithTranslation(App)
