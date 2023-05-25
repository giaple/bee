
import { redirect} from 'next/navigation'
import { Inter } from 'next/font/google'
import React , {useEffect} from 'react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const inter = Inter({ subsets: ['latin'] })



const Home: React.FC = () => {
  const router = useRouter();

 useEffect(() => {
  const userInfor = localStorage.getItem('userInfor')
  if(userInfor){
    router.push('/categories')
  }else{
    router.push('/login')
  }
 }, [])


  return null
}

export const getServerSideProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "vi", ["common"])),
    },
  };
}

export default Home
