import React from 'react';
import { Grid } from '@mui/material';

const orderStatus = [
    { label: "upcoming", value: "upcoming" },
    { label: "cancelled", value: "cancelled" },
    { label: "completed", value: "completed" },
];

const Booking = () => {
    return (
        <div>
            <Grid container sx={{ justifyContent: "space-between" }}>
                <Grid item xs={2.5}>
                    <div className="h-auto shadow-1gbg-white p-5 sticky top-5">
                        <h1 className="font-bold text-lg">Filter</h1>
                        <div className="space-y-4 mt-10">
                            <h1 className="font-semibold">ORDER STATUS</h1>
                            {orderStatus.map((option) => (
                                <div className='flex items-center' key={option.value}>
                                    <input
                                        defaultValue={option.value}
                                        type="checkbox"
                                        className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500'
                                        id={option.value}
                                    />
                                    <label className='ml-3 text-sm text-gray-600' htmlFor={option.value}>
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </Grid>
                
                
            </Grid>
        </div>
    );
};

export default Booking;