import React, { useState, useEffect } from 'react';
import MainCarosel from '../../components/HomeCarosel/MainCarosel';
import HomeSectionCarosel from '../../components/HomeSectionCarosel/HomeSectionCarosel';
import Footer from '../../components/Footer/Footer';
import axios from 'axios';

const HomePage = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    // State to store data for each category
    const [bridalWear, setBridalWear] = useState([]);
    const [jewelry, setJewelry] = useState([]);
    const [makeupStyling, setMakeupStyling] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryPosts = async (category, setter) => {
            try {
                const encodedCategory = encodeURIComponent(category);
                const res = await axios.get(
                    `${API_URL}/api/posts?category=${encodedCategory}&limit=10`
                );
                setter(res.data);
            } catch (err) {
                console.error(`Error fetching ${category}`, err);
            }
        };

        const fetchData = async () => {
            await fetchCategoryPosts('Bridal Wear', setBridalWear);
            await fetchCategoryPosts('Jewelry', setJewelry);
            await fetchCategoryPosts('Makeup & Styling', setMakeupStyling);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <MainCarosel />
            <div className='space-y-10 py-20 flex flex-col justify-center px-5 lg:px-10'>
                <HomeSectionCarosel data={bridalWear} sectionName={"Bridal Wear"} />
                <HomeSectionCarosel data={jewelry} sectionName={"Jewelry"} />
                <HomeSectionCarosel data={makeupStyling} sectionName={"Makeup & Styling"} />
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;
