import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import dayjs from 'dayjs';

export default function Calendar() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const vendorId = localStorage.getItem('vendorId');  

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    
    axios
      .get(`${API_URL}/api/vendors/${vendorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const vendor = response.data.vendor;
        const posts = response.data.posts;

        console.log("Vendor:", vendor);
        console.log("Posts:", posts);

        const vendorUnavailableDates = vendor.notAvailableDates || [];
        const postUnavailableDates = posts
          .filter(post => post.availability === false && post.unavailableUntil)
          .map(post => dayjs(post.unavailableUntil).format('YYYY-MM-DD'));

        const allUnavailableDates = [...new Set([...vendorUnavailableDates, ...postUnavailableDates])];
        setUnavailableDates(allUnavailableDates);
      })
      .catch((error) => {
        console.error("Error fetching vendor data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [vendorId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const disabledDates = unavailableDates;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDateTimePicker
        orientation="landscape"
        renderInput={(props) => <input {...props} />}
        shouldDisableDate={(date) => {
          const formattedDate = date.format('YYYY-MM-DD');
          return disabledDates.includes(formattedDate);  
        }}
      />
    </LocalizationProvider>
  );
}
