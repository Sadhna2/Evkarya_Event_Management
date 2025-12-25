import React from "react";
import { Grid, Typography, Button } from "@mui/material";

const Footer = () => {
    return (
        <div>
            <Grid
                container
                direction="row"
                justifyContent="space-around"
                alignItems="flex-start"
                className="bg-black text-white text-center mt-10"
                sx={{ bgcolor: "black", color: "white", pt: 4, pb: 4 }}
            >
                {/* About Section */}
                <Grid item xs={12} sm={6} md={2} display="flex" flexDirection="column">
                    <Typography variant="h6" className="pb-2">
                        About EvKarya
                    </Typography>
                    <Button color="inherit">Our Story</Button>
                    <Button color="inherit">Team</Button>
                    <Button color="inherit">Careers</Button>
                    <Button color="inherit">Press</Button>
                    <Button color="inherit">Contact Us</Button>
                </Grid>

                {/* Services Section */}
                <Grid item xs={12} sm={6} md={2} display="flex" flexDirection="column">
                    <Typography variant="h6" className="pb-2">
                        Our Services
                    </Typography>
                    <Button color="inherit">Wedding Planning</Button>
                    <Button color="inherit">Corporate Events</Button>
                    <Button color="inherit">Birthday Parties</Button>
                    <Button color="inherit">Concert Management</Button>
                    <Button color="inherit">Catering Services</Button>
                </Grid>

                {/* Venues Section */}
                <Grid item xs={12} sm={6} md={2} display="flex" flexDirection="column">
                    <Typography variant="h6" className="pb-2">
                        Popular Venues
                    </Typography>
                    <Button color="inherit">Banquet Halls</Button>
                    <Button color="inherit">Outdoor Lawns</Button>
                    <Button color="inherit">Hotels & Resorts</Button>
                    <Button color="inherit">Conference Rooms</Button>
                    <Button color="inherit">Beachside Venues</Button>
                </Grid>

                {/* Help & Support */}
                <Grid item xs={12} sm={6} md={2} display="flex" flexDirection="column">
                    <Typography variant="h6" className="pb-2">
                        Help & Support
                    </Typography>
                    <Button color="inherit">FAQs</Button>
                    <Button color="inherit">Event Guides</Button>
                    <Button color="inherit">Vendor Support</Button>
                    <Button color="inherit">Live Chat</Button>
                    <Button color="inherit">Feedback</Button>
                </Grid>

                {/* Social Media */}
                <Grid item xs={12} sm={6} md={2} display="flex" flexDirection="column">
                    <Typography variant="h6" className="pb-2">
                        Connect With Us
                    </Typography>
                    <Button color="inherit">Facebook</Button>
                    <Button color="inherit">Instagram</Button>
                    <Button color="inherit">Twitter</Button>
                    <Button color="inherit">LinkedIn</Button>
                    <Button color="inherit">YouTube</Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default Footer;