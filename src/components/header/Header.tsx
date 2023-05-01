import Image from "next/image";
import React, { useEffect, useState } from "react";
import TuringLogo from "../../assets/images/logo.png";
import { useRouter } from "next/router";
const Header = () => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState('')

  useEffect(()=> {
    setAccessToken(localStorage?.getItem("access_token") as string)
  }, [])
  const logout = () => {
    localStorage.clear();
    router.push("/auth/signin");
    location.href = `${process.env.NEXT_PUBLIC_APP_URL}/auth/signin` as string
  };
  return (
    <div className="bg-white border-b-2 border-gray-400 h-[80px] w-screen flex justify-between items-center px-12">
      <Image src={TuringLogo} alt="Turing Logo" width={300} height={50} />
      {accessToken && (
        <button
          type="button"
          onClick={() => logout()}
          className="bg-blue-800 px-4 py-2 rounded-lg"
        >
          <span className="text-white">Logout</span>
        </button>
      )}
    </div>
  );
};

export default Header;
