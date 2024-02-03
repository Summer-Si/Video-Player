import { NextPageContext } from "next";
import { getSession } from "next-auth/react";

import Navbar from "@/components/Navbar";
import Billboard from "@/components/Billboard";
import MovieList from "@/components/MovieList";
import useMovieList from "@/hooks/useMovieList";
import useFavorites from "@/hooks/useFavorites";
import InfoModal from "@/components/InfoModal";
import useInfoModal from "@/hooks/useInfoModal";

// checking if available session exists and if it doesn't/click Logout
// it's going to redirect to '/auth' page. 
export async function getServerSideProps(context: NextPageContext) {
  try{
    const session = await getSession(context);

    if (!session) {
      return {
        redirect: {
          destination: '/auth',
          permanet: false,
        }
      }
    }

    return {
    props: {}
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return { props: {} };
  }
}  

export default function Home() {
  const { data: movies = [] } = useMovieList();
  const { data: favorites = [] } = useFavorites();
  const { isOpen, closeModal } = useInfoModal();

  return (
    <>
      <InfoModal visible={isOpen} onClose={closeModal} />
      <Navbar />
      <Billboard />
      <div className="pb-40">
        <MovieList title="Tending Now" data={movies}/>
        <MovieList title="My List" data={favorites}/>
      </div>
    </>
  )
}

