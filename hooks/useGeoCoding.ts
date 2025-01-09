import { useState, useEffect } from 'react';
import axios from 'axios';

interface Address {
    formattedAddress: string;
    city?: string;   // Made optional since it might not be present
    state?: string;  // Made optional since it might not be present
    country: string;
}

const useAddressFromCoords = (latitude: number, longitude: number): { address: Address | null; loading: boolean; error: string | null; } => {
    const [address, setAddress] = useState<Address | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // console.log("lat", latitude)
    // console.log("lon", longitude)
    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
                    params: {
                        lat: latitude,
                        lon: longitude,
                        format: 'json',
                    },
                });

                console.log("API response", response.data); // Log the response data

                const res = response.data;
                if (response.status === 200 && res.address) {
                    setAddress({
                        formattedAddress: res.display_name,
                        city: res.address.city,     // Safely access address properties
                        state: res.address.state,   // Safely access address properties
                        country: res.address.country,
                    });
                } else {
                    setError('Unable to fetch address');
                }
            } catch (err) {
                console.error('Error fetching address:', err); // Log the error for debugging
                setError('Error fetching address');
            } finally {
                setLoading(false);
            }
        };

        fetchAddress();
    }, [latitude, longitude]);

    const getAddressComponent = (results: any, type: string) => {
        const component = results.address_components?.find((component: any) =>
            component.types.includes(type)
        );
        return component ? component.long_name : '';
    };

    return { address, loading, error };
};

export default useAddressFromCoords;
