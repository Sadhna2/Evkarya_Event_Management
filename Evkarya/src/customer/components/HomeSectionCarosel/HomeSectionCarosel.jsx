import React, { useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import HomeSectionCard from '../HomeSectionCard/HomeSectionCard';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const HomeSectionCarosel = ({ data, sectionName }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const responsive = {
        0: { items: 1 },
        640: { items: 2 },
        768: { items: 3 },
        1024: { items: 4 },
        1280: { items: 5 },
    };

    const slidePrev = () => setActiveIndex((prev) => Math.max(prev - 1, 0));
    const slideNext = () => setActiveIndex((prev) => Math.min(prev + 1, data.length - 1));
    const syncActiveIndex = ({ item }) => setActiveIndex(item);

    const items = data.slice(0, 10).map((item, index) => (
        <div key={index} className="px-2">
            <HomeSectionCard product={item} />
        </div>
    ));

    return (
        <div className="relative border bg-white rounded-2xl shadow-md mb-10 px-4 py-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 px-4">{sectionName}</h2>
            <div className="relative">
                <AliceCarousel
                    items={items}
                    disableButtonsControls
                    disableDotsControls
                    responsive={responsive}
                    onSlideChanged={syncActiveIndex}
                    activeIndex={activeIndex}
                    mouseTracking
                />

                {/* Right Arrow */}
                {activeIndex < data.length - 5 && (
                    <Button
                        variant="contained"
                        onClick={slideNext}
                        className="carousel-btn right"
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            right: '-10px',
                            transform: 'translateY(-50%)',
                            bgcolor: 'white',
                            minWidth: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            boxShadow: 3,
                            zIndex: 10,
                            '&:hover': {
                                bgcolor: '#f3f4f6',
                            },
                        }}
                    >
                        <KeyboardArrowLeftIcon sx={{ transform: 'rotate(90deg)', color: 'black' }} />
                    </Button>
                )}

                {/* Left Arrow */}
                {activeIndex > 0 && (
                    <Button
                        variant="contained"
                        onClick={slidePrev}
                        className="carousel-btn left"
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '-10px',
                            transform: 'translateY(-50%)',
                            bgcolor: 'white',
                            minWidth: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            boxShadow: 3,
                            zIndex: 10,
                            '&:hover': {
                                bgcolor: '#f3f4f6',
                            },
                        }}
                    >
                        <KeyboardArrowLeftIcon sx={{ transform: 'rotate(-90deg)', color: 'black' }} />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default HomeSectionCarosel;
