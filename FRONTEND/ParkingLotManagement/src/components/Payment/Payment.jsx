import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Assuming you might use axios for API calls

const Payment = () => {
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [upiId, setUpiId] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch vehicles from the API or local state
        const getallvechiles=async()=>{
            const response=await axios.get("http://localhost:7000/api/v1/vechile",{
                withCredentials:true
            })
            setVehicles(response.data);
        }
        getallvechiles()
    }, []);

    const handleVehicleChange = (e) => {
        setSelectedVehicle(e.target.value);
    };

    const handleAddVehicle = () => {
        navigate('/vehicleRegistration');
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate('/dashboard')

        // Retrieve the selected slot ID from localStorage
        const selectedSlotId = localStorage.getItem('selectedSlotId');
        if (!selectedSlotId) return;

        // Handle payment form submission
        const paymentData = {
            reservation_id: selectedVehicle,
            user_id: 'dummyUserId', // Replace with actual user ID
            amount: amount,
            paymentDate: new Date(),
            paymentMethod: paymentMethod,
            upiId: paymentMethod === 'online-payment' ? upiId : undefined,
            username: username
        };

        try {
            // Post payment data to the server
            const response = await axios.post('/api/payments', paymentData);

            // Check the response and handle slot status update
            if (response.status === 200) {
                // Update slot status on the server
                await axios.patch(`/api/slots/${selectedSlotId}`, { booked: true });

                // Save booked slot ID to localStorage
                localStorage.setItem('bookedSlotId', selectedSlotId);

                // Navigate back to ParkingView
                navigate('/ParkingView');
            }
        } catch (error) {
            console.error('Payment submission error:', error);
        }
    };

    return (
        <div className="bg-gray-50 font-[sans-serif]">
            <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
                <div className="max-w-md w-full">
                    <h2 className="text-gray-900 text-center text-2xl font-bold">Payment Details</h2>
                    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                className="w-full text-white text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                className="w-full text-white text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">Amount</label>
                            <input
                                id="amount"
                                type="number"
                                className="w-full text-white text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="payment_method">Payment Method</label>
                            <select
                                id="payment_method"
                                className="w-full text-white text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                value={paymentMethod}
                                onChange={handlePaymentMethodChange}
                                required
                            >
                                <option value="cash">Cash</option>
                                <option value="online-payment">Online Payment</option>
                            </select>
                        </div>
                        {paymentMethod === 'online-payment' && (
                            <div className="mt-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="upi_id">UPI ID</label>
                                <input
                                    id="upi_id"
                                    type="text"
                                    className="w-full text-white text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vehicle_select">Select Vehicle</label>
                            <select
                                id="vehicle_select"
                                className="w-full text-white text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                value={selectedVehicle}
                                onChange={handleVehicleChange}
                            >
                                <option value="" disabled>Select a vehicle</option>
                                {vehicles.length > 0 ? (
                                    vehicles.map((vehicle) => (
                                        <option key={vehicle._id} value={vehicle.license_plate}>
                                            {vehicle.license_plate}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>No vehicles available</option>
                                )}
                            </select>
                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={handleAddVehicle}
                                    className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none"
                                >
                                    Add Vehicle Details
                                </button>
                            </div>
                        </div>
                        <div className="mt-8">
                            <button
                                type="submit"
                                className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                            >
                                Submit Payment
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Payment;
