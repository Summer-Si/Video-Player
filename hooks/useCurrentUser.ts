import fetcher from "@/lib/fetcher"
import useSWR from "swr"


const useCurrentUser = () => {
    // fetch data from the url, use fetcher
    const { data, error, isLoading, mutate } = useSWR('/api/current', fetcher);

    return {
        data,
        error,
        isLoading,
        mutate,
    }
};

export default useCurrentUser;