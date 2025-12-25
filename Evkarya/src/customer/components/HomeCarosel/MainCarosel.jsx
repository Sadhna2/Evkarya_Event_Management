import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { MainCaroselData } from './MainCaroselData';

const MainCarosel = () => {
    const items = MainCaroselData.map((item) => (
        <div className="pt-40 flex justify-center items-center p-4">
            <img 
                className=" cursor-pointer -z-10 w-full max-w-[90%] h-[70vh] object-cover rounded-lg" 
                role="presentation" 
                src={item.image} 
                alt="" 
            />
        </div>
    ));

    return (
        <div className="w-full flex justify-center mx-auto mb-12">
            <AliceCarousel
                items={items}
                disableButtonsControls
                autoPlay
                autoPlayInterval={2000} 
                infinite
            />
        </div>
    );
};

export default MainCarosel;
