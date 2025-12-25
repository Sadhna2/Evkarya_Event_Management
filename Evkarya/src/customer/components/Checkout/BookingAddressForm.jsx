import React from 'react';
import { Grid, Box, TextField, Button } from '@mui/material';
import AdressCard from '../AddressCard/AdressCard';


const BookingAddressForm = () => {
    
    const handleSubmit=(e)=>{
        e.preventDefault();
        
        const data=new FormData(e.currentTarget);
        const address={
            firstName:data.get("firstName"),
            lasttName:data.get("lastName"),
            firstName:data.get("firstName"),
            streetAddress:data.get("Address"),
            city:data.get("city"),
            state:data.get("state"),
            zipCode:data.get("zip"),
            mobile:data.get("phoneNumber"),
        }
        console.log("address",address);
    }
    return (
        <div>
            <Grid container spacing={4}>
                {/* Address List Section */}
                <Grid item xs={12} lg={5}>
                    <Box className="border rounded-e-md shadow-md" sx={{ height: '30.5rem', overflowY: 'scroll' }}>
                        <div className="p-5 py-7 border-b cursor-pointer">
                            <AdressCard />
                            <Button
                                sx={{ mt: 2, bgcolor: 'rgb(145, 85, 253)' }}
                                size="large"
                                variant="contained"
                            >
                                Book here
                            </Button>
                        </div>
                    </Box>
                </Grid>

                {/* Address Form Section */}
                <Grid item xs={12} lg={7}>
                    <Box className="border rounded-s-md shadow-md p-5">
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="firstName"
                                        name="firstName"
                                        label="First Name"
                                        fullWidth
                                        autoComplete="given-name"
                                    />

                                </Grid>
                                {/* Add other form fields here */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="lastName"
                                        name="lastName"
                                        label="Last Name"
                                        fullWidth
                                        autoComplete="given-name"
                                    />

                                </Grid>
                                <Grid item xs={12} >
                                    <TextField
                                        required
                                        id="Address"
                                        name="Address"
                                        label="Address"
                                        fullWidth
                                        autoComplete="given-name"
                                        multiline
                                        rows={4}
                                    />

                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="city"
                                        name="city"
                                        label="city"
                                        fullWidth
                                        autoComplete="given-name"
                                    />

                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="state"
                                        name="state"
                                        label="State/Province/Region"
                                        fullWidth
                                        autoComplete="given-name"
                                    />

                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="zip"
                                        name="zip"
                                        label="Zip/Postal code"
                                        fullWidth
                                        autoComplete="shipping postal-code"
                                    />

                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        label="phone Number"
                                        fullWidth
                                        autoComplete="given-name"
                                    />

                                </Grid>
                                <Grid item xs={12} sm={6}>
                                <Button
                                sx={{ py:1.5, mt: 2, bgcolor: 'rgb(145, 85, 253)' }}
                                size="large"
                                variant="contained"
                                type='submit'
                            >
                                Book here
                            </Button>
                                </Grid>
                                
                            </Grid>
                        </form>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
};

export default BookingAddressForm;