import { useEffect, useState } from 'react';

const useApiData = (apiFunction: any, ...params: any) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await apiFunction(...params);
                setData(result);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiFunction, ...params]);

    return { data, loading, error };
};

export default useApiData;
