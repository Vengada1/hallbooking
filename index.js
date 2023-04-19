//Importing the dotenv module
require('dotenv').config();

//Importing the express module
const express = require('express');

//Initializing the express and port number
const app = express();
const PORT = process.env.PORT || 4000;

// Calling the express.json() method for parsing
app.use(express.json());

//Create data for rooms in array format
const rooms = [
    {
        room_type: "premium",
        room_id: "P000",
        amenities: "Air Conditioning, Free Wi-Fi, medium Podium",
        seats:150,
        price_per_hour: 2000,
    },
    {
        room_type: "Super-premium",
        room_id: "P001",
        amenities: "Air Conditioning, AV facilities, Free Wi-Fi, Large Podium",
        seats:300,
        price_per_hour: 5000,
    },
];

const booking_Details = [
    {
        customer_name:"Gokul Krishnan",
        room_id: "P000",
        room_type: "premium",
        date: new Date("2023-01-13"),
        starting_time: "08:00 AM",
        ending_time: "12:10 PM",
        status: "Confirmed",
    },
    {
        customer_name:"Gokulnath",
        room_id: "P001",
        room_type: "Super-premium",
        date: new Date("2023-01-13"),
        starting_time: "11:00 AM",
        ending_time: "03:00 PM",
        status: "Confirmed",
    },
];

// API status if running or not
app.get("/", (req, res) =>{
    res.status(200).send("Welcome to our Hall Booking Application");
});

// For creating the rooms
app.post("/createRoom", (req, res) => {

    rooms.push({
        room_type:req.body.room_type,
        room_id: `${"P00"+ rooms.length}`,
        amenities:req.body.amenities,
        seats:req.body.seats,
        price_per_hour:req.body.price_per_hour,
    });

   res.status(201).send({
        message : "Room is created successfully"
   });
});

// For booking the rooms
app.post("/bookRoom", (req, res) => {
    let number = booking_Details.length + 1;
    req.body.booked_id = number;
    // console.log("number:", number);
    try{
        req.body.date = new Date(req.body.date);
        // console.log("date:", req.body.date, new Date(req.body.date) );
        let booking_req_Details = {
            customer_Name: req.body.customer_Name,
            booked_id: req.body.booked_id,
            room_type: req.body.room_type,
            starting_time: req.body.starting_time,
            ending_time: req.body.ending_time,
            status: "Confirmed",
        };

        for (let book of booking_Details){
            if (book.date.getTime() == req.body.date.getTime() && book.starting_time === req.body.starting_time){
                // console.log(book.date.getTime(), req.body.date.getTime());
                // console.log(book.starting_time, req.body.starting_time);
                
                return res.status(400).send({
                    message: "the room is not available in this time slot, please select the different time slot"
                });
            }else{
                booking_Details.push(booking_req_Details);
                return res.status(201).send({
                    message: "Room is booked successfully"
                });
            };
        };

    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error"
        });
    };
});
    

//For list the room details
app.get("/listRooms",(req,res)=>{
    res.send(rooms)
});

// For booked room details
app.get("/bookedDetails", (req, res) => {

    let roomList = [];
    booking_Details.forEach((customer) => {
        let roomDetails = {};

        roomDetails.room_id = customer.room_id;
        roomDetails.room_type = customer.room_type;
        roomDetails.customer_name = customer.customer_name;
        roomDetails.date = customer.date;
        roomDetails.starting_time = customer.starting_time;
        roomDetails.ending_time = customer.ending_time;
        roomDetails.status = customer.status;
        roomList.push(roomDetails);

    });

    res.status(200).send(roomList);
});

// For customer details
app.get("/customerDetails",(req, res) => {

    let customerList = [];
    booking_Details.forEach((customer) => {
        let customerDetails = {};
        customerDetails.customer_name = customer.customer_name;
        customerDetails.room_type = customer.room_type;
        customerDetails.room_id = customer.room_id;
        customerDetails.date = customer.date;
        customerDetails.starting_time = customer.starting_time;
        customerDetails.ending_time = customer.ending_time;
        customerList.push(customerDetails);
    });
    res.status(200).send(customerList);
});

// Listening to the port
app.listen(PORT, () => {
    console.log(`Server is listening at ${PORT}`);
});